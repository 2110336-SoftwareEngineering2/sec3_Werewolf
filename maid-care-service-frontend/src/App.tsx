import React from "react";
import { ChakraProvider} from "@chakra-ui/react";
import {Switch, Route} from "react-router-dom";
import theme from "./theme.js"

import {LogIn} from './components/pages/login';
import {SignUp} from './components/pages/signup';

export const App = () => {
	return (
		<ChakraProvider theme={theme}>
			<Switch>
				<Route exact path="/login" component={LogIn} />
				<Route exact path="/signup" component={SignUp} />
			</Switch>
		</ChakraProvider>
	);
};
