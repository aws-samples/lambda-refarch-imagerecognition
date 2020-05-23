This project was built on React and on top of https://github.com/aws-samples/amplify-photo-gallery-workshop


## Running locally

You can run the front-end locally while targeting the back-end and auth deployed in your AWS account. 

If you followed [the deployment instructions](../../README.md), you should have  `src/react-frontend/aws-exports.js` file.

### I don't have aws-exports, or deleted accidentally

1. Open up your deployed App in Amplify Console by running `amplify console`
2. At the bottom of the page under **Edit your backend**, copy and run the `amplify pull` command
    - e.g. `amplify pull --appId d34s789vnlqyw4 --envName master`

> NOTE: **Aws-exports** is a configuration file for AWS Amplify library containing Cognito User Pools, AppSync  API, and what authentication mechanism it should use along with its region.

Once you're all set, install front-end dependencies and run a local copy:

1. `npm install`
2. `npm start`

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

