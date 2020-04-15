/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const checkSfnStatus = /* GraphQL */ `
  query CheckSfnStatus($input: checkSfnStatusInput!) {
    checkSfnStatus(input: $input) {
      startDate
      stopDate
      status
    }
  }
`;
export const listAlbums = /* GraphQL */ `
  query ListAlbums(
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owner
        photos {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getAlbum = /* GraphQL */ `
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
      id
      name
      owner
      photos {
        items {
          id
          albumId
          uploadTime
          bucket
          format
          exifMake
          exitModel
          SfnExecutionArn
          ProcessingStatus
          owner
        }
        nextToken
      }
    }
  }
`;
export const getPhoto = /* GraphQL */ `
  query GetPhoto($id: ID!) {
    getPhoto(id: $id) {
      id
      albumId
      uploadTime
      bucket
      fullsize {
        key
        width
        height
      }
      thumbnail {
        key
        width
        height
      }
      format
      exifMake
      exitModel
      SfnExecutionArn
      ProcessingStatus
      geoLocation {
        Latitude {
          D
          M
          S
          Direction
        }
        Longtitude {
          D
          M
          S
          Direction
        }
      }
      album {
        id
        name
        owner
        photos {
          nextToken
        }
      }
      owner
    }
  }
`;
export const listPhotos = /* GraphQL */ `
  query ListPhotos(
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        albumId
        uploadTime
        bucket
        fullsize {
          key
          width
          height
        }
        thumbnail {
          key
          width
          height
        }
        format
        exifMake
        exitModel
        SfnExecutionArn
        ProcessingStatus
        album {
          id
          name
          owner
        }
        owner
      }
      nextToken
    }
  }
`;
export const listPhotosByAlbumUploadTime = /* GraphQL */ `
  query ListPhotosByAlbumUploadTime(
    $albumId: ID
    $uploadTime: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotosByAlbumUploadTime(
      albumId: $albumId
      uploadTime: $uploadTime
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        albumId
        uploadTime
        bucket
        fullsize {
          key
          width
          height
        }
        thumbnail {
          key
          width
          height
        }
        format
        exifMake
        exitModel
        SfnExecutionArn
        ProcessingStatus
        album {
          id
          name
          owner
        }
        owner
      }
      nextToken
    }
  }
`;
