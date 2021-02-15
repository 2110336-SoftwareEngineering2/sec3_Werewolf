import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Switch, Route } from 'react-router-dom';
import theme from './theme.js';

import { Login } from './components/pages/login';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Switch>
        <Route exact path="/login" component={Login} />
      </Switch>
    </ChakraProvider>
  );
};
