import React from "react";

import {TextInputField} from "../../shared/FormikField"
import {HStack,Button} from "@chakra-ui/react";

const IDCardInfo = () => {
  return(
    <>
      <TextInputField name="nationality" label="Nationality" placeholder="Nationality" />
      <TextInputField name="citizenID" label="Citizen ID" placeholder="Citizen ID" />
      <TextInputField name="bankAccount" label="Bank Account Number" placeholder="Bank Account Number" />
    </>
  );
};

export default IDCardInfo;