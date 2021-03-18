import React from 'react';
import { Box, Flex, VStack, Button, HStack } from '@chakra-ui/react';

import FlexBox from '../../shared/FlexBox';
import SignupFormik from './SignupFormik';


const SignUp = () => {

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox width={{xs:"90vw"}}>
        <VStack
          spacing="1"
          mb="5"
          minHeight={{sm:"75vh",md:"70vh"}}
        >
          <HStack width="100%" justifyContent="flex-start">
            <Box fontSize="1xl" mb="8">
              Grab
              <br />
              Maidcare
            </Box>
          </HStack>
          <Box fontSize={{ base: 'xl', md: '3xl' }} mb="5" fontWeight="bold">
            Create Your Maid Account
          </Box>
          <SignupFormik />
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default SignUp;

