import { Box, Center, Container, HStack, Text, VStack } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { memo, useEffect, useState } from 'react';
import { fetchWorkspaceById } from '../../../../api';
import Map from '../../../shared/Map';

import Status from './Status';
import UserStatus from './UserStatus';

const JobItem = ({ job }) => {
  const { customerId, workplaceId } = job;

  const [loading, setLoading] = useState(false);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await fetchWorkspaceById(workplaceId);
        setWorkspace(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setWorkspace(null);
        setLoading(false);
      }
    })();
  }, [workplaceId]);

  const renderMap = () => {
    if (loading)
      return (
        <Center flex={2}>
          <Spinner thickness="4px" />
        </Center>
      );
    return (
      <Box flex={3} minW={`10rem`} bgColor="green.400" alignSelf={`stretch`}>
        {workspace && <Map latitude={workspace.latitude} longitude={workspace.longitude} />}
      </Box>
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
      minH={36}>
      <HStack alignItems="center">
        {renderMap()}
        <HStack flex={6} p={4}>
          <VStack flex={6} alignItems="felx-start" spacing={4}>
            <VStack justifyContent="flex-start" alignItems="flex-start">
              <HStack>
                <UserStatus uid={customerId} />
              </HStack>
            </VStack>
            <Box>
              <Text as="h5" fontWeight="bold">
                Note
              </Text>
              <Text as="p" noOfLines={2}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, ullam! Lorem
                ipsum dolor.
              </Text>
            </Box>
          </VStack>
          <Status job={job} />
        </HStack>
      </HStack>
    </Container>
  );
};

export default memo(JobItem);
