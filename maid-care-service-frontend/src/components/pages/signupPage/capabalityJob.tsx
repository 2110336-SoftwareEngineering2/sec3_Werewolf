import React from "react";
import {
  Box,
  Checkbox,
  VStack,
} from "@chakra-ui/react";


export const CapabalityJob = () => {
  return(
    <VStack spacing="20px" align="left" justify="left">
      <Box fontSize="1xl" mb="30px" left="0px">Capability Job(s)</Box>
      <Checkbox colorScheme="green" alignItems="left" display="flex" justify="left">Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
    </VStack>
  );
};