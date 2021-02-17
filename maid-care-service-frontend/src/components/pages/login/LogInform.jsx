import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { VStack, Link, Center, Button } from '@chakra-ui/react';
import { TextInput } from '../../shared/FormikField.jsx';

import userStore from '../../../store/User';

const LogInForm = () => {
  const history = useHistory();
  const [showPW, setShowPW] = useState(false);

  const handleSubmit = async ({ email, password }, { setSubmitting }) => {
    try {
      setSubmitting(true);
      userStore.login({ email, password });
      history.replace('/home');
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address'),
        password: Yup.string(),
      })}
      onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <VStack spacing={4} width={{ sm: '72', md: '96' }}>
            {/* Email Field */}
            <TextInput
              label="Email"
              name="email"
              type="text"
              placeholder="email"
              autoComplete="username"
            />
            {/* Password Field */}
            <TextInput
              label="Password"
              name="password"
              type={showPW ? 'text' : 'password'}
              placeholder="password"
              autoComplete="current-password"
              child={
                <Link
                  color="gray.500"
                  fontWeight="700"
                  onClick={() => {
                    setShowPW(!showPW);
                  }}>
                  {showPW ? 'hide' : 'show'}
                </Link>
              }
            />
          </VStack>
          <Center>
            <Button
              isLoading={isSubmitting}
              boxShadow="xl"
              className="button"
              mt="6"
              mb="0.75"
              bg="buttonGreen"
              type="submit">
              Log In
            </Button>
          </Center>
        </Form>
      )}
    </Formik>
  );
};
export default LogInForm;

// setTimeout(() => {
//   auth
//   .post('/login', values)
//   .then(response => {
//     setError(null)
//     userStore.toggleLogin()
//     userStore.setUser(response.data.user)
//   })
//   .then(() => {
//       return(history.push("/home"))
//   })
//   .catch(err => {
//     if (err.response) {
//        setError(err.response.data.message);
//     } else {
//         setError(err.request);
//     }
//   });
//   setSubmitting(false);
// }, 400);
