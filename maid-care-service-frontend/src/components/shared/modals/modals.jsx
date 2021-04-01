import { Button } from '@chakra-ui/button';
import { Center, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/layout';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Icon, Input, Portal, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FaImages } from 'react-icons/fa';
import { useStores } from '../../../hooks/use-stores';

export const DiscardJobModal = ({ job, isOpen, onOpen, onClose }) => {
  const cancelRef = useRef();

  const handleConfirm = () => {};

  return (
    <AlertDialog
      isCentered
      size={`xl`}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}>
      <AlertDialogOverlay />
      <AlertDialogContent as={VStack} h={`60vh`} minH={300} maxH={500}>
        <AlertDialogBody as={VStack} justifyContent={`center`} alignItems={`center`}>
          <Heading textAlign={`center`} fontSize={`4xl`} lineHeight={1.25}>
            Are you sure you want to cancel the work?
          </Heading>
          <Text mt={4} textAlign={`center`} as={`span`} color={`red`}>
            You will be automatically rate with 1 star
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} variant={`outline`} colorScheme={`red`} onClick={onClose}>
            Go back
          </Button>
          <Button colorScheme={`red`} onClick={handleConfirm} ml={3}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ConfirmModal = ({ job, isOpen, onClose, onConfirm = () => {} }) => {
  const [images] = useState([]); // TODO: change to Mobx State
  const uploadBtnRef = useRef();

  const renderImages = () => {
    if (images.length > 0) {
      return (
        <Grid
          role="group"
          templateColumns={`repeat(3, 1fr)`}
          gap={2}
          justifyContent={`center`}
          alignItems={`center`}>
          {images.map((image, idx) => (
            <GridItem key={idx}>
              <Center>{/* <Image /> */}</Center>
            </GridItem>
          ))}
          <GridItem>
            <Icon as={FaImages} h={`30%`} minH={120} w={`30%`} minW={120} onClick={handleClick} />
          </GridItem>
        </Grid>
      );
    }
    return <Icon as={FaImages} h={`30%`} minH={120} w={`30%`} minW={120} onClick={handleClick} />;
  };

  const handleClick = () => {
    uploadBtnRef.current.click();
  };

  const handleChange = (event) => {
    const fileUpload = event.target.files[0];
    console.log(fileUpload);
    // TODO: Upload file to Firebase FireStore
    // 1. Upload To Firebase
    // 2. Get URL from Firebase, update state
    // 3. Get Image from Firebase to Display Preview
    // Done!
  };

  return (
    <>
      <Modal size={`xl`} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as={VStack} h={`60hv`} minH={300} maxH={400}>
          <ModalHeader fontSize={`4xl`}>Submit your work evidences</ModalHeader>
          <ModalBody as={VStack} p={0}>
            {renderImages()}
            <Input ref={uploadBtnRef} onChange={handleChange} type={`file`} visibility={`hidden`} />
          </ModalBody>
          <ModalFooter>
            <Button variant={`outline`} colorScheme={`red`} onClick={onClose}>
              Go back
            </Button>
            <Button colorScheme={`green`} onClick={onConfirm} ml={3}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
