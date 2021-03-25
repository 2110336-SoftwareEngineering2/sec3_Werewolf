import React, { useState } from 'react';
import LogoText from '../../../assets/images/logo-text.png';
import { Box, Flex, VStack, Button, HStack, chakra, Stack, Spinner } from '@chakra-ui/react';
import PostjobForm from './form';
import { useStores } from '../../../hooks/use-stores';
export const Postjob = () => {
  const [steps, setSteps] = useState(5);

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <Flex
        py="8"
        px={{ base: '8', md: '12' }}
        minWidth={{ base: '80vw', md: '30vw' }}
        width={steps === 5 ? "700px" : "450px"}
        bg="boxWhite"
        borderRadius="24px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)">
        <VStack spacing="3" mb="5" minHeight={ steps > 3 ? {} : { sm: '80vh', md: '70vh' }} width="100%" border="1px">
          <PostjobHeader steps={steps} />
          <PostjobForm steps={steps} setSteps={setSteps} />
        </VStack>
      </Flex>
    </Flex>
  );
};

const PostjobHeader = ({ steps }) => {
  switch (steps) {
    case 1:
    case 2:
    case 3:
      return (
        <>
          <HStack justify="space-between" width="100%">
            <Box fontSize="1xl" mb="8">
              <chakra.img src={LogoText} h="40px" />
            </Box>
            <Box fontSize="2xl" mb="8" color="gray.400">
              Step {steps} of 3
            </Box>
          </HStack>
          <Box
            fontSize={{ base: 'xl', md: '2xl' }}
            width="100%"
            fontWeight="bold"
            textAlign="center">
            Task Description
          </Box>
        </>
      );
    case 4:
      return (
        <>
          <HStack justify="center" width="100%">
            <Box fontSize="1xl" mb="8">
              <chakra.img src={LogoText} h="40px" />
            </Box>
          </HStack>
        </>
      );
      case 5:
      return (
        <HStack justify="left" width="100%">
            <Box fontSize="1xl" mb="8">
              <chakra.img src={LogoText} h="30px" />
            </Box>
          </HStack>
      );
  }
};
