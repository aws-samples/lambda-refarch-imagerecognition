/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPhotoalbumsGraphQLAPIIdOutput = process.env.API_PHOTOALBUMS_GRAPHQLAPIIDOUTPUT
var apiPhotoalbumsGraphQLAPIEndpointOutput = process.env.API_PHOTOALBUMS_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */// eslint-disable-next-line

require('es6-promise').polyfill();
require('isomorphic-fetch');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({ signatureVersion: 'v4' });
const AUTH_TYPE = require('aws-appsync').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;
const uuidv4 = require('uuid/v4');
const gql = require('graphql-tag');

/*
Note: Sharp requires native extensions to be installed in a way that is compatible
with Amazon Linux (in order to run successfully in a Lambda execution environment).

If you're not working in Cloud9, you can follow the instructions on http://sharp.pixelplumbing.com/en/stable/install/#aws-lambda how to install the module and native dependencies.
*/
const Sharp = require('sharp');

// We'll expect these environment variables to be defined when the Lambda function is deployed
const THUMBNAIL_WIDTH = parseInt(process.env.THUMBNAIL_WIDTH || 80, 10);
const THUMBNAIL_HEIGHT = parseInt(process.env.THUMBNAIL_HEIGHT || 80, 10);

let client = null


async function storePhotoInfo(item) {
  console.log('storePhotoItem', JSON.stringify(item))
  const createPhoto = gql`
      mutation CreatePhoto(
          $input: CreatePhotoInput!
          $condition: ModelPhotoConditionInput
      ) {
          createPhoto(input: $input, condition: $condition) {
              id
              albumId
              owner
              bucket
              fullsize {
                  key
                  width
                  height
              }
              thumbnail {
                  key
                  width
                  height
              }
              album {
                  id
                  name
                  owner
              }
          }
      }
  `;

  console.log('trying to createphoto with input', JSON.stringify(item))
  const result = await client.mutate({
    mutation: createPhoto,
    variables: { input: item },
    fetchPolicy: 'no-cache'
  })

  console.log('result', JSON.stringify(result))
  return result
}

function thumbnailKey(keyPrefix, filename) {
  return `${keyPrefix}/resized/${filename}`;
}

function fullsizeKey(keyPrefix, filename) {
  return `${keyPrefix}/fullsize/${filename}`;
}

function makeThumbnail(photo) {
  return Sharp(photo).resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT).toBuffer();
}

async function resize(photoBody, bucketName, key) {
  const keyPrefix = key.substr(0, key.indexOf('/upload/'))
  const originalPhotoName = key.substr(key.lastIndexOf('/') + 1)
  const originalPhotoDimensions = await Sharp(photoBody).metadata();

  const thumbnail = await makeThumbnail(photoBody);

  await Promise.all([
    S3.putObject({
      Body: thumbnail,
      Bucket: bucketName,
      Key: thumbnailKey(keyPrefix, originalPhotoName),
    }).promise(),

    S3.copyObject({
      Bucket: bucketName,
      CopySource: bucketName + '/' + key,
      Key: fullsizeKey(keyPrefix, originalPhotoName),
    }).promise(),
  ]);

  await S3.deleteObject({
    Bucket: bucketName,
    Key: key
  }).promise();

  return {
    photoId: originalPhotoName,

    thumbnail: {
      key: thumbnailKey(keyPrefix, originalPhotoName),
      width: THUMBNAIL_WIDTH,
      height: THUMBNAIL_HEIGHT
    },

    fullsize: {
      key: fullsizeKey(keyPrefix, originalPhotoName),
      width: originalPhotoDimensions.width,
      height: originalPhotoDimensions.height
    }
  };
};

async function processRecord(record) {
  const bucketName = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

  console.log('processRecord', JSON.stringify(record))

  if (record.eventName !== "ObjectCreated:Put") { console.log('Is not a new file'); return; }
  if (! key.includes('upload/')) { console.log('Does not look like an upload from user'); return; }

  const originalPhoto = await S3.getObject({ Bucket: bucketName, Key: key }).promise()

  const metadata = originalPhoto.Metadata
  console.log('metadata', JSON.stringify(metadata))
  console.log('resize')
  const sizes = await resize(originalPhoto.Body, bucketName, key);
  console.log('sizes', JSON.stringify(sizes))
  const id = uuidv4();
  const item = {
    id: id,
    owner: metadata.owner,
    albumId: metadata.albumid,
    bucket: bucketName,
    thumbnail: {
      width: sizes.thumbnail.width,
      height: sizes.thumbnail.height,
      key: sizes.thumbnail.key,
    },
    fullsize: {
      width: sizes.fullsize.width,
      height: sizes.fullsize.height,
      key: sizes.fullsize.key,
    }
  }

  console.log(JSON.stringify(metadata), JSON.stringify(sizes), JSON.stringify(item))
  await storePhotoInfo(item);
}


exports.handler = async (event, context, callback) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  client = new AWSAppSyncClient({
    url: process.env.API_PHOTOALBUMS_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.REGION,
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: AWS.config.credentials
    },
    disableOffline: true
  });

  try {
    event.Records.forEach(processRecord);
    callback(null, { status: 'Photo Processed' });
  }
  catch (err) {
    console.error(err);
    callback(err);
  }
};

