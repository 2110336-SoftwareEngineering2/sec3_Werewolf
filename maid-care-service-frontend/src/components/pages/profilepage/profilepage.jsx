import React, { useState, useEffect } from 'react';
import {toJS} from 'mobx';
import { observer } from 'mobx-react-lite';
import { Box, Flex, Stack, VStack, HStack, Text, Image, Switch } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import {setAvailability} from '../../../api/maid';

import FlexBox from '../../shared/FlexBox';
import MaidLogo from '../../../MaidLogo.svg';
import ProfilePic from './Pic.svg';
import { fetchUserById} from '../../../api/user';
import {fetchMaidById} from '../../../api/maid'
import { useStores } from '../../../hooks/use-stores';

export const ProfilePage = observer(() => {
  const { userStore } = useStores();
  const [userInfo, setUser] = useState(false); //general user info i.e. name
  const [maidInfo, setMaid] = useState(false); // maid info i.e. review score
  const [avail, setAvail] = useState(false);

  useEffect(() => {
    if (userStore && userStore.userData) {
      const userID = userStore.userData._id;
      setUser(toJS(userStore.userData))
      fetchMaidById(userID)
      .then((res) => {
        setMaid(res.data);
        setAvail(maidInfo.availability)
        console.log(maidInfo)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }, [userStore.userData, maidInfo]);

  // generate star icons per review score
  const stars = (score) => {

    if(score && score !== 0){
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
    }
    else if(score === 0){
      return(
        <HStack spacing={0.5}>
        <FontAwesomeIcon icon={faStar} color="#DCDCDC" />
      </HStack>
      )
    }
    else{
      return(<Text>--- No Review ----</Text>)
    }
  };

  // calculate age by year
  const age = (DOB) => {
    return(new Date().getFullYear() - new Date(DOB).getFullYear())
  }

  //toggle status

  const onToggleStatus = () => {
      setAvailability(!avail)
      .then((res) => {
        setAvail(res.data.availability)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
        window.confirm("Sorry, cannot change your status right now. Please try again later")
      })
  }

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

              {stars(maidInfo.avgRating)}
              <Text>{maidInfo.avgRating? maidInfo.avgRating+"/5 from 42 reviews" : null}</Text>

            </VStack>
            // Right Stack for information
            <Stack spacing={4}>

              <HStack justifyContent="space-between" width="100%">
                <Box fontSize="xl">{userInfo.firstname + ' ' + userInfo.lastname}</Box>

                {/*status */} 
                <HStack spacing="2">
                  <Text>Status: {avail ? 'On': 'Off'}</Text>
                  <Switch size="md" onChange={onToggleStatus} isChecked={avail} />
                </HStack>

              </HStack>

              <Box fontSize="md">{age(userInfo.birthdate) + " years old"}</Box>

              <Box w={['80vw', '30vw']} bg="White" p={6}>
                <Text fontSize="md">
                  {maidInfo.note}
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
