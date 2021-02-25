import React from "react";

import {TextInput} from "../../shared/FormikField"

export const IdCardInfo = () => {
  return(
    <>
      <TextInput name="nationality" label="Nationality" placeholder="Nationality" />
      <TextInput name="citizenID" label="Citizen ID" placeholder="Citizen ID" />
      <TextInput name="bankAccount" label="Bank Account Number" placeholder="Bank Account Number" />
    </>
  );
};