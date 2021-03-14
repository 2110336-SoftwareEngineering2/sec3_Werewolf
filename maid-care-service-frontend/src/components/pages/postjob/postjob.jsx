import React, { useState } from 'react';
import FlexBox from '../../shared/FlexBox';
import { Box, Flex, VStack, Button, HStack } from '@chakra-ui/react';
import PostjobForm from './form';

export const Postjob = () => {
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
      <Flex
        py="8"
        px={{ base: '8', md: '12' }}
        minWidth={{ base: '80vw', md: '30vw' }}
        width="450px"
        bg="boxWhite"
        borderRadius="24px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)">
        <VStack spacing="3" mb="5" minHeight={{ sm: '80vh', md: '70vh' }} >
          <HStack justify="space-between" width="100%" >
            <Box fontSize="1xl" mb="8">
              Grab
              <br />
              Maidcare
            </Box>
            <Box fontSize="2xl" mb="8" color="gray.400">
              Step {steps} of 3
            </Box>
          </HStack>
          <Box
            fontSize={{ base: 'xl', md: '2xl' }}
            width="100%" 
            fontWeight="bold"
            textAlign="center"
            >
            Task Description
          </Box>

          <PostjobForm steps={steps}/>
          <HStack justify="flex-end" width="100%"  bottom="1px" >
            {steps > 1 ? (
              <Button
                width="100px"
                className="button button-register"
                bg="buttonGreen"
                onClick={handleDecrement}>
                Previous
              </Button>
            ) : null}
            {steps < 3 ? (
              <Button
                width="100px"
                className="button button-register"
                bg="buttonGreen"
                onClick={handleIncrement}>
                Next
              </Button>
            ) : null}
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  );
};
