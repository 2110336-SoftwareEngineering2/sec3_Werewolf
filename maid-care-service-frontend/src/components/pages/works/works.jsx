import { Box, Container, Flex, Heading, VStack } from '@chakra-ui/layout';
import React, { useState, useEffect } from 'react';

const WorksPage = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    setWorks([{}, {}, {}]);
  }, []);

  return (
    <Flex
      direction="column"
      bgColor="gray.300"
      h="100vh"
      justifyContent="center"
      alignItems="center">
      <Container borderRadius={4} bgColor="gray.100" p={6} w={`70vw`} maxW={1200}>
        <Heading>Works</Heading>
        <VStack>
          {works.map((work, idx) => {
            return <Box key={idx}>{`Work ${idx}`}</Box>;
          })}
        </VStack>
      </Container>
    </Flex>
  );
};

export default WorksPage;
