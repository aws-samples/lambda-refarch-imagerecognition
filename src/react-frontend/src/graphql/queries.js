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
        createdAt
        updatedAt
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
      createdAt
      updatedAt
      photos {
        items {
          id
          albumId
          owner
          uploadTime
          bucket
          format
          exifMake
          exitModel
          SfnExecutionArn
          ProcessingStatus
          objectDetected
          createdAt
          updatedAt
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
      owner
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
      objectDetected
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
      createdAt
      updatedAt
      album {
        id
        name
        owner
        createdAt
        updatedAt
        photos {
          nextToken
        }
      }
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
        owner
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
        objectDetected
        createdAt
        updatedAt
        album {
          id
          name
          owner
          createdAt
          updatedAt
        }
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
        owner
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
        objectDetected
        createdAt
        updatedAt
        album {
          id
          name
          owner
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
