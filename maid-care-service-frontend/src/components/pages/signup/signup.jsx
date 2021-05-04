import React from 'react';
import { Box, Flex, VStack, HStack, Image } from '@chakra-ui/react';

import FlexBox from '../../shared/FlexBox';
import SignupFormik from './SignupFormik';
import logo from '../../../assets/images/logo-text.png';

const SignUp = () => {
  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox width={{ xs: '90vw' }} justify="center">
        <VStack spacing="1" mb="5" minHeight={{ sm: '75vh', md: '70vh' }} width="100%">
          <HStack width="100%" justifyContent="flex-start">
            <Image src={logo} w={120} />
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
