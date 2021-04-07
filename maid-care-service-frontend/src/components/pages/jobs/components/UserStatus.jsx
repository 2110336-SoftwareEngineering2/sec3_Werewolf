import { Avatar } from '@chakra-ui/avatar';
import { Text } from '@chakra-ui/layout';
import { SkeletonCircle, SkeletonText } from '@chakra-ui/skeleton';
import { useEffect, useState } from 'react';
import { fetchUserById } from '../../../../api';

const UserStatus = ({ uid, user }) => {
  const [u, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) setLoading(true);
      if (user) {
        if (isMounted) setUser(user);
      } else {
        try {
          const { data } = await fetchUserById(uid);
          if (isMounted) setUser(data);
        } catch (error) {
          console.error(error);
          if (isMounted) setUser(null);
        }
      }
      if (isMounted) setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [uid, user]);

  return loading ? (
    <>
      <SkeletonCircle size={10} />
      <SkeletonText noOfLines={2} />
    </>
  ) : !u ? (
    <>
      <Avatar></Avatar>
      <Text fontSize={`lg`} fontWeight={`bold`}>
        No user
      </Text>
    </>
  ) : (
    <>
      <Avatar src={u.profilePicture}></Avatar>
      <Text fontSize={`lg`} fontWeight={`bold`}>
        {u.firstname} {u.lastname}
      </Text>
    </>
  );
};

export default UserStatus;
