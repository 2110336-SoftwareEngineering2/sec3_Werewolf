import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import SignUp from './components/pages/signup/signup.jsx';
import Home from './components/pages/home/home.jsx';
import EditProfile from './components/pages/editprofile/editprofile.jsx';
import Workspace from './components/pages/workspace/workspace.jsx';
import ProtectedRoute from './components/protectedRoute';
import Promotion from './components/pages/promotion/promotion.jsx';
import ProfilePage from './components/pages/profilepage/profilepage.jsx';
import Navbar from './components/layouts/Navbar.jsx';
import JobsPage from './components/pages/jobs/jobs.jsx';
import { Postjob } from './components/pages/postjob/postjob.jsx';
import Verification from './components/pages/signup/verfification.jsx';
import{ UploadImage} from './components/shared/image_test/upload_image.jsx';

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
        <Route exact path="/register" component={SignUp} />
       
        <Route exact path="/auth/verify/:token" component={Verification} />
        <ProtectedRoute path="/promotion" component={Promotion} />
        <ProtectedRoute exact path="/profile" component={ProfilePage} />
        <ProtectedRoute exact path="/profile/edit" component={EditProfile} />
        
        <ProtectedRoute exact path="/workspace" component={Workspace} />
		    <Route path="/postjob" component={Postjob} />
        <ProtectedRoute exact path="/jobs" component={JobsPage} />

        <Route path="/image" component={UploadImage} />
      </Switch>
    </ChakraProvider>
  );
};
