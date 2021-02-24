import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import Home from './components/pages/home/home.jsx';
import EditProfile from './components/pages/editprofile/editprofile.jsx';
import Workspace from './components/pages/workspace/workspace.jsx';
import ProtectedRoute from './components/protectedRoute';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route exact path="/workspace" component={Workspace} />
        <ProtectedRoute exact path="/home" component={Home} />
      </Switch>
    </ChakraProvider>
  );
};
