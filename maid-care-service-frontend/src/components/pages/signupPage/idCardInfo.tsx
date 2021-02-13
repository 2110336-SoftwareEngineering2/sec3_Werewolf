import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
type cardProps = {
  nationality:string,
  citizenId:string,
  bankAccount:string
}

export const IdCardInfo = ( {nationality, citizenId, bankAccount} :  cardProps) => {
  return(
    <>
      <FormControl id="nationality" width={{sm:"270px",md:"368px"}}>
        <FormLabel mb="0">Nationality</FormLabel>
          <Input placeholder="Text Here" className="formField"/>
        </FormControl>

        <FormControl id="citizenid" width={{sm:"270px",md:"368px"}}>
          <FormLabel mb="0">Citizen Id</FormLabel>
          <Input placeholder="Text Here" className="formField" />
        </FormControl>

        <FormControl id="bankaccount" width={{sm:"270px",md:"368px"}}>
          <FormLabel mb="0">Back Account Number</FormLabel>
          <Input placeholder="Text Here"  className="formField" />
        </FormControl>
    </>
  );
};