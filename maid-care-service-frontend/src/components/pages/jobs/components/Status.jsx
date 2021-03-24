import Icon from '@chakra-ui/icon';
import { HStack, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import { MATCHED, POSTED } from '../../../../constants/post-state';

const JobStatus = ({ job: { state, expiryTime } }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  // Create Interval if Job Still NOT Matched
  useEffect(() => {
    if (state !== POSTED) return;
    const interval = setInterval(() => {
      const exp = new Date(expiryTime);
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
  }, [state, expiryTime]);

  return state === MATCHED ? (
    <>
      <HStack wrap={true}>
        <Icon as={FaCheckCircle} w={6} h={6} />
        <Text fontSize={`lg`} fontWeight={`bold`}>
          Matched
        </Text>
      </HStack>
    </>
  ) : (
    <>
      <Icon as={FaClock} />
      <Text fontSize={`lg`}>{remainingTime}</Text>
    </>
  );
};

export default JobStatus;
