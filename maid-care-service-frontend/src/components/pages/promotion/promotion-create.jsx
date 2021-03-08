import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import PromotionForm from './components/PromotionForm';

const PromotionCreate = () => {
  return (
    <Flex height="100%" justifyContent="center" alignItems="center">
      <Flex
        width={{
          sm: '100%',
          md: '80%',
          lg: '60%',
        }}
        flexDirection="column"
        py="8"
        px={{ base: '8', md: '12' }}
        bg="boxWhite"
        borderRadius="24px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)">
        <Text mb="2" align="center" fontSize={32} fontWeight="extrabold">
          Promotion Publish
        </Text>
        <PromotionForm />
      </Flex>
    </Flex>
  );
};

export default PromotionCreate;
