# use lambda-local (https://www.npmjs.com/package/lambda-local) to test lambda functions locally
lambda-local -l index.js -h handler -e step-sample-input.json -t 60