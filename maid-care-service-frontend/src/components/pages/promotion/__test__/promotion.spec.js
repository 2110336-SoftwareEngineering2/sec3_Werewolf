import React from 'react';
import { cleanup } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrowserRouter } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';

afterEach(cleanup);

describe('test promotion form', () => {
  it('should valid input', async () => {
    const testInputValues = {
      code: 'GSIMPTQ125',
      description: 'description',
      discountRate: 20,
      startDate: Date('2020-04-24'),
      endDate: Date('2020-06-20'),
    };

    const today = Date('2020-04-23');
    jest.spyOn(global, 'Date').mockImplementation(() => today);

    const { getByLabelText, getByTestId } = render(
      <BrowserRouter>
        <PromotionForm />
      </BrowserRouter>
    );

    userEvent.type(getByLabelText(/Promotion/i), 'John');
  });
});
