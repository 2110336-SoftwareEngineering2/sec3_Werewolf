import React from 'react';
import {
  Button,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

// this file, ButtonField.jsx, is responsible for 3 main job.
// 1. contain all button ( Previous button, Next button, Submit button )
// 2. handle steps increment & decrement when button is clicked.
// 3. Show confirm window when submit button on page3 is clicked.

const ButtonField = ({ steps, setSteps }) => {
  const handleDecrement = () => {
    if (steps > 1) {
      setSteps(previousStep => previousStep - 1);
    }
  };

  const handleIncrement = () => {
    if (steps <= 5) {
      setSteps(previousStep => previousStep + 1);
    }
  };

  // This 3 variables is used for submit button.
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <>
      <HStack justify="flex-end" width="100%" bottom="1px">
        {steps > 1 && steps < 4 ? (
          <Button
            width="100px"
            className="button button-register"
            bg="buttonGreen"
            onClick={handleDecrement}>
            Previous
          </Button>
        ) : null}
        {steps < 3 ? (
          <Button width="100px" className="button button-register" bg="buttonGreen" type="summit">
            Next
          </Button>
        ) : null}
        {steps == 3 ? (
          <Button
            width="100px"
            className="button button-register"
            bg="buttonGreen"
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
              <Button
                colorScheme="green"
                type="submit"
                onClick={() => {
                  onClose();
                  handleIncrement();
                }}
                ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ButtonField;
