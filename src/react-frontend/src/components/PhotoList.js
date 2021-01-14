import React, {useState} from 'react';
import {S3Image} from 'aws-amplify-react'

import {Card, Label, Divider, Form, Dimmer, Loader, Message} from 'semantic-ui-react'

import {v4 as uuid} from 'uuid';
import * as mutations from '../graphql/mutations'
import AWSConfig from '../aws-exports'
import {Auth} from "aws-amplify";
import Storage from '@aws-amplify/storage'
import API, {graphqlOperation} from "@aws-amplify/api";

export const S3ImageUpload = (props) => {
  const [uploading, setUploading] = useState(false)
  const [statuses, setStatuses] = useState({})

  const ProcessingStatus = (props) => {
    setStatuses(prevState => {
      for (let id in props.processingStatuses) {
        if (id in prevState) {
          prevState[id]['status'] = props.processingStatuses[id]['status']
          prevState[id]['sfnArn'] = props.processingStatuses[id]['sfnArn']
        }
      }
      return prevState
    });

    let sfnExecutionLink = ((sfnArn) => {
      if (sfnArn) {
        let arnComponets = sfnArn.split(":")
        let awsRegion = arnComponets[3]
        let executionId = arnComponets[arnComponets.length-1]
        let consoleUrl = `https://console.aws.amazon.com/states/home?region=${awsRegion}#/executions/details/${sfnArn}`
        return (
          <span>Step Function execution: <a href={consoleUrl} target="_blank" rel="noopener noreferrer" >  {executionId}</a></span>
        )
      } else {
        return null
      }
    })
    return (Object.keys(statuses).map((fileId) => {
        let status = statuses[fileId]
        return (<Message positive>
            {/*<Message.Header>{filename}</Message.Header>*/}
            <p>
              <b>{status.filename}</b>
              {(status.status === 'PENDING' && ' uploading to S3.')}
              {((status.status === 'UPLOADED' || status.status === 'RUNNING') && ' uploaded. Processing... ')}
              {(status.status === 'SUCCEEDED' && ' successfully processed. ')}
              {sfnExecutionLink(status.sfnArn)}
            </p>

          </Message>
        )
      }
    ))
  }

  const uploadFile = async (file) => {
    const imageId = uuid();
    const fileName = 'uploads/' + imageId + '.' + file.name.split('.').pop();
    const user = await Auth.currentAuthenticatedUser();

    let createPhotoArg = {
      id: imageId,
      albumId: props.albumId,
      owner: user.username,
      uploadTime: new Date(),
      bucket: AWSConfig.aws_user_files_s3_bucket,
      ProcessingStatus: 'PENDING'
    }

    await API.graphql(graphqlOperation(mutations.createPhoto, {"input": createPhotoArg}))

    setStatuses(prevStatus => {
      prevStatus[imageId] = {
        'filename': file.name,
        'status': 'PENDING'
      }
      return prevStatus
    })

    try {
      const result = await Storage.vault.put(
        fileName,
        file,
        {
          metadata: {
            // Discovered that Amplify has bug that doesn't persist this metadata when multipart upload is used
            // https://github.com/aws-amplify/amplify-js/issues/5432
            albumid: props.albumId,
            owner: user.username,
          }
        }
      );

      setStatuses(prevStatus => {
        prevStatus[imageId]['status'] = 'UPLOADED';
        return prevStatus
      })

      console.log(`Uploaded ${file.name} to ${fileName}: `, result);
    } catch (e) {
      console.log('Failed to upload to s3.')
    }
  }

  const onFileSelectionChange = async (e) => {
    setUploading(true)

    let files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files.item(i));
    }
    setStatuses({})
    props.clearStatus()
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
        onChange={onFileSelectionChange}
        style={{display: 'none'}}
      />
      <ProcessingStatus processingStatuses={props.processingStatuses}/>
    </div>
  );
}

export const PhotoList = React.memo(props => {

  const PhotoItems = (props) => {
    const photoItem = (photo) => {
      if (photo.ProcessingStatus === "SUCCEEDED") {
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
        const GeoLocation = () => {
          if (photo.geoLocation) {
            const geo = photo.geoLocation
            return (
              <p><strong>Geolocation:</strong>&nbsp;
                {geo.Latitude.D}°{Math.round(geo.Latitude.M)}'{Math.round(geo.Latitude.S)}"{geo.Latitude.Direction} &nbsp;
                {geo.Longtitude.D}°{Math.round(geo.Longtitude.M)}'{Math.round(geo.Longtitude.S)}"{geo.Longtitude.Direction}
              </p>
            )
          } else {
            return null
          }
        }

        return (
          <Card key={photo.id}>
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
                <p><b>Detected labels:</b></p>
                <DetectedLabels/>
                <p><b>Image size: </b>{photo.fullsize.width} x {photo.fullsize.height}</p>
                <GeoLocation/>
                {(photo.exifMake || photo.exitModel) &&
                <p><strong>Device: </strong>{photo.exifMake} {photo.exitModel} </p>}
              </Card.Description>
            </Card.Content>
          </Card>
        )
      } else if (photo.ProcessingStatus === "RUNNING" || photo.ProcessingStatus === "PENDING") {
        return (<Card>
          <Dimmer active>
            <Loader> Processing </Loader>
          </Dimmer>
        </Card>)
      }
    }

    return (<Card.Group> {props.photos.map(photoItem)}</Card.Group>);
  };

  return (
    <div>
      <Divider hidden/>
      <PhotoItems photos={props.photos}/>
    </div>)
})
