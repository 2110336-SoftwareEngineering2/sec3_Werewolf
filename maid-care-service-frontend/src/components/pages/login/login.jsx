import React from "react";
import {
  Box,
  Flex,
  VStack,
  Link,
  Text,
} from "@chakra-ui/react";

import FlexBox from "../../shared/FlexBox";
import LogInForm from "./LogInform.jsx";

export const LogIn = () => {
  
  
  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing="3">
          <Box fontSize="3xl" mb="5">
            Grab
            <br />
            Maidcare
          </Box>
          <LogInForm/>
          <Link fontSize={{base:"sm",md:"md"}}>Forgot password</Link>
          <Text fontSize={{base:"sm",md:"md"}} mb="16">Want to be maid? {" "}
            <Link color="#38A169">Create Account Here</Link>
          </Text>
        </VStack>
      </FlexBox>
    </Flex>
  );
};

export default LogIn;