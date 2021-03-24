import { Button } from '@chakra-ui/button';
import { Box, Center, Container, Flex, Heading, HStack, List, ListItem } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStores } from '../../../hooks/use-stores';

import JobItemList from './components/JobItemList';

const JobsPage = observer(() => {
  const { userStore, jobStore } = useStores();

  const currentJob = jobStore.currentJob;

  const handleRefresh = () => {
    jobStore.fetchAllJobs(userStore.userData._id);
  };

  useEffect(() => {
    if (userStore.userData) jobStore.fetchAllJobs(userStore.userData._id);
  }, [userStore.userData, jobStore]);

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
              console.log(toJS(job));
              return (
                <ListItem position="relative" key={job._id} my={2} minW={`90%`}>
                  <JobItemList job={job} />
                </ListItem>
              );
            })
          )}
        </List>
      </Container>
    </Flex>
  );
});

export default JobsPage;
