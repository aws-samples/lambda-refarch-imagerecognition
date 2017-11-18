## Step 0: Set up resources

### Step 0A: Set up Lambda functions and data stores

The AWS Step Functions state machine you will create in this workshop coordinates a number of Lambda functions that implement the logic for each step. Some of those Lambda functions rely on the existance of AWS resources and data stores, such as an Amazon S3 bucket or an Amazon DynamoDB table.

In this section, you will use a cloudformation template to provision the AWS Lambda functions plus all the resources that those require.

Region| Code | Launch
------|------|-------
EU (Ireland) | <span style="font-family:'Courier';">eu-west-1</span> | [![Launch Step 0A in eu-west-1](images/cfn-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=sfn-workshop-setup&templateURL=https://s3-eu-west-1.amazonaws.com/sfn-image-workshop-eu-west-1/cloudformation/step0-sam.yaml)
US East (N. Virginia) | <span style="font-family:'Courier';">us-east-1</span> | [![Launch Step 0A in us-east-1](images/cfn-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=sfn-workshop-setup&templateURL=https://s3.amazonaws.com/sfn-image-workshop-us-east-1/cloudformation/step0-sam.yaml)
US West (Oregon) | <span style="font-family:'Courier';">us-west-2</span> | [![Launch Step 0A in us-west-2](images/cfn-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=sfn-workshop-setup&templateURL=https://s3-us-west-2.amazonaws.com/sfn-image-workshop-us-west-2/cloudformation/step0-sam.yaml)

<details>
<summary><strong> CloudFormation launch instructions (expand for details) </strong></summary><p>
 
1. Click the **Launch Stack** link above for the region of your choice.

1. Click **Next** on the Select Template page.

1. On the Specify Details page, leave all the defaults and click **Next**.

1. On the Options page, also leave all the defaults and click **Next**.

1. On the Review page, check the boxes to acknowledge that CloudFormation will create IAM resources and click **Create Change Set**.
	![Acknowledge IAM Screenshot](./images/0a-cfn-create-change-set.png)

	This template creates a number of IAM roles to grant the Lambda fuctions proper permissions on the resources they have to deal with. In addition to that, the template uses the [AWS Serverless Transform](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-aws-serverless.html) that leverages the [AWS Serverless Application Model](https://github.com/awslabs/serverless-application-model) - SAM - to simplify template authoring for serverless components.
    
1. Wait for the change set to finish computing changes and click **Execute**
	![Execute Change Set Screenshot](./images/0a-cfn-execute-change-set.png)

1. Wait for the `sfn-workshop-setup` stack to reach a status of `CREATE_COMPLETE` (you might need to click the refresh button to see the stack being created). 
</details>

	
### Next step
You are now ready to move on to [Step 1](step-1.md)!
