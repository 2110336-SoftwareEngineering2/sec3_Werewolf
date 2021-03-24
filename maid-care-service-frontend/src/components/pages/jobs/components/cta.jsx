import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/layout';
import { useModalContext } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { MATCHED, POSTED } from '../../../../constants/post-state';
import { useStores } from '../../../../hooks/use-stores';

const Actions = ({ job, state }) => {
  return state === POSTED ? (
    <PostedActions job={job} />
  ) : state === MATCHED ? (
    <MatchedActions />
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

export default Actions;
