import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, Stack, VStack, HStack, Text, Image } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';

import FlexBox from '../../shared/FlexBox';
import MaidLogo from '../../../MaidLogo.svg';
import ProfilePic from './Pic.svg';
import { fetchCurrentUser} from '../../../api/auth';
import {fetchMaidById} from '../../../api/maid'
import { useStores } from '../../../hooks/use-stores';

export const ProfilePage = observer(() => {
  const { userStore } = useStores();
  const [userInfo, setUser] = useState(false); //general user info i.e. name
  const [maidInfo, setMaid] = useState(false); // maid info i.e. review score

  useEffect(() => {
    if (userStore && userStore.userData) {
      const userID = userStore.userData._id;
      fetchCurrentUser(userID)
        .then((res) => {
          setUser(res.data);
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err);
        });

      fetchMaidById(userID)
      .then((res) => {
        setMaid(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }, [userStore.userData]);

  const stars = (score) => {
    return (
      <HStack spacing={0.5}>
        {Array(Math.floor(score))
          .fill()
          .map((e, i) => (
            <FontAwesomeIcon key={i} icon={faStar} color="#FFB800" />
          ))}
        {score - Math.floor(score) > 0 ? (
          <FontAwesomeIcon icon={faStarHalf} color="#FFB800" />
        ) : null}
      </HStack>
    );
  };

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing={4}>
          <Image
            width="9rem"
            height="2.5rem"
            objectFit="contain"
            src={MaidLogo}
            alt="Grab MaidCare Logo"
          />
          <Text fontSize="2xl" fontWeight="bold" mb="5">
            Maid Profile
          </Text>
          <Stack spacing={14} direction={['column', 'row']}>
            // Left Stack for profile pic and rating
            <VStack spacing={4} justify="center">
              <Image width="12rem" height="12rem" src={ProfilePic} />
              {stars(3.5)}
              <Text>5/5 from 42 reviews</Text>
            </VStack>
            // Right Stack for information
            <Stack spacing={4}>
              <Box fontSize="xl">Mrs. Sommutkuen Maisarbnamsakul</Box>
              <Box fontSize="md">42 years old</Box>
              <Box w={['80vw', '30vw']} bg="White" p={6}>
                <Text fontSize="lg">
                  Hi. I’m ok to do every job. But I prefer on ironing and I’m scared of roaches.
                  Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos. Nulla ut urna finibus, aliquam justo sit amet, posuere tortor. Etiam
                  posuere ultrices mi in placerat.
                </Text>
              </Box>
            </Stack>
          </Stack>
        </VStack>
      </FlexBox>
    </Flex>
  );
});

export default ProfilePage;