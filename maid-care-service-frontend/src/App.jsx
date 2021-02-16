import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route } from 'react-router-dom';
import theme from './theme.js';

import LogIn from './components/pages/login/login.jsx';
import Home from './components/pages/home/home.jsx';
import ProtectedRoute from './components/protectedRoute';

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <Switch>
        <Route exact path="/login" component={LogIn} />
        <ProtectedRoute exact path="/home" component={Home} />
      </Switch>
    </ChakraProvider>
  );
};
