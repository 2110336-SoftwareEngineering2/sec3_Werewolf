import React, { useState, useRef, useEffect } from 'react';
import { FaPlusCircle, FaTimesCircle, FaRegImages, FaImages } from 'react-icons/fa';
import UserStatus from './../../jobs/components/UserStatus.jsx';
import LogoText from '../../../../assets/images/logo-text.png';
import { Center, Image, Input, useToast } from '@chakra-ui/react';
import {
  Box,
  Text,
  chakra,
  Textarea,
  VStack,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Grid,
  GridItem,
  ButtonGroup,
  ListItem,
  Icon,
} from '@chakra-ui/react';
import { refund } from './../../../../api';
import {} from '../../../../hooks/use-stores.js';
import { MultiImageStore } from '../../../../store/Image.js';
import { observer } from 'mobx-react-lite';

//Review form contain RatingStar component and Textarea.
const RefundFormModal = observer(({ isOpen, onClose, job }) => {
  const { _id: jobId, maidId } = job;
  const [refundFeedback, setRefundFeedback] = useState('');
  const toast = useToast();

  const toastRefundSuccess = () => {
    toast({
      title: 'Refund form is submitted',
      description: "We've receive your refund form.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  const toastRefundFail = () => {
    toast({
      title: `System fail`,
      description: 'Please try again',
      status: 'error',
      isClosable: true,
    });
  };

  const toastRefundEmpty = () => {
    toast({
      title: `System fail`,
      description: 'Feedback cannot be empty',
      status: 'error',
      isClosable: true,
    });
  };

  const handleChange = (event) => {
    setRefundFeedback(event.target.value);
  };

  const [imagesStore] = useState(() => new MultiImageStore());
  const uploadBtnRef = useRef();

  const pathList = imagesStore.path_list;
  const images = Object.keys(imagesStore.path_list);

  const renderImages = () => {
    if (images.length > 0) {
      return (
        <Grid
          role="group"
          templateColumns={`repeat(4, 1fr)`}
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
            <VStack
              justify="center"
              align="center"
              w={`5rem`}
              h={`5rem`}
              p={4}
              onClick={handleClick}>
              <Icon as={FaPlusCircle} w={8} h={8} color={`green.500`} />
              <Text fontWeight="bold">Add</Text>
            </VStack>
          </GridItem>
        </Grid>
      );
    }
    return (
      <VStack justify="center" align="center" w={`5rem`} h={`5rem`} p={4} onClick={handleClick}>
        <Icon as={FaPlusCircle} w={8} h={8} color={`green.500`} />
        <Text fontWeight="bold">Add</Text>
      </VStack>
    );
  };

  const handleClick = () => {
    uploadBtnRef.current.click();
  };

  const handleClose = () => {
    if (images.length >= 0 && window.confirm('Are you sure to discard actions?')) {
      onClose();
    }
  };

  const handleUploadChange = async (event) => {
    const fileUpload = event.target.files[0];
    if (!fileUpload) return;
    try {
      imagesStore.upload(fileUpload);
    } catch (error) {
      console.error(error);
    }
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

  const handleRefundSubmit = () => {
    if (refundFeedback === '') {
      toastRefundEmpty();
    } else {
      refund
        .post('/', {
          jobId: jobId,
          description: refundFeedback,
          photo: Object.values(pathList),
        })
        .then((response) => {
          console.log('put refund/', response);
          setRefundFeedback(response.data);
          toastRefundSuccess();
          onClose();
        })
        .catch((error) => {
          console.error(error);
          toastRefundFail();
        });
    }
  };

  return (
    <>
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleClose}
        size={`3xl`}
        scrollBehavior={`inside`}>
        <ModalOverlay />
        <ModalContent overflow={'hidden'} borderRadius={`xl`}>
          <ModalCloseButton zIndex={`tooltip`} />

          <Grid h={`75vh`} templateRows={`7rem repeat(10, 1fr)`} templateColumns={`repeat(8, 1fr)`}>
            <GridItem rowStart={1} rowSpan={1} colSpan={8} p={4} as={VStack} alignItems="center">
              <HStack alignItems="flex-start" width="100%">
                <chakra.img src={LogoText} h={`2.5vw`} />
              </HStack>
              <Text fontWeight="bold" fontSize="xx-large">
                Refund Form
              </Text>
            </GridItem>

            <GridItem rowStart={2} rowSpan={1} colSpan={8} p={4}>
              <HStack>
                <UserStatus uid={maidId} />
              </HStack>
            </GridItem>
            <GridItem rowStart={3} rowSpan={5} colStart={1} colEnd={-1} p={4}>
              <Text fontWeight="bold">Please give us your feedback</Text>
              <Textarea
                value={refundFeedback}
                onChange={handleChange}
                placeholder="Text here...."
                size="sm"
                h={'12vw'}
              />
            </GridItem>
            <GridItem rowStart={8} rowSpan={3} colStart={1} colEnd={-1} p={4}>
              <Text fontWeight="bold" mb={`1vw`}>
                Add photo (maximum 8 photos)
              </Text>
              <HStack spacing={7}>
                {renderImages()}

                <Input
                  type="file"
                  accept="image/*"
                  ref={uploadBtnRef}
                  display="none"
                  onChange={handleUploadChange}
                />
              </HStack>
              <Text>
                our admin will reach back to you by the email that you given us within 3 - 5 days
              </Text>
            </GridItem>
            <GridItem
              as={ButtonGroup}
              display={`flex`}
              justifyContent={`flex-end`}
              alignItems={`center`}
              rowStart={-2}
              colStart={1}
              colEnd={-1}
              p={4}>
              <Button
                bg="buttonGreen"
                color="white"
                isLoading={imagesStore.isUploading}
                onClick={() => {
                  handleRefundSubmit();
                }}>
                Submit
              </Button>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>
    </>
  );
});

export default RefundFormModal;
