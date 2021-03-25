import { Box, Container, Flex, HStack, Stack, Text, VStack } from '@chakra-ui/layout';
import React, { memo } from 'react';

import Status from './Status';
import UserStatus from './UserStatus';

const JobItem = ({ job }) => {
  const { customerId } = job;

  const renderMap = () => {
    return <Box flex={2} minW={`10rem`} bgColor="green.400" h={`12rem`}></Box>;
  };

  return (
    <Container boxShadow="md" borderRadius={4} overflow="hidden" m={0} px={0} minW={`100%`}>
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
    </Container>
  );
};

export default JobItem;
