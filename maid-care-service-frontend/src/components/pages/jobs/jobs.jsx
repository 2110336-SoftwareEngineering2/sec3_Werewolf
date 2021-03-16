import { Button } from '@chakra-ui/button';
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
  Wrap,
} from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from '../../../hooks/use-stores';
import JobItem from './components/JobItem';

const JobsPage = observer(() => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentJob, setCurrentJob] = useState(null);

  const { userStore, jobStore } = useStores();

  const handleRefresh = (event) => {
    // TODO: re-fetch jobs data
    console.log('refresh btn clicked!');
    fetchJobs();
  };

  const fetchJobs = () => {
    setLoading(true);
    return setTimeout(() => {
      setJobs([
        {
          id: 1,
          works: [
            {
              typeOfWork: 'Work A',
              description: 'Work for A Task',
              quantity: 112,
            },
          ],
        },
        {
          id: 2,
          works: [
            {
              typeOfWork: 'Work A',
              description: 'Work for A Task',
              quantity: 102,
            },
            {
              typeOfWork: 'Work B',
              description: 'Work for B Task',
              quantity: 102,
            },
          ],
        },
        {
          id: 3,
          works: [
            {
              typeOfWork: 'Work A',
              description: 'Work for A Task',
              quantity: 92,
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
          {isLoading ? (
            <Center>
              <Spinner size={`xl`} thickness={6} />
            </Center>
          ) : (
            jobs.map((job) => {
              return (
                <ListItem onClick={() => setCurrentJob(job)} my={2} minW={`90%`}>
                  <JobItem key={job.id} job={job} />
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
