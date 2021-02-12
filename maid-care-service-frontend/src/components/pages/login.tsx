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
        <VStack spacing="20x">
          <Box fontSize="3xl" mb="30px">
            Grab
            <br />
            Maidcare
          </Box>
          
          <VStack spacing="20px">
          <FormControl id="email">
            <FormLabel mb="0">Email address</FormLabel>
            <Input type="email" placeholder="email address" className="formField"/>
          </FormControl>

          <FormControl id="password" width={{sm:"270px",md:"368px"}}>
            <FormLabel mb="0">Password</FormLabel>
            <InputGroup>
            <Input type={showPW? "text":"password"} placeholder="password" className="formField"/>
            <InputRightElement width="4rem">
              <Link color="gray.500" fontWeight="700" onClick={() => {setShowPW(!showPW)}} >{showPW? "hide":"show"}</Link>
            </InputRightElement>
            </InputGroup>
          </FormControl>
          </VStack>
          <Center>
            <Button boxShadow="xl" className="button" mt="25px" mb="10px" bg="buttonGreen">
              Log In
            </Button>
          </Center>
          <Link fontSize={{base:"sm",md:"md"}}>Forgot password</Link>
          <Text fontSize={{base:"sm",md:"md"}} mb="60px">Want to be maid? {" "}
            <Link color="#38A169">Create Account Here</Link>
          </Text>
        </VStack>
      </FlexBox>
    </Flex>
  );
};
