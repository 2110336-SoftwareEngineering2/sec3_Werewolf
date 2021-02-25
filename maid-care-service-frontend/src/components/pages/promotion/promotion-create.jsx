import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Form, Formik, Field } from 'formik';
import React from 'react';
import { TextareaFeild, TextInputField } from '../../shared/FormikField';
import * as Yup from 'yup';
import { Prompt, useHistory } from 'react-router-dom';
import moment from 'moment';

const FORMAT = `yyyy-MM-DDTHH:mm`;

const PromotionCreate = () => {
  const history = useHistory();

  const today = moment(new Date()).format(FORMAT);
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
    console.log(values);
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
          {({ isSubmitting, dirty, values }) => (
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
              <Field name="rate">
                {({ field, meta }) => (
                  <FormControl isInvalid={meta.touched && meta.error}>
                    <Flex flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <FormLabel htmlFor="startDate">
                        <Text fontWeight="bold">Discount rate</Text>
                      </FormLabel>
                      <NumberInput {...field} max={100} min={0} clampValueOnBlur={true}>
                        <NumberInputField {...field} placeholder={80} />
                      </NumberInput>
                      <Text ml={2}>% (percent)</Text>
                    </Flex>
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Spacer margin={6} />
              <Stack direction={['column', 'column', 'row']}>
                <Field name="startDate">
                  {({ field, meta }) => (
                    <FormControl isInvalid={meta.touched && meta.error}>
                      <Flex
                        flexDirection="row"
                        justifyContent={{
                          sm: 'space-between',
                        }}
                        alignItems="center">
                        <FormLabel htmlFor="endDate">
                          <Text fontWeight="bold">Available date</Text>
                        </FormLabel>
                        <Input {...field} type="datetime-local" name="startDate" id="startDate" />
                      </Flex>
                      {meta.touched && meta.error && (
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      )}
                      <FormHelperText>Start date of the promotion.</FormHelperText>
                    </FormControl>
                  )}
                </Field>
                <Field name="endDate">
                  {({ field, meta }) => (
                    <FormControl isInvalid={meta.touched && meta.error}>
                      <Flex
                        flexDirection="row"
                        justifyContent={{
                          sm: 'space-between',
                        }}
                        alignItems="center">
                        <FormLabel>
                          <Text fontWeight="bold">Expired date</Text>
                        </FormLabel>
                        <Input {...field} type="datetime-local" name="endDate" id="endDate" />
                      </Flex>
                      {meta.touched && meta.error && (
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      )}
                      <FormHelperText>End date of the promotion.</FormHelperText>
                    </FormControl>
                  )}
                </Field>
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
