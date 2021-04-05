import { Button } from '@chakra-ui/button';
import { useModalContext } from '@chakra-ui/modal';
import React from 'react';
import { DONE } from '../../../constants/post-state';

const CustomerAction = ({ job }) => {
  const { _id: jobId, state } = job;
  const { onClose } = useModalContext();

  return state === DONE ? ( // wait for reviewed
    <>
      <Button colorScheme={`green`} onClick={() => {}}>
        Write Your Review
      </Button>
    </>
  ) : (
    <>
      <Button variant={`outline`} onClick={onClose}>
        Close
      </Button>
    </>
  );
};

export default CustomerAction;
