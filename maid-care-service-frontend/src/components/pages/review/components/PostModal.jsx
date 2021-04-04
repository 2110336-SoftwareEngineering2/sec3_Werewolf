import React, { useState } from 'react';
import {
  Box,
  Text,
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
  Heading,
  ListItem,
} from '@chakra-ui/react';
import UserStatus from './../../jobs/components/UserStatus.jsx';
import Icon from '@chakra-ui/icon';
import { FaTshirt, FaRing, FaBroom, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Address from './../../jobs/components/Address.jsx';
import ReviewFormModal from './ReviewFormModal.jsx';
import StarRating from './../../postjob/components/StarRating.jsx';

// Re

const PostModal = ({ isOpen, onClose, job }) => {
  const { _id: jobId, work, workplaceId, customerId, state, maidId, review, rating } = job;
  const [isOpenReview, setOpenReview] = useState(false);
  // Is user write review.
  var d = new Date();

  const handleConfirmReview = () => {
    setOpenReview(false);
  };

  const reviewState = (STATE) => {
    switch (STATE) {
      case 'notReviewed':
        return (
          <>
            <Icon as={FaExclamationCircle} w={7} h={7} color={`red.400`} p={0} />
            <Text fontWeight="bold">This job is waiting for your review</Text>
          </>
        );
    }
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
              <UserStatus uid={maidId} />
            </GridItem>
            <GridItem as={List} rowStart={3} rowSpan={3} colStart={0} colSpan={2} p={4}>
              {work &&
                work.map(({ quantity }, idx) => (
                  <ListItem as={HStack} key={jobId + idx} mt="1vw">
                    <Icon
                      as={idx === 0 ? FaRing : idx === 1 ? FaBroom : FaTshirt}
                      w={8}
                      h={8}
                      color={`gray.800`}
                    />
                    <Text>
                      {quantity} {idx === 0 ? 'จาน' : idx === 1 ? 'ตารางเมตร' : 'ตัว'}
                    </Text>
                  </ListItem>
                ))}
            </GridItem>
            <GridItem rowSpan={1} colStart={3} colEnd={7} p={4} alignItems={`baseline`}>
              <Address workplaceId={workplaceId} />
            </GridItem>
            <GridItem rowStart={3} rowSpan={1} colStart={3} colEnd={7} p={4}>
              <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
                Review
              </Heading>
              <Text>{review === null ? 'อยากบอกอะไรเมต ไหมจ๊ะ? อิอิ' : review}</Text>
            </GridItem>
            <GridItem rowStart={4} rowSpan={2} colStart={3} colEnd={7} p={4}>
              {review === null ? (
                <HStack>
                  <Icon as={FaExclamationCircle} w={7} h={7} color={`red.400`} p={0} />
                  <Text fontWeight="bold">This job is waiting for your review</Text>
                </HStack>
              ) : (
                <>
                  <HStack>
                    <Icon as={FaCheckCircle} w={7} h={7} color={`green.400`} p={0} />
                    <Text fontWeight="bold">Your review has been sent</Text>
                  </HStack>
                  <HStack>
                    <StarRating rating={rating} />
                    <Text>{rating} / 5 stars</Text>
                  </HStack>
                </>
              )}
            </GridItem>
            <GridItem rowSpan={4} colStart={7} colEnd={-1} p={4}>
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
              {review === null ? (
                <Button
                  onClick={() => {
                    setOpenReview(true);
                  }}
                  bg="buttonGreen"
                  color="white">
                  Write your Review
                </Button>
              ) : (
                <Button bg="white" color="buttonGreen" borderColor="green" border="1px">
                  Request for Refund
                </Button>
              )}
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>
      <ReviewFormModal
        isOpen={isOpenReview}
        onClose={() => {
          setOpenReview(false);
        }}
        job={job}
        handleConfirmReview={handleConfirmReview}
      />
    </>
  );
};

export default PostModal;
