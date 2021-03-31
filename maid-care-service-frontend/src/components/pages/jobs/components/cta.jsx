import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Text } from '@chakra-ui/layout';
import { useModalContext } from '@chakra-ui/modal';
import { Portal } from '@chakra-ui/portal';
import { Spinner } from '@chakra-ui/spinner';
import { toast } from '@chakra-ui/toast';
import { CONFIRMED, DONE, MATCHED, POSTED } from '../../../../constants/post-state';
import { useStores } from '../../../../hooks/use-stores';
import { AlertModal, ConfirmModal, SuccessModal } from './modals';

const Actions = ({ job, state }) => {
  return state === POSTED ? (
    <PostedActions job={job} />
  ) : state === MATCHED ? (
    <MatchedActions />
  ) : state === CONFIRMED ? (
    <ConfirmActions job={job} />
  ) : state === DONE ? (
    <DoneActions />
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
  const alertDisclosure = useDisclosure();
  const confirmDisclosure = useDisclosure();
  const successDisclosure = useDisclosure();

  return (
    <>
      <Button colorScheme={`red`} onClick={alertDisclosure.onOpen}>
        Discard
      </Button>
      <Button colorScheme={`orange`} onClick={confirmDisclosure.onOpen}>
        Make a job done
      </Button>

      <AlertModal {...alertDisclosure} />

      <Portal>
        <ConfirmModal
          job={job}
          {...confirmDisclosure}
          onSuccess={() => toast({ description: 'some text' })}
        />
      </Portal>
    </>
  );
};

const DoneActions = () => {
  return <></>;
};

export default Actions;
