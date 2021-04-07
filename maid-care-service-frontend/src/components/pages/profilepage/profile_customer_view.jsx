import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, Stack, Button, Link, Text, Image, Center, Input } from '@chakra-ui/react';

import FlexBox from '../../shared/FlexBox';
import MaidLogo from '../../../MaidLogo.svg';
import ProfilePic from './Pic.svg';
import { useStores } from '../../../hooks/use-stores';
import { Link as ReactLink } from 'react-router-dom';
import { SingleImageStore } from '../../../store/Image';
import { reaction } from 'mobx';
import { user } from '../../../api';

const ProfilePage = observer(() => {
  const { userStore } = useStores();
  const [userInfo, setUser] = useState(false); //general user info i.e. name
  const uploadRef = useRef();

  const [imageStore] = useState(new SingleImageStore());

  useEffect(() => {
    if (userStore && userStore.userData) {
      setUser(userStore.userData);
    }
  }, [userStore.userData]);

  // calculate age by year
  const age = (DOB) => {
    return new Date().getFullYear() - new Date(DOB).getFullYear();
  };

  const handleUploadClick = () => {
    uploadRef.current.focus();
    uploadRef.current.click();
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      imageStore.upload(file);
      console.log('image uploading...');
      reaction(
        () => imageStore.isUploading,
        async (value, prevValue, reaction) => {
          console.log('reaction');
          if (prevValue && !value) {
            // setUser((prev) => ({ ...prev, profilePicture: imageStore.path }));
            try {
              const { data: info } = await user.put('/update-profile', {
                profilePicture: imageStore.path,
              });
              await userStore.getUserData();
            } catch (error) {
              console.error(error);
            }
          }
        },
        { delay: 1000 }
      );
    } catch (error) {
      console.error(error);
    }
  };

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
            <Box onClick={handleUploadClick} borderRadius={`50%`} overflow={`hidden`}>
              {userInfo && userInfo.profilePicture ? (
                <Image width="12rem" height="12rem" src={userInfo.profilePicture} />
              ) : (
                // Placeholder
                <Image width="12rem" height="12rem" src={ProfilePic} />
              )}
              <Input
                type="file"
                accept="image/*"
                ref={uploadRef}
                display="none"
                onChange={handleUpload}
              />
            </Box>

            <Stack spacing={4}>
              <Box fontSize="xl">{userInfo.firstname + ' ' + userInfo.lastname}</Box>
              <Box fontSize="md">{age(userInfo.birthdate) + ' years old'}</Box>
              <Box fontSize="md">{userInfo.email}</Box>
              <Button bg="buttonGreen" color="white">
                <Link as={ReactLink} to="/workspace">
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
