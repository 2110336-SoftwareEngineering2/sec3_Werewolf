import React, { useState, useRef } from 'react';
import RatingStar from './RatingStar.jsx';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Text,
  Flex,
  Container,
  Textarea,
  VStack,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  List,
  ButtonGroup,
  Heading,
} from '@chakra-ui/react';
import UserStatus from './../../jobs/components/UserStatus.jsx';
import Status from './../../jobs/components/Status.jsx';

//Review form contain RatingStar component and Textarea.
const ReviewFormModal = ({ isOpen, onClose }) => {
  var d = new Date();
  const [rating, setRating] = useState(0); // for pass as a argument to RatingStar component and show rating number in this page.
  const [images] = useState([]); // TODO: change to Mobx State
  const uploadBtnRef = useRef();

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

          <Grid h={`75vh`} templateRows={`14rem repeat(5, 1fr)`} templateColumns={`repeat(8, 1fr)`}>
            <GridItem
              as={Box}
              rowSpan={1}
              colStart={1}
              colEnd={-1}
              bg={`green.300`}
              borderRadius={`xl`}
              zIndex={`toast`}></GridItem>

            <GridItem as={HStack} rowStart={2} rowSpan={1} colSpan={2} p={4}>
              <UserStatus />
            </GridItem>
            <GridItem
              as={List}
              rowStart={3}
              rowSpan={3}
              colStart={0}
              colSpan={2}
              p={4}
              >
              <Status job={''} />
            </GridItem>
            <GridItem
              rowSpan={1}
              colStart={3}
              colEnd={7}
              p={4}
              alignItems={`baseline`}
              >
              <VStack alignItems="flex-start" w={`30vw`}>
                <Text>Rate this job</Text>
                <RatingStar rating={rating} setRating={setRating} />
              </VStack>
            </GridItem>
            <GridItem rowStart={3} rowSpan={3} colStart={3} colEnd={-1} p={4}>
              <Text>Write a review for this job</Text>
              <Textarea name="reviewText" placeholder="Text here...." size="sm" h={'17vw'} />
            </GridItem>
            <GridItem rowSpan={1} colStart={7} colEnd={-1} p={4}>
              <Text>{d.toDateString()}</Text>
              <Text>{d.toTimeString().slice(0, 8)}</Text>
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
              <Button bg="white" color="buttonGreen" borderColor="green" border="1px">
                Request for Refund
              </Button>
              <Button bg="buttonGreen" color="white">
                Submit
              </Button>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewFormModal;
