import { Box, Center, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../../hooks/use-stores';
import logo from '../../../assets/svgs/logo.svg';

const Home = observer(() => {
  return (
    <Flex direction="column">
      <Box w="100%" h="100vh" position="relative" overflow="hidden" bgColor="gray.300">
        {/* <Box position="absolute">
          <img style={{ margin: 0 }} src={brush} alt="Brush" />
        </Box> */}
        <Center h="100vh" w="60%" position="absolute" right={`2rem`} zIndex="docked">
          <img src={logo} alt="GrabMaid Logo" />
        </Center>
        {/* Gray Ball */}
        <Box
          position="absolute"
          right="-55%"
          top="-20%"
          clipPath="circle(50% at 50% 50%)"
          bgColor="gray.200"
          w={1200}
          h={1200}
          zIndex="base"
        />
        {/* Green Ball */}
        <Box
          position="absolute"
          left="-10%"
          top="5%"
          clipPath="circle(50% at 50% 50%)"
          bgColor="green.500"
          w={400}
          h={400}
          zIndex="base"
        />
      </Box>
      {/* TODO: add more sections. */}
    </Flex>
  );
});

export default Home;
