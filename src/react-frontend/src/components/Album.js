import React, { useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify';

import { Header, Input, List, Segment } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'
import * as subscriptions from '../graphql/subscriptions'

import { makeComparator } from "../utils";

export const NewAlbum = () => {
	const [name, setName] = useState('')
	const handleSubmit = async (event) => {
		event.preventDefault();
		await API.graphql(graphqlOperation(mutations.createAlbum, { input: { name } }))
		setName('')
	}
	return (
		<Segment>
			<Header as='h3'>Add a new album</Header>
			<Input type='text'
				placeholder='New Album Name'
				icon='plus'
				iconPosition='left'
				action={{ content: 'Create', onClick: handleSubmit }}
				name='name'
				value={name}
				onChange={(e) => setName(e.target.value)} />
		</Segment>
	)
}

export const AlbumList = () => {
	const [albums, setAlbums] = useState([])
	useEffect(() => {
		async function fetchData() {
			const result = await API.graphql(graphqlOperation(queries.listAlbums, { limit: 999 }))
			setAlbums(result.data.listAlbums.items)
		}

		fetchData()
	}, [])

	useEffect(() => {
		let subscription

		async function setupSubscription() {
			const user = await Auth.currentAuthenticatedUser()
			subscription = API.graphql(graphqlOperation(subscriptions.onCreateAlbum, { owner: user.username })).subscribe({
				next: (data) => {
					const album = data.value.data.onCreateAlbum
					setAlbums(a => a.concat([album].sort(makeComparator('name'))))
				}
			})
		}

		setupSubscription()

		return () => subscription.unsubscribe();
	}, [])

	const albumItems = () => {
		return albums
			.sort(makeComparator('name'))
			.map(album => <List.Item key={album.id}>
				<NavLink to={`/albums/${album.id}`}>{album.name}</NavLink>
			</List.Item>);
	}

	return (<Segment>
		<Header as='h3'>My Albums</Header>
		<List divided relaxed>
			{albumItems()}
		</List>
	</Segment>
	)
}
