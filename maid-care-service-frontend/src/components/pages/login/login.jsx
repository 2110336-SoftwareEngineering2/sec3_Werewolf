import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, VStack, Link, Text } from '@chakra-ui/react';
import { Redirect,useLocation} from 'react-router-dom';

import FlexBox from '../../shared/FlexBox';
import LogInForm from './LogInform.jsx';
import { useStores } from '../../../hooks/use-stores';


export const LogIn = observer(() => {
  const { userStore } = useStores();
  const history = useLocation().state.history;

  if (userStore.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing="1">
          {history == '/auth/verify'? <Text fontSize="large" color="green">Register Succesful!</Text>:null}
          <VStack spacing="3">
              <Box fontSize="3xl" mb="5">
                Grab
                <br />
                Maidcare
              </Box>
              <LogInForm />
              <Link fontSize={{ base: 'sm', md: 'md' }}>Forgot password</Link>
              <Text fontSize={{ base: 'sm', md: 'md' }} mb="16">
                Want to be maid? <Link href="/register" color="#38A169">Create Account Here</Link>
              </Text>
            </VStack>
        </VStack>
      </FlexBox>
    </Flex>
  );
});

export default LogIn;
