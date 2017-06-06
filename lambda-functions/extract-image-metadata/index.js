// dependencies
const AWS = require('aws-sdk');
const gm = require('gm').subClass({imageMagick: true}); // Enable ImageMagick integration.
const util = require('util');
const Promise = require('bluebird');
Promise.promisifyAll(gm.prototype);

// get reference to S3 client
const s3 = new AWS.S3();

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

    getObjectPromise.then((getObjectResponse) => {
        gm(getObjectResponse.Body).identifyAsync().then((data) => {
            console.log("Identified metadata:\n", util.inspect(data, {depth: 5}));
            callback(null, data);
        }).catch(function (err) {
            callback(new ImageIdentifyError(err));

        });
    }).catch(function (err) {
        callback(err);
    });
};

function ImageIdentifyError(message) {
    this.name = "ImageIdentifyError";
    this.message = message;
}
ImageIdentifyError.prototype = new Error();
