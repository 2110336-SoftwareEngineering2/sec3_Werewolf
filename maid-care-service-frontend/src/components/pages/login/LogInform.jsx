import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Flex, VStack, Link, Center, Button } from "@chakra-ui/react";

import { TextInput } from "../../shared/FormikField";

const LogInForm = () => {
  const [showPW, setShowPW] = useState(false);
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

  return (
    <VStack spacing={4}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
            console.log("yo")
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
      >
        <Form>
          <Flex flexDirection="column" width={{ sm: "72", md: "96" }}>
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
          </Flex>
        </Form>
      </Formik>
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
    </VStack>
  );
};

export default LogInForm;
