import React, { useState } from 'react';
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
import Address from './../../jobs/components/Address.jsx';
import ReviewFormModal from './ReviewFormModal.jsx';

// Re

const PostModal = ({ isOpen, onClose }) => {
  const [isOpenReview, setIsOpenReview] = useState(false);
  var d = new Date();

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
            <GridItem as={List} rowStart={3} rowSpan={3} colStart={0} colSpan={2} p={4}>
              <Status job={''} />
            </GridItem>
            <GridItem rowSpan={2} colStart={3} colEnd={7} p={4} alignItems={`baseline`}>
              <Address workplaceId={''} />
            </GridItem>
            <GridItem rowStart={4} rowSpan={2} colStart={3} colEnd={7} p={4}>
              <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
                Note
              </Heading>
              <Text>อยากบอกอะไรเมต ไหมจ๊ะ? อิอิ</Text>
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
              <Button
                onClick={() => {
                  setIsOpenReview(true);
                }}
                bg="buttonGreen"
                color="white">
                Write your Review
              </Button>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>
      <ReviewFormModal
        isOpen={isOpenReview}
        onClose={() => {
          setIsOpenReview(false);
        }}
      />
    </>
  );
};

export default PostModal;
