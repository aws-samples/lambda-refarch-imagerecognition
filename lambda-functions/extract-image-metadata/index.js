// dependencies
const AWS = require('aws-sdk');
const gm = require('gm').subClass({imageMagick: true}); // Enable ImageMagick integration.
const util = require('util');
const Promise = require('bluebird');
Promise.promisifyAll(gm.prototype);

// get reference to S3 client
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    // Read input from the event.
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    var getObjectPromise = s3.getObject({
        Bucket: srcBucket,
        Key: srcKey
    }).promise();

    getObjectPromise.then(function (getObjectResponse) {
        gm(getObjectResponse.Body).identifyAsync().then((data) => {
            data.eventData = event;
            data.eventData.size = data.size;
            data.eventData.format = data.format;
            callback(null, data);
        }).catch(function (err) {
            callback(err);
        });
    }).catch(function (err) {
        callback(err);
    });
};