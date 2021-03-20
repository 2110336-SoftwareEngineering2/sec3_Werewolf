import React, { useState, useEffect } from 'react';

import { Formik, Form, useFormikContext, Field } from 'formik';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { job, workspace, promotion } from '../../../api';
import { useStores } from '../../../hooks/use-stores';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ButtonField from './ButtonField.jsx';
import Page1_TaskDescription from './Page1_TaskDescription.jsx';
import {
  Link,
  VStack,
  Button,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';
import { values } from 'mobx';
import { FaYoutube } from 'react-icons/fa';

const PostjobForm = observer(props => {
  const [putResponse, setPutResponse] = useState();
  const { userStore } = useStores();
  const user = userStore.userData;

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
    if (props.steps < 5) {
      if (props.steps == 1) {
        putFormToServer((values = { values }));
      }
      props.setSteps(previousStep => previousStep + 1);
    }
  };

  const putFormToServer = ({ values }) => {
    const n_dishes = () => (values.isDishes === false ? 0 : values.amountOfDishes);
    const n_rooms = () => (values.isRooms === false ? 0 : values.areaOfRooms);
    const n_clothes = () => (values.isClothes === false ? 0 : values.amountOfClothes);

    job
      .put('/cost', {
        workspaceId: values.workspaceId,
        work: [
          {
            typeOfWork: 'Dish Washing',
            description: 'None',
            quantity: parseInt(n_dishes()),
          },
          {
            typeOfWork: 'House Cleaning',
            description: 'None',
            quantity: parseInt(n_rooms()),
          },
          {
            typeOfWork: 'Laundry',
            description: 'None',
            quantity: parseInt(n_clothes()),
          },
        ],
        promotionCode: '',
      })
      .then(response => {
        setPutResponse(response.data);
        console.log(putResponse);
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  };

  const form = () => {
    if (props.steps === 1) {
      return <Page1_TaskDescription />;
    } else if (props.steps === 2 || props.steps === 3) {
      return <Page2Page3 steps={props.steps} putResponse={putResponse} />;
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
        workspaceId: '',
      }}
      validationSchema={yup}
      onSubmit={handleSubmit}>
      <Form>
        <VStack spacing="4" width={{ sm: '72', md: '96' }}>
          {form()}
        </VStack>
        <ButtonField steps={props.steps} setSteps={props.setSteps} />
      </Form>
    </Formik>
  );
});

export default PostjobForm;



const Page2Page3 = ({ steps, putResponse }) => {
  // this 4 constanct is only for test.
  const [isPromoAvailable, setPromoAvailable] = useState(null);
  const [promoData, setPromoData] = useState();

  const { values } = useFormikContext();

  const getPromotioncodeFromServer = () => {
    promotion
      .get(`/${values.promotionCode}`, {
        timeout: 5000,
      })
      .then(response => {
        setPromoAvailable("true");
        setPromoData(response.data);
        console.log(promoData);
      })
      .catch(error => {
        console.error(error);
        setPromoAvailable("false");
      });
  }

  const calTotalWithPromo = () => putResponse.cost - ( putResponse.cost * ( isPromoAvailable === 'true' ?  promoData.discountRate : 0 )/ 100 );

  const promotionBox = () => {
    if (steps == 2) {
      return (
        <FormControl id="clothes" width={{ sm: '270px', md: '368px' }} mt="40px">
          <TextInputField
            label="Promotion Code"
            name="promotionCode"
            placeholder="Apply Your Promotion Code"
          />
          <HStack mt="5px">
            <Button 
            onClick={getPromotioncodeFromServer}
            width="100px"
            >Verify
            </Button>
            <Text 
              color={isPromoAvailable === 'true' ? 'green' :
              isPromoAvailable === 'false' ? 'red' : 'white'}
              >
              {isPromoAvailable === 'true' ? 'Your promotion code is available' :
              isPromoAvailable === 'false' ? 'Your promotion code is unavailable' : ''
              }</Text>
          </HStack>
        </FormControl>
      );
    } else if (steps == 3) {
      return (
        <>
          <HStack justify="space-between" width="100%" mt="20px">
            <Text fontFamily="body">Promotion (Discount Rate)</Text>
            <Text fontFamily="body" fontWeight="bold">
             {isPromoAvailable === 'true' ?  `${promoData.discountRate}%` : '0%' }
            </Text>
          </HStack>
          <HStack justify="space-between" width="100%">
            <Text fontFamily="body" fontWeight="bold">
              Total price
            </Text>
            <Text fontFamily="body" fontWeight="bold">
              {calTotalWithPromo()}
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
        <Text fontFamily="body">
          {putResponse === undefined ? 'Loading...' : putResponse.work[0].cost}
        </Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body">
          {values.areaOfRooms == '' || values.isRooms === false ? '0' : values.areaOfRooms} Square
          meters of Rooms
        </Text>
        <Text fontFamily="body">
          {putResponse === undefined ? 'Loading...' : putResponse.work[1].cost}
        </Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body">
          {values.amountOfClothes == '' || values.isClothes === false
            ? '0'
            : values.amountOfClothes}{' '}
          Clothes
        </Text>
        <Text fontFamily="body">
          {putResponse === undefined ? 'Loading...' : putResponse.work[2].cost}
        </Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body" fontWeight="bold">
          Total price
        </Text>
        <Text fontFamily="body" fontWeight="bold">
          {putResponse === undefined
            ? ''
            : putResponse.work[0].cost + putResponse.work[1].cost + putResponse.work[2].cost}
        </Text>
      </HStack>
      {promotionBox()}
    </FormControl>
  );
};
