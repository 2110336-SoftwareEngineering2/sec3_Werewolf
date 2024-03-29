import * as React from 'react';
import { Flex } from '@chakra-ui/react';

const FlexBox = ({ children }) => (
  <Flex
    py="8"
    px={{ base: '8', md: '12' }}
    my="6"
    mx="3"
    minWidth={{ base: '50vw', md: '30vw' }}
    height="fit-content"
    bg="boxWhite"
    borderRadius="24px"
    boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)">
    {children}
  </Flex>
);

export default FlexBox;
