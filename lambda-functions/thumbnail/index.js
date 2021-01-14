// dependencies
const S3 = require('aws-sdk/clients/s3');
const gm = require('gm').subClass({ imageMagick: true }); // Enable ImageMagick integration.
const util = require('util');

// constants
const MAX_WIDTH = 250;
const MAX_HEIGHT = 250;

const s3 = new S3();

function thumbnailKey(keyPrefix, filename) {
	return `${keyPrefix}/resized/${filename}`;
}

async function generateThumbnail(s3Bucket, srcKey, width, height, format) {
	let originalPhoto = await s3.getObject({ Bucket: s3Bucket, Key: srcKey }).promise();

	const resizePromise = new Promise((resolve, reject) => {
		gm(originalPhoto.Body).resize(width, height).toBuffer(format, (err, buffer) => {
			if (err) {
				reject(err);
			} else {
				resolve(buffer);
			}
		});
	});
	return await resizePromise
}

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
exports.handler = async (event, context, callback) => {
	try {
		console.log("Reading input from event:\n", util.inspect(event, { depth: 5 }));
		const s3Bucket = event.s3Bucket;
		// Object key may have spaces or unicode non-ASCII characters.
		const srcKey = event.s3Key;

		const size = event.extractedMetadata.dimensions;
		const scalingFactor = Math.min(
			MAX_WIDTH / size.width,
			MAX_HEIGHT / size.height
		);
		const width = scalingFactor * size.width;
		const height = scalingFactor * size.height;
		const format = event.extractedMetadata.format; // JPG or PNG

		const resizedBuffer = await generateThumbnail(s3Bucket, srcKey, width, height, format);
		console.log(`resized : ${width} x ${height}`)

		const keyPrefix = srcKey.substr(0, srcKey.indexOf('/uploads/'))
		const originalPhotoName = srcKey.substr(srcKey.lastIndexOf('/') + 1)
		const destKey = thumbnailKey(keyPrefix, originalPhotoName)
		const s3PutParams = {
			Bucket: s3Bucket,
			Key: destKey,
			ContentType: "image/" + format.toLowerCase(),
			Body: resizedBuffer
		};
		await s3.upload(s3PutParams).promise()
		console.log(`uploaded : s3://${s3Bucket}/${destKey}`)

		let thumbnailInfo = {
			width,
			height,
			s3key: destKey,
			s3Bucket
		}

		callback(null, thumbnailInfo)
	} catch (err) {
		console.error(err);
		callback(err);
	}
}


