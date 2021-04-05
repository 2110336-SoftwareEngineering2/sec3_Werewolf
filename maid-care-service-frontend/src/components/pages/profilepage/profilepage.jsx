import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
<<<<<<< Updated upstream
import { Box, Flex, Stack, VStack, HStack, Text, Image, Center, Switch } from '@chakra-ui/react';
||||||| constructed merge base
import { Box, Flex, Stack, VStack, HStack, Text, Image, Switch } from '@chakra-ui/react';
=======
import {
  Box,
  Flex,
  Stack,
  VStack,
  HStack,
  Text,
  Image,
  Switch,
  Button,
  Link,
} from '@chakra-ui/react';
>>>>>>> Stashed changes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< Updated upstream
import {setAvailability} from '../../../api/maid';
import { faStar, faStarHalf, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
||||||| constructed merge base
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import {setAvailability} from '../../../api/maid';
=======
import { faPencilAlt, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { setAvailability } from '../../../api/maid';
>>>>>>> Stashed changes

import FlexBox from '../../shared/FlexBox';
import MaidLogo from '../../../MaidLogo.svg';
import ProfilePic from './Pic.svg';
import { fetchMaidById } from '../../../api/maid';
import { useStores } from '../../../hooks/use-stores';

export const ProfilePage = observer(() => {
  const { userStore } = useStores();
  const [userInfo, setUser] = useState(false); //general user info i.e. name
  const [maidInfo, setMaid] = useState(false); // maid info i.e. review score
  const [avail, setAvail] = useState(false);

  useEffect(() => {
    if (userStore && userStore.userData) {
      const userID = userStore.userData._id;
      setUser(toJS(userStore.userData));
      fetchMaidById(userID)
        .then((res) => {
          setMaid(res.data);
          setAvail(maidInfo.availability);
          console.log(maidInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userStore.userData]);

  // generate star icons per review score
  const stars = (score) => {
    if (score && score !== 0) {
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
    } else if (score === 0) {
      return (
        <HStack spacing={0.5}>
          <FontAwesomeIcon icon={faStar} color="#DCDCDC" />
        </HStack>
      );
    } else {
      return <Text>--- No Review ----</Text>;
    }
  };

  // calculate age by year
  const age = (DOB) => {
    return new Date().getFullYear() - new Date(DOB).getFullYear();
  };

  //toggle status

  const onToggleStatus = () => {
    setAvailability(!avail)
      .then((res) => {
        setAvail(res.data.availability);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        window.confirm('Sorry, cannot change your status right now. Please try again later');
      });
  };

  function Skill({ title, can }) {
    return (
      <HStack spacing={2}>
        {can == true ? (
          <FontAwesomeIcon icon={faCheckCircle} color="#48BB78"/>
        ) : ( <FontAwesomeIcon icon={faTimesCircle} color="#E53E3E"/> ) }        
        <Text fontSize="lg"> {title} </Text>
      </HStack>      
    );
  }

  const skillChart = () => {
    return (
      <Stack spacing={2.5}>
        <Box fontSize="xl" fontWeight="bold">I can do:</Box>
        <Skill title="Dish Washing" can={true}/>
        <Skill title="Clothes Ironing" can={true}/>
        <Skill title="Room Cleaning" can={false}/>
      </Stack>
    );
  };

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh" maxW="100vw">
      <FlexBox>
<<<<<<< Updated upstream
        <Stack spacing={5}>

||||||| constructed merge base
        <VStack spacing={4}>

=======
        <VStack spacing={4}>
>>>>>>> Stashed changes
          <Image
            width="9rem"
            height="2.5rem"
            objectFit="contain"
            src={MaidLogo}
            alt="Grab MaidCare Logo"
          />
<<<<<<< Updated upstream

          <Center>
          <Text fontSize="2xl" fontWeight="bold">
||||||| constructed merge base
          <Text fontSize="2xl" fontWeight="bold" mb="5">
=======

          <Text fontSize="2xl" fontWeight="bold" mb="5">
>>>>>>> Stashed changes
            Maid Profile
          </Text>
          </Center>

          <Flex w="100%" justify={{ base: 'center', md: 'flex-end' }}>
            <Button bg="buttonGreen" color="white">
              <Link href="/profile/edit">
                <FontAwesomeIcon icon={faPencilAlt} /> Edit Profile
              </Link>
            </Button>
          </Flex>

          <Stack spacing={14} direction={['column', 'row']}>
            // Left Stack for profile pic and rating
            <VStack spacing={4} justify="center">
              <Image width="12rem" height="12rem" src={ProfilePic} />

              {stars(maidInfo.avgRating)}
              <Text>{maidInfo.avgRating ? maidInfo.avgRating + '/5 from 42 reviews' : null}</Text>
            </VStack>
            // Right Stack for information
            <Stack spacing={4}>
              <HStack justifyContent="space-between" width="100%">
                <Box fontSize="xl">{userInfo.firstname + ' ' + userInfo.lastname}</Box>

                {/*status */}
                <HStack spacing="2">
                  <Text>Status: {avail ? 'On' : 'Off'}</Text>
                  <Switch size="md" onChange={onToggleStatus} isChecked={avail} />
                </HStack>
              </HStack>

              <Box fontSize="md">{age(userInfo.birthdate) + ' years old'}</Box>

              <Box w={['80vw', '30vw']} bg="White" p={6}>
                <Text fontSize="md">{maidInfo.note}</Text>
              </Box>

              {skillChart()}
              
            </Stack>
          </Stack>
        </Stack>
      </FlexBox>
    </Flex>
  );
});

export default ProfilePage;
