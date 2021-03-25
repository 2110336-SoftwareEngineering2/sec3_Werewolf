import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Text } from '@chakra-ui/layout';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useModalContext,
} from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { useRef } from 'react';
import { CONFIRMED, MATCHED, POSTED } from '../../../../constants/post-state';
import { useStores } from '../../../../hooks/use-stores';

const Actions = ({ job, state }) => {
  return state === POSTED ? (
    <PostedActions job={job} />
  ) : state === MATCHED ? (
    <MatchedActions />
  ) : state === CONFIRMED ? (
    <ConfirmActions />
  ) : (
    <Text>Error!</Text>
  );
};

/**
 * state === posted
 */
const PostedActions = ({ job }) => {
  const { onClose } = useModalContext();
  const { jobStore } = useStores();
  const { _id: jobId } = job;

  const handleAccept = async () => {
    try {
      await jobStore.accept({ jobId }); // accept job, wait for customer confirm...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button onClick={onClose} variant={`outline`} colorScheme={`red`}>
        Cancel
      </Button>
      <Button onClick={handleAccept} colorScheme={`green`}>
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

const ConfirmActions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button colorScheme={`red`} onClick={onOpen}>
        Discard the current Job
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize={`lg`}>Discard the current Job</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure?{' '}
            <Text as={`span`} color={`red`}>
              You will get rate 1 star if you discard job.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme={`red`} onClick={onClose} ml={3}>
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Actions;
