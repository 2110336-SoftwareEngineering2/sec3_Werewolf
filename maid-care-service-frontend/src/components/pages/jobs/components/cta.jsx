import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Center, Flex, Grid, GridItem, Heading, Spacer, Text, VStack } from '@chakra-ui/layout';
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
  useModalContext,
} from '@chakra-ui/modal';
import { Icon, Image, Input } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaImages } from 'react-icons/fa';
import { CONFIRMED, DONE, MATCHED, POSTED } from '../../../../constants/post-state';
import { useStores } from '../../../../hooks/use-stores';

const Actions = ({ job, state }) => {
  return state === POSTED ? (
    <PostedActions job={job} />
  ) : state === MATCHED ? (
    <MatchedActions />
  ) : state === CONFIRMED ? (
    <ConfirmActions />
  ) : state === DONE ? (
    <DoneActions />
  ) : (
    <Text>Error!</Text>
  );
};

/**
 * state === posted
 */
const PostedActions = ({ job }) => {
  const { onClose } = useModalContext();
  const { jobStore } = useStores();
  const { _id: jobId } = job;

  const handleAccept = async () => {
    try {
      await jobStore.accept({ jobId }); // accept job, wait for customer confirm...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button onClick={onClose} variant={`outline`} colorScheme={`red`}>
        Cancel
      </Button>
      <Button onClick={handleAccept} colorScheme={`green`}>
        Accept
      </Button>
    </>
  );
};

const MatchedActions = () => {
  return (
    <>
      <Button disabled variant={`outline`} colorScheme={`orange`}>
        <Spinner mr={2} /> Waiting Customer to confirm...
      </Button>
    </>
  );
};

const ConfirmActions = () => {
  const { isOpen: isDiscardOpen, onOpen: onDiscardOpen, onClose: onDiscardClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button colorScheme={`red`} onClick={onDiscardOpen}>
        Discard
      </Button>
      <Button colorScheme={`orange`} onClick={onConfirmOpen}>
        Confirm
      </Button>

      <AlertDialog
        isCentered
        size={`xl`}
        isOpen={isDiscardOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDiscardClose}>
        <AlertDialogOverlay />
        <AlertDialogContent as={VStack} h={`60vh`} minH={300} maxH={500}>
          <AlertDialogBody
            as={Flex}
            direction={`column`}
            justifyContent={`center`}
            alignItems={`center`}>
            <Heading textAlign={`center`} fontSize={`4xl`} lineHeight={1.25}>
              Are you sure you want to cancel the work?
            </Heading>
            <Text mt={4} textAlign={`center`} as={`span`} color={`red`}>
              You will be automatically rate with 1 star
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              variant={`outline`}
              colorScheme={`red`}
              onClick={onDiscardClose}>
              Go back
            </Button>
            <Button colorScheme={`red`} onClick={onDiscardClose} ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ConfirmModal
        isConfirmOpen={isConfirmOpen}
        onConfirmOpen={onConfirmOpen}
        onConfirmClose={onConfirmClose}
      />
    </>
  );
};

const ConfirmModal = ({ isConfirmOpen, onConfirmOpen, onConfirmClose }) => {
  const uploadBtnRef = useRef();

  const handleClick = () => {
    uploadBtnRef.current.click();
  };

  const [images, setImages] = useState([{}]);

  const renderImages = () => {
    if (images.length > 0) {
      return (
        <Grid
          templateColumns={`repeat(3, 1fr)`}
          gap={2}
          justifyContent={`center`}
          alignItems={`center`}>
          {images.map((image, idx) => (
            <GridItem>
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
    // Send Photo path to server with POST
    onConfirmClose();
    onOpen();
  };

  // for Done modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const t = setTimeout(() => onClose(), 2000);
    return () => clearTimeout(t);
  }, [isOpen]);

  return (
    <>
      <Modal size={`xl`} isCentered isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent as={VStack} h={`60hv`} minH={300} maxH={400}>
          <ModalHeader fontSize={`4xl`}>Submit your work evidences</ModalHeader>
          <ModalBody as={VStack} p={0}>
            {renderImages()}
            <Input ref={uploadBtnRef} onChange={handleChange} type={`file`} visibility={`hidden`} />
          </ModalBody>
          <ModalFooter>
            <Button variant={`outline`} colorScheme={`red`} onClick={onConfirmClose}>
              Go back
            </Button>
            <Button colorScheme={`green`} onClick={handleSubmit} ml={3}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </>
  );
};

const DoneActions = () => {
  return <></>;
};

export default Actions;
