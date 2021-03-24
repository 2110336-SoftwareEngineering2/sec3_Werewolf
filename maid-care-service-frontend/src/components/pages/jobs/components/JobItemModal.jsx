import { Avatar } from '@chakra-ui/avatar';
import { Button, ButtonGroup } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
} from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FaTshirt } from 'react-icons/fa';
import { fetchWorkspaceById } from '../../../../api';
import Status from './Status';
import UserStatus from './UserStatus';

const JobItemModal = observer(({ job, onCancel, onAccept }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  const { _id: jobId, work, workplaceId, customerId } = job;

  useEffect(() => {
    // Get Job Address
    (async () => {
      try {
        setLoading(true);
        const response = await fetchWorkspaceById(workplaceId);
        const wsp = response.data;
        setAddress(wsp.description);
        console.log(wsp);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [workplaceId]);

  return (
    <Grid h={`75vh`} templateRows={`14rem repeat(5, 1fr)`} templateColumns={`repeat(5, 1fr)`}>
      <GridItem
        as={Box}
        rowSpan={1}
        colSpan={6}
        bg={`green.300`}
        borderRadius={`xl`}
        zIndex={`toast`}></GridItem>
      <GridItem as={HStack} rowSpan={1} colSpan={1} px={2} py={2}>
        <UserStatus uid={customerId} />
      </GridItem>
      <GridItem as={List} rowStart={3} rowSpan={3} colStart={0} colSpan={1} p={4}>
        {work.map(({ quantity }, idx) => (
          <ListItem as={HStack} key={jobId + idx}>
            <Icon as={FaTshirt} w={8} h={8} color={`gray.800`} />
            <Text>{quantity} ตัว</Text>
          </ListItem>
        ))}
      </GridItem>
      <GridItem rowSpan={2} colSpan={3} p={4} alignItems={`baseline`}>
        <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
          Address
        </Heading>
        <Skeleton isLoaded={!loading}>
          <Text>{address}</Text>
        </Skeleton>
      </GridItem>
      <GridItem rowStart={4} rowSpan={2} colStart={0} colSpan={3} p={4}>
        {/* TODO: add note to return value of api */}
        <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
          Note
        </Heading>
        <Skeleton isLoaded={!loading}>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum, ullam! Lorem ipsum
            dolor.
          </Text>
        </Skeleton>
      </GridItem>
      <GridItem rowSpan={4} colSpan={1} p={4}>
        {/* Map State to What Component we want to Render Here! */}
        <Status job={job} />
      </GridItem>
      <GridItem
        as={ButtonGroup}
        display={`flex`}
        justifyContent={`flex-end`}
        alignItems={`center`}
        rowStart={-2}
        colSpan={5}
        p={4}>
        <Button onClick={onCancel} variant={`outline`} colorScheme={`red`}>
          Cancel
        </Button>
        <Button onClick={onAccept} colorScheme={`green`}>
          Accept
        </Button>
      </GridItem>
    </Grid>
  );
});

export default JobItemModal;
