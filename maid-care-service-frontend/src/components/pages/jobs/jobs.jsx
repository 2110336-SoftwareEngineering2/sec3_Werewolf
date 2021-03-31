import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Center, Container, Flex, Heading, HStack, List, ListItem } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { CONFIRMED, DONE, MATCHED, POSTED } from '../../../constants/post-state';
import { useStores } from '../../../hooks/use-stores';

import JobItemList from './components/JobItemList';
import JobItemModal from './components/JobItemModal';

const JobsPage = observer(() => {
  const { userStore, jobStore } = useStores();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState();

  // Mobx Job Store
  const jobs = jobStore.jobs;
  const currentJob = jobStore.currentJob;
  const loading = jobStore.loading;
  const error = jobStore.error;

  // Mobx User Store
  const curUser = userStore.userData;

  // Render Modal if already have a current job
  useEffect(() => {
    if (currentJob === null) {
      setSelected(null);
    } else {
      setSelected(currentJob);
    }
  }, [currentJob]);

  useEffect(() => {
    const fetchJobsInterval = setInterval(async () => {
      await jobStore.fetchAllJobs();
    }, 10000);
    return () => clearInterval(fetchJobsInterval);
  }, [jobStore]);

  const handleRefresh = () => {
    jobStore.fetchAllJobs();
  };

  const handleSelect = (job) => {
    setSelected(job);
    onOpen();
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  useEffect(() => {
    if (curUser) jobStore.fetchAllJobs(curUser._id);
  }, [curUser, jobStore]);

  const renderModal = () => {
    return (
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={() => handleClose()}
        size={`3xl`}>
        <ModalOverlay />
        <ModalContent overflow={'hidden'} borderRadius={`xl`}>
          <ModalCloseButton zIndex={`tooltip`} />
          {/* Job Modal */}
          <JobItemModal job={selected} />
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Flex
      direction="column"
      minH={`100vh`}
      bgColor="gray.300"
      padding={'20vh'}
      justifyContent="flex-start"
      alignItems="center">
      <Container borderRadius={4} bgColor="gray.100" p={6} w={`70vw`} maxW={1200}>
        <Heading>Jobs</Heading>
        <HStack justifyContent="flex-end">
          <Button onClick={handleRefresh} bgColor="brandGreen" color="white">
            Refresh
          </Button>
        </HStack>
        <List spacing={6} mt={4} p={3} justifyContent="center">
          {loading ? (
            <Center>
              <Spinner size={`xl`} thickness={6} />
            </Center>
          ) : (
            jobs.map((job) => {
              return (
                <ListItem key={job._id} my={2} minW={`90%`} onClick={() => handleSelect(job)}>
                  <JobItemList job={job} />
                </ListItem>
              );
            })
          )}
        </List>
      </Container>
      {selected && renderModal()}
    </Flex>
  );
});

export default JobsPage;
