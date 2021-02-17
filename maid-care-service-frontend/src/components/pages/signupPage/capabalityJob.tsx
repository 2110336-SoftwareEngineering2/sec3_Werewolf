import React from "react";
import {
  Box,
  Checkbox,
  Stack,
} from "@chakra-ui/react";


export const CapabalityJob = () => {
  return(
    <>
      <Box fontSize="1xl" mb="10px">Capability Job(s)</Box>
      <Checkbox colorScheme="green"  display="flex" >Label</Checkbox>
      <Checkbox align="left"  colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
      <Checkbox colorScheme="green" >Label</Checkbox>
    </>
  );
};