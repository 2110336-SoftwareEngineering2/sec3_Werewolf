import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, VStack, Link, Text, Image, Spacer } from '@chakra-ui/react';
import { Redirect, useLocation } from 'react-router-dom';

import FlexBox from '../../shared/FlexBox';
import LogInForm from './LogInform.jsx';
import { useStores } from '../../../hooks/use-stores';
import logo from '../../../assets/images/logo-text.png';

export const LogIn = observer(() => {
  const { userStore } = useStores();
  const from = useLocation().state ? useLocation().state.from : '';

  if (userStore.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing="1" w={`100%`}>
          {from === '/auth/verify' ? (
            <Text fontSize="large" color="green">
              Register Succesful!
            </Text>
          ) : null}
          <VStack spacing="4">
            <Image src={logo} htmlWidth={200} />
            <LogInForm />
            <Spacer />
            <Link fontSize={{ base: 'sm', md: 'md' }}>Forgot password</Link>
            <Text fontSize={{ base: 'sm', md: 'md' }} mb="16">
              Want to be maid?{' '}
              <Link href="/register" color="#38A169">
                Create Account Here
              </Link>
            </Text>
          </VStack>
        </VStack>
      </FlexBox>
    </Flex>
  );
});

export default LogIn;
