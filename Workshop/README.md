# Workshop: Serverless Image Processing Workflow with AWS Step Functions 

In this workshop, you will learn to build a serverless image processing workflow step-by-step using AWS Step Functions.

As can be seen in the diagram below, this workflow processes photos uploaded to Amazon S3 and extracts metadata from the image such as geolocation, size/format, time, etc. It then uses image recognition to tag objects in the photo. In parallel, it also produces a thumbnail of the photo. AWS Step Functions acts as the orchestration to coordinate the various steps involved. 

![pick IAM role for state machine](../images/photo-processing-backend-diagram.png)

## Pre-requisites

- Administrative access to an AWS account
- Code editor of choice (e.g. Sublime Text, PyCharm, etc...)

## Instructions

* [Step 0: Set up resources](step-0.md)
* [Step 1: Adding first Lambda step to a AWS Step Functions state machine](step-1.md)
* [Step 2: Add branching logic to state machine](step-2.md)
* [Step 3: Add parallel processing to the workflow](step-3.md)
* [Step 4: Persisting labels and image metadata](step-4.md)
* [Step 5: Start execution from an S3 event](step-5.md)
* [Step 6: Build and Launch the web application](step-6.md)
* [Extra credit options](additional-steps.md)
* [Resource clean-up](clean-up.md)
