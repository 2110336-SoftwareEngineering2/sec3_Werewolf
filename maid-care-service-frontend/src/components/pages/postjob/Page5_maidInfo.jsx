import React, { useState, useEffect } from 'react';

import { maid, user, job } from '../../../api';
import profileImage from './Image/profileImage.png';
import { VStack, Text, HStack, Box, chakra } from '@chakra-ui/react';
import StarRating from './components/StarRating.jsx';
import AlertButton from './components/AlertButton.jsx';

const Page5_maidInfo = ({ setSteps, maidId, jobId, setConfirm }) => {
  var d = new Date();
  const [maidInfo, setMaidInfo] = useState();
  const [userInfo, setUserInfo] = useState();

  const handleIncrement = () => {
    setSteps(previousStep => previousStep + 1);
  };

  const getUserInfo_API = () => {
    user
      .get(`/${maidId}`, {
        timeout: 5000,
      })
      .then(response => {
        console.log('get user/{uid} : ', response);
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getMaidInfo_API = () => {
    maid
      .get(`/${maidId}`, {
        timeout: 5000,
      })
      .then(response => {
        console.log('get maid/{uid} : ', response);
        setMaidInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const customerConfirm_API = () => {
    job
      .put(`/${jobId}/customer-confirm`)
      .then(response => {
        console.log('put job/{jobId}/customer-confirm : ', response);
        handleIncrement();
        setConfirm('true');
      })
      .catch(error => {
        console.error(error);
        setConfirm('fail');
      });
  };

  const customerCancel_API = () => {
    job
      .put(`/${jobId}/customer-cancel`)
      .then(response => {
        console.log('put job/{jobId}/customer-cancle: ', response);
        handleIncrement();
        setConfirm('false');
      })
      .catch(error => {
        console.error(error);
        setConfirm('fail');
      });
  };

  const testHandle = () => {
    console.log('Cancel');
  };

  useEffect(() => {
    getUserInfo_API();
    getMaidInfo_API();
  }, []);

  return (
    <HStack width="600px" height="300px">
      <VStack justifyContent="center" width="200px" height="100%">
        <chakra.img src={profileImage} width="200px" />
        <StarRating
          rating={maidInfo == null ? 0 : maidInfo.avgRating == null ? 0 : maidInfo.avgRating}
        />
        <Text>
          {maidInfo == null ? 0 : maidInfo.avgRating == null ? 0 : maidInfo.avgRating}/5 from{' '}
          {maidInfo == null ? 0 : maidInfo.totalReviews} reviews
        </Text>
      </VStack>
      <Box width="400px" height="100%">
        <Text mb="20px" fontWeight="bold">
          Maid Profile
        </Text>
        <Text>
          {userInfo == null ? '' : userInfo.firstname} {userInfo == null ? '' : userInfo.lastname}
        </Text>
        <Text>
          {d.getFullYear() -
            (userInfo == null
              ? d.getFullYear()
              : parseInt(userInfo.birthdate.substring(0, 4)))}{' '}
          years old
        </Text>
        <Box mt="10px" bg="white" width="100%" height="150px" fontSize="12px" overflow="hidden">
          {maidInfo == null ? '' : maidInfo.note}
        </Box>
        <AlertButton
          mainbtnName="Confirm"
          mainbtnColor="buttonGreen"
          lbtnName="Cancel"
          rbtnName="Confirm"
          headerText="Do you want to confirm ?"
          bodyText="We will send confirmation message to your maid."
          lbtnFunction={testHandle}
          rbtnFunction={customerConfirm_API}
        />
        <AlertButton
          mainbtnName="Cancel"
          mainbtnColor="red"
          lbtnName="Cancel"
          rbtnName="Confirm"
          headerText="Do you want to confirm ?"
          bodyText="We will send canceled message to your maid."
          lbtnFunction={testHandle}
          rbtnFunction={customerCancel_API}
        />
      </Box>
    </HStack>
  );
};

export default Page5_maidInfo;
