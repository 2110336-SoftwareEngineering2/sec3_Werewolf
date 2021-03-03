import React from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import PersonalInfo from "./PersonalInfo";
import IDCardInfo from "./IDCardInfo";
import { Button, VStack } from '@chakra-ui/react';


const SignupFormik = (props) => {

  const yup = Yup.object({
    firstName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
    lastName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
    DOB: Yup.date().required('Required'),
    nationality: Yup.string(),
    citizenID: Yup.string().max(13, 'Citizen ID must be 13-digit long').required('Required'),
    bankAccount: Yup.string().max(10,'Bank account must be 10-digit long').required('Required')
  });

  const handleSubmit = (values) => {
    console.log(values)
  }

  const form = () => {
    if(props.steps === 1){
      return(<PersonalInfo />)
    }
    else if(props.steps === 2){
      return(<IDCardInfo />)
    }
  }
  return (
    <Formik initialValues={{
        firstName: '',
        lastName: '',
        DOB:'',
        nationality:'',
        citizenID:'',
        bankAccount:'',
      }}
      validationSchema={yup}
      onSubmit={handleSubmit}
      >
          <Form>
          <VStack spacing="4" width={{ sm: '72', md: '96' }}>
            {form()}
          </VStack>
           </Form>
      </Formik>
  );
};

export default SignupFormik;