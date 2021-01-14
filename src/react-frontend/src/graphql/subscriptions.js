/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum($owner: String) {
    onCreateAlbum(owner: $owner) {
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum($owner: String) {
    onUpdateAlbum(owner: $owner) {
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum($owner: String) {
    onDeleteAlbum(owner: $owner) {
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
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto($owner: String) {
    onCreatePhoto(owner: $owner) {
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
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto($owner: String) {
    onUpdatePhoto(owner: $owner) {
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
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto($owner: String) {
    onDeletePhoto(owner: $owner) {
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
