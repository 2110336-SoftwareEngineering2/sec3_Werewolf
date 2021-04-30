import React, { useState } from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Button, HStack, Spacer, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import { Prompt, useHistory } from 'react-router-dom';
import { DatetimeField, TextareaFeild, TextInputField } from '../../../shared/FormikField';
import RateField from '../components/RateField';
import { observer } from 'mobx-react-lite';
import { FORM_MODE } from '../constants/form-mode';
import { promotion } from '../../../../api';

const DATETIME_LOCAL_FORMAT = `yyyy-MM-DDTHH:mm`;

const PromotionForm = observer(({ mode = FORM_MODE.CREATE, onSubmit }) => {
  const history = useHistory();

  const [, setError] = useState(false);

  const today = moment(new Date()).format(DATETIME_LOCAL_FORMAT);
  const promotionSchema = Yup.object().shape(
    {
      code: Yup.string().required('This field is required'),
      description: Yup.string().optional().ensure(),
      discountRate: Yup.number()
        .required('This field is required')
        .min(0, 'Rate cannot be less than 0%')
        .max(100, 'Rate cannot be more than 100%'),
      startDate: Yup.date('Invalid Date Format')
        .required('Select Available Date')
        .min(today, 'Available date connot be before today'),
      endDate: Yup.date('Invalid Date Format')
        .required('Select Expired Date')
        .min(today, 'Expired date cannot be before today')
        .when(
          'startDate',
          (startDate, schema) =>
            startDate && schema.min(startDate, 'Expired date cannot be before Available date')
        ),
    },
    [['startDate', 'endDate']]
  );

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
        setError(error);
      });
    /**End handle Submit logic here */
    setSubmitting(false);
  };

  const handleCancel = () => {
    history.push('/promotion');
  };

  return (
    <Formik
      data-testid="promotion-formik"
      initialValues={{
        code: '',
        description: '',
        discountRate: 0,
        startDate: today,
        endDate: today,
      }}
      // onSubmit={handleSubmit}
      onSubmit={(values) => {
        console.log(values);
      }}
      validationSchema={promotionSchema}>
      {({ isSubmitting, dirty }) => (
        <Form style={{ width: '100%' }} data-testid="promotion-form">
          <Prompt when={dirty} message="Are you sure to discard?"></Prompt>
          <TextInputField
            label="Promotion Code"
            type="text"
            name="code"
            placeholder="GRABPIZZA1112"
            helperText="Code for promotion."
          />
          <Spacer margin={4} />
          <TextareaFeild label="Description" name="description" placeholder="Text here" />
          <Spacer margin={6} />
          <RateField name="discountRate" label="Discount Rate" />
          <Spacer margin={6} />
          <Stack direction={['column', 'column', 'row']}>
            <DatetimeField
              name="startDate"
              label="Available Date"
              helperText="Start date of the promotion"
            />
            <DatetimeField
              name="endDate"
              label="Expired Date"
              helperText="End date of the promotion."
            />
          </Stack>
          <Spacer margin={6} />
          <HStack justifyContent="flex-end">
            <Button bg="red" color="white" onClick={handleCancel}>
              Cancel
            </Button>
            <Button isLoading={isSubmitting} type="submit" bg="buttonGreen" color="white">
              Publish
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
});

export default PromotionForm;
