import React, { useState } from 'react';

import { Formik, Form, useFormikContext, Field } from 'formik';
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
    } else if (props.steps === 2 || props.steps === 3) {
      return <Page2Page3 steps={props.steps} />;
    }
  };

  return (
    <Formik
      initialValues={{
        isDishes: false,
        isRooms: false,
        isClothes: false,
        amountOfDishes: '',
        areaOfRooms: '',
        amountOfClothes: '',
        promotionCode: '',
      }}
      validationSchema={yup}
      onSubmit={handleSubmit}>
      <Form>
        <div>{JSON.stringify(values, null, 4)}</div>
        <VStack spacing="4" width={{ sm: '72', md: '96' }}>
          {form()}
        </VStack>
      </Form>
    </Formik>
  );
};

const Page1 = () => {
  const { values } = useFormikContext();

  return (
    <>
      <Form>
        <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
          <FormLabel mb="0">Location</FormLabel>
          <Select name="location" mb="5px">
            <option value="" selected>
              Select your workplace location
            </option>
            {}
          </Select>
          <Button width="200px" className="button" bg="buttonGreen">
            Add your workspace
          </Button>
        </FormControl>
        <FormLabel mb="5px">Type of Work</FormLabel>
        <FormControl id="dishes" width={{ sm: '270px', md: '368px' }}>
          <HStack>
            <Field type="checkbox" name="isDishes"/>
            <Text>Dish Washing</Text>
          </HStack>
          <TextInputField
            label=""
            name="amountOfDishes"
            placeHolder="Amount of dishes (e.g. 20)"
            isDisabled={!values.isDishes}
          />
        </FormControl>
        <FormControl id="rooms" width={{ sm: '270px', md: '368px' }}>
          <HStack>
            <Field type="checkbox" name="isRooms"/>
            <Text>Room cleaning</Text>
          </HStack>
          <TextInputField
            label=""
            name="areaOfRooms"
            placeHolder="Amount of the room in square meter (e.g. 100)"
            isDisabled={!values.isRooms}
          />
        </FormControl>
        <FormControl id="clothes" width={{ sm: '270px', md: '368px' }}>
          <HStack>
            <Field type="checkbox" name="isClothes"/>
            <Text>Clothes Ironing</Text>
          </HStack>
          <TextInputField
            label=""
            name="amountOfClothes"
            placeHolder="Amount of clothes (e.g. 10)"
            isDisabled={!values.isClothes}
          />
        </FormControl>
      </Form>
    </>
  );
};

export default PostjobForm;

const Page2Page3 = ({ steps }) => {
  const DISHPRICE = 100;
  const ROOMPRICE = 10;
  const CLOTHPRICE = 50;
  const DISCOUNT = 100; // for Test only

  const { values } = useFormikContext();
  const dishesPrice = () => values.isDishes === false ? 0 : values.amountOfDishes * DISHPRICE;
  const roomsPrice = () => values.isRooms === false ? 0 : values.areaOfRooms * ROOMPRICE;
  const clothedPrice = () => values.isClothes === false ? 0 : values.amountOfClothes * CLOTHPRICE;
  const totalPrice = () => dishesPrice() + roomsPrice() + clothedPrice();
  const Discount = 0;

  const promotionBox = () => {
    if (steps == 2) {
      return (
        <FormControl id="clothes" width={{ sm: '270px', md: '368px' }} mt="40px">
          <TextInputField
            label="Promotion Code"
            name="promotionCode"
            placeHolder="Apply Your Promotion Code"
          />
        </FormControl>
      );
    }
    else if (steps == 3){
      return (
        <>
        <HStack justify="space-between" width="100%" mt="20px">
          <Text fontFamily="body">
            Promotion
          </Text>
          <Text fontFamily="body" fontWeight="bold">
            -{DISCOUNT}
          </Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body" fontWeight="bold">
            Total price (Discount)
          </Text>
          <Text fontFamily="body" fontWeight="bold">
            {totalPrice() - DISCOUNT}
          </Text>
        </HStack>
        </>
      );
    }
    return (<div></div>);
  }

  return (
    <Form border="1px">
      <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
        <Text mb="3px" fontWeight="3px" fontSize="20px" fontFamily="body">
          Total Price
        </Text>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body">
            {values.amountOfDishes == '' || values.isDishes ===false ? '0' : values.amountOfDishes} Dishes
          </Text>
          <Text fontFamily="body">{dishesPrice()}</Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body">
            {values.areaOfRooms == '' || values.isRooms === false? '0' : values.areaOfRooms} Square meters of Rooms
          </Text>
          <Text fontFamily="body">{roomsPrice()}</Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body">
            {values.amountOfClothes == '' || values.isClothes === false ? '0' : values.amountOfClothes} Clothes
          </Text>
          <Text fontFamily="body">{clothedPrice()}</Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body" fontWeight="bold">
            Total price
          </Text>
          <Text fontFamily="body" fontWeight="bold">
            {totalPrice()}{' '}
          </Text>
        </HStack>
        {promotionBox()}
      </FormControl>
    </Form>
  );
};
