import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
type personalProps = {
  firstname: string,
  lastname:string,
  birthday:string
}

export const PersonalInfo = ({firstname, lastname, birthday}: personalProps) => {
  return(
    <>
      <FormControl id="firstname" width={{sm:"270px",md:"368px"}}>
        <FormLabel mb="0">First name</FormLabel>
          <Input placeholder="Text Here" className="formField" value={firstname}/>
        </FormControl>

        <FormControl id="lastname" width={{sm:"270px",md:"368px"}}>
          <FormLabel mb="0">Last name</FormLabel>
          <Input placeholder="Text Here" className="formField" value={lastname}/>
        </FormControl>

        <FormControl id="birthday" width={{sm:"270px",md:"368px"}}>
          <FormLabel mb="0">Date of Birth</FormLabel>
          <Input type="date"  className="formField" value={birthday}/>
        </FormControl>
    </>
  );
};