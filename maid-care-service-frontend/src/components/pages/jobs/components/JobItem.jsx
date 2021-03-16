import { Avatar } from '@chakra-ui/avatar';
import Icon from '@chakra-ui/icon';
import { Box, Container, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import React from 'react';
import { FaClock } from 'react-icons/fa';

const JobItem = ({ ...props }) => {
  return (
    <Container boxShadow="md" borderRadius={4} overflow="hidden" my={2} mx={0} px={0} minW={`90%`}>
      <Flex direction="row" alignItems="center">
        <Box flex={2} bgColor="green.400" h={`10rem`}></Box>
        <VStack flex={4} p={2} alignItems="felx-start">
          <HStack alignItems="center">
            <Avatar title="Mr. Teerawat R" />
            <Text as="h2">Mr. Teerawat R</Text>
          </HStack>
          <Box>
            <Text as="h5" fontWeight="bold">
              Note
            </Text>
            <Text as="p" noOfLines={2}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, ullam! Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Alias repellat magnam sit aut aliquam
              error commodi veniam debitis mollitia fuga cupiditate distinctio, eos placeat totam.
              Tenetur, commodi! Fugiat, a aliquam.
            </Text>
          </Box>
        </VStack>
        <VStack flex={1} alignSelf="flex-start" p={2}>
          <HStack>
            <Icon as={FaClock} w={6} h={6}></Icon>
            <Text as="p" fontSize={`xl`}>
              0:30
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default JobItem;
