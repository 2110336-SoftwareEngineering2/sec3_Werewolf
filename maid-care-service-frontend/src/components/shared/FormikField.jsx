import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";


const TextInput = ({label,type,placeholder,child,...props}) => {
    const [field,meta] = useField(props)

    return(<FormControl isInvalid={meta.touched && meta.error}>
        <FormLabel mb={0}>{label}</FormLabel>
        <InputGroup>
            <Input {...field} type={type} placeholder={placeholder} />
            {child? <InputRightElement width="16">
                {child}
            </InputRightElement>: <></> }
        </InputGroup>
        {meta.touched && meta.error ? (
         <div className="error">{meta.error}</div>
       ) : null}
    </FormControl>)
}

export {TextInput};
