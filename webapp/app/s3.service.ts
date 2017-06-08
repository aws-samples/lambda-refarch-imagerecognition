import {Injectable} from '@angular/core';
import {CONFIG} from './config';
declare const AWS: any;

@Injectable()
export class S3Service {
  private s3Client: any;

  constructor() {
    AWS.config.region = CONFIG.Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: CONFIG.CognitoIdentityPool});
    this.s3Client = new AWS.S3({
      region: CONFIG.Region
    });
  }

  upload(params: any): Promise<any> {
    return this.s3Client.upload(params).promise();
  }

  getDownloadPresignedUrl(params: any): Promise<string> {
    let promise = new Promise((resolve, reject) => {
      this.s3Client.getSignedUrl('getObject', params, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return promise;
  }
}
