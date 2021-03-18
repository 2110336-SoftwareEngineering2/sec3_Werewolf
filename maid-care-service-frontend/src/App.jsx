import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import Home from './components/pages/home/home.jsx';
import EditProfile from './components/pages/editprofile/editprofile.jsx';
import Workspace from './components/pages/workspace/workspace.jsx';
import ProtectedRoute from './components/protectedRoute';
import Promotion from './components/pages/promotion/promotion.jsx';
import SignUp from './components/pages/signup/signup.jsx';
import Verification from './components/pages/signup/verfification.jsx';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/login" component={LogIn} />
        <Route path="/promotion" component={Promotion} />
        <Route path="/signup" component={SignUp} />
        <Route path="/auth/verify/:token" component={Verification} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route exact path="/workspace" component={Workspace} />
        <ProtectedRoute exact path="/home" component={Home} />
      </Switch>
    </ChakraProvider>
  );
};
