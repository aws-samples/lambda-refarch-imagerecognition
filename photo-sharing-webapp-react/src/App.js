import React from 'react';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import {Grid, Menu} from 'semantic-ui-react'

import '@aws-amplify/ui/dist/style.css';

import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

import {NewAlbum, AlbumList} from './components/Album'
import {AlbumDetails} from "./components/AlbumDetail";

Amplify.configure(aws_exports);

function App() {
  return (
    <AmplifyAuthenticator>
    <Router>
      <Menu inverted attached>
        <Menu.Item
          name='home'>
          <NavLink to='/'>Albums</NavLink>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <AmplifySignOut />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Grid padded>
        <Grid.Column>

          <Route path="/" exact component={NewAlbum}/>
          <Route path="/" exact component={AlbumList}/>
          <Route
            path="/albums/:albumId"
            render={props => <AlbumDetails id={props.match.params.albumId}/>}/>
        </Grid.Column>
      </Grid>
    </Router>
    </AmplifyAuthenticator>
  );
}


export default App;