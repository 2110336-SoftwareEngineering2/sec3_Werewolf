import React, { useState } from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Flex,
  VStack,
  Button,
  HStack,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';
import { values } from 'mobx';

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
        isDishes: false,
        amountOfDishes: '',
        areaOfRooms: '',
        amountOfClothes: '',
      }}
      validationSchema={yup}
      onSubmit={handleSubmit}>
    <Form>
      <div>{JSON.stringify(values,null, 4)}</div>
        <VStack spacing="4" width={{ sm: '72', md: '96' }}>
          {form()}
        </VStack>
      </Form>
    </Formik>
  );
};

const Page1 = () => {
  const [isDishesinputDisable, setDishesinputDisable] = useState(true);
  const [isAreainputDisable, setAreainputDisable] = useState(true);
  const [isClothinputDisable, setClothinputDisable] = useState(true);

  const handleDishesinputDisable = () => {
    isDishesinputDisable == true ? setDishesinputDisable(false) : setDishesinputDisable(true);
  };
  const handleAreainputDisable = () => {
    isAreainputDisable == true ? setAreainputDisable(false) : setAreainputDisable(true);
  };

  const handleClothinputDisable = () => {
    isClothinputDisable == true ? setClothinputDisable(false) : setClothinputDisable(true);
  };

  return (
    <>
      <Form>
        <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
          <FormLabel mb="0">Location</FormLabel>
          <Select name="location">
            <option value="" selected>
              Select your workplace location
            </option>
            {}
          </Select>
        </FormControl>
        <FormLabel mb="5px">Type of Work</FormLabel>
        <FormControl id="dishes" width={{ sm: '270px', md: '368px' }}>
          <Checkbox value="" onChange={handleDishesinputDisable}>
            Dish Washing
          </Checkbox>
          <TextInputField
            label=""
            name="amountOfDishes"
            placeHolder="Amount of dishes (e.g. 20)"
            isDisabled={isDishesinputDisable}
          />
        </FormControl>
        <FormControl id="rooms" width={{ sm: '270px', md: '368px' }}>
          <Checkbox onChange={handleAreainputDisable}>Room Cleaning</Checkbox>
          <TextInputField
            label=""
            name="areaOfRooms"
            placeHolder="Amount of the room in square meter (e.g. 100)"
            isDisabled={isAreainputDisable}
          />
        </FormControl>
        <FormControl id="clothes" width={{ sm: '270px', md: '368px' }}>
          <Checkbox onChange={handleClothinputDisable}>Clothes Ironing</Checkbox>
          <TextInputField
            label=""
            name="amountOfClothes"
            placeHolder="Amount of clothes (e.g. 10)"
            isDisabled={isClothinputDisable}
          />
        </FormControl>
      </Form>
    </>
  );
};

export default PostjobForm;
