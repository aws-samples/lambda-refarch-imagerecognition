AWS_BRANCH ?= dev
STACK_NAME ?= photo-sharing
GRAPHQL_API_ID ?= "UNDEFINED"
APPSYNC_URL ?= "UNDEFINED"
PHOTO_BUCKET ?= "UNDEFINED"
TEMPLATE_NAME = image-processing

target:
	$(info ${HELP_MESSAGE})
	@exit 0

init: ##=> Install OS deps and dev tools
	$(info [*] Initializing...)
	@$(MAKE) _install_os_packages


deploy: ##=> Deploy services
	$(info [*] Deploying backend...)

#	cd lambda-functions/thumbnail && npm install && \
#	cd ../extract-image-metadata && npm install && \
#	cd ../store-image-metadata && npm install && \

	cd cloudformation/ && \
 	sam build --template ${TEMPLATE_NAME}.serverless.yaml  && \
	sam package \
		  --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
		  --s3-prefix photo-sharing-app/lambda/ \
		  --output-template-file packaged.yaml && \
	sam deploy \
		--template-file packaged.yaml \
		--stack-name ${STACK_NAME}-backend-${AWS_BRANCH} \
		--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
		--parameter-overrides \
		  PhotoRepoS3Bucket=${PHOTO_BUCKET} \
		  GraphQLEndPoint=${APPSYNC_URL} \
		  GraphQLAPIId=${GRAPHQL_API_ID} \
		  Stage=${AWS_BRANCH} \
     	 --no-fail-on-empty-changeset

#############
#  Helpers  #
#############

_install_os_packages:
	$(info [*] Installing jq...)
	yum install jq -y
	$(info [*] Upgrading Python SAM CLI and CloudFormation linter to the latest version...)
	python3 -m pip install --upgrade --user cfn-lint aws-sam-cli


define HELP_MESSAGE

	Environment variables:

	These variables are automatically filled at CI time except STRIPE_SECRET_KEY
	If doing a dirty/individual/non-ci deployment locally you'd need them to be set

	AWS_BRANCH: "dev"
		Description: Feature branch name used as part of stacks name; added by Amplify Console by default
	DEPLOYMENT_BUCKET_NAME: "a_valid_bucket_name"
		Description: S3 Bucket name used for deployment artifacts
	GRAPHQL_API_ID: "hnxochcn4vfdbgp6zaopgcxk2a"
		Description: AppSync GraphQL ID already deployed
	PHOTO_BUCKET: ""

	Common usage:

	...::: Bootstraps environment with necessary tools like SAM CLI, cfn-lint, etc. :::...
	$ make init

	...::: Deploy all SAM based services :::...
	$ make deploy

	...::: Delete all SAM based services :::...
	$ make delete

	...::: Export parameter and its value to System Manager Parameter Store :::...
	$ make export.parameter NAME="/env/service/amplify/api/id" VALUE="xzklsdio234"
endef
