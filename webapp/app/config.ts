export interface Config {
  Region: string;
  S3PhotoRepoBucket: string;
  DDBImageMetadataTable: string;
  DDBAlbumMetadataTable: string;
  DescribeExecutionLambda: string;
  CognitoIdentityPool: string;
}

export const CONFIG: Config = {
  DDBAlbumMetadataTable : "photo-sharing-backend-AlbumMetadataDDBTable-10EV3LCQ5PT6M",
  CognitoIdentityPool : "us-west-2:fa66b92c-27dd-4cdf-9cd4-5314d4190d57",
  Region : "eu-west-1",   // might be replaced if you launched the template in a different region
  DDBImageMetadataTable : "photo-sharing-backend-ImageMetadataDDBTable-JAVKSMXN0ETI",
  S3PhotoRepoBucket : "photo-sharing-backend-photorepos3bucket-7inrc7x5qvdf",
  DescribeExecutionLambda : "photo-sharing-backend-DescribeExecutionFunction-2011F3H38HLI"
};
