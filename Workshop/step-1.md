## Step 1: Adding first Lambda step to a AWS Step Functions state machine

To build an AWS Step Functions state machine to coordinate the processing steps, we will start with the machine containing a single step.

Step Functions state machines are defined in JSON using the [Amazon States Language](https://states-language.net/spec.html). Take a look at the below JSON that defines a state machine with a single step:

```javascript
{
  "StartAt": "ExtractImageMetadata",
  "Comment": "Imgage Processing State Machine",
  "States": {
    "ExtractImageMetadata": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-west-2:012345678912:function:sfn-workshop-setup-ExtractMetadata",
      "End": true
    }
  }
}
```

When this state machine is launched, the AWS Step Functions interpreter begins execution by identifying the Start State. It executes that state, and then checks to see if the state is marked as an End State. If it is, the machine terminates and returns a result. If the state is not an End State, the interpreter looks for a “Next” field to determine what state to run next; it repeats this process until it reaches a Terminal State (Succeed, Fail, or an End State) or a runtime error occurs.

When you are constructing a state machine definition by authoring JSON directly, make sure to use [statelint](https://github.com/awslabs/statelint) tool to validate your JSON before creating the state machine.

### Step 1A: Add AWS Lambda Task state

1. In a text editor of your choice, start a state machine definition in JSON:

	```javascript
	{
	  "StartAt": "ExtractImageMetadata",
	  "Comment": "Image Processing State Machine",
	  "States": {
	    "ExtractImageMetadata": {
	      "Type": "Task",
	      "Resource": "REPLACE_WITH_YOUR_LAMBDA_ARN",
	      "End": true
	    }
	  }
	}
	```

1. In the JSON, replace the `REPLACE_WITH_YOUR_LAMBDA_ARN` string with the ARN of the metadata extraction AWS Lambda function
	> To find the ARN of the metadata extraction AWS Lambda function, in the AWS CloudFormation Console, go to the **sfn-workshop-setup** stack, look in the Outputs section for **ExtractMetadataLambda**
	>
	> It should look something like `arn:aws:lambda:us-west-2:<YOUR-ACCOUNT-ID>:function:sfn-workshop-setup-ExtractMetadata`



### Step 1B: Create an initial AWS Step Functions state machine

1.  Go to [AWS Step Functions management console](http://console.aws.amazon.com/states/home)

1.  You might see the Get Started page if you have not used AWS Step Functions before. If that's the case, click **Get Started**, it should lead you to the page to create a new state machine. Otherwise, click the **Create a State Machine** button.

1. Type `ImageProcessing` for the state machine name

1. In **State machine definition**, 	paste in the JSON exported from Step 1A

	You can click on the &#x21ba; icon on the right hand pane to refresh the visual representation of the state machine:

	<img src="images/1b-step-console-preview.png" width="90%">

1. Click **Next** to configure additional settings in the next page.

1. For **IAM role for executions**, if you already have IAM roles created for Step Functions, select **I will use an existing role**, and select the IAM role that already exists in your account

	<details>
	<summary><strong> Expand for screenshot </strong></summary><p>

	![select IAM role](./images/3-create-statemachine-select-role.png)
	</details>

	If you do not have any IAM roles created for Step Functions, you can pick **Create an IAM role for me** and give it a name, for example, `StepFunctionExecutionRoleForImageProcessing`:

	<details>
	<summary><strong> Expand for screenshot </strong></summary><p>

	![create IAM role for state machine](./images/1-auto-IAM-role.png)

	</details>

1. Click **Create state machine** to finish the creation


### Step 1C: Test the state machine execution

1. Click the **Start execution** button to start a new execution.

1. Here you specify the input data passed into the AWS Step Functions state machine to process.

   Each execution of a Step Functions state machine has an unique ID. You can either specify one when starting the execution, or have the service generate one for you. In the text field that says "enter your execution id here",  you can specify an execution ID, or leave it blank.

	For input data, use the following JSON template. Make sure to substitute the s3Bucket field with your own value.

	```JSON
	{
	  "s3Bucket": "FILL_IN_YOUR_VALUE",
	  "s3Key": "tests/1_cactus.jpg"
	}
	```

	> The `s3Bucket` and `s3Key` fields tell the image processing workflow the Amazon S3 bucket and key the picture is stored at.

	For `s3Bucket` field, look in the **Output** section of the **sfn-workshop-setup** CloudFormation stack for `PhotoRepoS3Bucket`.  

	For `s3key` field, we already uploaded some test images to your bucket (under ```/tests```).  

	We recommend you save the test input JSON in a text editor (Sublime, Notepad++, etc.) as we will reuse it in later steps.

	Click **Start Execution**

	<img src="images/1c-start-new-execution.png" width="90%">

1.  You can now see the state machine execution in action. Explore the different tabs in the Console to see what information is available to you for this execution:

	<img src="images/1c-execution.png" width="90%">


### Step 1D: Using ResultPath to join output with original input

If you take a look at the **Output** of the state machine we just created, it has lots of useful information about the metadata that was extracted from the image by the Lambda function, but what if we also want to pass down the original input data that was passed to this step? e.g. subsequent steps also need reference to the s3Bucket and s3Key that the image is stored at.

One option is to write this logic in the Lambda function itself to copy the input data into the output of the Lambda function. Alternatively, Step Functions provides a feature we can leverage -- **Paths**. This feature allows to manipulate the input passed into a task and the output of task passed on to the next state using a JSON path expression.

There are three different types of **Paths** fields: **InputPath**, **ResultPath** and **OutputPath**. (Read more about the Paths feature in [documentation](https://docs.aws.amazon.com/step-functions/latest/dg/awl-ref-paths.html) and [Amazon States Language specification.](https://states-language.net/spec.html#path) )

For our specific need we will use the **ResultPath** field. This field defines for passing on data to the next state, which part of the input JSON will be replaced by the result of the execution (e.g. output of the Lambda function). By default (if omitted), this field takes on `$`, which means the execution result will the be entire data passed on to the next (OutputPath allows further filtering of the output of ResultPath). That behavior can be changed by explicitly specifying a JSON path:

- If the **ResultPath** JSON path expression matches an item in the state's input, only that input item is overwritten with the results of executing the state's task. The entire modified input becomes available to the state's output.

- If the **ResultPath** JSON path expression does not match an item in the state's input, that item is added to the input. The item contains the results of executing the state's task. The expanded input becomes available to the state's output.

Now, add a `$.extractedMetadata` as a result path for the step we've added to the state machine.	 

<details>
<summary><strong> Expand for step-by-step instructions</strong></summary><p>

1. On the AWS Step Functions management console page click on **Dashboard** to go back to your list of state machines.

1. Select the state machine we just created. Click on **Edit state machine**

	<img src="images/1d-edit.png" width="90%">

1. Add the attribute `"ResultPath": "$.extractedMetadata"` to the task. The final JSON should look like the following:

	```javascript
	{
	  "StartAt": "ExtractImageMetadata",
	  "Comment": "Image Processing State Machine",
	  "States": {
	    "ExtractImageMetadata": {
	      "Type": "Task",
	      "Resource": "REPLACE_WITH_YOUR_LAMBDA_ARN",
	      "ResultPath": "$.extractedMetadata",
	      "End": true
	    }
	  }
	}
	```

1. Also, copy/paste the new definition to your text editor for further work later

1. Click **Save** and click **Save anyway** if the warning pops up.

1. Enter the same JSON input you used on Step 1C-2 (you can find it by going to the execution history of the `ImageProcessing` and copy the JSON from the details>Input plane) and click **Start Execution**

</details>


Verify after the change, for new executions the **Output** contains the state input attributes plus an additional field `extractedMetadata` that contains the task ouput, effectively merging both the input and the output

<img src="images/1d-output-w-resultpath.png" width="90%">

You are now ready to move on to [Step 2](step-2.md)!
