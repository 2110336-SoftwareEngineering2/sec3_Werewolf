import React from "react";
import {
  Box,
  Flex,
  Stack,
  VStack,
  HStack,
  Text,
  Image,
} from "@chakra-ui/react";

import FlexBox from "../../shared/FlexBox";
import MaidLogo from "../../../MaidLogo.svg";
import ProfilePic from "./Pic.svg";

export const ProfilePage = () => {
  
  
  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing={4}>
          <Image
                width="146px"
                height="41.48px"
                objectFit="contain"
                src={MaidLogo}
                alt="Grab MaidCare Logo"
            />
          <Box fontSize="3xl" fontWeight="bold" mb="5">Maid Profile</Box>
          <HStack spacing={16}>
            // Left Stack for profile pic and rating 
            <Stack spacing={4}>
              <Image
                    width="250px"
                    height="250px"
                    src={ProfilePic}
              />
            </Stack>
            // Right Stack for information
            <Stack spacing={4}>
              <Box fontSize="2xl" >Mrs. Somying Yingsom</Box>
              <Box fontSize="2xl" >42 years old</Box>
              <Box w="500px" h="200px" bg="White" p={5}>
                <Text fontSize="xl">Bio xxxx</Text>
              </Box>
            </Stack>
          </HStack>
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default ProfilePage;