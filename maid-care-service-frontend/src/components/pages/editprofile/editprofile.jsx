import React from "react";
import {
  Box,
  Flex,
  Stack,
  VStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";

import FlexBox from "../../shared/FlexBox";
import MaidLogo from "../../../MaidLogo.svg";

export const EditProfile = () => {
  
  
  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing="3">
          <Stack direction="row">
            <Image
                width="146px"
                height="41.48px"
                objectFit="contain"
                src={MaidLogo}
                alt="Grab MaidCare Logo"
            />
          </Stack>
          <Box fontSize="3xl" fontWeight="bold" mb="5">Edit Your Profile</Box>
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default EditProfile;