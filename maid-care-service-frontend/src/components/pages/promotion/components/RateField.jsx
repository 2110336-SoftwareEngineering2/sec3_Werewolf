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
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <Stack direction={direction}>
        <FormLabel htmlFor="startDate">
          <Text fontWeight="bold">{label}</Text>
        </FormLabel>
        <NumberInput {...field} max={100} min={0} clampValueOnBlur={true}>
          <NumberInputField {...field} placeholder={80} />
        </NumberInput>
        <Text ml={2}>% (percent)</Text>
      </Stack>
      {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
  );
};

export default RateField;
