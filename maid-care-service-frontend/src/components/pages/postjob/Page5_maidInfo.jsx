import React, { useState, useEffect } from 'react';

import { maid, user } from '../../../api';
import profileImage from './Image/profileImage.png';
import { VStack, Text, HStack, Box, chakra } from '@chakra-ui/react';
import StarRating from './components/StarRating.jsx';

const Page5_maidInfo = ({ maidId }) => {
  var d = new Date();
  const [maidInfo, setMaidInfo] = useState();
  const [userInfo, setUserInfo] = useState();

  const getMaidInfo_user = () => {
    user
      .get(`/${maidId}`, {
        timeout: 5000,
      })
      .then(response => {
        console.log('User : ', response);
        setMaidInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getMaidInfo_maid = () => {
    maid
      .get(`/${maidId}`, {
        timeout: 5000,
      })
      .then(response => {
        console.log('Maid : ', response);
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    getMaidInfo_user();
    getMaidInfo_maid();
  }, []);

  return (
    <HStack width="600px" height="300px" >
      <VStack justifyContent="center" width="200px" height="100%">
        <chakra.img src={profileImage} width="200px" />
        <HStack>
          <StarRating rating={ maidInfo == null ? 0 : maidInfo.avgRating == null ? 0 : maidInfo.avgRating }/>
        </HStack>
      </VStack>
      <Box width="400px" height="100%">
        <Text mb="20px" fontWeight="bold">
          Maid Profile
        </Text>
        <Text>
          {maidInfo == null ? '' : maidInfo.firstname} {maidInfo == null ? '' : maidInfo.lastname}
        </Text>
        <Text>
          {d.getFullYear() -
            (maidInfo == null
              ? d.getFullYear()
              : parseInt(maidInfo.birthdate.substring(0, 4)))}{' '}
          years old
        </Text>
        <Box 
        mt="10px"
        bg="white" 
        width="100%" 
        height="150px"
        fontSize="12px"
        overflow="hidden"
        >
          {userInfo == null ? "" : userInfo.note}
        </Box>
      </Box>
    </HStack>
  );
};

export default Page5_maidInfo;
