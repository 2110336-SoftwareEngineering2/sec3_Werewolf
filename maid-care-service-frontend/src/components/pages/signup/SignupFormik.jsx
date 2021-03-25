import React, { useState } from 'react';
import * as Yup from 'yup';

import { auth } from '../../../api/auth.js';

import { VStack, Text, Image, Stack,Box,Flex } from '@chakra-ui/react';
import {ErrorMessage} from 'formik';

import Wizard from './Wizard/Wizard';
import {TextInputField, DateField, CheckField} from "../../shared/FormikField";

const SignupFormik = () => {
  const WizardStep = ({ children }) => children;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const [submitted, setSubmit] = useState(false);
  const [error, setError] = useState(false)

  const work_choices = ['House Cleaning', 'Dish Washing', 'Laundry', 'Gardening', 'Decluttering'];

  function signup(values) {
    let confirm = window.confirm('Confirm form submission. This cannot be undone.');
    if(confirm == true){
      console.log('values' ,values)
      auth.post('/register',values)
      .then(response => {
        console.log('response', response) 
        setSubmit(true);
      })
      .catch(err => {
        setError(err.response)
        setSubmit(true)
        console.log(err.response.status)
      })
    }
  }

  if (submitted && !error) {
    return (
      <VStack justifyContent="center">
        <Image src="/assets/images/mail.png" alt="verification email" mb="2" boxSize="10rem" />
        <Text fontSize="lg">A verfication email has been sent</Text>
        <Text fontSize="md" color="gray">
          Please follow the verification link provided in your email
        </Text>
      </VStack>
    );
  }

  else if (submitted && error){
    if(error.status === 409)
    return(
      <VStack justifyContent="center" mt="2">
        <Image src="/assets/images/sadface.png" alt="taken email" my="5" boxSize="10rem" />
        <Text fontSize="lg" color="red">Sorry, this email address is already registered.</Text>
      </VStack>
    )
  }

  return (
    <VStack spacing="1" width="100%">
      <Wizard
      initialValues={{
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        citizenId: '',
        bankAccountNumber: '',
        role: 'maid',
        work: [],
      }}
      onSubmit={async values => sleep(300).then(() => signup(values))}>
      {/*step0*/}
      <WizardStep validationSchema={Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
        firstname: Yup.string()
            .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
            .required('Required'),
          lastname: Yup.string()
            .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
            .required('Required'),
      })}>
        <TextInputField name="email" label="Email Address" placeholder="example@mail.com"/>
        <TextInputField name="password" label="Password" type="password"/>
        <TextInputField name="firstName" label="First Name" placeholder="First Name"/>
        <TextInputField name="lastName" label="Last Name" placeholder="Last Name"/>
      </WizardStep>


      {/*step1*/}
      <WizardStep
        onSubmit={() => console.log('submit 1')}
        validationSchema={Yup.object({
          birthdate: Yup.date()
            .required('Required')
            .test('age', 'You must be 18 or older', function (birthdate) {
              const min_age = new Date();
              min_age.setFullYear(min_age.getFullYear() - 18);
              return birthdate <= min_age;
            })
            .test('age', 'You must be younger than 80', function (birthdate) {
              const max_age = new Date();
              max_age.setFullYear(max_age.getFullYear() - 80);
              return birthdate >= max_age;
            }),
          nationality: Yup.string().marequired(),
          citizenId: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .length(13, 'Citizen ID must be 13-digit long')
            .required('Required'),
          bankAccountNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .length(10, 'Bank account must be 10-digit long')
            .required('Required'),
        })}>
          <DateField name="birthdate" label="Date of Birth" helperText="Maid can only be 18-80 years old" />
          <TextInputField name="citizenID" label="Citizen ID" placeholder="Citizen ID" />
          <TextInputField name="bankAccountNumber" label="Bank Account Number" placeholder="Bank Account Number" />
      </WizardStep>


      {/*step3*/}
      <WizardStep
        onSubmit={() => console.log('submit 3')}
        validationSchema={Yup.object({
          work: Yup.array().min(1, 'Please select at least 1 job').required(),
        })}>
        <Flex flexDir="column" justify="left" width="100%">
      <Box fontSize="1xl" mb="10px">
        <Text fontWeight="bold">Capability Job(s)</Text>
      </Box>
        {work_choices.map((c,index) => {
          return(
            <Box marginBottom="2" key={index}><CheckField name="work" label={c} value={c} /></Box>)
        })}
      <ErrorMessage name="work">{msg => <Box color="red">{msg}</Box>}</ErrorMessage>
    </Flex>
      </WizardStep>
    </Wizard>
    </VStack>
  );
};

export default SignupFormik;
