import React from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {PersonalInfo} from './PersonalInfo';
import {TextInput,DateInput} from "../../shared/FormikField";



const SignupFormik = () => {
  const yup = Yup.object({
    firstName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
    lastName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
    DOB: Yup.date().required('Required'),
  });
  return (
    <Formik initialValues={{
        firstName: '',
        lastName: '',
      }}
      validationSchema={yup}>
          <Form>
          <TextInput name="firstName" label="First Name" placeholder="First Name"/>
     <TextInput name="lastName" label="Last Name" placeholder="Last Name"/>
     <DateInput name="DOB" label="Date of Birth"/>
          </Form>
      </Formik>
  );
};

export default SignupFormik;