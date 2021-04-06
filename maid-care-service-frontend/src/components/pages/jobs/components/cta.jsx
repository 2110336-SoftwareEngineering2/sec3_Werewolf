import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/layout';
import { useModalContext } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { useContext } from 'react';
import {
  CANCELED,
  CONFIRMED,
  DONE,
  MATCHED,
  POSTED,
  REVIEWED,
} from '../../../../constants/post-state';
import { useStores } from '../../../../hooks/use-stores';
import { ConfirmContext, DiscardJobContext } from './context/ctx';

const Actions = ({ job }) => {
  const { state } = job;
  return (
    <>
      {state === POSTED ? (
        <PostedActions job={job} />
      ) : state === MATCHED ? (
        <MatchedActions />
      ) : state === CONFIRMED ? (
        <ConfirmActions job={job} />
      ) : state === DONE || REVIEWED || CANCELED ? (
        <DoneActions />
      ) : (
        <Text>Error!</Text>
      )}
    </>
  );
};

/**
 * state === posted
 */
const PostedActions = ({ job }) => {
  const { onClose } = useModalContext();
  const { jobStore } = useStores();
  const { _id: jobId } = job;
  const currentJob = jobStore.currentJob;
  const loading = jobStore.loading;

  const handleAccept = async () => {
    try {
      await jobStore.accept({ jobId }); // accept job, wait for customer confirm...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {currentJob && <Text color={`gray.800`}>Cannot accept more than 1 job at a time.</Text>}
      <Button onClick={onClose} variant={`outline`} colorScheme={`red`}>
        Cancel
      </Button>
      <Button
        isLoading={loading}
        disabled={currentJob}
        onClick={handleAccept}
        colorScheme={`green`}>
        Accept
      </Button>
    </>
  );
};

const MatchedActions = () => {
  return (
    <>
      <Button disabled variant={`outline`} colorScheme={`orange`}>
        <Spinner mr={2} /> Waiting Customer to confirm...
      </Button>
    </>
  );
};

const ConfirmActions = ({ job }) => {
  const { setIsConfirmModalOpen } = useContext(ConfirmContext);
  const { setIsDiscardModalOpen } = useContext(DiscardJobContext);

  return (
    <>
      <Button
        colorScheme={`red`}
        onClick={() => {
          setIsDiscardModalOpen(true);
        }}>
        Discard
      </Button>
      <Button
        colorScheme={`orange`}
        onClick={() => {
          setIsConfirmModalOpen(true);
        }}>
        Finish
      </Button>
    </>
  );
};

const DoneActions = () => {
  const { onClose } = useModalContext();

  return (
    <>
      <Button variant={`outline`} onClick={onClose}>
        Close
      </Button>
    </>
  );
};

export default Actions;
