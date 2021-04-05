import React from 'react';
import { observer } from 'mobx-react-lite';

import { VStack, HStack, Input, Image, Spinner, IconButton, Box, Stack } from '@chakra-ui/react';

import {SingleImageStore} from '../../../store/Image'


export const SingleUpload = observer(() => {
  const singleImageStore  = new SingleImageStore();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    try {
      singleImageStore.upload(file);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(singleImageStore.isUploading, singleImageStore.path)

  return (
    <Box className="App">
      <VStack spacing={3}>
        <Input type="file" onChange={handleUpload}></Input>
        <HStack spacing={2}>
          {singleImageStore.isUploading ? (
            <Spinner size="xl" />
          ) : (
            <Image src={singleImageStore.path ?? '/profilepic'} alt="upload photo" boxSize="150px" />
          )}
        </HStack>
      </VStack>
    </Box>
  );
});
