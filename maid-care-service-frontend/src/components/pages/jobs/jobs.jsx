import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Center, Container, Flex, Heading, HStack, List, ListItem, Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { observer } from 'mobx-react-lite';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { CANCELED, DONE, REVIEWED } from '../../../constants/post-state';
import { useStores } from '../../../hooks/use-stores';
import JobItemList from '../../shared/jobs/JobItemList';
import JobItemModal from './components/JobItemModal';
import Actions from './components/cta';
import { useCurrentLocation } from '../../../hooks/use-location';
import { updateLocation } from '../../../api';

const JobsPage = observer(() => {
  const { userStore, jobStore } = useStores();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState();
  const [mode, setMode] = useState('allJobs');

  // Mobx Job Store
  const jobs = jobStore.jobs;
  const currentJob = jobStore.currentJob;
  const loading = jobStore.loading;

  // Mobx User Store
  const curUser = userStore.userData;

  const updateMaidLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = position.coords;
        updateLocation(location)
          .then(() => console.log('success'))
          .catch((error) => console.error(error));
      },
      (error) => {
        console.error(error);
      },
      {}
    );
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported!');
      return;
    }
    const updateLocationInterval = setInterval(() => {
      updateMaidLocation();
    }, 60 * 1000); // 10 mins
    return () => clearInterval(updateLocationInterval);
  }, [updateMaidLocation]);

  // Render Modal if already have a current job
  useEffect(() => {
    if (currentJob === null) {
      setSelected(null);
    } else {
      setSelected(currentJob);
    }
  }, [currentJob]);

  // Fetch every 5 seconds
  useEffect(() => {
    const fetchJobsInterval = setInterval(async () => {
      await jobStore.fetchAllJobs();
    }, 30000);
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

  const filterExceptCurrentJob = (job) => {
    return job._id === currentJob._id;
  };

  const compareJobs = (x, y) => {
    return new Date(x.expiryTime) > new Date(y.expiryTime);
  };

  // Fetch user data
  useEffect(() => {
    if (curUser) jobStore.fetchAllJobs(curUser._id);
  }, [curUser, jobStore]);

  const renderSelectedJobModal = () => {
    return (
      <>
        <JobItemModal job={selected} isOpen={isOpen} onClose={handleClose} actions={Actions} />
      </>
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
        <HStack spacing={4} alignItems={`baseline`}>
          <Heading>Jobs</Heading>
          <Button
            variant={`link`}
            textDecoration={`underline`}
            fontSize={`lg`}
            color={mode === 'allJobs' && 'green.400'}
            onClick={() => setMode('allJobs')}>
            All Jobs
          </Button>
          <Button
            disabled={!currentJob}
            variant={`link`}
            textDecoration={`underline`}
            fontSize={`lg`}
            color={mode === 'curJob' && 'green.400'}
            onClick={() => setMode('curJob')}>
            Current Job
          </Button>
          <Button
            variant={`link`}
            textDecoration={`underline`}
            fontSize={`lg`}
            color={mode === 'history' && 'green.400'}
            onClick={() => setMode('history')}>
            History
          </Button>
        </HStack>
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
          ) : jobs.length ? (
            jobs
              .filter((job) =>
                mode === 'curJob'
                  ? filterExceptCurrentJob(job)
                  : mode === 'history'
                  ? [DONE, CANCELED, REVIEWED].includes(job.state)
                  : true
              )
              .sort((cur, next) =>
                currentJob && cur._id === currentJob._id ? -1 : !compareJobs(cur, next)
              )
              .map((job) => {
                return (
                  <ListItem key={job._id} my={2} minW={`90%`} onClick={() => handleSelect(job)}>
                    <JobItemList job={job} />
                  </ListItem>
                );
              })
          ) : (
            <Text>There is no item.</Text>
          )}
        </List>
      </Container>
      {selected && renderSelectedJobModal()}
    </Flex>
  );
});

export default memo(JobsPage);
