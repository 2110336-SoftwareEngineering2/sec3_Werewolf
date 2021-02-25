import React, { useState } from 'react';
import { Box, Flex, VStack,Button,HStack } from '@chakra-ui/react';

import FlexBox from '../shared/FlexBox';
import SignupFormik from './signupPage/SignupFormik';
import { PersonalInfo } from './signupPage/PersonalInfo'
import { IdCardInfo } from './signupPage/IDCardInfo.jsx';
import { CapabalityJob } from './signupPage/Job';

const SignUp = () => {
  /*const [steps, setSteps] = useState(1);

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
    if (steps === 2) {
      return (
        <IdCardInfo/>
      );
    } else if (steps === 3) {
      return <CapabalityJob />;
    }
    return (
      <PersonalInfo/>
    );
  };

  const next_button = (
      <Button
        className="button button-register"
        bg="buttonGreen"
        onClick={handleIncrement}>
        Next
      </Button>
  );

  const prev_button = (
    <Button
    className="button button-register"
      bg="buttonGreen"
      onClick={handleDecrement}>
      Previous
    </Button>);

  const finish_button = <Button type="submit" className="button button-register" bg="buttonGreen">Finish</Button>*/


  return (
    <Flex bg="brandGreen"  align="center" justify="center" minH="100vh">
      <FlexBox>
        
        <VStack spacing="3" mb="5"  width={{sm:"72",md:"96"}} height={{sm:"80vh",md:"70vh"}}>
        <HStack justify="space-between">
        <Box fontSize="1xl" mb="8">
              Grab
              <br />
              Maidcare
            </Box>
            <Box fontSize="2xl" mb="8" color="gray.400">
              Step 1 of 3
            </Box>
          </HStack>
          <Box fontSize={{ base: 'xl', md: '2xl' }} mb="30px" fontWeight="bold">
            Create Your Maid Account
          </Box>
          <SignupFormik/>
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default SignUp;

/*const note = <>{step_inputform()}
<Flex flexDir="row" justify="flex-end">
  {steps > 1? prev_button: null}
  {steps === 3? finish_button: next_button }
</Flex></>*/