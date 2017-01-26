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
    const srcBucket = event.eventData.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.eventData.s3Key.replace(/\+/g, " "));

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
            ":format": event.format,
            ":dimensions": event.size,
            ":fileSize": event.Filesize,
            ":userID": s3ObjectMetadata.Metadata.userid,
            ":albumID": s3ObjectMetadata.Metadata.albumid
        };

        // extract exif info
        if (event.Properties) {
            if (event.Properties["exif:DateTime"]) {
                UpdateExpression += ", exifTime = :exifTime"
                ExpressionAttributeValues[":exifTime"] = event.Properties["exif:DateTime"];
            }
            if (event.Properties["exif:GPSLatitude"] && event.Properties["exif:GPSLatitudeRef"] && event.Properties["exif:GPSLongitude"] && event.Properties["exif:GPSLongitudeRef"]) {
                try {
                    const lat = parseCoordinate(event.Properties["exif:GPSLatitude"], event.Properties["exif:GPSLatitudeRef"]);
                    UpdateExpression += ", latitude = :latitude"
                    ExpressionAttributeValues[":latitude"] = lat;
                    const long = parseCoordinate(event.Properties["exif:GPSLongitude"], event.Properties["exif:GPSLongitudeRef"]);
                    UpdateExpression += ", longitude = :longitude"
                    ExpressionAttributeValues[":longitude"] = long;
                    console.log("lat", lat);
                    console.log("long", long);
                } catch (err) {
                    // ignore failure in parsing coordinates
                    console.log(err);
                }
            }
            if (event.Properties["exif:Make"]) {
                UpdateExpression += ", exifMake = :exifMake"
                ExpressionAttributeValues[":exifMake"] = event.Properties["exif:Make"];
            }
            if (event.Properties["exif:Model"]) {
                UpdateExpression += ", exifModel = :exifModel"
                ExpressionAttributeValues[":exifModel"] = event.Properties["exif:Model"];
            }
        }

        console.log("UpdateExpression", UpdateExpression);
        console.log("ExpressionAttributeValues", ExpressionAttributeValues);
        var ddbparams = {
            TableName: tableName,
            Key: {
                'imageID': event.eventData.objectID
            },
            UpdateExpression: UpdateExpression,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ConditionExpression: 'attribute_exists (imageID)'
        };

        docClient.update(ddbparams).promise().then(function (data) {
            callback(null, {"eventData": event.eventData});
        }).catch(function (err) {
            callback(err);
        });
    })
}

function parseCoordinate(coordinate, coordinateDirection) {
    return {
        "D": parseInt(coordinate.split(",")[0].trim().split("/")[0]),
        "M": parseInt(coordinate.split(",")[1].trim().split("/")[0]),
        "S": parseInt(coordinate.split(",")[2].trim().split("/")[0]) / 100,
        "Direction": coordinateDirection
    };
}
