import { Avatar } from '@chakra-ui/avatar';
import { Text } from '@chakra-ui/layout';
import { SkeletonCircle, SkeletonText } from '@chakra-ui/skeleton';
import React, { useEffect, useState } from 'react';
import { fetchUserById } from '../../../../api';

const UserStatus = ({ uid, user }) => {
  const [u, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (user) {
        setUser(user);
      } else {
        try {
          const { data } = await fetchUserById(uid);
          setUser(data);
        } catch (error) {
          console.error(error);
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, [uid, user]);

  return loading || !u ? (
    <>
      <SkeletonCircle size={10} />
      <SkeletonText noOfLines={2} />
    </>
  ) : (
    <>
      <Avatar></Avatar>
      <Text fontSize={`lg`} fontWeight={`bold`}>
        {u.firstname} {u.lastname}
      </Text>
    </>
  );
};

export default UserStatus;
