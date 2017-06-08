export interface Config {
  Region: string;
  S3PhotoRepoBucket: string;
  DDBImageMetadataTable: string;
  DDBAlbumMetadataTable: string;
  DescribeExecutionLambda: string;
  CognitoIdentityPool: string;
}

export const CONFIG: Config = {
  DDBAlbumMetadataTable : "TO_BE_REPLACED",
  CognitoIdentityPool : "TO_BE_REPLACED",
  Region : "us-west-2",   // might be replaced if you launched the template in a different region
  DDBImageMetadataTable : "TO_BE_REPLACED",
  S3PhotoRepoBucket : "TO_BE_REPLACED",
  DescribeExecutionLambda : "TO_BE_REPLACED"
};
