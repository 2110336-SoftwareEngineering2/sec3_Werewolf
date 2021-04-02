import React from 'react';
import { Box, Text, Flex, Container, Textarea, VStack } from '@chakra-ui/react';
import ReviewForm from './components/ReviewForm.jsx'

const Review = () => {

  return (
    <Flex
      direction="column"
      minH={`100vh`}
      bgColor="gray.300"
      padding={'20vh'}
      justifyContent="flex-start"
      alignItems="center">
      <Container borderRadius={4} bgColor="gray.100" p={6} w={`70vw`} maxW={1200}>
        <ReviewForm />
      </Container>
    </Flex>
  );
};

export default Review;
