import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
  VStack,
  Link,
  Center,
  Button,
  FormErrorMessage,
  FormControl,
  Text,
} from '@chakra-ui/react';
import { TextInput } from '../../shared/FormikField.jsx';

import userStore from '../../../store/User';
import { observer } from 'mobx-react-lite';

const LogInForm = observer(() => {
  const history = useHistory();
  const [showPW, setShowPW] = useState(false);

  const handleSubmit = async ({ email, password }, { setSubmitting }) => {
    setSubmitting(true);
    // log user in
    await userStore.login({ email, password });
    if (userStore.errors.length) {
      setSubmitting(false);
    } else {
      history.push('/home');
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
            {userStore.errors.length && <Text color="red">{userStore.error_message}</Text>}
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
