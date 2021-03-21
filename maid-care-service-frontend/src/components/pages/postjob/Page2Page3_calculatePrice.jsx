import React, { useState  } from 'react';
import { useFormikContext } from 'formik';
import { promotion } from '../../../api';
import { observer } from 'mobx-react-lite';
import {
  Button,
  HStack,
  FormControl,
  Text,
} from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';

const Page2Page3_calculatePrice = observer(({ steps, putResponse, isPromoAvailable, setPromoAvailable }) => {
    const { values } = useFormikContext();
    const [promoData, setPromoData] = useState('');
  
    const getPromotioncodeFromServer = () => {
      promotion
        .get(`/${values.promotionCode}`, {
          timeout: 5000,
        })
        .then(response => {
          setPromoAvailable('true');
          setPromoData(response.data);
          console.log(promoData);
        })
        .catch(error => {
          console.error(error);
          setPromoData("");
          setPromoAvailable('false');
        });
    };
  
    const promotionBox = () => {
      if (steps == 2) {
        return (
          <FormControl id="clothes" width={{ sm: '270px', md: '368px' }} mt="40px">
            <TextInputField
              label="Promotion Code"
              name="promotionCode"
              placeholder="Apply Your Promotion Code"
            />
            <HStack mt="5px">
              <Button onClick={getPromotioncodeFromServer} width="100px">
                Verify
              </Button>
              <Text
                color={
                  isPromoAvailable === 'true'
                    ? 'green'
                    : isPromoAvailable === 'false'
                    ? 'red'
                    : 'white'
                }>
                {isPromoAvailable === 'true'
                  ? 'Your promotion code is available'
                  : isPromoAvailable === 'false'
                  ? 'Your promotion code is unavailable'
                  : ''}
              </Text>
            </HStack>
          </FormControl>
        );
      } else if (steps == 3) {
        return (
          <>
            <HStack justify="space-between" width="100%" mt="20px">
              <Text fontFamily="body">Promotion (Discount Rate)</Text>
              <Text fontFamily="body" fontWeight="bold">
                {isPromoAvailable === 'true' ? `${promoData.discountRate}%` : '0%'}
              </Text>
            </HStack>
            <HStack justify="space-between" width="100%">
              <Text fontFamily="body" fontWeight="bold">
                Total price
              </Text>
              <Text fontFamily="body" fontWeight="bold">
                {putResponse.cost}
              </Text>
            </HStack>
          </>
        );
      }
      return <div></div>;
    };
  
    return (
      <FormControl mb="20px" id="house-no" width={{ sm: '270px', md: '368px' }}>
        <Text mb="3px" fontWeight="3px" fontSize="20px" fontFamily="body">
          Total Price
        </Text>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body">
            {values.amountOfDishes == '' || values.isDishes === false ? '0' : values.amountOfDishes}{' '}
            Dishes
          </Text>
          <Text fontFamily="body">
            {putResponse === undefined ? 'Loading...' : putResponse.work[0].cost}
          </Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body">
            {values.areaOfRooms == '' || values.isRooms === false ? '0' : values.areaOfRooms} Square
            meters of Rooms
          </Text>
          <Text fontFamily="body">
            {putResponse === undefined ? 'Loading...' : putResponse.work[1].cost}
          </Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body">
            {values.amountOfClothes == '' || values.isClothes === false
              ? '0'
              : values.amountOfClothes}{' '}
            Clothes
          </Text>
          <Text fontFamily="body">
            {putResponse === undefined ? 'Loading...' : putResponse.work[2].cost}
          </Text>
        </HStack>
        <HStack justify="space-between" width="100%">
          <Text fontFamily="body" fontWeight="bold">
            Total price
          </Text>
          <Text fontFamily="body" fontWeight="bold">
            {putResponse === undefined
              ? ''
              : putResponse.work[0].cost + putResponse.work[1].cost + putResponse.work[2].cost}
          </Text>
        </HStack>
        {promotionBox()}
      </FormControl>
    );
  });


  export default Page2Page3_calculatePrice;
  
  