import { Button } from '@chakra-ui/button';
import { Box, Center, Container, Flex, Heading, HStack, List, ListItem } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from '../../../hooks/use-stores';

import JobItem from './components/JobItem';

const JobsPage = observer(() => {
  const [currentJob, setCurrentJob] = useState(null);

  const { userStore, jobStore } = useStores();

  const handleRefresh = () => {
    // TODO: re-fetch jobs data
    console.log(toJS(jobStore.jobs));
    jobStore.fetchAllJobs(userStore.userData._id);
  };

  useEffect(() => {
    if (userStore.userData) jobStore.fetchAllJobs(userStore.userData._id);
    console.log(toJS(jobStore.jobs));
  }, [userStore.userData, jobStore]);

  const renderModal = () => {
    return (
      <Modal
        size={`xl`}
        isCentered
        onClose={() => setCurrentJob(null)}
        isOpen={currentJob}
        motionPreset={`slideInBottom`}
        scrollBehavior={`outside`}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Box>
            <JobItem isExpanded={true} job={currentJob} />
          </Box>
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
          {jobStore.loading ? (
            <Center>
              <Spinner size={`xl`} thickness={6} />
            </Center>
          ) : (
            jobStore.jobs.map((job) => {
              return (
                <ListItem key={job._id} onClick={() => setCurrentJob(job)} my={2} minW={`90%`}>
                  <JobItem job={job} />
                </ListItem>
              );
            })
          )}
        </List>
        {renderModal()}
      </Container>
    </Flex>
  );
});

export default JobsPage;
