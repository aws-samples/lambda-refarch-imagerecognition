#!/bin/bash -e

SCRIPT_NAME=`basename $0`
if [ $# -lt 2 ]; then
  echo "Usage: ${SCRIPT_NAME} <region> <lambda-deployment-bucket>"
  exit 1
fi

cd lambda-functions
cd create-s3-event-trigger-helper && npm install
cd ../thumbnail  && npm install
cd ../extract-image-metadata && npm install
cd ../../cloudformation


REGION=$1
LAMBDA_DEPLOYMENT_BUCKET=$2
TEMPLATE_NAME=image-processing
STATEMACHINE_JSON=state-machine.json
python inject_state_machine_cfn.py -s ${STATEMACHINE_JSON} -c ${TEMPLATE_NAME}.serverless.yaml -o image-processing.complete.yaml

sam package \
   --template image-processing.complete.yaml \
   --s3-bucket ${LAMBDA_DEPLOYMENT_BUCKET} \
   --s3-prefix cloudformation \
   --region ${REGION} \
   --output-template-file ${TEMPLATE_NAME}.output.yaml

# Pass Template Parameters with the --parameter-overrides flag as necessary
#sam deploy \
#    --template-file  ${TEMPLATE_NAME}.output.yaml \
#    --stack-name  \
#    --capabilities CAPABILITY_IAM \
#    --region ${REGION} \
#    --no-fail-on-empty-changeset
