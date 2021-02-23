import React from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';

const TextInput = ({ label, type, placeholder, child, direction, isRequired, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <Stack direction={direction}>
        <FormLabel htmlFor={field.name} mb={0}>
          <Text fontWeight="bold">{label}</Text>
        </FormLabel>
        <InputGroup>
          <Input id={field.name} {...field} {...props} type={type} placeholder={placeholder} />
          {child && <InputRightElement width="16">{child}</InputRightElement>}
        </InputGroup>
        {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
      </Stack>
    </FormControl>
  );
};

export { TextInput };
