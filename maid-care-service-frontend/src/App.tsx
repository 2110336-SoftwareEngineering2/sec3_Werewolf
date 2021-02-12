<<<<<<< Updated upstream
import React, { useState } from "react";
import { ChakraProvider, Box, Text, VStack, Code, Grid, theme, Button, Stack } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import CounterView, { Counter } from "./components/Counter";

export const App = () => {
	const [counter, setCounter] = useState<Counter>(new Counter());

	return (
		<ChakraProvider theme={theme}>
			<Box textAlign="center" fontSize="xl">
				<Grid minH="100vh" p={3}>
					<ColorModeSwitcher justifySelf="flex-end" />
					<VStack spacing={8}>
						<Logo h="40vmin" pointerEvents="none" />
						<Text>
							Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
						</Text>
						<Text>Test Mobx Counter</Text>
						<Stack direction="row" spacing={4} align="center">
							<Button onClick={() => counter.increaseCount()} colorScheme="teal" variant="solid">
								+
							</Button>
							<CounterView counter={counter} />
							<Button onClick={() => counter.decreaseCount()} colorScheme="teal" variant="solid">
								-
							</Button>
						</Stack>
					</VStack>
				</Grid>
			</Box>
		</ChakraProvider>
	);
};
||||||| constructed merge base
=======
import React, { useState } from "react";
import { ChakraProvider, Box, Text, VStack, Code, Grid, theme, Button, Stack } from "@chakra-ui/react";
import {Switch, Route} from "react-router-dom";

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
>>>>>>> Stashed changes
