import React, { useState } from 'react';

import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ButtonField from './ButtonField.jsx';
import Page5_maidInfo from './Page5_maidInfo.jsx';
import Page1_TaskDescription from './Page1_TaskDescription.jsx';
import Page2Page3_calculatePrice from './Page2_3_calculatePrice.jsx';
import Page4_matching from './Page4_matching.jsx';
import { VStack, Text } from '@chakra-ui/react';

const PostjobForm = observer(props => {
  const [isPromoAvailable, setPromoAvailable] = useState(null);

  // maidId is received from API in Page4_matching and then pass as a parameter to
  // Page5_maidInfo in order to get maid information.
  const [maidId, setMaidId] = useState('');

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

  const handleSubmit = () => {
    if (props.steps < 5) {
      props.setSteps(previousStep => previousStep + 1);
    }
  };

  const switchPage = () => {
    switch (props.steps) {
      case 1:
        return <Page1_TaskDescription />;
      case 2:
      case 3:
        return (
          <Page2Page3_calculatePrice
            steps={props.steps}
            isPromoAvailable={isPromoAvailable}
            setPromoAvailable={setPromoAvailable}
          />
        );
      case 4:
        return <Page4_matching setSteps={props.setSteps} isPromoAvailable={isPromoAvailable} setMaidId={setMaidId} />;
      case 5:
        return <Page5_maidInfo maidId={'605ca4cbfc41950040c4c1d9'} />;
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
        workplaceId: '',
      }}
      validationSchema={yup}
      onSubmit={handleSubmit}>
      <Form>
        <VStack spacing="4" width={{ sm: '72', md: '96' }}>
          {switchPage()}
        </VStack>
        <ButtonField steps={props.steps} setSteps={props.setSteps} />
      </Form>
    </Formik>
  );
});

export default PostjobForm;
