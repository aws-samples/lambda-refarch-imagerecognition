import React, {useState, useEffect} from 'react';

import Amplify, {Auth} from 'aws-amplify';
import API, {graphqlOperation} from '@aws-amplify/api'
import aws_exports from './aws-exports';

import {withAuthenticator} from 'aws-amplify-react';
import {Grid, Header, Input, List, Segment} from 'semantic-ui-react'

import '@aws-amplify/ui/dist/style.css';

import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'

import {NewAlbum, AlbumList} from './components/Album'
import {AlbumDetails} from "./components/AlbumDetail";

Amplify.configure(aws_exports);

function App() {
  return (
    <Router>
      <Grid padded>
        <Grid.Column>
          <Route path="/" exact component={NewAlbum}/>
          <Route path="/" exact component={AlbumList}/>
          <Route
            path="/albums/:albumId"
            render={() => <div>
              <NavLink to='/'>Back to Albums list</NavLink>
            </div>}/>
          <Route
            path="/albums/:albumId"
            render={props => <AlbumDetails id={props.match.params.albumId}/>}/>
        </Grid.Column>
      </Grid>
    </Router>
  );
}

export default withAuthenticator(App, {
  includeGreetings: true,
  signUpConfig: {
    hiddenDefaults: ['phone_number']
  }
});

