import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Button, Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import { Prompt, useHistory } from 'react-router-dom';
import { DatetimeField, TextareaFeild, TextInputField } from '../../shared/FormikField';
import RateField from './components/RateField';

const DATETIME_LOCAL_FORMAT = `yyyy-MM-DDTHH:mm`;

const PromotionCreate = () => {
  const history = useHistory();

  const today = moment(new Date()).format(DATETIME_LOCAL_FORMAT);
  const promotionSchema = Yup.object().shape(
    {
      code: Yup.string().required('This field is required'),
      description: Yup.string().optional().ensure(),
      rate: Yup.number()
        .min(0, 'Rate cannot be less than 0%')
        .max(100, 'Rate cannot be more than 100%')
        .required(),
      startDate: Yup.date('Invalid Date Format')
        .required('Select Available Date')
        .min(today, 'Available date connot be before today'),
      endDate: Yup.date('Invalid Date Format')
        .required('Select Expired Date')
        .min(today, 'Expired date cannot be before today')
        .when(
          'startDate',
          (startDate, schema) =>
            startDate && schema.min(startDate, 'Expored date cannot be before Available date')
        ),
    },
    [['startDate', 'endDate']]
  );

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    /**Start handle Submit logic here */
    console.log(values);
    /**End handle Submit logic here */
    setSubmitting(false);
  };

  const handleCancel = () => {
    history.push('/promotion');
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
        <Formik
          initialValues={{
            code: '',
            description: '',
            rate: 0,
            startDate: today,
            endDate: today,
          }}
          onSubmit={handleSubmit}
          validationSchema={promotionSchema}>
          {({ isSubmitting, dirty }) => (
            <Form style={{ width: '100%' }}>
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
              <RateField name="rate" label="Discount Rate" />
              <Spacer margin={6} />
              <Stack direction={['column', 'column', 'row']}>
                <DatetimeField
                  name="startDate"
                  label="Available date"
                  helperText="Start date of the promotion"
                />
                <DatetimeField
                  name="endDate"
                  label="Expire date"
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
      </Flex>
    </Flex>
  );
};

export default PromotionCreate;
