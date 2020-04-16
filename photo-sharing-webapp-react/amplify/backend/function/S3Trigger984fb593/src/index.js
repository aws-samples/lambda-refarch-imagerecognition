/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPhotoshareGraphQLAPIIdOutput = process.env.API_PHOTOSHARE_GRAPHQLAPIIDOUTPUT
var apiPhotoshareGraphQLAPIEndpointOutput = process.env.API_PHOTOSHARE_GRAPHQLAPIENDPOINTOUTPUT
var storagePhotostorageBucketName = process.env.STORAGE_PHOTOSTORAGE_BUCKETNAME

Amplify Params - DO NOT EDIT */
require('dotenv').config();
require('isomorphic-fetch');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({signatureVersion: 'v4'});
const AUTH_TYPE = require('aws-appsync').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag')
const stateMachineArn = process.env.STATE_MACHINE_ARN;

console.log(process.env.STATE_MACHINE_ARN)
console.log(process.env.API_PHOTOSHARE_GRAPHQLAPIENDPOINTOUTPUT)

let client = new AWSAppSyncClient({
  url: process.env.API_PHOTOSHARE_GRAPHQLAPIENDPOINTOUTPUT,
  region: process.env.REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials
  },
  disableOffline: true
});

const CREATE_PHOTO_MUTATION = gql`
    mutation CreatePhoto(
        $input: CreatePhotoInput!
        $condition: ModelPhotoConditionInput
    ) {
        createPhoto(input: $input, condition: $condition) {
            id
            albumId
            uploadTime
            bucket
            owner
            fullsize {
                key
            }
            SfnExecutionArn
            ProcessingStatus

        }
    }
`

const UPDATE_PHOTO_MUTATION = gql`
    mutation UpdatePhoto(
        $input: UpdatePhotoInput!
        $condition: ModelPhotoConditionInput
    ) {
        updatePhoto(input: $input, condition: $condition) {
            id
            albumId
            owner
            uploadTime
            bucket
            SfnExecutionArn
            ProcessingStatus
        }
    }
`


const START_WORKFLOW_MUTATION = gql`
    mutation StartSfnExecution(
        $input: StartSfnExecutionInput!
    ) {
        startSfnExecution(input: $input) {
            executionArn
            startDate
        }
    }
`

async function startSfnExecution(bucketName, key, id) {
  const sfnInput = {
    s3Bucket: bucketName,
    s3Key: key,
    objectID: id
  };
  const startWorkflowInput = {
    input: JSON.stringify(sfnInput),
    stateMachineArn: stateMachineArn
  }
  const startWorkflowResult = await client.mutate({
    mutation: START_WORKFLOW_MUTATION,
    variables: {input: startWorkflowInput},
    fetchPolicy: 'no-cache'
  })

  let executionArn = startWorkflowResult.data.startSfnExecution.executionArn
  return executionArn
}

async function processRecord(record) {
  const bucketName = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  const id = key.split('/').pop().split(".")[0]
  console.log('processRecord', JSON.stringify(record))

  if (!key.includes('upload')) {
    console.log('Does not look like an upload from user');
    return;
  }

  // const photoInfo = await S3.headObject({Bucket: bucketName, Key: key}).promise()
  // const metadata = photoInfo.Metadata
  // const uploadTime = photoInfo.LastModified
  //
  // const albumId = metadata.albumid
  // const owner = metadata.owner
  const SfnExecutionArn = await startSfnExecution(bucketName, key, id);
  console.log(`Sfn started. Execution: ${SfnExecutionArn}`)

  // const item = {
  //   id: key,
  //   albumId,
  //   owner,
  //   uploadTime,
  //   bucket: bucketName,
  //   fullsize: {
  //     key: key,
  //   },
  //   SfnExecutionArn,
  //   ProcessingStatus: 'RUNNING'
  // }
  // console.log('update photo item: ', JSON.stringify(item, null, 2))
  const item = {
    id,
    SfnExecutionArn,
    ProcessingStatus: 'RUNNING'
  }
  console.log('update photo item: ', JSON.stringify(item, null, 2))

  const result = await client.mutate({
    mutation: UPDATE_PHOTO_MUTATION,
    variables: {input: item},
    fetchPolicy: 'no-cache'
  })

  console.log('result', JSON.stringify(result))
  return result
}

exports.handler = async (event, context, callback) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  try {
    for (let i in event.Records) {
      await processRecord(event.Records[i])
    }
    callback(null, {status: 'Photo Processed'});
  } catch (err) {
    console.error(err);
    callback(err);
  }
};