import React, { useState } from "react";
import { ChakraProvider, Box, Text, VStack, Code, Grid,Button, Stack } from "@chakra-ui/react";
import {Switch, Route} from "react-router-dom";
import theme from "./theme.js"

import {LogIn} from './components/pages/login.js';

export const App = () => {
	return (
		<ChakraProvider theme={theme}>
			<Switch>
				<Route exact path="/login" component={LogIn} />
			</Switch>
		</ChakraProvider>
	);
};
