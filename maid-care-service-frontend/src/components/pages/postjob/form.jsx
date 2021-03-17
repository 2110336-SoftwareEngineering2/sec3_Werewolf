import React, { useState, useEffect } from 'react';

import { Formik, Form, useFormikContext, Field } from 'formik';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { postjob } from '../../../api';
import { useStores } from '../../../hooks/use-stores';
import { workspace } from '../../../api';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import {
  Link,
  VStack,
  Button,
  HStack,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Text,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';
import { values } from 'mobx';
import { FaYoutube } from 'react-icons/fa';

const PostjobForm = props => {
  const yup = Yup.object({
    amountOfDishes: Yup.mixed().when('isDishes', {
      is: true,
      then: Yup.number()
        .required('Amount of dishes must be a number.')
        .min(1, 'Amount of dishes must be positive number.'),
    }),
    areaOfRooms: Yup.mixed().when('isRooms', {
      is: true,
      then: Yup.number()
        .required('Area of room must be a number.')
        .min(1, 'Area of room must be positive number.'),
    }),
    amountOfClothes: Yup.mixed().when('isClothes', {
      is: true,
      then: Yup.number()
        .required('Amount of cloth must be a number.')
        .min(1, 'Amount of cloth must be positive number.'),
    }),
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
      onSubmit={() => {
        if (props.steps < 3) {
          props.setSteps(previousStep => previousStep + 1);
        }
      }}>
      <Form>
        <VStack spacing="4" width={{ sm: '72', md: '96' }}>
          {form()}
        </VStack>
        <ButtonField steps={props.steps} setSteps={props.setSteps} />
      </Form>
    </Formik>
  );
};

const Page1 = () => {
  const { values } = useFormikContext();
  const [error, setError] = useState(false);
  const [myWorkspaces, setMyWorkspaces] = useState([]);

  const getWorkspace = () =>{
    workspace
    .get('/', {
      timeout: 5000,
    })
    .then(response => {
      setMyWorkspaces(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
      setError(error);
    });
  }
  useEffect( () => {
    getWorkspace();
  }, []);

  return (
    <>
      <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
        <FormLabel mb="0">Location</FormLabel>
        <Select name="location" mb="5px">
          <option value="">Select your workplace location</option>
          { myWorkspaces.map( (myWorkspace) => {
            console.log(myWorkspace.description)
            return (<option  value="">{myWorkspace.description}</option>);
          } )}
        </Select>
        <Link as={RouterLink} to="/workspace" mt="10px">
          Add new workspace
        </Link>
      </FormControl>
      <FormLabel mb="5px">Type of Work</FormLabel>
      <FormControl id="dishes" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isDishes" />
          <Text>Dish Washing</Text>
        </HStack>
        <TextInputField
          label=""
          name="amountOfDishes"
          type="number"
          placeholder="Amount of dishes (e.g. 20)"
          isDisabled={!values.isDishes}
        />
      </FormControl>
      <FormControl id="rooms" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isRooms" />
          <Text>Room cleaning</Text>
        </HStack>
        <TextInputField
          label=""
          name="areaOfRooms"
          placeholder="Amount of the room in square meter (e.g. 100)"
          isDisabled={!values.isRooms}
        />
      </FormControl>
      <FormControl id="clothes" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isClothes" />
          <Text>Clothes Ironing</Text>
        </HStack>
        <TextInputField
          label=""
          name="amountOfClothes"
          placeholder="Amount of clothes (e.g. 10)"
          isDisabled={!values.isClothes}
        />
      </FormControl>
    </>
  );
};

export default PostjobForm;

const Page2Page3 = ({ steps }) => {
  // this 4 constanct is only for test.
  const DISHPRICE = 100;
  const ROOMPRICE = 10;
  const CLOTHPRICE = 50;
  const DISCOUNT = 100;

  const { values } = useFormikContext();
  const dishesPrice = () => (values.isDishes === false ? 0 : values.amountOfDishes * DISHPRICE);
  const roomsPrice = () => (values.isRooms === false ? 0 : values.areaOfRooms * ROOMPRICE);
  const clothedPrice = () => (values.isClothes === false ? 0 : values.amountOfClothes * CLOTHPRICE);
  const totalPrice = () => dishesPrice() + roomsPrice() + clothedPrice();

  const promotionBox = () => {
    if (steps == 2) {
      return (
        <FormControl id="clothes" width={{ sm: '270px', md: '368px' }} mt="40px">
          <TextInputField
            label="Promotion Code"
            name="promotionCode"
            placeholder="Apply Your Promotion Code"
          />
        </FormControl>
      );
    } else if (steps == 3) {
      return (
        <>
          <HStack justify="space-between" width="100%" mt="20px">
            <Text fontFamily="body">Promotion</Text>
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
    return <div></div>;
  };

  return (
    <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
      <Text mb="3px" fontWeight="3px" fontSize="20px" fontFamily="body">
        Total Price
      </Text>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body">
          {values.amountOfDishes == '' || values.isDishes === false ? '0' : values.amountOfDishes}{' '}
          Dishes
        </Text>
        <Text fontFamily="body">{dishesPrice()}</Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body">
          {values.areaOfRooms == '' || values.isRooms === false ? '0' : values.areaOfRooms} Square
          meters of Rooms
        </Text>
        <Text fontFamily="body">{roomsPrice()}</Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body">
          {values.amountOfClothes == '' || values.isClothes === false
            ? '0'
            : values.amountOfClothes}{' '}
          Clothes
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
  );
};

const ButtonField = ({ steps, setSteps }) => {
  const handleDecrement = () => {
    if (steps > 1) {
      setSteps(previousStep => previousStep - 1);
    }
  };

  // This 3 variables is used for submit button.
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <>
      <HStack justify="flex-end" width="100%" bottom="1px">
        {steps > 1 ? (
          <Button
            width="100px"
            className="button button-register"
            bg="buttonGreen"
            onClick={handleDecrement}>
            Previous
          </Button>
        ) : null}
        {steps < 3 ? (
          <Button width="100px" className="button button-register" bg="buttonGreen" type="summit">
            Next
          </Button>
        ) : null}
        {steps == 3 ? (
          <Button
            width="100px"
            className="button button-register"
            bg="buttonGreen"
            type="summit"
            onClick={() => setIsOpen(true)}>
            Summit
          </Button>
        ) : null}
      </HStack>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Do you want to confirm ?
            </AlertDialogHeader>
            <AlertDialogBody>
              The system will perform the match immediately after you have confirmed.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={onClose} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
