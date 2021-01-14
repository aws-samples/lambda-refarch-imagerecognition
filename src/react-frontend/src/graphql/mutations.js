/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const startSfnExecution = /* GraphQL */ `
  mutation StartSfnExecution($input: StartSfnExecutionInput!) {
    startSfnExecution(input: $input) {
      executionArn
      startDate
    }
  }
`;
export const createAlbum = /* GraphQL */ `
  mutation CreateAlbum(
    $input: CreateAlbumInput!
    $condition: ModelAlbumConditionInput
  ) {
    createAlbum(input: $input, condition: $condition) {
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
export const updateAlbum = /* GraphQL */ `
  mutation UpdateAlbum(
    $input: UpdateAlbumInput!
    $condition: ModelAlbumConditionInput
  ) {
    updateAlbum(input: $input, condition: $condition) {
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
export const deleteAlbum = /* GraphQL */ `
  mutation DeleteAlbum(
    $input: DeleteAlbumInput!
    $condition: ModelAlbumConditionInput
  ) {
    deleteAlbum(input: $input, condition: $condition) {
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
export const createPhoto = /* GraphQL */ `
  mutation CreatePhoto(
    $input: CreatePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    createPhoto(input: $input, condition: $condition) {
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
export const updatePhoto = /* GraphQL */ `
  mutation UpdatePhoto(
    $input: UpdatePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    updatePhoto(input: $input, condition: $condition) {
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
export const deletePhoto = /* GraphQL */ `
  mutation DeletePhoto(
    $input: DeletePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    deletePhoto(input: $input, condition: $condition) {
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
