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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Icon, Input } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaImages } from 'react-icons/fa';
import { useStores } from '../../../../hooks/use-stores';

export const AlertModal = ({ isOpen, onOpen, onClose }) => {
  const cancelRef = useRef();

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
          <Button colorScheme={`red`} onClick={onClose} ml={3}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ConfirmModal = ({ job, isOpen, onOpen, onClose, onSuccess = () => {} }) => {
  const [images] = useState([]);
  const { jobStore } = useStores();

  const uploadBtnRef = useRef();

  const { _id: jobId } = job;

  const renderImages = () => {
    if (images.length > 0) {
      return (
        <Grid
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
            <Center>
              <Icon as={FaImages} h={`30%`} minH={120} w={`30%`} minW={120} onClick={handleClick} />
            </Center>
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

  const handleSubmit = async () => {
    try {
      await jobStore.done({ jobId });
      onSuccess();
    } catch (error) {
      console.error(error);
    }
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
            <Button colorScheme={`green`} onClick={handleSubmit} ml={3}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const SuccessModal = ({ isOpen, onOpen, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => onClose(), 2000);
    return () => clearTimeout(timeout);
  }, [onClose, isOpen]);

  return (
    <Modal size={`xl`} closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as={VStack} h={`60hv`} minH={300} maxH={400} p={12}>
        <ModalCloseButton />
        <ModalHeader fontSize={`4xl`} color={`green.400`}>
          Your job is done!
        </ModalHeader>
        <ModalBody as={VStack}>
          <Text mb={4}>Please wait for the rating from customer</Text>
          <Center h={`50%`} w={`50%`}>
            <Icon as={FaCheckCircle} h={`full`} w={`full`} color={`green.400`} />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
