import React from "react";

import {TextInputField, DateField} from "../../shared/FormikField";

const PersonalInfo = () => {
  return(
    <>
     <TextInputField name="firstName" label="First Name" placeholder="First Name"/>
     <TextInputField name="lastName" label="Last Name" placeholder="Last Name"/>
     <DateField name="DOB" label="Date of Birth" helperText="Maid can only be 18-80 years old" />
    </>
  );
};

export default PersonalInfo;