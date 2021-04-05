import React from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
} from '@chakra-ui/react';

// mainbtnName : main button
// lbtnName : Left Button Name (Button in the alert dialog)
// rbtnName : Right Button Name Button in the alert dialog)
// headerText : header text
// bodyText : body text
// lbtnFunction : Function that is performed when Left Button Name is clicked
// rbtnFunction : Function that is performed when Right Button Name is clicked
const AlertButton = ({
  mainbtnName,
  mainbtnColor,
  lbtnName,
  rbtnName,
  headerText,
  bodyText,
  lbtnFunction,
  rbtnFunction,
}) => {
  // This 3 variables is used for submit button.
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <>
      <Button
        width="100px"
        className="button button-register"
        bg={mainbtnColor}
        onClick={() => setIsOpen(true)}>
        {mainbtnName}
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {headerText}
            </AlertDialogHeader>
            <AlertDialogBody>{bodyText}</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  onClose();
                  lbtnFunction();
                }}>
                {lbtnName}
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  onClose();
                  rbtnFunction();
                }}
                ml={3}>
                {rbtnName}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AlertButton;
