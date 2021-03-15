import React, { useState } from 'react';
import FlexBox from '../../shared/FlexBox';
import LogoText from '../../../assets/images/logo-text.png'
import {
  Box,
  Flex,
  VStack,
  Button,
  HStack,
  chakra,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import PostjobForm from './form';

export const Postjob = () => {
  const [steps, setSteps] = useState(1);

  // This 3 variables is used for submit button.
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

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
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh" >
      <Flex
        py="8"
        px={{ base: '8', md: '12' }}
        minWidth={{ base: '80vw', md: '30vw' }}
        width="450px"
        bg="boxWhite"
        borderRadius="24px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)">
        <VStack spacing="3" mb="5" minHeight={{ sm: '80vh', md: '70vh' }} width="100%">
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

          <PostjobForm steps={steps} />
          <HStack justify="flex-end" width="100%" bottom="1px">
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
            {steps == 3 ? (
              <Button
                width="100px"
                className="button button-register"
                bg="buttonGreen"
                type="summit"
                onClick={() => setIsOpen(true)}>
                Summit
              </Button>
            ) : null}
          </HStack>
          <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Do you want to confirm ?
                </AlertDialogHeader>

                <AlertDialogBody>
                  The system will perform the match immediately after you have confirmed.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="green" onClick={onClose} ml={3}>
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>
      </Flex>
    </Flex>
  );
};
