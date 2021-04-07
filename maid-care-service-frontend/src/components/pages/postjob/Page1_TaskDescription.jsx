import React, { useState, useEffect } from 'react';
import { useFormikContext, Field } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { workspace } from '../../../api';
import { observer } from 'mobx-react-lite';
import { Link, HStack, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';
import PopoverForm from './components/WorkDescrtiptionPopover';

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
      .then((response) => {
        setMyWorkspaces(response.data);
        console.log('get workspace/ : ', response.data);
      })
      .catch((error) => {
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
        <FormLabel mb="0" fontWeight="bold" fontSize="lg">
          Location
        </FormLabel>
        <TextInputField as={Select} id="selectButton" name="workplaceId" mb="5px">
          <option value="">Select your workplace location</option>
          {myWorkspaces.map((myWorkspace) => {
            return (
              <option key={myWorkspace._id} value={myWorkspace._id}>
                {myWorkspace.description}
              </option>
            );
          })}
        </TextInputField>
        <Link color="green.400" as={RouterLink} to="/workspace" mt={`1vw`}>
          Add new workspace
        </Link>
      </FormControl>
      <FormLabel mb="5px">Type of Work</FormLabel>
      <FormControl id="dishes" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isDishes" />
          <Text>Dish Washing</Text>
        </HStack>
        <HStack>
          <TextInputField
            label=""
            name="amountOfDishes"
            type="number"
            placeholder="Amount of dishes (e.g. 20)"
            isDisabled={!values.isDishes}
          />
          <PopoverForm
            label="Description for Dish Washing"
            name="descriptionOfDishes"
            isDisabled={!values.isDishes}
          />
        </HStack>
      </FormControl>
      <FormControl id="rooms" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isRooms" />
          <Text>Room cleaning</Text>
        </HStack>
        <HStack>
          <TextInputField
            label=""
            name="areaOfRooms"
            placeholder="Amount of the room in square meter (e.g. 100)"
            isDisabled={!values.isRooms}
          />
          <PopoverForm
            label="Description for Room Cleaning"
            name="descriptionOfRooms"
            isDisabled={!values.isRooms}
          />
        </HStack>
      </FormControl>
      <FormControl id="clothes" width={{ sm: '270px', md: '368px' }}>
        <HStack>
          <Field type="checkbox" name="isClothes" />
          <Text>Clothes Ironing</Text>
        </HStack>
        <HStack>
          <TextInputField
            label=""
            name="amountOfClothes"
            placeholder="Amount of clothes (e.g. 10)"
            isDisabled={!values.isClothes}
          />
          <PopoverForm
            label="Description for Clothes Ironing"
            name="descriptionOfClothes"
            isDisabled={!values.isClothes}
          />
        </HStack>
      </FormControl>
    </>
  );
});

export default Page1_TaskDescription;
