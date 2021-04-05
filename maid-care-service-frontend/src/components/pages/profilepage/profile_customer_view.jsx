import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, Stack, Button, Link, Text, Image, Center } from '@chakra-ui/react';

import FlexBox from '../../shared/FlexBox';
import MaidLogo from '../../../MaidLogo.svg';
import ProfilePic from './Pic.svg';
import { fetchUserById } from '../../../api/user';
import { useStores } from '../../../hooks/use-stores';

export const ProfilePage = observer(() => {
  const { userStore } = useStores();
  const [userInfo, setUser] = useState(false); //general user info i.e. name

  useEffect(() => {
    if (userStore && userStore.userData) {
      const userID = userStore.userData._id;
      fetchUserById(userID)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userStore.userData]);

  // calculate age by year
  const age = (DOB) => {
    return(new Date().getFullYear() - new Date(DOB).getFullYear())
  }

  //toggle status

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <Stack spacing={5}>

          <Image
            width="9rem"
            height="2.5rem"
            objectFit="contain"
            src={MaidLogo}
            alt="Grab MaidCare Logo"
          />

          <Center>
          <Text fontSize="2xl" fontWeight="bold">
            Profile
          </Text>
          </Center>

          <Stack spacing={14} direction={['column', 'row']}>

            <Image width="12rem" height="12rem" src={ProfilePic} />

            <Stack spacing={4}>

              <Box fontSize="xl">{userInfo.firstname + ' ' + userInfo.lastname}</Box>
              <Box fontSize="md">{age(userInfo.birthdate) + " years old"}</Box>
              <Box fontSize="md">{userInfo.email}</Box>
              <Button bg="buttonGreen" color="white">
                <Link href="/workspace">
                  Add Workspace
                </Link>
              </Button>

            </Stack>

          </Stack>
        </Stack>
      </FlexBox>
    </Flex>
  );
});

export default ProfilePage;
