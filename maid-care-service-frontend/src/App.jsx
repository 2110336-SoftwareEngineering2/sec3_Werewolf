import React from 'react';
import { Center, ChakraProvider, Text } from '@chakra-ui/react';
import { Switch, Route, Redirect } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import SignUp from './components/pages/signup/signup.jsx';
import Home from './components/pages/home/home.jsx';
import EditProfile from './components/pages/editprofile/editprofile.jsx';
import Workspace from './components/pages/workspace/workspace.jsx';
import ProtectedRoute from './components/protectedRoute';
import Promotion from './components/pages/promotion/promotion.jsx';
import Navbar from './components/layouts/Navbar.jsx';
import JobsPage from './components/pages/jobs/jobs.jsx';
import Post from './components/pages/post/post.jsx';
import Review from './components/pages/review/review.jsx';
import Verification from './components/pages/signup/verfification.jsx';
import Profile from './components/pages/profilepage/profile.jsx';

export const App = observer(() => {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/home" component={Home} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/auth/verify/:token" component={Verification} />
        <ProtectedRoute exact path="/profile/edit" component={EditProfile} />
        <ProtectedRoute exact path="/review" component={Review} />
        <ProtectedRoute exact path="/workspace" component={Workspace} />
        <ProtectedRoute permission={['admin']} path="/promotion" component={Promotion} />
        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute path="/post" component={Post} />
        <ProtectedRoute path="/promotion" component={Promotion} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        <ProtectedRoute exact path="/profile/edit" component={EditProfile} />
        <ProtectedRoute exact path="/workspace" component={Workspace} />
        <ProtectedRoute exact path="/jobs" component={JobsPage} />
        <Route
          component={() => (
            <Center w={`100vw`} h={`100vh`}>
              <Text fontSize={`4xl`} fontWeight={`bold`}>
                404 Page not found
              </Text>
            </Center>
          )}
        />
      </Switch>
    </ChakraProvider>
  );
});
