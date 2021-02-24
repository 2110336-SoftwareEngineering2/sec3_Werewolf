import React from 'react';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Flex, VStack, HStack, Link, Center, Button, Box, Spacer, Text } from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField.jsx';

const LogInForm = () => {
  return (
    <VStack spacing={4}>
      <Formik>
        <Form>
          <HStack spacing={4}>
            <Flex flexDirection="column" width={{ sm: '72', md: '96' }}>
              <TextInputField label="First Name" name="first name" placeholder="first name" />
              <TextInputField label="Date of Birth" name="Date of Birth" placeholder="MM/DD/YYYY" />
              <TextInputField label="Citizen ID" name="citizen id" placeholder="citizen id" />
            </Flex>
            <Flex flexDirection="column" width={{ sm: '72', md: '96' }}>
              <TextInputField label="Last Name" name="last name" placeholder="last name" />
              <TextInputField label="Nationality" name="nationality" placeholder="nationality" />
              <TextInputField
                label="Bank Account Number"
                name="bank account number"
                placeholder="bank account number"
              />
            </Flex>
          </HStack>
          <Flex>
            <Spacer />
            <HStack spacing={4} mt="6">
              <Button boxShadow="xl" className="button" bg="buttonGrey" type="submit">
                <Text color="#A0AEC0"> Discard Change </Text>
              </Button>
              <Button boxShadow="xl" className="button" bg="buttonGreen" type="submit">
                Done
              </Button>
            </HStack>
          </Flex>
        </Form>
      </Formik>
    </VStack>
  );
};
export default LogInForm;
