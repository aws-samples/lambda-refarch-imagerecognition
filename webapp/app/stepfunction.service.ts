import {Injectable} from '@angular/core';
import {CONFIG} from './config';
declare const AWS: any;

@Injectable()
export class StepFunctionService {
  private lambdaClient: any;

  constructor() {
    AWS.config.region = CONFIG.Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: CONFIG.CognitoIdentityPool});
    this.lambdaClient = new AWS.Lambda({
      region: CONFIG.Region
    });
  }

  checkExecutionStatus(arn: string): Promise<string> {

    const lambdaInputPayload = JSON.stringify({executionArn: arn});
    const params = {
      FunctionName: CONFIG.DescribeExecutionLambda,
      Payload: lambdaInputPayload
    };

    let promise = new Promise((resolve, reject) => {
      this.lambdaClient.invoke(params).promise().then((data: any) => {
        const payload = JSON.parse(data.Payload);
        resolve(payload.status);
      }).catch((err: any) => {
        reject(err);
      });
    });
    return promise;
  }
}
