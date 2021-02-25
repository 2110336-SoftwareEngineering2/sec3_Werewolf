import React from "react";
import {VStack,Box} from "@chakra-ui/react"
import {CheckBox} from "../../shared/FormikField";


export const CapabalityJob = () => {
  const choices = ['House cleaning','Clothes Washing & Ironing','House Clearing','Gardening']
  return(
    <>
      <Box fontSize="1xl" mb="10px">Capability Job(s)</Box>
      <VStack spacing="4">
        {choices.map((choice,index) => {
          return(<CheckBox choice={choice} value={index} />)
        })}
      </VStack>
    </>
  );
};