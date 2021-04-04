import React, { useEffect, useState } from 'react';
import {
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import PostModal from './components/PostModal.jsx'
import { job } from './../../../api';

// Re

const Review = () => {
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
        console.log('get job/{uid} : ', response);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchJobById();
  }, [])


  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PostModal isOpen={isOpen} onClose={onClose} job={myJob === undefined ? '' : myJob} fetchJobById={fetchJobById}/>
    </>
  );
};

export default Review;
