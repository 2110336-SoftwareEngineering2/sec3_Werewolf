import React from 'react';
import {observer} from 'mobx-react-lite';
import {toJS} from 'mobx';

import { VStack, HStack, Input,Image, Spinner, IconButton,Box,Stack } from '@chakra-ui/react';

import {MultiImageStore} from '../../../store/Image'
import { CloseIcon } from '@chakra-ui/icons';


const multiImageStore = new MultiImageStore();


export const UploadImage = observer(() => {
  
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if(file.name in toJS(multiImageStore.path_list)){
      window.alert('This photo already exists')
    }
    else{
      try{
        multiImageStore.upload(file,file.name)
      }
      catch(error){
        console.log(error)
      }
    }
  };

  

  const handleDelete = (e) => {
    const img_name = e.currentTarget.getAttribute('name')
    multiImageStore.delete(img_name)
    
  }

  //console.log(toJS(multiImageStore.path_list))

  return (
    <Box className="App">
      <VStack spacing={3}>
        <Input type="file" onChange={handleUpload} isDisabled={multiImageStore.isUploading}></Input>
        <HStack spacing={2}>
            {
              Object.keys(multiImageStore.path_list).map((name,index) => {
                const url = multiImageStore.path_list[name];

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
            {multiImageStore.isUploading ? <Spinner size="xl"/> : null}
        </HStack>
      </VStack>
    </Box>
  );
});
