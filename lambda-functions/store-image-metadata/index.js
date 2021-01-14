// dependencies
require('isomorphic-fetch');
const AWS = require('aws-sdk');
const AUTH_TYPE = require('aws-appsync').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag')
const util = require('util');

let client = new AWSAppSyncClient({
	url: process.env.GRAPHQL_API_ENDPOINT,
	region: process.env.AWS_REGION,
	auth: {
		type: AUTH_TYPE.AWS_IAM,
		credentials: AWS.config.credentials
	},
	disableOffline: true
});

const UPDATE_PHOTO = gql`
    mutation UpdatePhoto(
        $input: UpdatePhotoInput!
        $condition: ModelPhotoConditionInput
    ) {
        updatePhoto(input: $input, condition: $condition) {
            id
            albumId
            uploadTime
            bucket
            fullsize {
                key
                width
                height
            }
            thumbnail {
                key
                width
                height
            }
            format
            exifMake
            exitModel
            objectDetected
            SfnExecutionArn
            ProcessingStatus
            geoLocation {
                Latitude {
                    D
                    M
                    S
                    Direction
                }
                Longtitude {
                    D
                    M
                    S
                    Direction
                }
            }
            owner
        }
    }
`;


exports.handler = async (event, context, callback) => {
	console.log("Reading input from event:\n", util.inspect(event, { depth: 5 }));
	const id = event.objectID
	let extractedMetadata = event.extractedMetadata;
	const fullsize = {
		key: event.s3Key,
		width: extractedMetadata.dimensions.width,
		height: extractedMetadata.dimensions.height
	}

	const updateInput = {
		id,
		fullsize,
		format: extractedMetadata.format,
		exifMake: extractedMetadata.exifMake || null,
		exitModel: extractedMetadata.exifModel || null,
		ProcessingStatus: "SUCCEEDED"

	}
	const thumbnailInfo = event.parallelResults[1];

	if (thumbnailInfo) {
		updateInput['thumbnail'] = {
			key: thumbnailInfo.s3key,
			width: Math.round(thumbnailInfo.width),
			height: Math.round(thumbnailInfo.height)
		}
	}

	if (event.parallelResults[0]) {
		const labels = event.parallelResults[0];
		let tags = []
		for (let i in labels) {
			tags.push(labels[i]["Name"])
		}
		updateInput["objectDetected"] = tags
	}


	if (event.extractedMetadata.geo) {
		updateInput['geoLocation'] = {
			Latitude: event.extractedMetadata.geo.latitude,
			Longtitude: event.extractedMetadata.geo.longitude
		}
	}

	console.log(JSON.stringify(updateInput, null, 2));

	const result = await client.mutate({
		mutation: UPDATE_PHOTO,
		variables: { input: updateInput },
		fetchPolicy: 'no-cache'
	})

	return { "Status": "Success" }
}
