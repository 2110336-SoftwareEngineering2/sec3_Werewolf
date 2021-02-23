import {
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import DatePicker from '../../shared/DatePicker/DatePicker';

const initialFormValues = {
  code: '',
  description: '',
};

const PromotionCreate = () => {
  const handleSubmit = (values, action) => {
    console.log(values);
  };

  return (
    <Flex height="100%" justifyContent="center" alignItems="center">
      <Flex
        width={{
          sm: '100%',
          md: '80%',
          lg: '60%',
        }}
        flexDirection="column"
        py="8"
        px={{ base: '8', md: '12' }}
        bg="boxWhite"
        borderRadius="24px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.25)">
        <Text mb="2" align="center" fontSize={32} fontWeight="extrabold">
          Promotion Publish
        </Text>
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          {props => (
            <Form style={{ width: '100%' }}>
              <FormControl>
                <FormLabel>
                  <Text fontWeight="bold">Promotion Code</Text>
                </FormLabel>
                <Input type="text" name="code" placeholder="GRAB112PIZZA" />
                <FormHelperText>Code to redeem.</FormHelperText>
              </FormControl>
              <Spacer margin={4} />
              <FormControl>
                <FormLabel>
                  <Text fontWeight="bold">Description</Text>
                </FormLabel>
                <Textarea type="text" name="description" placeholder="Text here" />
                <FormHelperText>Code Desciption.</FormHelperText>
              </FormControl>
              <Spacer margin="6" />
              <FormControl>
                <Flex flexDirection="row" justifyContent="flex-start" alignContent="center">
                  <Center>
                    <FormLabel>
                      <Text fontWeight="bold">Discount rate</Text>
                    </FormLabel>
                  </Center>
                  <NumberInput>
                    <NumberInputField placeholder={80} />
                  </NumberInput>
                  <FormHelperText ml={2}>% (percent)</FormHelperText>
                </Flex>
              </FormControl>
              <Spacer margin="6" />
              <Stack direction={['column', 'column', 'row']}>
                <FormControl>
                  <Flex
                    flexDirection="row"
                    justifyContent={{
                      sm: 'space-between',
                    }}>
                    <Center>
                      <FormLabel>
                        <Text fontWeight="bold">Available date</Text>
                      </FormLabel>
                    </Center>
                    <DatePicker id="available-date" />
                  </Flex>
                  <FormHelperText>Start date of the promotion.</FormHelperText>
                </FormControl>
                <FormControl>
                  <Flex
                    flexDirection="row"
                    justifyContent={{
                      sm: 'space-between',
                    }}>
                    <Center>
                      <FormLabel>
                        <Text fontWeight="bold">Expired date</Text>
                      </FormLabel>
                    </Center>
                    <DatePicker id="expired-date" />
                  </Flex>
                  <FormHelperText>End date of the promotion.</FormHelperText>
                </FormControl>
              </Stack>
              <Spacer margin="6" />
              <HStack justifyContent="flex-end">
                <Button bg="red" color="white">
                  Cancel
                </Button>
                <Button bg="buttonGreen" color="white">
                  Publish
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default PromotionCreate;
