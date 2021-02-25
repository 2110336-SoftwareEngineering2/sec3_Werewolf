import React, { useState } from 'react';
import { Box, Flex, VStack, Button, HStack } from '@chakra-ui/react';

import FlexBox from '../shared/FlexBox';
import SignupFormik from './signupPage/SignupFormik';


const SignUp = () => {
  const [steps, setSteps] = useState(1);

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



  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack
          spacing="3"
          mb="5"
          minHeight={{ sm: '80vh', md: '70vh' }}>
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
          <SignupFormik steps={steps} />
          <HStack justify="flex-end" width="100%">
            {steps > 1 ? (
              <Button className="button button-register" bg="buttonGreen" onClick={handleDecrement}>
                Previous
              </Button>
            ) : null}
            {steps < 3 ? (
              <Button className="button button-register" bg="buttonGreen" onClick={handleIncrement}>
                Next
              </Button>
            ) : null}
          </HStack>
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default SignUp;

