import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import Icon from '@chakra-ui/icon';
import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { Collapse } from '@chakra-ui/transition';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FaClock, FaTshirt } from 'react-icons/fa';
import axios from 'axios';
import { Skeleton } from '@chakra-ui/skeleton';

const JobItem = observer(
  ({ job: { _id, customerId, work, expiryTime }, isExpanded = false, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [customer, setCustomer] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [remainingTime, setRemainingTime] = useState(null);

    const fetchCustomer = () => {
      setLoading(true);
      axios
        .get(`/api/users/${customerId}`)
        .then((response) => {
          const { data: cus } = response;
          console.log(cus);
          setCustomer(cus);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setCustomer(null);
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchCustomer();
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        const exp = new Date(expiryTime);
        const cur = new Date();
        const diff = (exp.getTime() - cur.getTime()) / 1000;
        setRemainingTime(diff);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }, [expiryTime]);

    const renderMap = () => {
      return (
        <Box flex={2} minW={`10rem`} bgColor="green.400" h={isExpanded ? `12rem` : `10rem`}></Box>
      );
    };

    const renderModal = () => {
      return (
        <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader as="h1" fontSize={`3xl`} textAlign="center">
              Matching ...
            </ModalHeader>
            <ModalBody>
              <VStack>
                <Center my={8}>
                  <Spinner thickness={8} w={24} h={24} />
                </Center>
                <HStack>
                  <Button bgColor="red.400" color="white" onClick={onClose}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      );
    };

    return (
      <Container boxShadow="md" borderRadius={4} overflow="hidden" m={0} px={0} minW={`100%`}>
        {isExpanded && renderMap()}
        <Flex direction="row" alignItems="center">
          {!isExpanded && renderMap()}
          <Stack direction={isExpanded ? 'row' : 'column'} flex={4} p={2} alignItems="felx-start">
            <VStack flex={1} justifyContent="flex-start" alignItems="flex-start">
              <Skeleton isLoaded={!isLoading && customer}>
                <HStack>
                  <Avatar title="Mr. Teerawat R" />
                  <Text as="h2">{customer && `${customer.firstname} ${customer.lastname}`}</Text>
                </HStack>
              </Skeleton>
              <Collapse in={isExpanded} animateOpacity>
                <List listStyleImage="none" spacing={3} my={4}>
                  {work.map(({ quantity }, idx) => (
                    <ListItem key={_id + idx} px={3}>
                      <ListIcon as={FaTshirt} w={6} h={6} />
                      {quantity} อัน
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </VStack>
            <Box flex={1}>
              <Collapse in={isExpanded} animateOpacity>
                <Text as="h5" fontWeight="bold">
                  Address
                </Text>
                <Text as="p" noOfLines={isExpanded ? 99 : 2} mb={2}>
                  Lorem ipsum dolor sit amet. Veniam at ipsa quisquam! 30140
                </Text>
              </Collapse>
              <Text as="h5" fontWeight="bold">
                Note
              </Text>
              <Text as="p" noOfLines={isExpanded ? 99 : 2}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, ullam! Lorem
                ipsum dolor.
              </Text>
            </Box>
          </Stack>
          <VStack flex={1} alignSelf="flex-start" p={2}>
            <HStack>
              <Icon as={FaClock} w={6} h={6}></Icon>
              <Text as="p" fontSize={`xl`}>
                {remainingTime > 0 ? `${remainingTime} second` : `Time out`}
              </Text>
            </HStack>
          </VStack>
        </Flex>
        {/* Call to Action */}
        <Collapse in={isExpanded} animateOpacity>
          <HStack justifyContent="flex-end" m={2}>
            <Button onClick={onOpen} bgColor="green.400" color="white">
              Accept
            </Button>
            {renderModal()}
          </HStack>
        </Collapse>
      </Container>
    );
  }
);

export default JobItem;
