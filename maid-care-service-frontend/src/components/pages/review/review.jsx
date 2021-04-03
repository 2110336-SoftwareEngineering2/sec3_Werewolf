import React from 'react';
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

// Re

const Review = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PostModal isOpen={isOpen} onClose={onClose}/>
    </>
  );
};

export default Review;
