import { Button } from '@chakra-ui/button';
import { Container, Flex, Heading, HStack, VStack } from '@chakra-ui/layout';
import React, { useEffect } from 'react';
import JobItem from './components/JobItem';

const JobsPage = () => {
  const jobs = [{ id: 1 }, { id: 2 }, { id: 3 }];

  useEffect(() => {}, []);

  const handleRefresh = (event) => {
    // TODO: re-fetch jobs data.
    console.log('refresh btn clicked!');
  };

  return (
    <Flex
      direction="column"
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
        <VStack mt={4} p={3} justifyContent="center">
          {jobs.map((job) => {
            return <JobItem key={job.id} />;
          })}
        </VStack>
      </Container>
    </Flex>
  );
};

export default JobsPage;
