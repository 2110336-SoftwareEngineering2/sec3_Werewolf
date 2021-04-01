import Icon from '@chakra-ui/icon';
import { HStack, Spacer, Text, VStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaCheckCircle, FaClock } from 'react-icons/fa';
import { CONFIRMED, DONE, MATCHED, POSTED } from '../../../../constants/post-state';

const JobStatus = ({ job }) => {
  const { state, expiryTime, finishTime } = job;

  return state === MATCHED ? (
    <>
      <HStack wrap={true}>
        <Icon as={FaCheckCircle} w={6} h={6} />
        <Text fontSize={`lg`} fontWeight={`bold`}>
          Matched
        </Text>
      </HStack>
    </>
  ) : state === CONFIRMED ? (
    <InProgressStatus />
  ) : state === DONE ? (
    <DoneStatus finishTime={finishTime} />
  ) : state === POSTED ? (
    <CounterStatus expiryTime={expiryTime} />
  ) : (
    <Text fontSize={`lg`} fontWeight={`bold`}>
      No status
    </Text>
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
      <HStack>
        <Icon as={FaClock} w={6} h={6} />
        <Text fontSize={`lg`} fontWeight={`bold`}>
          {remainingTime}
        </Text>
      </HStack>
    </>
  );
};

const InProgressStatus = ({ acceptedTime }) => {
  return (
    <>
      <Text fontSize={`lg`}>{new Date().toDateString()}</Text>
      <Text>{new Date(acceptedTime).toTimeString().slice(0, 8)}</Text>
      <HStack wrap={true}>
        <Icon as={FaCalendarCheck} w={6} h={6} />
        <Text fontSize={`lg`} fontWeight={`bold`}>
          Confirmed
        </Text>
      </HStack>
      <VStack>
        <Text fontSize={`xl`}>{new Date().toDateString()}</Text>
        <Text>{new Date().toTimeString()}</Text>
      </VStack>
    </>
  );
};

const DoneStatus = ({ finishTime }) => {
  return (
    <>
      <VStack flex={2} alignItems={'flex-end'} p={2}>
        <Text fontSize={`lg`}>{new Date().toDateString()}</Text>
        <Text>{new Date(finishTime).toTimeString().slice(0, 8)}</Text>

        <HStack justifyContent={`flex-end`} alignItems={`center`} pt={8}>
          <Icon as={FaCheckCircle} w={8} h={8} color={`green.400`} p={0} />
          <Text fontSize={`2xl`} fontWeight={`bold`}>
            Done
          </Text>
        </HStack>
      </VStack>
    </>
  );
};

export default JobStatus;
