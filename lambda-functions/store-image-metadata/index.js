// dependencies
const AWS = require('aws-sdk');
const util = require('util');

const tableName = process.env.IMAGE_METADATA_DDB_TABLE;
// get reference to S3 client
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
});

exports.handler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    const s3ObjectParams = {
        Bucket: srcBucket,
        Key: srcKey
    };

    const s3ObjectMetadataPromise = s3.headObject(s3ObjectParams).promise();

    s3ObjectMetadataPromise.then((s3ObjectMetadata) => {
        const fileUploadTimeStamp = Math.floor(Date.parse(s3ObjectMetadata.LastModified) / 1000);
        console.log(util.inspect(s3ObjectMetadata, {depth: 5}));

        var UpdateExpression = 'SET uploadTime = :uploadTime, ' +
            'imageFormat = :format, dimensions = :dimensions, ' +
            'fileSize = :fileSize, userID = :userID, ' +
            'albumID = :albumID';

        var ExpressionAttributeValues = {
            ":uploadTime": fileUploadTimeStamp,
            ":format": event.extractedMetadata.format,
            ":dimensions": event.extractedMetadata.dimensions,
            ":fileSize": event.extractedMetadata.fileSize,
            ":userID": s3ObjectMetadata.Metadata.userid,
            ":albumID": s3ObjectMetadata.Metadata.albumid
        };

        if (event.extractedMetadata.geo) {
            UpdateExpression += ", latitude = :latitude"
            ExpressionAttributeValues[":latitude"] = event.extractedMetadata.geo.latitude;
            UpdateExpression += ", longitude = :longitude"
            ExpressionAttributeValues[":longitude"] = event.extractedMetadata.geo.longitude;
        }

        if (event.extractedMetadata.exifMake) {
            UpdateExpression += ", exifMake = :exifMake"
            ExpressionAttributeValues[":exifMake"] = event.extractedMetadata.exifMake;
        }
        if (event.extractedMetadata.exifModel) {
            UpdateExpression += ", exifModel = :exifModel"
            ExpressionAttributeValues[":exifModel"] = event.extractedMetadata.exifModel;
        }

        if (event.parallelResults[0]) {
            const labels = event.parallelResults[0];
            var tags = labels.map((data) => {
                return data["Name"];
            });
            UpdateExpression += ", tags = :tags"
            ExpressionAttributeValues[":tags"] = tags;
        }

        if (event.parallelResults[1]) {
            UpdateExpression += ", thumbnail = :thumbnail"
            ExpressionAttributeValues[":thumbnail"] = event.parallelResults[1];
        }

        console.log("UpdateExpression", UpdateExpression);
        console.log("ExpressionAttributeValues", ExpressionAttributeValues);

        var ddbparams = {
            TableName: tableName,
            Key: {
                'imageID': event.objectID
            },
            UpdateExpression: UpdateExpression,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ConditionExpression: 'attribute_exists (imageID)'
        };

        docClient.update(ddbparams).promise().then(function (data) {
            callback(null, data);
        }).catch(function (err) {
            callback(err);
        });
    })
}