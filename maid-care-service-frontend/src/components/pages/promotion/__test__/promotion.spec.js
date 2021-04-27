import React from 'react';
import { cleanup } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';

afterEach(cleanup);

describe('test code field', () => {
  it('should invalid when value is empty', async () => {
    const { getByLabelText, findByTestId } = render(
      <BrowserRouter>
        <PromotionForm />
      </BrowserRouter>
    );

    const input = getByLabelText('Promotion Code');

    fireEvent.blur(input);

    const validationError = await findByTestId('error-code');

    expect(validationError.innerHTML).toBe('This field is required');
  });
});
