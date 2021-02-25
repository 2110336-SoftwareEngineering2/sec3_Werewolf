import React from "react";
import {TextInput,DateInput} from "../../shared/FormikField";

export const PersonalInfo = () => {
  return(
    <>

     <TextInput name="firstName" label="First Name" placeholder="First Name"/>
     <TextInput name="lastName" label="Last Name" placeholder="Last Name"/>
     <DateInput name="DOB" label="Date of Birth"/>
    </>
  );
};