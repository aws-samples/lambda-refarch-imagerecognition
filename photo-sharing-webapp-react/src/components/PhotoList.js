import React, {useState} from 'react';
import {S3Image} from 'aws-amplify-react'

import {Card, Icon, Label, Divider, Form} from 'semantic-ui-react'

import {v4 as uuid} from 'uuid';

import {Auth} from "aws-amplify";
import Storage from '@aws-amplify/storage'

export const S3ImageUpload = (props) => {
  const [uploading, setUploading] = useState(false)

  const uploadFile = async (file) => {
    const fileName = 'uploads/' + uuid() + '.' + file.name.split('.').pop();
    const user = await Auth.currentAuthenticatedUser();

    const result = await Storage.vault.put(
      fileName,
      file,
      {
        metadata: {
          albumid: props.albumId,
          owner: user.username,
        }
      }
    );

    console.log('Uploaded file: ', result);
  }

  const onChange = async (e) => {
    setUploading(true)

    let files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files.item(i));
    }
    await Promise.all(files.map(f => uploadFile(f)));

    setUploading(false)
  }

  return (
    <div>
      <Form.Button
        onClick={() => document.getElementById('add-image-file-input').click()}
        disabled={uploading}
        icon='file image outline'
        content={uploading ? 'Uploading...' : 'Add Images'}
      />
      <input
        id='add-image-file-input'
        type="file"
        accept='image/*'
        multiple
        onChange={onChange}
        style={{display: 'none'}}
      />
    </div>
  );
}

export const PhotoList = React.memo(props => {

  const PhotoItems = (props) => {
    const photoItem = (photo) => {
      if (photo.ProcessingStatus == "SUCCEEDED") {

        const DetectedLabels = () => {
          if (photo.objectDetected) {
            return photo.objectDetected.map((tag) => (
              <Label basic color='orange' key={tag}>
                {tag}
              </Label>
            ))
          } else {
            return null;
          }
        }

        return (
          <Card>
            <Card.Content textAlign="center">
              <S3Image
                key={photo.id}
                imgKey={'resized/' + photo.thumbnail.key.replace(/.+resized\//, '')}
                level="private"
                // style={{display: 'inline-block', 'paddingRight': '5px'}}
              />
            </Card.Content>
            <Card.Content>
              <Card.Meta>
                <span className='date'>Uploaded: {new Date(photo.uploadTime).toLocaleString()}</span>
              </Card.Meta>
              <Card.Description>
                <p><b>Image size: </b>{photo.fullsize.width} x {photo.fullsize.height}</p>
                <p><b>Detected labels:</b></p>
                <DetectedLabels/>
              </Card.Description>
            </Card.Content>
          </Card>
        )
      } else {
        return (<Card>
          Processing...

        </Card>)
      }
      // if (photo.ProcessingStatus == "RUNNING") {
      //   return <div>Processing...</div>
      // } if (photo.ProcessingStatus == "SUCCEEDED") {
      //   return (<S3Image
      //     key={photo.thumbnail.key}
      //     imgKey={'resized/' + photo.thumbnail.key.replace(/.+resized\//, '')}
      //     level="private"
      //     style={{display: 'inline-block', 'paddingRight': '5px'}}
      //   />);
      //
      // }

    }

    return props.photos.map(photoItem);
  };

  return (
    <div>
      <Divider hidden/>
      <Card.Group>

        <PhotoItems photos={props.photos}/>
      </Card.Group>
    </div>)
})