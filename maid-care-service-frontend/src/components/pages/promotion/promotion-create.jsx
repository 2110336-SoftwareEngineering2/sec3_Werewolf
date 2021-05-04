import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { promotion } from '../../../api';
import { useHistory } from 'react-router-dom';

import PromotionForm from './components/PromotionForm';

const PromotionCreate = () => {
  const history = useHistory();

  const handleSubmit = (
    { code, description, discountRate, startDate, endDate },
    { setSubmitting, resetForm }
  ) => {
    setSubmitting(true);
    /**Start handle Submit logic here */
    promotion
      .post('/', {
        code: code,
        description: description,
        discountRate: discountRate,
        availableDate: startDate,
        expiredDate: endDate,
      })
      .then((response) => {
        console.log(response);
        setSubmitting(false);
        resetForm();

        history.replace('/promotion'); // Go to promotion page
      })
      .catch((error) => {
        console.error(error);
        setSubmitting(false);
      });
    /**End handle Submit logic here */
    setSubmitting(false);
  };
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
        <PromotionForm onSubmit={handleSubmit} />
      </Flex>
    </Flex>
  );
};

export default PromotionCreate;
