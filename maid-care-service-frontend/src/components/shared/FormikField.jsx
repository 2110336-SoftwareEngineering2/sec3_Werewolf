import React from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Textarea,
} from '@chakra-ui/react';

const TextInputField = ({ label, left, right, helperText, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel htmlFor={field.name}>
        <Text fontWeight="bold">{label}</Text>
      </FormLabel>
      <InputGroup>
        {left && <InputLeftElement>{left}</InputLeftElement>}
        <Input id={field.name} {...field} {...props} type={props.type} />
        {right && <InputRightElement width={16}>{right}</InputRightElement>}
      </InputGroup>
      {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const TextareaFeild = ({ label, helperText, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel>
        <Text fontWeight="bold">{label}</Text>
      </FormLabel>
      <Textarea {...field} {...props} />
      {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export { TextInputField, TextareaFeild };
