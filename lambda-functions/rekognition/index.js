const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    const srcBucket = event.eventData.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.eventData.s3Key.replace(/\+/g, " "));

    var params = {
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        },
        MaxLabels: 10,
        MinConfidence: 60
    };
    
    rekognition.detectLabels(params).promise().then(function (data) {
        data.eventData = event.eventData;
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });

};