import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Center,
  Button,
} from "@chakra-ui/react";

import FlexBox from "../shared/FlexBox";
import {PersonalInfo} from "./signupPage/personalinfo";
import {IdCardInfo} from "./signupPage/idCardInfo";
import {CapabalityJob} from "./signupPage/capabalityJob";

export const SignUp = () => {
    const [steps, setSteps] = useState(1);

    const info = {
      // step1
      firstname:'',
      lastname:'',
      birthday:'',
      // step2
      nationality:'',
      citizenId:'',
      bankAccount:''
    }

    const handleIncrement = () => {
        if (steps < 3) {
            setSteps(previousStep => previousStep + 1);
        }
    };

    const handleDecrement = () => {
        if (steps > 1) {
            setSteps(previousStep => previousStep - 1);
        }
    };

    const step_inputform = () => {
      if (steps === 1){ return (<PersonalInfo firstname={info.firstname} lastname={info.lastname} birthday={info.birthday}/>); }
      else if (steps === 2) { return (<IdCardInfo nationality={info.nationality} citizenId={info.citizenId} bankAccount={info.bankAccount}/>); }
      else if (steps === 3) { return (<CapabalityJob/>); }
      return (<PersonalInfo firstname={info.firstname} lastname={info.lastname} birthday={info.birthday}/>);
    }

    const step_button = () => {
      if (steps === 1){ 
        return (
          <Center>
            <Button boxShadow="xl" w="100px" className="button" mt="25px" mb="10px" ml="30px" bg="buttonGreen" onClick={handleIncrement}>Next</Button>
          </Center>
        );
      }
      else if (steps === 3) { 
        return (
          <Center>
            <Button boxShadow="xl" w="100px"className="button" mt="25px" mb="10px" ml="30px" bg="buttonGreen" onClick={handleDecrement}>Previous</Button>
            <Button boxShadow="xl" w="100px" className="button" mt="25px" mb="10px" ml="30px" bg="buttonGreen" >Finish</Button>
          </Center>
        ); 
      }
      return (
        <Center>
            <Button boxShadow="xl" w="100px"className="button" mt="25px" mb="10px" ml="30px" bg="buttonGreen" onClick={handleDecrement}>Previous</Button>
            <Button boxShadow="xl" w="100px" className="button" mt="25px" mb="10px" ml="30px" bg="buttonGreen" onClick={handleIncrement}>Next</Button>
          </Center>
      );
    }


  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing="20x">
            <Center>
                <Box fontSize="1xl" mb="30px" mr="100px">Grab<br/>Maidcare</Box>
                <Box fontSize="2xl" mb="30px" ml="100px">Step {steps} of 3</Box>
            </Center>
          <Box fontSize="3xl" mb="30px" fontWeight="extrabold">Create Your Maid Account</Box>
          
          {step_inputform()}
          {step_button()}
        </VStack>
      </FlexBox>
    </Flex>
  );
};

