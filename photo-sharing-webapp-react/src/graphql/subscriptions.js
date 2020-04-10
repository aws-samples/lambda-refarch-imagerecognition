/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum($owner: String!) {
    onCreateAlbum(owner: $owner) {
      id
      name
      photos {
        items {
          id
          albumId
          bucket
          owner
        }
        nextToken
      }
      owner
    }
  }
`;
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum($owner: String!) {
    onUpdateAlbum(owner: $owner) {
      id
      name
      photos {
        items {
          id
          albumId
          bucket
          owner
        }
        nextToken
      }
      owner
    }
  }
`;
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum($owner: String!) {
    onDeleteAlbum(owner: $owner) {
      id
      name
      photos {
        items {
          id
          albumId
          bucket
          owner
        }
        nextToken
      }
      owner
    }
  }
`;
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto($owner: String!) {
    onCreatePhoto(owner: $owner) {
      id
      albumId
      album {
        id
        name
        photos {
          nextToken
        }
        owner
      }
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
      owner
    }
  }
`;
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto($owner: String!) {
    onUpdatePhoto(owner: $owner) {
      id
      albumId
      album {
        id
        name
        photos {
          nextToken
        }
        owner
      }
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
      owner
    }
  }
`;
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto($owner: String!) {
    onDeletePhoto(owner: $owner) {
      id
      albumId
      album {
        id
        name
        photos {
          nextToken
        }
        owner
      }
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
      owner
    }
  }
`;
