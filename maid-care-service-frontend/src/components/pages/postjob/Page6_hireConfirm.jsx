import React from 'react';
import { useHistory } from 'react-router-dom';
import { VStack, Text, Button} from '@chakra-ui/react';

const Page6_hireConfirm = ({ isConfirm }) => {
  const history = useHistory();

  const routeChange = () => {
    let path = `/post`;
    history.push(path);
  };

  const showIcon = () => {
    switch (isConfirm) {
      case 'null':
      case 'fail':
        return (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="red"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <Text fontWeight="bold" fontSize="25px" color="red.500">
              System Fail
            </Text>
          </>
        );

      case 'true':
        return (
          <>
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="green"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <Text fontWeight="bold" fontSize="25px" color="green.600">
              Hire Confirm
            </Text>
          </>
        );

      case 'false':
        return (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="red"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <Text fontWeight="bold" fontSize="25px" color="red.500">
              Hire Canceled
            </Text>
          </>
        );

      case 'noMatch':
        return (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="red"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <Text fontWeight="bold" fontSize="20px" color="red.500">
              There is no maid around you
            </Text>
          </>
        );
    }
  };

  return (
    <VStack>
      {showIcon()}
      <Button
        width="200px"
        className="button button-register"
        bg={isConfirm == 'true' ? 'buttonGreen' : 'red'}
        onClick={routeChange}>
        Back to your posts.
      </Button>
    </VStack>
  );
};

export default Page6_hireConfirm;
