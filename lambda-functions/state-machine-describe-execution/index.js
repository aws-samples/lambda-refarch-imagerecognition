const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions({
    region: process.env.AWS_REGION
});
const util = require('util');

exports.handler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    var params = {
        executionArn: event.executionArn
    };
    stepfunctions.describeExecution(params).promise().then(data => {
        callback(null, data);
    }).catch(err => {
        callback(err);
    })
}