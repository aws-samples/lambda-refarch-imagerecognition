/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = /* GraphQL */ `
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
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
        photos {
          nextToken
        }
        owner
      }
      nextToken
    }
  }
`;
export const getPhoto = /* GraphQL */ `
  query GetPhoto($id: ID!) {
    getPhoto(id: $id) {
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
        album {
          id
          name
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
      nextToken
    }
  }
`;
export const listPhotosByAlbum = /* GraphQL */ `
  query ListPhotosByAlbum(
    $albumId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotosByAlbum(
      albumId: $albumId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        albumId
        album {
          id
          name
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
      nextToken
    }
  }
`;
