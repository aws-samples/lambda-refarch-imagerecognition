export interface Config {
  Region: string;
  S3PhotoRepoBucket: string;
  DDBImageMetadataTable: string;
  DDBAlbumMetadataTable: string;
  DescribeExecutionLambda: string;
  AccessKeyId: string;
  SecretAccessKey: string;
}

export const CONFIG: Config = {
  AccessKeyId : "TO_BE_REPLACED",
  SecretAccessKey : "TO_BE_REPLACED",
  DDBAlbumMetadataTable : "TO_BE_REPLACED",
  Region : "us-west-2",   // might be replaced if you launched the template in a different region
  DDBImageMetadataTable : "TO_BE_REPLACED",
  S3PhotoRepoBucket : "TO_BE_REPLACED",
  DescribeExecutionLambda : "TO_BE_REPLACED"
};
