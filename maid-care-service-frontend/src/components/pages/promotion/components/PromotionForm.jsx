import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { Button, HStack, Spacer, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { Prompt, useHistory } from 'react-router-dom';
import { promotion } from '../../../../api';

import { FORM_MODE } from '../constants/form-mode';
import RateField from '../components/RateField';
import { DatetimeField, TextareaFeild, TextInputField } from '../../../shared/FormikField';

const DATETIME_LOCAL_FORMAT = `yyyy-MM-DDTHH:mm`;

const PromotionForm = observer(
  ({
    mode = FORM_MODE.CREATE,
    onSubmit = () => {},
    dateModule: Date = global.Date,
    promotionService = promotion,
  }) => {
    const history = useHistory();

    const today = moment(new Date()).format(DATETIME_LOCAL_FORMAT);

    const promotionSchema = Yup.object().shape(
      {
        code: Yup.string()
          .required('This field is required')
          .test('checkCodeUnique', 'This code is already registered', async (value) => {
            if (!value) return true;
            try {
              const { data } = await promotionService.get(value);
              return !data;
            } catch (err) {
              const isExisted = err.response.status !== 404;
              return !isExisted;
            }
          }),
        description: Yup.string().optional().ensure(),
        discountRate: Yup.number()
          .required('This field is required')
          .min(0, 'Rate cannot be less than 0%')
          .max(100, 'Rate cannot be more than 100%'),
        startDate: Yup.date('Invalid Date Format')
          .required('Select Available Date')
          .min(today, 'Available date cannot be before today'),
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

    const handleSubmit = (values, actions) => {
      onSubmit(values, actions);
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
        onSubmit={handleSubmit}
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
            <Stack direction={['column', 'column', 'column', 'column', 'row']}>
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
              <Button
                data-testid={`submit-btn`}
                isLoading={isSubmitting}
                type="submit"
                bg="buttonGreen"
                color="white">
                Publish
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    );
  }
);

export default PromotionForm;
