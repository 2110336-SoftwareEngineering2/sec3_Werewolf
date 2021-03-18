import React from "react";

import { Flex, VStack, Image,Text} from '@chakra-ui/react';
import FlexBox from '../../shared/FlexBox';

const Verification = () => {
    return(<Flex bg="brandGreen" align="center" justify="center" minH="100vh">
        <FlexBox>
            <VStack
                spacing="3"
                mb="5"
                minHeight={{sm:"75vh",md:"70vh"}}
                justifyContent="center"
            >
                <Image src="/assets/images/mail.png" alt="verification email" mb="2" boxSize="10rem" />
                <Text fontSize="xl">A verfication email has been sent</Text>
                <Text fontSize="sm" color="gray">Please follow the verification link provided in your email</Text>
            </VStack>
        </FlexBox>
    </Flex>)
}

export default Verification;