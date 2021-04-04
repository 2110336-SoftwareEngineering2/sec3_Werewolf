import React, { useState, useEffect } from 'react';
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
import { useToast } from '@chakra-ui/react';
import Icon from '@chakra-ui/icon';
import { FaTshirt, FaRing, FaBroom, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Address from './../../jobs/components/Address.jsx';
import ReviewFormModal from './ReviewFormModal.jsx';
import RefundFormModal from './RefundFormModal.jsx';
import { GetRatingStar } from './RatingStar.jsx';
import { job } from './../../../../api';
// Re

const PostModal = ({ isOpen, onClose, job, fetchJobById }) => {
  let { _id: jobId, work, workplaceId, maidId, review, rating } = job;
  const [isOpenReview, setOpenReview] = useState(false);
  const [isOpenRefund, setOpenRefund] = useState(false);
  const [isRefundSubmitted, setRefundSubmitted] = useState(false);
  // Is user write review.
  var d = new Date();
  const toast = useToast();


  const handleConfirmReview = () => {
    setOpenReview(false);
    fetchJobById();
  };

  const handleConfirmRefund = () => {
    setOpenRefund(false);
    setRefundSubmitted(true);
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
              <Text>{review === null ? 'อยากบอกอะไรเมต ไหมจ๊ะ? อิอิ . . . . . .' : review}</Text>
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
                    <GetRatingStar rating={rating} />
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
              ) : isRefundSubmitted === true ? (
                <HStack>
                  <Icon as={FaCheckCircle} w={7} h={7} color={`green.400`} p={0} />
                  <Text>Request refund sent</Text>
                </HStack>
              ) : (
                <Button
                  bg="white"
                  color="buttonGreen"
                  borderColor="green"
                  border="1px"
                  onClick={() => {
                    setOpenRefund(true);
                  }}>
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
      <RefundFormModal
        isOpen={isOpenRefund}
        onClose={() => {
          setOpenRefund(false);
        }}
        job={job}
        handleConfirmRefund={handleConfirmRefund}
      />
    </>
  );
};

export default PostModal;
