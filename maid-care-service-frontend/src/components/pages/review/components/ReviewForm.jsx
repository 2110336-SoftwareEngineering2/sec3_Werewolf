import React, { useState } from 'react';
import RatingStar from './RatingStar.jsx';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { VStack, Text, Textarea } from '@chakra-ui/react';

const ReviewForm = (props) => {
  const [rating, setRating] = useState(0);

  return (
    <Formik
      initialValues={{
        reviewText: '',
      }}
      >
      <Form style={{ width: '100%' }}>
        <VStack alignItems="left">
          <Text>Rate this job</Text>
          <RatingStar rating={rating} setRating={setRating} />
          <Text>Write a review for this job</Text>
          <Textarea name="reviewText" placeholder="Text here...." size="sm" />
        </VStack>
      </Form>
    </Formik>
  );
};

export default ReviewForm;
