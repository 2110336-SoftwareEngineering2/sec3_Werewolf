import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Container,
  Textarea,
  VStack,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  List,
  ButtonGroup,
  Heading,
} from '@chakra-ui/react';
import PostModal from './components/PostModal.jsx'
import { job } from './../../../api';

// Re

const Review = ( ) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [myJob, setMyJob] = useState();
  const jobId = '6064b08bdefaec00408fb4a3';

  const fetchJobById = () => {
    job
      .get(`/${jobId}`, {
        timeout: 5000,
      })
      .then(response => {
        setMyJob(response.data);
        console.log('get job/ : ', response);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchJobById();
  }, [])

  const workspaceId = '6056e37ab24470004087a7de';
  const maidId = '605ca4cbfc41950040c4c1d9';

  console.log('x', myJob);


  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PostModal isOpen={isOpen} onClose={onClose} job={myJob}/>
    </>
  );
};

export default Review;
