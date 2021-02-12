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
import { createBreakpoints } from "@chakra-ui/theme-tools"


export const LogIn = () => {
  
  const [showPW,setShowPW] = useState(false)

  return (
    <Flex bg="#48BB78" align="center" justify="center" minH="100vh">
      <Flex
        py="20px"
        px={{base:"30px",md:"55px"}}
        bg="#F7FAFC"
        borderRadius="24px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)"
        align="center"
        justify="center"
      >
        <VStack spacing="10px">

          <Box fontSize="xl" marginBottom="40px">
            Grab
            <br />
            Maidcare
          </Box>

          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" placeholder="email address"/>
          </FormControl>

          <FormControl id="password" width={{sm:"270px",md:"370px"}}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={showPW? "text":"password"} placeholder="password"/>
            <InputRightElement width="4rem">
              <Link color="gray.500" onClick={() => {setShowPW(!showPW)}} >{showPW? "hide":"show"}</Link>
            </InputRightElement>
            </InputGroup>
          </FormControl>

          <Box height="20px" />
          <Center>
            <Button bg="#38A169" color="white" width="103px" height="48px" boxShadow="xl" mb="10px">
              Log In
            </Button>
          </Center>
          <Link fontSize={{base:"sm",md:"md"}}>Forgot password</Link>
          <Text fontSize={{base:"sm",md:"md"}} mb="5vh">Want to be maid? {" "}
            <Link color="#38A169">Create Account Here</Link>
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
};
