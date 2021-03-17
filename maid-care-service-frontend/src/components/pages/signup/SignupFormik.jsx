import React, { useState } from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { VStack } from '@chakra-ui/react';

import Wizard from '../../shared/MultiplePageForm/Wizard';
import PersonalInfo from './PersonalInfo';
import IDCardInfo from './IDCardInfo';
import Job from './Job';

const SignupFormik = () => {

  const WizardStep = ({ children }) => children;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  return (
      <Wizard
        initialValues={{
          firstName: '',
          lastName: '',
          DOB: '',
          nationality: '',
          citizenID: '',
          bankAccount: '',
          jobs: [],
        }}
        onSubmit={async values => sleep(300).then(() => console.log('Wizard submit', values))}>
          <WizardStep
            onSubmit={() => console.log('submit 1')}
            validationSchema={Yup.object({
              firstName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
              lastName: Yup.string().max(15, 'must be 15 characters or less').required('Required'),
              DOB: Yup.date()
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
            })}>
            <PersonalInfo />
          </WizardStep>
          <WizardStep
            onSubmit={() => console.log('submit 2')}
            validationSchema={Yup.object({
              nationality: Yup.string().required(),
              citizenID: Yup.string()
                .matches(/^[0-9]+$/, 'Must be only digits')
                .length(13, 'Citizen ID must be 13-digit long')
                .required('Required'),
              bankAccount: Yup.string()
                .matches(/^[0-9]+$/, 'Must be only digits')
                .length(10, 'Bank account must be 10-digit long')
                .required('Required'),
            })}>
            <IDCardInfo />
          </WizardStep>
          <WizardStep
            onSubmit={() => console.log('submit 3')}
            validationSchema={Yup.object({
              jobs: Yup.array().min(1, 'Please select at least 1 job option').required(),
            })}>
            <Job />
          </WizardStep>
      </Wizard>
  );
};

export default SignupFormik;
