import React, { useState, useRef } from 'react';
import { PutRatingStar } from '../../../shared/RatingStar';
import { FaTshirt, FaRing, FaBroom } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';
import {
  Box,
  Text,
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
  List,
  ButtonGroup,
  ListItem,
  Icon,
  Image,
} from '@chakra-ui/react';
import UserStatus from './../../jobs/components/UserStatus.jsx';
import CarouselWithDots from './Carousel';
import { review } from './../../../../api';

//Review form contain RatingStar component and Textarea.
const ReviewFormModal = ({ isOpen, onClose, job }) => {
  const { _id: jobId, work, maidId, photos } = job;
  var d = new Date();
  const [rating, setRating] = useState(0); // for pass as a argument to RatingStar component and show rating number in this page.
  const [reviewText, setReviewText] = useState('');
  const [images] = useState([]); // TODO: change to Mobx State
  const uploadBtnRef = useRef();
  const toast = useToast();

  const handleChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleReviewSubmit = () => {
    review
      .put('/', {
        rating: rating,
        reviewDescription: reviewText,
        jobId: jobId,
        maidId: maidId,
      })
      .then((response) => {
        console.log('put review/', response);
        toastReviewSuccess();
        onClose();
        //handleConfirmReview();
      })
      .catch((error) => {
        console.error(error);
        toastReviewFail();
      });
  };

  const toastReviewSuccess = () => {
    toast({
      title: 'Review form is submitted',
      description: 'Thank you for your review.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  const dosomething = () => {
    console.log(photos);
  };

  const toastReviewFail = () => {
    toast({
      title: `System fail`,
      description: 'Please try again',
      status: 'error',
      isClosable: true,
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

          <Grid h={`75vh`} templateRows={`17rem repeat(5, 1fr)`} templateColumns={`repeat(8, 1fr)`}>
            <GridItem
              as={Box}
              rowSpan={1}
              colStart={1}
              colEnd={-1}
              bg={`white`}
              border="5px"
              borderColor="green"
              borderRadius={`xl`}>
              <Box border="1px" height="100%" alignSelf="stretch">
                <CarouselWithDots job={job} />
              </Box>
            </GridItem>
            <GridItem as={HStack} rowStart={2} rowSpan={1} colSpan={2} p={4}>
              <UserStatus uid={maidId} />
            </GridItem>
            <GridItem as={List} rowStart={3} rowSpan={3} colStart={0} colSpan={2} p={4}>
              {work &&
                work.map(({ quantity, typeOfWork, unit }, idx) => (
                  <ListItem as={HStack} key={jobId + idx} mt="1vw">
                    <Icon
                      as={
                        typeOfWork === 'Dish Washing'
                          ? FaRing
                          : typeOfWork === 'House Cleaning'
                          ? FaBroom
                          : FaTshirt
                      }
                      w={8}
                      h={8}
                      color={`gray.800`}
                    />
                    <Text>
                      {quantity} {unit}
                    </Text>
                  </ListItem>
                ))}
            </GridItem>
            <GridItem rowSpan={1} colStart={3} colEnd={7} p={4} alignItems={`baseline`}>
              <VStack alignItems="flex-start" w={`30vw`}>
                <Text>Rate this job</Text>
                <HStack>
                  <PutRatingStar rating={rating} setRating={setRating} />
                </HStack>
              </VStack>
            </GridItem>
            <GridItem rowStart={3} rowSpan={3} colStart={3} colEnd={-1} p={4}>
              <Text>Write a review for this job</Text>
              <Textarea
                value={reviewText}
                onChange={handleChange}
                placeholder="Text here...."
                size="sm"
                h={'12vw'}
              />
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
              <Button
                bg="buttonGreen"
                color="white"
                onClick={() => {
                  handleReviewSubmit();
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

export default ReviewFormModal;
