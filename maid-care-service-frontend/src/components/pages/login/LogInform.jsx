import React, { useState} from "react";
import {useHistory} from "react-router-dom";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { VStack, Link, Center, Button,Box } from "@chakra-ui/react";
import { TextInput } from "../../shared/FormikField.jsx";

import userStore from "../../../MobX/User";

import {baseURL} from '../../../baseURL';


const LogInForm = () => {

  const history = useHistory();

  const [showPW, setShowPW] = useState(false);
  const [message,setMessage] = useState(null);

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


  const auth = axios.create({
    baseURL: baseURL+ "/auth", // use proxy for baseURL
    headers: {'Content-Type':'application/json'}
  })

  const yupValidation = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Required"),
    password: Yup.string()
  })

  const handleSubmit = (values,{setSubmitting}) => {
    setTimeout(() => {
      auth.post('/login',values)
    .then(response => {
      setMessage(null);
      userStore.setUser(response.data.user);
      userStore.login(true) 
    })
    .then(() => history.push('/home'))
    .catch(err => {
      if(err.response){
        setMessage(err.response.data.message);
      }
      else{
        setMessage(err.request)
      }
    })
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
          <Box color="red" mt="3">{message}</Box>
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
