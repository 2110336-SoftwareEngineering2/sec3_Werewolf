import React from 'react';
import { cleanup, waitFor } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';

afterEach(cleanup);

describe('test promotion form', () => {
  it('should valid input', async () => {
    const CODE = 'PIZZA1112';
    const DESC = 'Code for Pizza 1112';
    const DISC_RATE = 50;
    const START_DATE = '2021-05-01T00:00:00';
    const END_DATE = '2021-05-02T00:00:00';

    const container = render(
      <BrowserRouter>
        <PromotionForm />
      </BrowserRouter>
    );

    const form = await container.findByTestId('promotion-form');

    const codeField = container.getByLabelText('Promotion Code');
    const descField = container.getByLabelText('Description');
    const discRateField = container.getByLabelText('Discount Rate');
    const startDateField = container.getByLabelText('Available Date');
    const endDateField = container.getByLabelText('Expired Date');

    fireEvent.change(codeField, { target: { value: CODE } });
    fireEvent.change(descField, { target: { value: DESC } });
    fireEvent.change(discRateField, { target: { value: DISC_RATE } });
    fireEvent.change(startDateField, { target: { value: START_DATE } });
    fireEvent.change(endDateField, { target: { value: END_DATE } });
    fireEvent.submit(form);

    await waitFor(() => {
      const fields = container.getAllByTestId(/^error/i);
      fields.forEach((field) => {
        expect(field).not.toBeInTheDocument();
      });
    });
  });
});
