import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Container, Flex, HStack, Stack, Text, VStack } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { observer } from 'mobx-react-lite';
import React from 'react';

import JobItemModal from './JobItemModal';
import Status from './Status';
import UserStatus from './UserStatus';

const JobItem = observer(({ job, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { customerId } = job;

  const renderMap = () => {
    return <Box flex={2} minW={`10rem`} bgColor="green.400" h={`12rem`}></Box>;
  };

  const renderModal = () => {
    return (
      <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={`3xl`}>
        <ModalOverlay />
        <ModalContent overflow={'hidden'} borderRadius={`xl`}>
          <ModalCloseButton zIndex={`tooltip`} />
          {/* Job Modal */}
          <JobItemModal job={job} onCancel={onClose} onAccept={() => console.log('accept')} />
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Container
      boxShadow="md"
      borderRadius={4}
      overflow="hidden"
      m={0}
      px={0}
      minW={`100%`}
      onClick={onOpen}>
      <Flex direction="row" alignItems="center">
        {renderMap()}
        <Stack direction={`column`} flex={4} p={2} alignItems="felx-start">
          <VStack flex={1} justifyContent="flex-start" alignItems="flex-start">
            <HStack>
              <UserStatus uid={customerId} />
            </HStack>
          </VStack>
          <Box flex={1}>
            <Text as="h5" fontWeight="bold">
              Note
            </Text>
            <Text as="p" noOfLines={2}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, ullam! Lorem ipsum
              dolor.
            </Text>
          </Box>
        </Stack>
        <VStack flex={1} alignSelf="flex-start" p={2}>
          <Status job={job} />
        </VStack>
      </Flex>
      {renderModal()}
    </Container>
  );
});

export default JobItem;
