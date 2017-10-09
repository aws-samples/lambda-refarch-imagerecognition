// dependencies
const S3 = require('aws-sdk/clients/s3');
const gm = require('gm').subClass({imageMagick: true}); // Enable ImageMagick integration.
const util = require('util');

// constants
const MAX_WIDTH = 250;
const MAX_HEIGHT = 250;

const s3 = new S3();

/**
 * Generate a thumbnail of an image stored in s3 and store the thumbnail back in the same bucket under the "Thumbnail/" prefix
 * @param event
 *          should have the following inputs:
 *          {
 *                "s3Bucket": "mybucket",
 *                "s3Key": "mykey",
 *                "objectID": "l3j4234-234",
 *                "extractedMetadata": {
 *                   "dimensions": {
 *                      "width": 4567,
 *                      "height": 3456
 *                   }
 *                }
 *          }
 * @param context
 * @param callback
 */
exports.handler = (event, context, callback) => {
    const s3Bucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    const getObjectPromise = s3.getObject({
        Bucket: s3Bucket,
        Key: srcKey
    }).promise();

    const size = event.extractedMetadata.dimensions;
    const scalingFactor = Math.min(
        MAX_WIDTH / size.width,
        MAX_HEIGHT / size.height
    );
    const width = scalingFactor * size.width;
    const height = scalingFactor * size.height;

    var resizePromise = new Promise((resolve) => {
        getObjectPromise.then((getObjectResponse) => {
            gm(getObjectResponse.Body).resize(width, height).toBuffer(event.extractedMetadata.format, (err, buffer) => {
                if (err) {
                    callback(err);
                } else {
                    resolve(buffer);
                }
            });
        }).catch(function (err) {
            callback(err);
        });
    })

    const destKey = "Thumbnail/" + event.objectID;

    const s3PutParams = {
        Bucket: s3Bucket,
        Key: destKey,
        ContentType: "image/" + event.extractedMetadata.format.toLowerCase()
    };

    resizePromise.then(function (buffer) {
        s3PutParams.Body = buffer;
        s3.upload(s3PutParams).promise().then((data) => {
            callback(null, {"s3Bucket": s3Bucket, "s3Key": destKey});
        }).catch(function (err) {
            callback(err);
        })
    }).catch(function (err) {
        callback(err);
    })
}
