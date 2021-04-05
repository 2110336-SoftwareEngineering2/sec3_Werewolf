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
import { GetRatingStar } from '../../../shared/RatingStar.jsx';
import { fetchWorkspaceById } from '../../../../api';
import Map from '../../../shared/Map.jsx';
// Re

const PostModal = ({ isOpen, onClose, job, fetchJobById }) => {
  let { _id: jobId, work, workplaceId, maidId, review, rating } = job;
  const [isOpenReview, setOpenReview] = useState(false);
  const [isOpenRefund, setOpenRefund] = useState(false);
  const [isRefundSubmitted, setRefundSubmitted] = useState(false);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    // Get Job Address
    (async () => {
      try {
        setLoading(true);
        const response = await fetchWorkspaceById(workplaceId);
        const wsp = response.data;
        setAddress(wsp);
        console.log('fetchWorkspaceById : ', address);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [workplaceId]);

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
              bg={`gray.300`}
              zIndex={`toast`}>
              <Map
                latitude={address === null ? 13.7563 : address.latitude}
                longitude={address === null ? 100.5018 : address.longitude}
              />
            </GridItem>
            <GridItem as={HStack} rowStart={2} rowSpan={1} colSpan={2} p={4}>
              <UserStatus uid={maidId} />
            </GridItem>
            <GridItem as={List} rowStart={3} rowSpan={3} colStart={0} colSpan={2} p={4}>
                {work &&
                work.map(({ quantity, typeOfWork, unit }, idx) => (
                  <ListItem as={HStack} key={jobId + idx} mt="1vw">
                    <Icon
                      as={typeOfWork === 'Dish Washing' ? FaRing : typeOfWork === 'House Cleaning' ? FaBroom : FaTshirt}
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
            <GridItem rowSpan={1} colStart={3} colEnd={7} p={4} alignItems={`baseline`} overflow="hidden" textOverflow="ellipsis">
              <Address workplaceId={workplaceId} />
            </GridItem>
            <GridItem rowStart={3} rowSpan={2} colStart={3} colEnd={-1} p={4}>
              <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
                {review === null ? 'Note' : 'Your Review'}
              </Heading>
              <Box
                width="100%"
                height="80%"
                padding="1vw"
                overflow="scroll"
                >
                <Text>{review === null ? 'อยากบอกอะไรเมต ไหมจ๊ะ? อิอิ . . . . . .' : review}</Text>
              </Box>
            </GridItem>
            <GridItem rowStart={5} rowSpan={1} colStart={3} colEnd={-1} p={4}>
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
              {review === null ? (
                <>
                  <Button
                    bg="buttonGreen"
                    color="white"
                    onClick={() => {
                      setOpenReview(true);
                    }}>
                    Write your review
                  </Button>
                </>
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
        setOpenRefund={setOpenRefund}
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
