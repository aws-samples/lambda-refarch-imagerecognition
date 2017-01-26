const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();
const util = require('util');
const stateMachineArn = process.env.STATE_MACHINE_ARN;
const tableName = process.env.IMAGE_METADATA_DDB_TABLE;
var docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
});

exports.handler = (event, context, callback) => {
    const requestId = context.awsRequestId;

    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    const s3key = event.Records[0].s3.object.key;
    // the s3key has a "Incoming/" prefix
    const objectID = s3key.substring(s3key.indexOf("/") + 1);

    const input = {
        s3Bucket: srcBucket,
        s3Key: s3key,
        objectID: objectID
    };

    const dynamoItem = {
        imageID: objectID,
        s3key: s3key,
    };

    const initialItemPutPromise = docClient.put({
        TableName: tableName,
        Item: dynamoItem,
        ConditionExpression: 'attribute_not_exists (imageID)'
    }).promise();

    const stateMachineExecutionParams = {
        stateMachineArn: stateMachineArn,
        input: JSON.stringify(input),
        name: requestId
    };

    const executionArnPromise = new Promise((resolve, reject) => {
        initialItemPutPromise.then(data => {
            stepfunctions.startExecution(stateMachineExecutionParams)
                .promise()
                .then(function (data) {
                    resolve(data.executionArn);
                })
                .catch(function (err) {
                    reject(err);
                });
        }).catch(err => {
            reject(err);
        })
    })

    executionArnPromise.then(arn => {
        var ddbparams = {
            TableName: tableName,
            Key: {
                'imageID': objectID
            },
            UpdateExpression: "SET executionArn = :arn",
            ExpressionAttributeValues: {
                ":arn": arn
            },
            ConditionExpression: 'attribute_exists (imageID)'
        };

        docClient.update(ddbparams).promise().then(function (data) {
            callback(null, arn);
        }).catch(function (err) {
            callback(err);
        });
    }).catch(err => {
        callback(err);
    })
};