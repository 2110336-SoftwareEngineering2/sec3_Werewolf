import React,{useState} from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Center,
  Button,
  Link,
  Text,
} from "@chakra-ui/react";

import FlexBox from "../shared/FlexBox";

export const LogIn = () => {
  
  const [showPW,setShowPW] = useState(false)

  return (
    <Flex bg="brandGreen" align="center" justify="center" minH="100vh">
      <FlexBox>
        <VStack spacing="3">
          <Box fontSize="3xl" mb="5">
            Grab
            <br />
            Maidcare
          </Box>
          
          <VStack spacing="4">
          <FormControl id="email">
            <FormLabel mb="0">Email address</FormLabel>
            <Input type="email" placeholder="email address" className="formField"/>
          </FormControl>

          <FormControl id="password" width={{sm:"72",md:"96"}}>
            <FormLabel mb="0">Password</FormLabel>
            <InputGroup>
            <Input type={showPW? "text":"password"} placeholder="password" className="formField"/>
            <InputRightElement width="16">
              <Link color="gray.500" fontWeight="700" onClick={() => {setShowPW(!showPW)}} >{showPW? "hide":"show"}</Link>
            </InputRightElement>
            </InputGroup>
          </FormControl>
          </VStack>
          <Center>
            <Button boxShadow="xl" className="button" mt="6" mb="0.75" bg="buttonGreen">
              Log In
            </Button>
          </Center>
          <Link fontSize={{base:"sm",md:"md"}}>Forgot password</Link>
          <Text fontSize={{base:"sm",md:"md"}} mb="16">Want to be maid? {" "}
            <Link color="#38A169">Create Account Here</Link>
          </Text>
        </VStack>
      </FlexBox>
    </Flex>
  );
};
