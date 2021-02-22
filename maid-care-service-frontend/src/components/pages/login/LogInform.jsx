import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { VStack, Link, Center, Button, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/use-stores';

import { TextInput } from '../../shared/FormikField.jsx';

const LogInForm = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const { userStore } = useStores();

  const [showPW, setShowPW] = useState(false);
  const [errors, setErrors] = useState([]);

  // Clean up states.
  useEffect(() => {
    return () => {
      setErrors([]);
    };
  }, []);

  const handleSubmit = async ({ email, password }, { setSubmitting }) => {
    try {
      setSubmitting(true);
      // log user in
      await userStore.login({ email, password });
      setErrors([]);
      if (location.state) {
        history.push(location.state.from.pathname);
      } else {
        history.push('/');
      }
    } catch (error) {
      console.log(error);
      setErrors([...errors, error.response.data]);
      setSubmitting(false);
    }
  };

  const errorMessage = errors => {
    const lastError = errors[errors.length - 1];
    switch (lastError.statusCode) {
      case 401:
        return 'Email or Password is invalid';
      default:
        return 'Internal Server Error';
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Please fill Email'),
        password: Yup.string().required('Please fill Password'),
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
            {!isSubmitting && errors.length && <Text color="red">{errorMessage(errors)}</Text>}
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
});
export default LogInForm;
