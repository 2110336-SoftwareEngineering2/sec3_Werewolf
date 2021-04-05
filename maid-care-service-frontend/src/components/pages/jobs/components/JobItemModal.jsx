import { ButtonGroup } from '@chakra-ui/button';

import Icon from '@chakra-ui/icon';
import { Box, Grid, GridItem, Heading, HStack, List, ListItem, Text } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { useToast } from '@chakra-ui/toast';

import { useEffect, useState } from 'react';
import { FaTshirt } from 'react-icons/fa';
import { useStores } from '../../../../hooks/use-stores';
import { ConfirmModal, DiscardJobModal } from '../../../shared/modals/modals';
import Address from './Address';
import { ConfirmContext, DiscardJobContext } from './context/ctx';
import Actions from './cta';
import Status from './Status';
import UserStatus from './UserStatus';

const JobItemModal = ({ job, isOpen, onClose }) => {
  const { _id: jobId, work, workplaceId, customerId, state } = job;
  const { jobStore } = useStores();
  const toast = useToast();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDiscardJobModalOpen, setIsDiscardModalOpen] = useState(false);

  /** Maid confirm that job is done */
  const handleConfirm = () => {
    jobStore
      .done({ jobId })
      .then(() => {
        setIsConfirmModalOpen(false); // Close Confirm Modal
        toast({
          title: 'Successfully Confirmed!',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Something went wrong!',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      });
  };
  const handleDiscard = () => {
    jobStore
      .discard({ jobId })
      .then(() => {
        toast({
          title: 'Successfully Discarded!',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Something went wrong!',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      });
  };

  useEffect(
    () => () => {
      setIsDiscardModalOpen(false);
    },
    []
  );

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
              <UserStatus uid={customerId} />
            </GridItem>
            <GridItem as={List} rowStart={3} rowSpan={3} colStart={0} colSpan={2} p={4}>
              {work &&
                work.map(({ quantity }, idx) => (
                  <ListItem as={HStack} key={jobId + idx}>
                    <Icon as={FaTshirt} w={8} h={8} color={`gray.800`} />
                    <Text>{quantity} ตัว</Text>
                  </ListItem>
                ))}
            </GridItem>
            <GridItem rowSpan={2} colStart={3} colEnd={7} p={4} alignItems={`baseline`}>
              <Address workplaceId={workplaceId} />
            </GridItem>
            <GridItem rowStart={4} rowSpan={2} colStart={3} colEnd={7} p={4}>
              {/* TODO: add note to return value of api */}
              <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
                Note
              </Heading>
              <Text>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, ullam! Lorem
                ipsum dolor.
              </Text>
            </GridItem>
            <GridItem rowSpan={4} colStart={7} colEnd={-1} p={4}>
              {/* Map State to What Component we want to Render Here! */}
              <Status job={job} />
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
              <ConfirmContext.Provider
                value={{
                  isConfirmModalOpen,
                  setIsConfirmModalOpen,
                }}>
                <DiscardJobContext.Provider
                  value={{
                    isDiscardJobModalOpen,
                    setIsDiscardModalOpen,
                  }}>
                  <Actions job={job} state={state} />
                </DiscardJobContext.Provider>
              </ConfirmContext.Provider>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>

      <ConfirmModal
        job={job}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
      />
      <DiscardJobModal
        job={job}
        isOpen={isDiscardJobModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onDiscard={handleDiscard}
      />
    </>
  );
};

export default JobItemModal;
