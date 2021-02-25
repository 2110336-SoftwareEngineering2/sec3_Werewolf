import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack
} from "@chakra-ui/react";


const TextInput = ({label,type,placeholder,child,...props}) => {
    const [field,meta] = useField(props)

    return(<FormControl id={field.name} isInvalid={meta.touched && meta.error}>
        <FormLabel mb={0}>{label}</FormLabel>
        <InputGroup>
            <Input {...field} type={type?? "text"} placeholder={placeholder} />
            {child? <InputRightElement width="16">
                {child}
            </InputRightElement>: <></> }
        </InputGroup>
        {meta.touched && meta.error ? (
         <FormErrorMessage>{meta.error}</FormErrorMessage>
       ) : null}
    </FormControl>)
}

const SelectInput = ({props,choices}) => {
    const [field,meta] = useField(props)
    return(<FormControl id={field.name} isInvalid={meta.touched && meta.error}>
        <Select size="sm" {...field}>
            {choices.map( (c,index) => {
                return(<option value={index}>{c}</option>)
            })}
        </Select>
    </FormControl>)
}

const DateInput = ({label,props}) => {
    const [field,meta] = useField(props)

    return(<FormControl id={field.name} isInvalid={meta.touched && meta.error}>
        <FormLabel mb={0}>{label}</FormLabel>
            <Input type="date" {...field} />
            {meta.touched && meta.error ? (
         <FormErrorMessage>{meta.error}</FormErrorMessage>
       ) : null}
    </FormControl>)
}

const CheckBox = ({choice,value,props}) => {
    const [field,meta] = useField(props)
    return(<CheckBox value={value} {...field}>{choice}</CheckBox>)
} 


export {TextInput,SelectInput,DateInput,CheckBox};
