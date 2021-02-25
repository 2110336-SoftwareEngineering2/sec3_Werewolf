import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import Home from './components/pages/home/home.jsx';
import SignUp from './components/pages/signup';
import ProtectedRoute from './components/protectedRoute';
import OutsideRoute from './components/outsideRoute';

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <Switch>
        <OutsideRoute exact path="/login" component={LogIn} />
        <OutsideRoute exact path="/signup" component={SignUp} />
        <ProtectedRoute exact path="/home" component={Home} />
      </Switch>
    </ChakraProvider>
  );
};
