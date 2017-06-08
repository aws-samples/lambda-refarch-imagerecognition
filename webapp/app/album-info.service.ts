import {Injectable} from "@angular/core";
import {CONFIG} from "./config";
import {Album} from "./album";
declare const AWS: any;

@Injectable()
export class AlbumInfoService {

  private docClient: any;

  constructor() {
    AWS.config.region = CONFIG.Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: CONFIG.CognitoIdentityPool});
    this.docClient = new AWS.DynamoDB.DocumentClient({
      region: CONFIG.Region
    });
  }

  createAlbum(albumName: string, userID: string): Promise<void> {
    const dynamoItem = {
      albumID: userID + "/" + albumName,
      userID: userID,
      name: albumName,
      creationTime: Math.floor(new Date().getTime() / 1000)
    };

    return this.docClient.put({
      TableName: CONFIG.DDBAlbumMetadataTable,
      Item: dynamoItem,
      ConditionExpression: 'attribute_not_exists (albumID)'
    }).promise();
  }

  listAlbums(userID: string): Promise<Album[]> {
    const params = {
      TableName: CONFIG.DDBAlbumMetadataTable,
      IndexName: 'userID-creationTime-index',
      KeyConditionExpression: 'userID = :userID',
      ExpressionAttributeValues: {
        ':userID': userID
      },
      ScanIndexForward: false
    };

    let promise = new Promise((resolve, reject) => {
      this.docClient.query(params).promise().then((data: any) => {
        resolve(data.Items);
      }).catch((err: any) => {
        reject(err);
      });
    });

    return promise;
  }

  listPhotos(albumID: string): Promise<any> {
    const params = {
      TableName: CONFIG.DDBImageMetadataTable,
      IndexName: 'albumID-uploadTime-index',
      KeyConditionExpression: 'albumID = :albumID',
      ExpressionAttributeValues: {
        ':albumID': albumID
      },
      ScanIndexForward: false
    };
    return this.docClient.query(params).promise();
  }

  getInfo(imageID: string): Promise<any> {
    const params = {
      TableName: CONFIG.DDBImageMetadataTable,
      Key: {
        imageID: imageID.replace(/ /g, '+')
      }
    };
    let promise = new Promise((resolve, reject) => {
      this.docClient.get(params).promise().then((data: any) => {
        resolve(data.Item);
      }).catch((err: any) => {
        reject(err);
      });
    });

    return promise;
  }

}
