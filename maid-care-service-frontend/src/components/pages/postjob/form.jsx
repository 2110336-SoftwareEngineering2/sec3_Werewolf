import React, { useState } from 'react';

import { Formik, Form, useFormikContext, Field } from 'formik';
import { job } from '../../../api';
import { useStores } from '../../../hooks/use-stores';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ButtonField from './ButtonField.jsx';
import Page1_TaskDescription from './Page1_TaskDescription.jsx';
import Page2Page3_calculatePrice from './Page2Page3_calculatePrice.jsx';
import { VStack, Text } from '@chakra-ui/react';

const PostjobForm = observer(props => {
  // putResponse is variable which store response from jobPutCostAPI ( put /cost API );
  const [putResponse, setPutResponse] = useState();
  const [isPromoAvailable, setPromoAvailable] = useState(null);

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
      if (props.steps == 1 || props.steps == 2) {
        jobPutCostAPI((values = { values }));
      }
      props.setSteps(previousStep => previousStep + 1);
    }
  };

  const jobPutCostAPI = ({ values }) => {
    const n_dishes = () => (values.isDishes === false ? 0 : values.amountOfDishes);
    const n_rooms = () => (values.isRooms === false ? 0 : values.areaOfRooms);
    const n_clothes = () => (values.isClothes === false ? 0 : values.amountOfClothes);

    job
      .put('/cost', {
        workplaceId: values.workspaceId,
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
        promotionCode: isPromoAvailable === 'true' ? values.promotionCode : '',
      })
      .then(response => {
        console.log(response);
        setPutResponse(response.data);
        console.log(putResponse);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const form = () => {
    if (props.steps === 1) {
      return <Page1_TaskDescription />;
    } else if (props.steps === 2 || props.steps === 3) {
      return (
        <Page2Page3_calculatePrice
          steps={props.steps}
          putResponse={putResponse}
          isPromoAvailable={isPromoAvailable}
          setPromoAvailable={setPromoAvailable}
        />
      );
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
        <ButtonField
          steps={props.steps}
          setSteps={props.setSteps}
          isPromoAvailable={isPromoAvailable}
        />
      </Form>
    </Formik>
  );
});

export default PostjobForm;
