import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { VStack, HStack, Button, Text } from '@chakra-ui/react';
import { Prompt, useHistory } from 'react-router-dom';
import { DateField, TextInputField } from '../../shared/FormikField.jsx';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/use-stores.js';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toJS } from 'mobx';
import { user } from '../../../api/user.js';

const EditProfileForm = observer(
  ({
    userInfo = {
      firstname: '',
      lastname: '',
      birthdate: new Date().toISOString().slice(0, 10),
      citizenId: '',
      bankAccountNumber: '',
    },
  }) => {
    const history = useHistory();
    const { userStore } = useStores();
    const [formValues, setFormValues] = useState(userInfo);

    const curUser = userStore.userData;

    useEffect(() => {
      if (!curUser) return;
      setFormValues({
        ...curUser,
        birthdate: new Date(curUser.birthdate).toISOString().slice(0, 10),
      });
    }, [curUser]);

    useEffect(() => {
      return () => userStore && userStore.getUserData();
    }, []);

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
      console.log('values', values);
      setSubmitting(true);
      user
        .put('/update-profile', values)
        .then((response) => {
          const { data: info } = response;
          console.log('updated info', info);
          setSubmitting(false);
          resetForm({
            values: { ...info, birthdate: new Date(info.birthdate).toISOString().slice(0, 10) },
          });
          history.goBack();
        })
        .catch((error) => {
          console.error(error);
          setSubmitting(false);
        });
    };

    return (
      <VStack spacing={4}>
        <Formik
          enableReinitialize
          initialValues={formValues || userInfo}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            firstname: Yup.string().required('This field is required'),
            lastname: Yup.string().required('This field is required'),
            birthdate: Yup.date('Invalid Date Format').required('Select Available Date'),
            citizenId: Yup.string().required('This field is required'),
            bankAccountNumber: Yup.string().required('This field is required'),
          })}>
          {({ dirty, resetForm }) => (
            <Form>
              <HStack alignItems={`flex-start`} spacing={4}>
                <VStack width={{ sm: '72', md: '96' }}>
                  <TextInputField label="First Name" name="firstname" placeholder="first name" />
                  <DateField label="Date of Birth" name="birthdate" placeholder="MM/DD/YYYY" />
                  <TextInputField label="Citizen ID" name="citizenId" placeholder="citizen id" />
                </VStack>
                <VStack width={{ sm: '72', md: '96' }}>
                  <TextInputField label="Last Name" name="lastname" placeholder="last name" />
                  <TextInputField
                    label="Bank Account Number"
                    name="bankAccountNumber"
                    placeholder="bank account number"
                  />
                </VStack>
              </HStack>
              <HStack>
                <HStack spacing={4} mt="6" ml="auto">
                  <Prompt when={dirty} message="Are you sure to discard change?" />
                  <Button boxShadow="xl" bg="buttonGrey" onClick={resetForm}>
                    <Text color="gray.500"> Reset </Text>
                  </Button>
                  <Button
                    boxShadow="xl"
                    className="button"
                    bg="buttonGrey"
                    onClick={() => history.go(-1)}>
                    <Text color="gray.500"> Discard Change </Text>
                  </Button>
                  <Button boxShadow="xl" className="button" bg="buttonGreen" type="submit">
                    Done
                  </Button>
                </HStack>
              </HStack>
            </Form>
          )}
        </Formik>
      </VStack>
    );
  }
);
export default EditProfileForm;
