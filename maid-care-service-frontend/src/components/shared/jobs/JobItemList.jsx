import { Box, Center, Container, HStack, Text, VStack } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { memo, useEffect, useState } from 'react';
import { fetchWorkspaceById } from '../../../api';
import Map from '../Map';

import Status from '../../pages/jobs/components/Status';
import UserStatus from '../../pages/jobs/components/UserStatus';
import { useStores } from '../../../hooks/use-stores';
import { observer } from 'mobx-react-lite';

const JobItem = observer(({ job }) => {
  const { customerId, maidId, workplaceId, work, jobId } = job;
  const { userStore } = useStores();

  const curUser = userStore.userData;
  const userRole = curUser.role;

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
                <UserStatus uid={userRole === 'maid' ? customerId : maidId} />
              </HStack>
            </VStack>
            <Box>
            <Text as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
                Note
              </Text>
              {work &&
                work.map(({ typeOfWork, description }, idx) => (
                  <Text key={jobId + description + idx}>
                    {typeOfWork} - {description}
                  </Text>
                ))}
            </Box>
          </VStack>
          <Status job={job} />
        </HStack>
      </HStack>
    </Container>
  );
});

export default memo(JobItem);
