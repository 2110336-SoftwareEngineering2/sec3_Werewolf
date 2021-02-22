import React from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

const TextInput = ({ label, type, placeholder, child, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel htmlFor={field.name} mb={0}>
        {label}
      </FormLabel>
      <InputGroup>
        <Input id={field.name} {...field} {...props} type={type} placeholder={placeholder} />
        {child && <InputRightElement width="16">{child}</InputRightElement>}
      </InputGroup>
      {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
  );
};

export { TextInput };
