import React from 'react';
import { Text, Box,Flex} from '@chakra-ui/react';
import {CheckField} from '../../shared/FormikField';

const CapabalityJob = () => {
  const choices = ['House Cleaning', 'Dish Washing', 'Laundry', 'Gardening', 'Decluttering'];
  return (
    <Flex flexDir="column" justify="left" width="100%">
      <Box fontSize="1xl" mb="10px">
        <Text fontWeight="bold">Capability Job(s)</Text>
      </Box>
        {choices.map((c,index) => {
          return(
            <Box marginBottom="2" key={index}><CheckField name="jobs" label={c} value={c} /></Box>)
        })}
    </Flex>
  );
};

export default CapabalityJob;
