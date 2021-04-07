import { Button } from '@chakra-ui/button';
import { useModalContext } from '@chakra-ui/modal';
import React, { useContext } from 'react';
import { DONE, REVIEWED } from '../../../constants/post-state';
import { ReviewModalContext } from '../context/ReviewModalContext';

const CustomerAction = ({ job }) => {
  const { _id: jobId, state } = job;
  const { onClose } = useModalContext();
  const { onReviewOpen }  = useContext(ReviewModalContext) ;

  return state === DONE ? ( // wait for reviewed
    <>
      <Button colorScheme={`green`} onClick={onReviewOpen}>
        Write Your Review
      </Button>
    </>
  ) : (
    <>
      {state === REVIEWED && (
        <Button variant={`outline`} colorScheme={`green`} onClick={onClose}>
          Request for refund
        </Button>
      )}
      <Button variant={`outline`} onClick={onClose}>
        Close
      </Button>
    </>
  );
};

export default CustomerAction;
