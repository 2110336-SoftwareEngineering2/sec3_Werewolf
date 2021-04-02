import React, { useState} from 'react';
import ReactDOM from 'react-dom';
import { VStack, HStack, Input,Image } from '@chakra-ui/react';

import firebase from 'firebase/app';
import storage from '../firebase/firebase.js';

import { uploader } from './server.jsx';

export const UploadImage = () => {
  const [files, setFiles] = useState([]);
  var storageRef = storage.ref();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const url = await uploader(file)
  };

  return (
    <div className="App">
      <VStack spacing={3}>
        <Input type="file" onChange={handleUpload}></Input>
      </VStack>
    </div>
  );
};
