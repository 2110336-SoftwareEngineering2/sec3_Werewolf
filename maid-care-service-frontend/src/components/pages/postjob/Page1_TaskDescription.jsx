import React, { useState, useEffect } from 'react';

import { useFormikContext, Field } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { workspace } from '../../../api';
import { observer } from 'mobx-react-lite';
import { Link, HStack, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';

const Page1_TaskDescription = observer(() => {
  const { values } = useFormikContext();
  const [myWorkspaces, setMyWorkspaces] = useState([]);

  // this function will get workspace from backend server and then
  // set the value in myWorkspaces by perfroming setMyWorkspaces(response.data)
  const getWorkspaceAPI = () => {
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
      });
  };

  // this useEffect function will work only when page is reloaded.
  // that mean it will get workspace every time when page is reloaded.
  useEffect(() => {
    getWorkspaceAPI();
  }, []);

  return (
    <>
      <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
        <FormLabel mb="0">Location</FormLabel>
        <Field as={Select} id="selectButton" name="workplaceId" mb="5px">
          <option value="" >Select your workplace location</option>
          {myWorkspaces.map(myWorkspace => {
            return <option key={myWorkspace._id} value={myWorkspace._id} >{myWorkspace.description}</option>;
          })}
        </Field>
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
