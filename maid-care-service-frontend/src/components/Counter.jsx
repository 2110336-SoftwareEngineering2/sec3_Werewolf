import * as React from "react";
import { Center } from "@chakra-ui/react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

export class Counter {
	// State
	count: number = 0;

	constructor() {
		makeAutoObservable(this);
	}

	// Action
	increaseCount() {
		this.count += 1;
	}
	decreaseCount() {
		this.count -= 1;
	}
}

const CounterView = observer(({ counter }: { counter: Counter }) => {
	return (
		<Center w="50px" h="50px" bg="teal" color="white">
			{counter.count}
		</Center>
	);
});

export default CounterView;
