import React from 'react';
import { cleanup, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { render, fireEvent, screen } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';
import MockDate from 'mockdate';
import moment from 'moment';

const DATETIME_LOCAL_FORMAT = `yyyy-MM-DDTHH:mm`;

let promotion = null;
beforeEach(() => {
  // mock today date
  MockDate.set('2020-04-22');
  jest.mock('../../../../api');
  promotion = require('../../../../api').promotion;
});

afterEach(() => {
  promotion = null;
  cleanup();
});

describe('valid case', () => {
  it('[TC3-1] should valid input', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = 20;
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(wrapper.queryByTestId('error-code')).toBeNull();
      expect(wrapper.queryByTestId('error-description')).toBeNull();
      expect(wrapper.queryByTestId('error-discountRate')).toBeNull();
      expect(wrapper.queryByTestId('error-startDate')).toBeNull();
      expect(wrapper.queryByTestId('error-endDate')).toBeNull();
    });
  });
  it('[TC3-1] should call handle submit w/ correct inputs', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = 20;
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);

    const handleSubmitMock = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code

    jest.mock('../../../../api');
    const promotion = require('../../../../api').promotion;
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmitMock} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      // handleSubmit is called
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
      expect(handleSubmitMock).toHaveBeenCalledWith(
        {
          code: CODE,
          description: DESC,
          discountRate: DISC_RATE.toString(),
          startDate: START_DATE,
          endDate: END_DATE,
        },
        expect.anything()
      );
    });
  });
});

describe('invalid case code field', () => {
  it('[TC3-2] should fail due to empty code field', async () => {
    const CODE = ''; // empty code
    const DESC = 'description';
    const DISC_RATE = 20;
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(wrapper.queryByTestId('error-code')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error-code').innerHTML).toBe('This field is required');
  });
  it('[TC3-8] should fail due to already existed code field', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = 20;
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: true }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(wrapper.queryByTestId('error-code')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error-code').innerHTML).toBe('This code is already registered');
  });
});

describe('invalid case discount rate field', () => {
  it('[TC3-3] should fail due to empty discount rate field', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = '';
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(wrapper.queryByTestId('error-discountRate')).toBeInTheDocument();
      expect(wrapper.queryByTestId('error-discountRate').innerHTML).toBe('This field is required');
    });
  });

  it('[TC3-4] should fail due to exceed values of rate', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = 101;
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(wrapper.queryByTestId('error-discountRate')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error-discountRate').innerHTML).toBe(
      'Rate cannot be more than 100%'
    );
  });

  it('[TC3-5] should fail due to negative values of rate', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = -1;
    const START_DATE = moment('2020-04-23').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(wrapper.queryByTestId('error-discountRate')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error-discountRate').innerHTML).toBe(
      'Rate cannot be less than 0%'
    );
  });
});

describe('invalid case datetime fields', () => {
  it('[TC3-6] should fail due to start date is being before today', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = '';
    const START_DATE = moment('2020-04-21').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(wrapper.queryByTestId('error-startDate')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error-startDate').innerHTML).toBe(
      'Available date cannot be before today'
    );
  });

  it('[TC3-7] should fail due to end date is being before start date', async () => {
    const CODE = 'GSIMPTQ125';
    const DESC = 'description';
    const DISC_RATE = 101;
    const START_DATE = moment('2020-06-21').format(DATETIME_LOCAL_FORMAT);
    const END_DATE = moment('2020-06-20').format(DATETIME_LOCAL_FORMAT);
    const handleSubmit = jest.fn();

    const RESPONSE = { data: null }; // no duplicated code
    promotion.get = jest.fn(() => RESPONSE);

    const wrapper = render(
      <BrowserRouter>
        <PromotionForm onSubmit={handleSubmit} promotionService={promotion} dateModule={Date} />
      </BrowserRouter>
    );

    const codeField = wrapper.getByLabelText('Promotion Code');
    const descField = wrapper.getByLabelText('Description');
    const discRateField = wrapper.getByLabelText('Discount Rate');
    const startDateField = wrapper.getByLabelText('Available Date');
    const endDateField = wrapper.getByLabelText('Expired Date');
    const submitButton = wrapper.getByTestId('submit-btn');

    await waitFor(() => {
      fireEvent.change(codeField, { target: { value: CODE } });
    });
    await waitFor(() => {
      fireEvent.change(descField, { target: { value: DESC } });
    });
    await waitFor(() => {
      fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    });
    await waitFor(() => {
      fireEvent.change(startDateField, { target: { value: START_DATE } });
    });
    await waitFor(() => {
      fireEvent.change(endDateField, { target: { value: END_DATE } });
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(wrapper.queryByTestId('error-endDate')).toBeInTheDocument();
    expect(wrapper.queryByTestId('error-endDate').innerHTML).toBe(
      'Expired date cannot be before Available date'
    );
  });
});
