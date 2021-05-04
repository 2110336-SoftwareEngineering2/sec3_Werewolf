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
import { Icon, Image, Input } from '@chakra-ui/react';
import { toJS, when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { FaImages, FaTimesCircle } from 'react-icons/fa';
import { deleteImageURL, uploadImageURL } from '../../../api';
import { MultiImageStore } from '../../../store/Image';

export const DiscardJobModal = ({ job, isOpen, onOpen, onClose, onDiscard }) => {
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
          <Button colorScheme={`red`} onClick={onDiscard} ml={3}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ConfirmModal = observer(({ job, isOpen, onClose, onConfirm = () => {} }) => {
  const [imagesStore, setImagesStore] = useState(() => new MultiImageStore());
  const uploadBtnRef = useRef();

  useEffect(() => {
    return () => {
      setImagesStore(null);
    };
  }, []);

  const pathList = imagesStore.path_list;
  const images = Object.keys(imagesStore.path_list);
  const { _id: jobId } = job;

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
            <GridItem key={idx} position={`relative`}>
              <Icon
                as={FaTimesCircle}
                color={`red`}
                position={`absolute`}
                top={-2}
                right={-2}
                onClick={() => handleDelete({ jobId, image })}
              />
              <Center
                overflow={`hidden`}
                borderRadius={`lg`}
                w={40}
                h={40}
                border={`0.5rem solid`}
                borderColor={`gray.200`}>
                <Image src={pathList[image]} objectFit={`cover`}></Image>
              </Center>
            </GridItem>
          ))}
          <GridItem>
            <Center
              overflow={`hidden`}
              borderRadius={`lg`}
              w={40}
              h={40}
              border={`0.5rem solid`}
              borderColor={`gray.200`}>
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

  const handleConfirm = async () => {
    if (!window.confirm('Confirm?')) return;
    await Promise.all(images.map((image) => uploadImageURL({ jobId, url: pathList[image] })));
    onConfirm();
  };

  const handleClose = () => {
    if (images.length >= 0 && window.confirm('Are you sure to discard actions?')) {
      onClose();
    }
  };

  const handleChange = async (event) => {
    const fileUpload = event.target.files[0];
    if (!fileUpload) return;
    // TODO: Upload file to Firebase FireStore
    try {
      imagesStore.upload(fileUpload);
    } catch (error) {
      console.error(error);
    }
    // 2. Get URL from Firebase, update state
    // 3. Get Image from Firebase to Display Preview
    // Done!
  };

  const handleDelete = async ({ jobId, image }) => {
    if (window.confirm(`Are you sure to delete ${image}?`)) {
      try {
        await imagesStore.delete(image);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        size={`xl`}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={`outside`}>
        <ModalOverlay />
        <ModalContent as={VStack} h={`60hv`} minH={300}>
          <ModalHeader fontSize={`4xl`}>Submit your work evidences</ModalHeader>
          <ModalBody as={VStack} p={0}>
            {renderImages()}
            <Input ref={uploadBtnRef} onChange={handleChange} type={`file`} visibility={`hidden`} />
          </ModalBody>
          <ModalFooter>
            <Button variant={`outline`} colorScheme={`red`} onClick={handleClose}>
              Go back
            </Button>
            <Button colorScheme={`green`} onClick={handleConfirm} ml={3}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
