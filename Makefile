AWS_BRANCH ?= dev
STACK_NAME ?= photo-sharing
GRAPHQL_API_ID ?= "UNDEFINED"
PHOTO_BUCKET ?= "UNDEFINED"
STATE_MACHINE_JSON = state-machine.json
TEMPLATE_NAME = image-processing


init: ##=> Install OS deps and dev tools
	$(info [*] Initializing...)
	@$(MAKE) _install_os_packages


deploy: ##=> Deploy services
	$(info [*] Deploying backend...)
	$(info [*] Packaging and deploying Payment service...)
	echo ${STATE_MACHINE_JSON}
	cd cloudformation/ && \
    python inject_state_machine_cfn.py \
      -s ${STATE_MACHINE_JSON} \
      -c ${TEMPLATE_NAME}.serverless.yaml \
      -o ${TEMPLATE_NAME}.complete.yaml  && \
		sam package \
		  --template ${TEMPLATE_NAME}.complete.yaml \
			--s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
      --s3-prefix photo-sharing-app/lambda \
			--output-template-file packaged.yaml && \
		sam deploy \
			--template-file packaged.yaml \
			--stack-name ${STACK_NAME}-backend-${AWS_BRANCH} \
			--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
			--parameter-overrides \
      PhotoRepoS3Bucket=${PHOTO_BUCKET} \
      GraphQLEndPoint=${APPSYNC_URL} \
      GraphQLAPIId=${GRAPHQL_API_ID} \
      --no-fail-on-empty-changeset

#############
#  Helpers  #
#############

_install_os_packages:
	$(info [*] Installing jq...)
	yum install jq -y
	$(info [*] Upgrading Python SAM CLI and CloudFormation linter to the latest version...)
	python3 -m pip install --upgrade --user cfn-lint aws-sam-cli
