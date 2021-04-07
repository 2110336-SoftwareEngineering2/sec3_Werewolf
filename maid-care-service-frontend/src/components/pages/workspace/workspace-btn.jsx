import { Button } from '@chakra-ui/button';
import { Center } from '@chakra-ui/layout';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/modal';
import { useFormikContext } from 'formik';
import { useRef, useState } from 'react';

const WorkspaceButton = ({isOpen, setIsOpen, postWorkspace }) => {
  const { values } = useFormikContext();
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  return (
    <>
      <Center>
        <Button
          boxShadow="xl"
          w="200px"
          className="button"
          mt="25px"
          mb="10px"
          bg="buttonGreen"
          type="submit"
          >
          Add to saved places
        </Button>
      </Center>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add this places to your saved places?
            </AlertDialogHeader>

            <AlertDialogBody>
              Your address : <br />
              บ้านเลขที่ {values.houseNo} {values.address1} {values.address2} {values.city}
              {values.state} ประเทศไทย
              <br />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button 
              colorScheme="green" 
              onClick={() => {
                onClose();
                postWorkspace( {description:`${values.houseNo} ${values.address1} ${values.address2} ${values.city} ${values.state} ประเทศไทย`});
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

export default WorkspaceButton;
