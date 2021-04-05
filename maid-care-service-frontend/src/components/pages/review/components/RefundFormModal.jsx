import React, { useState, useRef, useEffect } from 'react';
import { FaPlusCircle, FaTimesCircle, FaRegImages } from 'react-icons/fa';
import UserStatus from './../../jobs/components/UserStatus.jsx';
import LogoText from '../../../../assets/images/logo-text.png';
import { useToast } from "@chakra-ui/react"
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

//Review form contain RatingStar component and Textarea.
const RefundFormModal = ({ isOpen, onClose, job, handleConfirmRefund = () => {} }) => {
  const { _id: jobId, work, maidId } = job;
  const [refundFeedback, setRefundFeedback] = useState('');
  const [images] = useState(['']); // TODO: change to Mobx State
  const uploadBtnRef = useRef();
  const toast = useToast()

  const toastRefundSuccess = () => {
    toast({
      title: "Refund form is submitted",
      description: "We've receive your refund form.",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  }

  const toastRefundFail = () => {
    toast({
        title: `System fail`,
        description: "Please try again",
        status: 'error',
        isClosable: true,
      })
  }



  const handleChange = (event) => {
    setRefundFeedback(event.target.value);
  };

  const handleRefundSubmit = () => {
    refund
      .post('/', {
        jobId: jobId,
        description: refundFeedback,
        photo: "",
      })
      .then((response) => {
        console.log('put refund/', response);
        setRefundFeedback(response.data);
        toastRefundSuccess();
      })
      .catch((error) => {
        console.error(error);
        toastRefundFail();
      });
  };

  return (
    <>
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={`3xl`}
        scrollBehavior={`inside`}>
        <ModalOverlay />
        <ModalContent overflow={'hidden'} borderRadius={`xl`}>
          <ModalCloseButton zIndex={`tooltip`} />

          <Grid h={`75vh`} templateRows={`7rem repeat(10, 1fr)`} templateColumns={`repeat(8, 1fr)`}>
            <GridItem
              rowStart={1}
              rowSpan={1}
              colSpan={8}
              p={4}
              as={VStack}
              alignItems="center">
              <HStack alignItems="flex-start" width="100%">
                <chakra.img src={LogoText} h={`2.5vw`} />
              </HStack>
              <Text fontWeight="bold" fontSize="xx-large">
                Refund Form
              </Text>
            </GridItem>

            <GridItem rowStart={2} rowSpan={1} colSpan={8} p={4} >
              <Text>job ID : {jobId}</Text>
              <HStack>
              <Text>maid : </Text>
              <UserStatus uid={maidId}/>
              </HStack>

            </GridItem>
            <GridItem rowStart={3} rowSpan={5} colStart={1} colEnd={-1} p={4}>
              <Text fontWeight="bold">Please give us your feedback</Text>
              <Textarea
                value={refundFeedback}
                onChange={handleChange}
                placeholder="Text here...."
                size="sm"
                h={'10vw'}
              />
            </GridItem>
            <GridItem rowStart={8} rowSpan={3} colStart={1} colEnd={-1} p={4} >
              <Text fontWeight="bold" mb={`1vw`}>
                Add photo (maximum 8 photos)
              </Text>
              <HStack spacing={7}>
              {[{ id: '1' }, { id: '2' }, { id: '3' }].map((image) => (
                          <ListItem key={image.id} position={`relative`} w={`fit-content`}>
                            {/* TODO: replace with Image */}
                            <Icon as={FaRegImages} w={12} h={12} />
                            <Icon
                              as={FaTimesCircle}
                              color={`red.400`}
                              w={6}
                              h={6}
                              position={`absolute`}
                              top={0}
                              right={-4}
                            />
                          </ListItem>
                        ))}
                <Box>
                  <Icon as={FaPlusCircle} w={8} h={8} color={`green.500`} />
                  <Text fontWeight="bold">Add</Text>
                </Box>
              </HStack>
              <Text>our admin will reach back to you by the email that you given us within 3 - 5 days</Text>
            </GridItem>
            <GridItem
              as={ButtonGroup}
              display={`flex`}
              justifyContent={`flex-end`}
              alignItems={`center`}
              rowStart={-2}
              colStart={1}
              colEnd={-1}
              p={4}
              >
              <Button
                bg="buttonGreen"
                color="white"
                onClick={() => {
                  handleConfirmRefund();
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
};

export default RefundFormModal;
