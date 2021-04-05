import { Heading, Text } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { useEffect, useState } from 'react';
import { fetchWorkspaceById } from '../../../../api';

const Address = ({ workplaceId }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // Get Job Address
    (async () => {
      try {
        setLoading(true);
        const response = await fetchWorkspaceById(workplaceId);
        const wsp = response.data;
        setAddress(wsp.description);
        console.log(wsp);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [workplaceId]);

  return (
    <>
      <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
        Address
      </Heading>
      <Skeleton isLoaded={!loading}>
        <Text>{address}</Text>
      </Skeleton>
    </>
  );
};

export default Address;
