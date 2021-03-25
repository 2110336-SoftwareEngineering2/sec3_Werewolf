import React, { useState } from 'react';
import { job } from '../../../api';
import { useFormikContext } from 'formik';
import {
  Button,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { wait, waitFor } from '@testing-library/dom';

// this file, ButtonField.jsx, is responsible for 3 main job.
// 1. contain all button ( Previous button, Next button, Submit button )
// 2. handle steps increment & decrement when button is clicked.
// 3. Show confirm window when submit button on page3 is clicked.

const ButtonField = ({ steps, setSteps, isPromoAvailable }) => {
  const { values } = useFormikContext();
  const [findmaidStatus, setFindmaidStatus] = useState(false);
  let getStatusFindmaidInterval;

  const handleDecrement = () => {
    if (steps > 1) {
      setSteps(previousStep => previousStep - 1);
    }
  };

  const handleIncrement = () => {
    if (steps <= 5) {
      setSteps(previousStep => previousStep + 1);
    }
  };

  const postJob_findmaidAPI = () => {
    const n_dishes = () => (values.isDishes === false ? 0 : values.amountOfDishes);
    const n_rooms = () => (values.isRooms === false ? 0 : values.areaOfRooms);
    const n_clothes = () => (values.isClothes === false ? 0 : values.amountOfClothes);

    job
      .post('/', {
        workplaceId: values.workspaceId,
        work: [
          {
            typeOfWork: 'Dish Washing',
            description: 'None',
            quantity: parseInt(n_dishes()),
          },
          {
            typeOfWork: 'House Cleaning',
            description: 'None',
            quantity: parseInt(n_rooms()),
          },
          {
            typeOfWork: 'Laundry',
            description: 'None',
            quantity: parseInt(n_clothes()),
          },
        ],
        promotionCode: isPromoAvailable === 'true' ? values.promotionCode : '',
      })
      .then(response => {
        console.log('postJobAPI : ', response);
        var jobId = response.data._id;
        jobPutFindmaidAPI(jobId);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const jobPutFindmaidAPI = jobID => {
    job
      .put(`/${jobID}/find-maid`)
      .then(response => {
        console.log('FindmaidAPI : ', response);
        const findmaidID = response.data._id;
        //getFindmaidStatusAPI(findmaidID);
        getStatusFindmaidInterval = setInterval( () => getFindmaidStatusAPI(findmaidID) , 5000);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getFindmaidStatusAPI = findMaidID => {
    job
      .get(`/${findMaidID}`, {
        timeout: 5000,
      })
      .then(response => {
        console.log('getFindmaidStatusAPI : ', response);
        console.log(response.data.state);
        if (response.data.state == 'matched') {
          console.log("We are matched");
          clearInterval(getStatusFindmaidInterval);
          setFindmaidStatus(true);
          handleIncrement();
        }
        
      })
      .catch(error => {
        console.error(error);
      });
  };

  // This 3 variables is used for submit button.
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <>
      <HStack justify="flex-end" width="100%" bottom="1px">
        {steps > 1 && steps < 5 ? (
          <Button
            width="100px"
            className="button button-register"
            bg="buttonGreen"
            onClick={handleDecrement}>
            Previous
          </Button>
        ) : null}
        {steps < 3 ? (
          <Button width="100px" className="button button-register" bg="buttonGreen" type="summit">
            Next
          </Button>
        ) : null}
        {steps == 3 ? (
          <Button
            width="100px"
            className="button button-register"
            bg="buttonGreen"
            onClick={() => setIsOpen(true)}>
            Summit
          </Button>
        ) : null}
      </HStack>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Do you want to confirm ?
            </AlertDialogHeader>
            <AlertDialogBody>
              The system will perform the match immediately after you have confirmed.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                type="submit"
                onClick={() => {
                  onClose();
                  handleIncrement();
                  postJob_findmaidAPI();
                }}
                ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ButtonField;
