import React, { useState, useEffect } from 'react';
import { Field } from 'formik';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Box,
  IconButton,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import FocusLock from 'react-focus-lock';
import { EditIcon } from '@chakra-ui/icons';

// import  FocusLock from "react-focus-lock"

// 1. Create a text input component
const TextInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Field as={Textarea} ref={ref} id={props.id} {...props}/>
    </FormControl>
  );
});

// 3. Create the Popover
// Ensure you set `closeOnBlur` prop to false so it doesn't close on outside click
const PopoverForm = ( {label, name, isDisabled, placeholder} ) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);

  return (
    <>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="right"
        closeOnBlur={false}>
        <PopoverTrigger border="1px">
          <IconButton isDisabled={isDisabled} size="md" icon={<EditIcon />} />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Stack spacing={4}>
              <TextInput label={label} id={name} name={name} placeholder={placeholder}/>
            </Stack>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverForm;
