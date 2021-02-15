import * as React from 'react';
import { Flex } from '@chakra-ui/react';

const FlexBox = ({ children }) => (
  <Flex
    py="30px"
    px={{ base: '30px', md: '50px' }}
    bg="boxWhite"
    borderRadius="24px"
    boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)"
    align="center"
    justify="center">
    {children}
  </Flex>
);

export default FlexBox;
