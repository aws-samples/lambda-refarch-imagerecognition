/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum($owner: String!) {
    onCreateAlbum(owner: $owner) {
      id
      name
      owner
      photos {
        items {
          id
          albumId
          uploadTime
          bucket
          owner
        }
        nextToken
      }
    }
  }
`;
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum($owner: String!) {
    onUpdateAlbum(owner: $owner) {
      id
      name
      owner
      photos {
        items {
          id
          albumId
          uploadTime
          bucket
          owner
        }
        nextToken
      }
    }
  }
`;
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum($owner: String!) {
    onDeleteAlbum(owner: $owner) {
      id
      name
      owner
      photos {
        items {
          id
          albumId
          uploadTime
          bucket
          owner
        }
        nextToken
      }
    }
  }
`;
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto($owner: String!) {
    onCreatePhoto(owner: $owner) {
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
      processingInfo {
        SfnExecutionArn
        Status
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
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto($owner: String!) {
    onUpdatePhoto(owner: $owner) {
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
      processingInfo {
        SfnExecutionArn
        Status
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
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto($owner: String!) {
    onDeletePhoto(owner: $owner) {
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
      processingInfo {
        SfnExecutionArn
        Status
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
