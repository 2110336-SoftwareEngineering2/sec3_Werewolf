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
import ProfilePage from './components/pages/profilepage/profilepage.jsx';
import Navbar from './components/layouts/Navbar.jsx';
import JobsPage from './components/pages/jobs/jobs.jsx';
import { Postjob } from './components/pages/postjob/postjob.jsx';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <ProtectedRoute exact path="/home" component={Home} />
        <Route exact path="/login" component={LogIn} />

       
        <ProtectedRoute exact path="/profile" component={ProfilePage} />
        <ProtectedRoute exact path="/profile/edit" component={EditProfile} />
        

        <ProtectedRoute path="/promotion" component={Promotion} />
        <ProtectedRoute exact path="/workspace" component={Workspace} />
		    <Route path="/postjob" component={Postjob} />
        <ProtectedRoute exact path="/jobs" component={JobsPage} />
      </Switch>
    </ChakraProvider>
  );
};
