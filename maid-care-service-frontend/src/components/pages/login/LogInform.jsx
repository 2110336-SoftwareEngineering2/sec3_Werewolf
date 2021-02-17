import React, { useState} from "react";
import {useHistory} from "react-router-dom";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { VStack, Link, Center, Button,Box } from "@chakra-ui/react";
import { TextInput } from "../../shared/FormikField.jsx";

import userStore from "../../../MobX/User";

import {auth} from "../../../axiosConfig";


const LogInForm = () => {

  const history = useHistory();
  const [showPW, setShowPW] = useState(false);
  const [error,setError] = useState(null)

  const showPWButton = (
    <Link
      color="gray.500"
      fontWeight="700"
      onClick={() => {
        setShowPW(!showPW);
      }}
    >
      {showPW ? "hide" : "show"}
    </Link>
  );

  const yupValidation = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Required"),
    password: Yup.string()
  })

  const handleSubmit = (values,{setSubmitting}) => {
    setTimeout(() => {
      auth
      .post('/login', values)
      .then(response => {
        setError(null)
        userStore.toggleLogin()
        userStore.setUser(response.data.user)
      })
      .then(() => {
          return(history.push("/home"))
      })
      .catch(err => {
        if (err.response) {
           setError(err.response.data.message);
        } else {
            setError(err.request);
        }
      });
      setSubmitting(false);
    }, 400);
  }

  return (
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={yupValidation}
        onSubmit={handleSubmit}
      >
        <Form>
        <VStack spacing={4} width={{ sm: "72", md: "96" }}>
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="email"
            />
            <TextInput
              label="Password"
              name="password"
              type={showPW ? "text" : "password"}
              placeholder="password"
              child={showPWButton}
            />
        </VStack>
          <Box color="red" mt="3">{error}</Box>
          <Center>
          <Button
          boxShadow="xl"
          className="button"
          mt="6"
          mb="0.75"
          bg="buttonGreen"
          type="submit"
        >
          Log In
        </Button>
          </Center>
        </Form>
      </Formik>
  );
};
export default LogInForm;
