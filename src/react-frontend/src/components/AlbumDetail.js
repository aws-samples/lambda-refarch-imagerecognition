import React, { useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api'

import { Header, Form, Segment } from 'semantic-ui-react'

import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'
import { Auth } from "aws-amplify";
import { PhotoList, S3ImageUpload } from "./PhotoList";

export const AlbumDetails = (props) => {
	const [album, setAlbum] = useState({ name: 'Loading...', photos: [] })
	const [photos, setPhotos] = useState([])
	const [hasMorePhotos, setHasMorePhotos] = useState(true)
	const [fetchingPhotos, setFetchingPhotos] = useState(false)
	const [nextPhotosToken, setNextPhotosToken] = useState(null)
	const [processingStatuses, setProcessingStatuses] = useState({})

	useEffect(() => {
		const loadAlbumInfo = async () => {
			const results = await API.graphql(graphqlOperation(queries.getAlbum, { id: props.id }))
			setAlbum(results.data.getAlbum)
		}

		loadAlbumInfo()
	}, [props.id])

	useEffect(() => {
		fetchNextPhotos()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		let subscription

		async function setupSubscription() {
			const user = await Auth.currentAuthenticatedUser()
			subscription = API.graphql(graphqlOperation(subscriptions.onCreatePhoto,
				{ owner: user.username })).subscribe({
					next: (data) => {
						const photo = data.value.data.onCreatePhoto
						if (photo.albumId !== props.id) return
						setPhotos(p => p.concat([photo]))

						setProcessingStatuses((prevState => {
							prevState[photo.id] = {
								'status': photo.ProcessingStatus,
								'sfnArn': photo.SfnExecutionArn
							}
							return prevState
						}))

					}
				})
		}

		setupSubscription();
		return () => subscription.unsubscribe()
	}, [props.id])

	useEffect(() => {
		let subscription

		async function setupSubscription() {
			const user = await Auth.currentAuthenticatedUser()
			subscription = API.graphql(graphqlOperation(subscriptions.onUpdatePhoto,
				{ owner: user.username })).subscribe({
					next: (data) => {
						const photo = data.value.data.onUpdatePhoto
						if (photo.albumId !== props.id) return
						setPhotos(p => {
							let newPhotos = p.slice()
							for (let i in newPhotos) {
								if (newPhotos[i].id === photo.id) {
									newPhotos[i] = photo
								}
							}
							setProcessingStatuses((prevState => {
								prevState[photo.id] = {
									'status': photo.ProcessingStatus,
									'sfnArn': photo.SfnExecutionArn
								}
								return prevState
							}))
							return newPhotos
						})
					}
				})
		}

		setupSubscription();
		return () => subscription.unsubscribe()
	}, [props.id])

	const fetchNextPhotos = async () => {
		const FETCH_LIMIT = 20
		setFetchingPhotos(true)
		let queryArgs = {
			albumId: props.id,
			limit: FETCH_LIMIT,
			nextToken: nextPhotosToken
		}
		if (!queryArgs.nextToken) delete queryArgs.nextToken
		const results = await API.graphql(graphqlOperation(queries.listPhotosByAlbumUploadTime, queryArgs))
		setPhotos(p => p.concat(results.data.listPhotosByAlbumUploadTime.items))
		setNextPhotosToken(results.data.listPhotosByAlbumUploadTime.nextToken)
		setHasMorePhotos(results.data.listPhotosByAlbumUploadTime.items.length === FETCH_LIMIT)
		setFetchingPhotos(false)
	}

	return (
		<Segment>
			<Header as='h3'>{album.name}</Header>
			<S3ImageUpload albumId={album.id}
				clearStatus={() => setProcessingStatuses({})}
				processingStatuses={processingStatuses} />
			<PhotoList photos={photos} />
			{
				hasMorePhotos &&
				<Form.Button
					onClick={() => fetchNextPhotos()}
					icon='refresh'
					disabled={fetchingPhotos}
					content={fetchingPhotos ? 'Loading...' : 'Load more photos'}
				/>
			}
		</Segment>
	)
}
