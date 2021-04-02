import React from 'react';
import {observer} from 'mobx-react-lite';

import { VStack, HStack, Input,Image, Spinner, IconButton,Box,Stack } from '@chakra-ui/react';

import {useStores} from '../../../hooks/use-stores'
import { CloseIcon } from '@chakra-ui/icons';

export const UploadImage = observer(() => {

  const {imageStore} = useStores();
  
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    try{
      imageStore.upload(file,file.name)
    }
    catch(error){
      console.log(error)
    }
  };

  const handleDelete = (e) => {
    const img_name = e.currentTarget.getAttribute('name')
    imageStore.delete(img_name)
    
  }

  return (
    <Box className="App">
      <VStack spacing={3}>
        <Input type="file" onChange={handleUpload}></Input>
        <HStack spacing={2}>
            {
              Object.keys(imageStore.path_list).map((name,index) => {
                const url = imageStore.path_list[name];

                return(
                  <Stack key={index} className="overlay-parent" boxSize="105px">
                  <div className="overlay-child" name={name} onClick={handleDelete}>
                    <IconButton icon={<CloseIcon/>} size="xs" isRound="true" colorScheme="red" />
                  </div>
                  <Image src={url} boxSize="100px"/>
                </Stack>
                )
              })
            }
            {imageStore.isUploading ? <Spinner size="xl"/> : null}
        </HStack>
      </VStack>
    </Box>
  );
});
