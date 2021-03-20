import React, { useState, useEffect } from 'react';

import { useFormikContext, Field } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { workspace } from '../../../api';
import { observer } from 'mobx-react-lite';
import { Link, HStack, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';

const Page1_TaskDescription = observer(() => {
  const { values } = useFormikContext();
  const [error, setError] = useState(false);
  const [myWorkspaces, setMyWorkspaces] = useState([]);

  // this function will get workspace from backend server and then
  // set the value in myWorkspaces by perfrom setMyWorkspaces(response.data)
  const getWorkspaceFromServer = () => {
    workspace
      .get('/', {
        timeout: 5000,
      })
      .then(response => {
        setMyWorkspaces(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
        setError(error);
      });
  };

  // this useEffec function will work only when page is reloaded.
  // that mean it will get workspace every time when when page is reloaded.
  useEffect(() => {
    getWorkspaceFromServer();
  }, []);

  return (
    <>
      <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
        <FormLabel mb="0">Location</FormLabel>
        <Select id="selectButton" name="workspaceId" mb="5px">
          <option value="">Select your workplace location</option>
          {/* Note : this option tag will render every time when user click something on the screen */}
          {myWorkspaces.map(myWorkspace => {
            return <option value={myWorkspace._id}>{myWorkspace.description}</option>;
          })}
        </Select>
        <Link as={RouterLink} to="/workspace" mt="10px">
          Add new workspace
        </Link>
      </FormControl>
      <FormLabel mb="5px">Type of Work</FormLabel>
      <FormControl id="dishes" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isDishes" />
          <Text>Dish Washing</Text>
        </HStack>
        <TextInputField
          label=""
          name="amountOfDishes"
          type="number"
          placeholder="Amount of dishes (e.g. 20)"
          isDisabled={!values.isDishes}
        />
      </FormControl>
      <FormControl id="rooms" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isRooms" />
          <Text>Room cleaning</Text>
        </HStack>
        <TextInputField
          label=""
          name="areaOfRooms"
          placeholder="Amount of the room in square meter (e.g. 100)"
          isDisabled={!values.isRooms}
        />
      </FormControl>
      <FormControl id="clothes" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isClothes" />
          <Text>Clothes Ironing</Text>
        </HStack>
        <TextInputField
          label=""
          name="amountOfClothes"
          placeholder="Amount of clothes (e.g. 10)"
          isDisabled={!values.isClothes}
        />
      </FormControl>
    </>
  );
});

export default Page1_TaskDescription;
