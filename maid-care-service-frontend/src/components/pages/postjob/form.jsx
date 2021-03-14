import React from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Flex, VStack, Button, HStack, Checkbox, FormControl, FormLabel, Select, Text} from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';

const PostjobForm = props => {
  const yup = Yup.object({
    firstName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
    lastName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
    DOB: Yup.date().required('Required'),
    nationality: Yup.string(),
    citizenID: Yup.string().max(13, 'Citizen ID must be 13-digit long').required('Required'),
    bankAccount: Yup.string().max(10, 'Bank account must be 10-digit long').required('Required'),
  });

  const handleSubmit = values => {
    console.log(values);
  };

  const form = () => {
    if (props.steps === 1) {
      return <Page1 />;
    } else if (props.steps === 2) {
      return <div>step == 2</div>;
    }
  };

  return (
    <Formik
      initialValues={{
        amountOfDishes: '',
        areaOfRooms: '',
        amountOfClothes: '',
      }}
      validationSchema={yup}
      onSubmit={handleSubmit}>
      <Form>
        <VStack spacing="4" width={{ sm: '72', md: '96' }}>
          {form()}
        </VStack>
      </Form>
    </Formik>
  );
};

const Page1 = () => {
  return (
    <>
      <Form>
        <FormControl mb="20px"id="house-no" width={{ sm: '270px', md: '368px' }}>
          <FormLabel mb="0">Location</FormLabel>
          <Select name="location" >
          <option value="" selected>Select your workplace location</option>
          {}
          </Select>
        </FormControl>
        <FormLabel mb="5px">Type of Work</FormLabel>
        <FormControl id="city" width={{ sm: '270px', md: '368px' }}>
          <Checkbox defaultIsChecked>Dish Washing</Checkbox>
          <TextInputField label="" name="amountOfDishes" />
        </FormControl>
        <FormControl id="city" width={{ sm: '270px', md: '368px' }}>
          <Checkbox defaultIsChecked>Room Cleaning</Checkbox>
          <TextInputField label="" name="areaOfRooms" />
        </FormControl>
        <FormControl id="city" width={{ sm: '270px', md: '368px' }}>
          <Checkbox defaultIsChecked>Clothes Ironing</Checkbox>
          <TextInputField label="" name="amountOfClothes" />
        </FormControl>
      </Form>
    </>
  );
};

export default PostjobForm;
