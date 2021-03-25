import React, { useState, useEffect } from 'react';

import { Formik, Form, useFormikContext, Field } from 'formik';
import { maid, user } from '../../../api';
import profileImage from './Image/profileImage.png';
import { useStores } from '../../../hooks/use-stores';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ButtonField from './ButtonField.jsx';
import Page1_TaskDescription from './Page1_TaskDescription.jsx';
import Page2Page3_calculatePrice from './Page2_3_calculatePrice.jsx';
import { VStack, Text, HStack, Box, chakra } from '@chakra-ui/react';

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
    <HStack width="600px" height="300px" border="2px">
      <Box justifyContent="center" width="200px" height="100%">
        <chakra.img src={profileImage} width="200px" />
      </Box>
      <Box width="400px" height="100%" border="1px">
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
