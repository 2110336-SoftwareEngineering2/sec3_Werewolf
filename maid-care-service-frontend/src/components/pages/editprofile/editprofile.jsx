import React from "react";
import {
  Box,
  Flex,
  VStack,
  Image,
} from "@chakra-ui/react";

import FlexBox from "../../shared/FlexBox";
import MaidLogo from "../../../MaidLogo.svg";
import ProfileForm from "./ProfileForm.jsx";

export const EditProfile = () => {
  
  
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
          <Box fontSize="3xl" fontWeight="bold" mb="5">Edit Your Profile</Box>
          <ProfileForm/>
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default EditProfile;