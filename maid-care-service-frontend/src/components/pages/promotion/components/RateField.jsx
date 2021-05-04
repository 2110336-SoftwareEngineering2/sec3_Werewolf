import React from 'react';
import {
  FormControl,
  FormLabel,
  Text,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  Stack,
} from '@chakra-ui/react';
import { useField } from 'formik';

const RateField = ({ label, helperText, direction = ['row'], ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <Stack direction={direction} alignItems="center">
        <FormLabel htmlFor={field.name}>
          <Text fontWeight="bold">{label}</Text>
        </FormLabel>
        <NumberInput
          id={field.name}
          defaultValue={20}
          {...field}
          onChange={(val) => helpers.setValue(val)}
          clampValueOnBlur={false}>
          <NumberInputField />
        </NumberInput>
        <Text ml={2}>%</Text>
      </Stack>
      {meta.touched && meta.error && (
        <FormErrorMessage data-testid={`error-${field.name}`}>{meta.error}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default RateField;
