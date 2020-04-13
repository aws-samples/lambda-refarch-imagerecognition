/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPhotoshareGraphQLAPIIdOutput = process.env.API_PHOTOSHARE_GRAPHQLAPIIDOUTPUT
var apiPhotoshareGraphQLAPIEndpointOutput = process.env.API_PHOTOSHARE_GRAPHQLAPIENDPOINTOUTPUT
var storagePhotostorageBucketName = process.env.STORAGE_PHOTOSTORAGE_BUCKETNAME

Amplify Params - DO NOT EDIT */
const stateMachineArn = process.env.STATE_MACHINE_ARN;
require('es6-promise').polyfill();
require('isomorphic-fetch');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({signatureVersion: 'v4'});
const AUTH_TYPE = require('aws-appsync').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag')
X`X`;
let client = new AWSAppSyncClient({
  url: process.env.API_PHOTOSHARE_GRAPHQLAPIENDPOINTOUTPUT,
  region: process.env.REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials
  },
  disableOffline: true
});

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
            album {
                id
                name
                owner
            }
        }
    }`


const startWorkflow = gql`
    mutation StartSfnExecution(
        $input: StartSfnExecutionInput!
    ) {
        startSfnExecution(input: $input) {
            executionArn
            startDate
        }
    }
`

async function processRecord(record) {
  const bucketName = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

  console.log('processRecord', JSON.stringify(record))

  if (record.eventName !== "ObjectCreated:Put") {
    console.log('Is not a new file');
    return;
  }
  if (!key.includes('upload/')) {
    console.log('Does not look like an upload from user');
    return;
  }


  const photoInfo = await S3.headObject({Bucket: bucketName, Key: key}).promise()
  const metadata = photoInfo.Metadata

  const owner = metadata.owner
  const albumId = metadata.albumid
  const objectId = uuidv4();

  const sfnInput = {
    s3Bucket: bucketName,
    s3Key: key,
    objectID: objectId
  };
  const startWorkflowInput = {
    input: JSON.stringify(sfnInput),
    stateMachineArn: stateMachineArn
  }
  const startWorkflowResult = await client.mutate({
    mutation: startWorkflow,
    variables: {input: startWorkflowInput},
    fetchPolicy: 'no-cache'
  })

  executionArn = startWorkflowResult
  console.log(startWorkflowResult)

  const item = {
    id: id,
    owner: metadata.owner,
    albumId: metadata.albumid,
    bucket: bucketName,
    fullsize: {
      key: sizes.fullsize.key,
    }
  }


}

exports.handler = async (event, context, callback) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  try {
    event.Records.forEach(processRecord);
    callback(null, {status: 'Photo Processed'});
  } catch (err) {
    console.error(err);
    callback(err);
  }
};


// exports.handler = (event, context, callback) => {
//
//   /* start state machine */
//
//   /* Store DDB */
//
//
//   const requestId = context.awsRequestId;
//
//   console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
//   const srcBucket = event.Records[0].s3.bucket.name;
//   const s3key = event.Records[0].s3.object.key;
//   // the s3key has a "Incoming/" prefix
//   const objectID = s3key.substring(s3key.indexOf("/") + 1);
//
//   const input = {
//     s3Bucket: srcBucket,
//     s3Key: s3key,
//     objectID: objectID
//   };
//
//   const dynamoItem = {
//     imageID: objectID,
//     s3key: s3key,
//   };
//
//   const initialItemPutPromise = docClient.put({
//     TableName: tableName,
//     Item: dynamoItem,
//     ConditionExpression: 'attribute_not_exists (imageID)'
//   }).promise();
//
//   const stateMachineExecutionParams = {
//     stateMachineArn: stateMachineArn,
//     input: JSON.stringify(input),
//     name: requestId
//   };
//
//   const executionArnPromise = new Promise((resolve, reject) => {
//     initialItemPutPromise.then(data => {
//       stepfunctions.startExecution(stateMachineExecutionParams)
//         .promise()
//         .then(function (data) {
//           resolve(data.executionArn);
//         })
//         .catch(function (err) {
//           reject(err);
//         });
//     }).catch(err => {
//       reject(err);
//     })
//   })
//
//   executionArnPromise.then(arn => {
//     var ddbparams = {
//       TableName: tableName,
//       Key: {
//         'imageID': objectID
//       },
//       UpdateExpression: "SET executionArn = :arn",
//       ExpressionAttributeValues: {
//         ":arn": arn
//       },
//       ConditionExpression: 'attribute_exists (imageID)'
//     };
//
//     docClient.update(ddbparams).promise().then(function (data) {
//       callback(null, arn);
//     }).catch(function (err) {
//       callback(err);
//     });
//   }).catch(err => {
//     callback(err);
//   })
// };