import React from 'react';
import { useField,Field } from 'formik';
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
  Checkbox,
  Flex
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

const DateField = ({label, helperText,...props}) => {
  const [field, meta] = useField(props)
  return(<FormControl isInvalid={meta.touched && meta.error}>
    <FormLabel>
      <Text fontWeight="bold">{label}</Text>
    </FormLabel>
    <Input id={field.name} {...field} {...props} type="date" />
    {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>)
}

const CheckField = ({label,...props}) => {
  const [field,meta] = useField(props)
  return(
    <FormControl>
    <Checkbox id={field.name} {...field} {...props} type="checkbox">{label}</Checkbox>
    {meta.touched && meta.error && <FormErrorMessage>{meta.error}</FormErrorMessage>}
    </FormControl>
    
  )
}

export { TextInputField, TextareaFeild, DateField,CheckField };
