import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Center, Container, Flex, Heading, HStack, List, ListItem, Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { observer } from 'mobx-react-lite';
import React, { memo, useEffect, useState } from 'react';
import { Icon, Box } from '@chakra-ui/react';
import { fetchCustomerAllJobs } from '../../../api';
import { CANCELED, DONE, REVIEWED } from '../../../constants/post-state';
import { useStores } from '../../../hooks/use-stores';
import { FaPlusCircle } from 'react-icons/fa';
import CustomerAction from '../../shared/jobs/CustomerAction';
import { useHistory } from 'react-router-dom';

import JobItemList from '../../shared/jobs/JobItemList';
import JobItemModal from '../jobs/components/JobItemModal';
import PostModal from '../review/components/PostModal';
import ReviewFormModal from '../review/components/ReviewFormModal';
import RefundFormModal from '../review/components/RefundFormModal';
import { ReviewModalContext } from '../../shared/context/ReviewModalContext';
import { RefundModalContext } from '../../shared/context/RefundModalContext';

const PostPage = observer(() => {
  const { userStore } = useStores();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState('allJobs');
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();
  const { isOpen: isRefundOpen, onOpen: onRefundOpen, onClose: onRefundClose } = useDisclosure();

  // Mobx User Store
  const curUser = userStore.userData;
  const history = useHistory();

  const routeChange = () => {
    let path = `/post/create`;
    history.push(path);
  };

  const fetchAllPost = async () => {
    setLoading(true);
    try {
      const { data: posts } = await fetchCustomerAllJobs();
      setPosts(posts);
    } catch (error) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPost();
  }, []);

  const handleSelect = (job) => {
    setSelected(job);
    onOpen();
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const handleRefresh = () => fetchAllPost();

  const compareJobs = (x, y) => {
    return new Date(x.expiryTime) > new Date(y.expiryTime);
  };

  const renderSelectedJobModal = () => {
    return (
      <>
        <RefundModalContext.Provider value={{ isRefundOpen, onRefundOpen, onRefundClose }}>
          <ReviewModalContext.Provider value={{ isReviewOpen, onReviewOpen, onReviewClose }}>
            <JobItemModal
              job={selected}
              isOpen={isOpen}
              onClose={handleClose}
              actions={CustomerAction}
            />
            <ReviewFormModal job={selected} isOpen={isReviewOpen} onClose={onReviewClose} />
            <RefundFormModal job={selected} isOpen={isRefundOpen} onClose={onRefundClose} />
          </ReviewModalContext.Provider>
        </RefundModalContext.Provider>
      </>
    );
  };

  return (
    <Flex
      direction="column"
      minH={`100vh`}
      bgColor="gray.300"
      padding={'20vh'}
      justifyContent="flex-start"
      alignItems="center">
      <Container borderRadius={4} bgColor="gray.100" p={6} w={`70vw`} maxW={1200}>
        <HStack spacing={4} alignItems={`baseline`}>
          <Heading>Post</Heading>
          <Button
            variant={`link`}
            textDecoration={`underline`}
            fontSize={`lg`}
            color={mode === 'allJobs' && 'green.400'}
            onClick={() => setMode('allJobs')}>
            All Posts
          </Button>
          <Button
            variant={`link`}
            textDecoration={`underline`}
            fontSize={`lg`}
            color={mode === 'history' && 'green.400'}
            onClick={() => setMode('history')}>
            History
          </Button>
        </HStack>
        <HStack justifyContent="flex-end">
          <Box onClick={routeChange} cursor="pointer">
            <Icon as={FaPlusCircle} w={12} h={12} color={`green.500`} />
          </Box>
          <Button onClick={() => handleRefresh()} bgColor="brandGreen" color="white">
            Refresh
          </Button>
        </HStack>
        <List spacing={6} mt={4} p={3} justifyContent="center">
          {loading ? (
            <Center>
              <Spinner size={`xl`} thickness={6} />
            </Center>
          ) : posts.length ? (
            posts
              .filter((job) =>
                mode === 'history' ? [DONE, REVIEWED, CANCELED].includes(job.state) : true
              )
              .sort((lhs, rhs) => !compareJobs(lhs, rhs))
              .map((job) => {
                return (
                  <ListItem key={job._id} my={2} minW={`90%`} onClick={() => handleSelect(job)}>
                    <JobItemList job={job} />
                  </ListItem>
                );
              })
          ) : (
            <Text>There is no item.</Text>
          )}
        </List>
      </Container>
      {selected && renderSelectedJobModal()}
    </Flex>
  );
});

export default memo(PostPage);
