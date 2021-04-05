import Icon from '@chakra-ui/icon';
import { HStack, Text, VStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { FaBroom, FaCheckCircle, FaClock, FaRegStar, FaRegTimesCircle } from 'react-icons/fa';
import {
  CANCELED,
  CONFIRMED,
  DONE,
  MATCHED,
  POSTED,
  REVIEWED,
} from '../../../../constants/post-state';

const DateAndTime = ({ datetime }) => {
  return (
    <>
      <Text fontSize={`lg`}>{new Date(datetime).toDateString()}</Text>
      <Text>{new Date(datetime).toTimeString().slice(0, 8)}</Text>
    </>
  );
};

const JobStatus = ({ job }) => {
  const { state, expiryTime, finishTime, acceptedTime } = job;

  return state === MATCHED ? (
    <MatchedStatus />
  ) : state === CONFIRMED ? (
    <InProgressStatus acceptedTime={acceptedTime} />
  ) : state === DONE ? (
    <WaitForReviewStatus finishTime={finishTime} />
  ) : state === REVIEWED ? (
    <DoneStatus finishTime={finishTime} />
  ) : state === CANCELED ? (
    <CanceledStatus acceptedTime={acceptedTime} />
  ) : state === POSTED ? (
    <CounterStatus expiryTime={expiryTime} />
  ) : (
    <Text fontSize={`lg`} fontWeight={`bold`}>
      No status
    </Text>
  );
};

const MatchedStatus = () => {
  return (
    <>
      <VStack alignItems={`flex-end`}>
        <HStack wrap={true}>
          <Icon as={FaCheckCircle} w={8} h={8} />
          <Text fontSize={`lg`} fontWeight={`bold`}>
            Matched
          </Text>
        </HStack>
      </VStack>
    </>
  );
};

const CounterStatus = ({ expiryTime }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  // Create Interval if Job Still NOT Matched
  useEffect(() => {
    const interval = setInterval(() => {
      // const exp = new Date(expiryTime);
      const exp = new Date(expiryTime);
      console.log(exp);
      const cur = new Date();
      const diff = (exp.getTime() - cur.getTime()) / 1000;
      console.log('diff', diff);
      setRemainingTime(new Date(diff * 1000).toISOString().substr(11, 8)); //HH:mm:ss
      if (diff < 0) {
        setRemainingTime('Time out');
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [expiryTime]);

  return (
    <>
      <VStack flex={3} alignItems={`flex-end`}>
        <HStack>
          <Icon as={FaClock} w={8} h={8} />
          <Text fontSize={`lg`} fontWeight={`bold`}>
            {remainingTime}
          </Text>
        </HStack>
      </VStack>
    </>
  );
};

const InProgressStatus = ({ acceptedTime }) => {
  return (
    <>
      <VStack alignItems={`flex-end`}>
        <DateAndTime datetime={acceptedTime} />
        <VStack wrap={true} alignItems={`center`} pt={8}>
          <Icon as={FaBroom} w={9} h={9} />
          <Text fontSize={`lg`} fontWeight={`bold`}>
            In Progress
          </Text>
        </VStack>
      </VStack>
    </>
  );
};

const WaitForReviewStatus = ({ finishTime }) => {
  return (
    <>
      <VStack flex={2} alignItems={'flex-end'} p={2}>
        <DateAndTime datetime={finishTime} />
        <VStack justifyContent={`flex-end`} alignItems={`flex-end`} pt={8}>
          <Icon as={FaRegStar} w={10} h={10} color={`orange.400`} p={0} />
          <Text fontSize={`md`} fontWeight={`bold`} color={`orange.400`}>
            Wait for Review
          </Text>
        </VStack>
      </VStack>
    </>
  );
};

const DoneStatus = ({ finishTime }) => {
  return (
    <>
      <VStack flex={2} alignItems={'flex-end'} p={2}>
        <DateAndTime datetime={finishTime} />
        <VStack justifyContent={`flex-end`} alignItems={`flex-end`} pt={8}>
          <Icon as={FaCheckCircle} w={10} h={10} color={`green.400`} p={0} />
          <Text fontSize={`2xl`} color={`green.400`}>
            All Done
          </Text>
        </VStack>
      </VStack>
    </>
  );
};

const CanceledStatus = ({ acceptedTime }) => {
  return (
    <>
      <VStack alignItems={`flex-end`}>
        <DateAndTime datetime={acceptedTime} />
        <VStack wrap={true} alignItems={`flex-end`} pt={8}>
          <Icon as={FaRegTimesCircle} w={9} h={9} color={`red.400`} />
          <Text fontSize={`lg`} fontWeight={`bold`} color={`red.400`}>
            Canceled
          </Text>
        </VStack>
      </VStack>
    </>
  );
};
export default JobStatus;
