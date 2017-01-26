// dependencies
const AWS = require('aws-sdk');
const util = require('util');

const tableName = process.env.IMAGE_METADATA_DDB_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
});

exports.handler = (event, context, callback) => {
    // if no labels were detected, skip further steps
    if (typeof event.Labels === "undefined" || event.Labels.length === 0) {
        callback(null, event);
    }

    var tags = event.Labels.map((data) => {
        return data["Name"];
    });

    var ddbparams = {
        TableName: tableName,
        Key: {
            'imageID': event.eventData.objectID
        },
        UpdateExpression: 'SET tags = :tags',
        ExpressionAttributeValues: {
            ':tags': tags
        },
        ConditionExpression: 'attribute_exists (imageID)'
    };

    docClient.update(ddbparams).promise().then((data) => {
        delete event.Labels;
        callback(null, event);
    }).catch(function (err) {
        callback(err);
    })
}
