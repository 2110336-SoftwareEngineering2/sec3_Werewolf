import { Button, Center, Text, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../../hooks/use-stores';

const Home = observer(() => {
  const { userStore } = useStores();
  const history = useHistory();

  const handleLogout = () => {
    userStore.logout();
    history.push('/login');
  };

  return (
    <>
      <Center h="100vh">
        <VStack>
          <Text>Hello {userStore.userData?.firstname}</Text>
          <Button onClick={handleLogout}>Logout</Button>
        </VStack>
      </Center>
    </>
  );
});

export default Home;
