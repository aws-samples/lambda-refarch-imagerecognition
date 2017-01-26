// load the state machine definition from json
const stateMachineDefinition = require('./step-function-spec.json');

const response = require('cfn-response');
const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions({
    region: process.env.AWS_REGION
});
const util = require('util');

exports.handler = function (event, context) {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
    const input = event.ResourceProperties;

    if (event.RequestType === 'Delete') {
        const arnOfStateMachineToDelete = event.PhysicalResourceId;
        stepfunctions.deleteStateMachine({stateMachineArn: arnOfStateMachineToDelete}).promise().then(function (data) {
            response.send(event, context, response.SUCCESS, data);
        }).catch(function (err) {
            response.send(event, context, response.FAILED, err);
        })
        return;
    }

    // substitute references to lambda functions with the ARNs of the actual functions created by cfn.
    stateMachineDefinition.States.ExtractImageMetadata.Resource = input.ExtractImageMetadataFunction;
    stateMachineDefinition.States.StoreImageMetadata.Resource = input.StoreImageMetadataFunction;
    stateMachineDefinition.States.ParallelProcessing.Branches[0].States.Rekognition.Resource = input.RekognitionFunction;
    stateMachineDefinition.States.ParallelProcessing.Branches[0].States.AddRekognizedTags.Resource = input.StoreRekognizedTagsFunction;
    stateMachineDefinition.States.ParallelProcessing.Branches[1].States.Thumbnail.Resource = input.GenerateThumbnailFunction;

    const stateMachineName = input.StackName + "-ImageProc-" + (new Date().getTime());

    var params = {
        definition: JSON.stringify(stateMachineDefinition),
        name: stateMachineName,
        roleArn: input.RoleArn
    };

    console.log("params", params);
    stepfunctions.createStateMachine(params).promise().then(function (data) {
        data.Arn = data.stateMachineArn;
        response.send(event, context, response.SUCCESS, data, data.stateMachineArn);
    }).catch(function (err) {
        console.log(err);
        response.send(event, context, response.FAILED, err);
    })
};