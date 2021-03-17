import React, { useState } from 'react';
import {Form, Formik } from 'formik';
import { Debug } from './Debug';

import {HStack,VStack,Button,Flex} from "@chakra-ui/react";


// Wizard is a single Formik instance whose children are each page of the
// multi-step form. The form is submitted on each forward transition (can only
// progress with valid input), whereas a backwards step is allowed with
// incomplete data. A snapshot of form state is used as initialValues after each
// transition. Each page has an optional submit handler, and the top-level
// submit is called when the final page is submitted.
const Wizard = ({ children, initialValues, onSubmit }) => {
  const [stepNumber, setStepNumber] = useState(0);
  const steps = React.Children.toArray(children);
  const [snapshot, setSnapshot] = useState(initialValues);

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = values => {
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = values => {
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values, bag) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values, bag);
    }
    if (isLastStep) {
      return onSubmit(values, bag);
    } else {
      bag.setTouched({});
      next(values);
    }
  };

  return (
    <Formik
      initialValues={snapshot}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}
    >
      {formik => (
          <Form>
          <VStack spacing="3"> {step}</VStack>
          <HStack w="100%" justifyContent="flex-end" marginTop="2rem">
          {stepNumber > 0 && (
              <Button className="button" onClick={() => previous(formik.values)} type="button">
                Back
              </Button>
            )}
             <Button className="button" bg="buttonGreen"  disabled={formik.isSubmitting} type="submit">
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </HStack>
          <Flex justifyContent="center" my="2" fontSize="2xl" color="lightgray">Step {stepNumber + 1} of {totalSteps}</Flex>
        </Form>
        
      )}
    </Formik>
  );
};

export default Wizard;