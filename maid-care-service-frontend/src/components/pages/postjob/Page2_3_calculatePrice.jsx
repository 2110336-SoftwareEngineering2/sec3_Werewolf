import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { promotion, job } from '../../../api';
import { observer } from 'mobx-react-lite';
import { Button, HStack, FormControl, Text } from '@chakra-ui/react';
import { TextInputField } from '../../shared/FormikField';

const Page2Page3_calculatePrice = observer(({ steps, isPromoAvailable, setPromoAvailable }) => {
  const { values } = useFormikContext();
  const [costInfo, setCostInfo] = useState();
  const [promoData, setPromoData] = useState('');

  const jobPutCostAPI = () => {
    const n_dishes = () => (values.isDishes === false ? 0 : values.amountOfDishes);
    const n_rooms = () => (values.isRooms === false ? 0 : values.areaOfRooms);
    const n_clothes = () => (values.isClothes === false ? 0 : values.amountOfClothes);

    job
      .put('/cost', {
        workplaceId: values.workplaceId,
        work: [
          {
            typeOfWork: 'Dish Washing',
            description: values.descriptionOfDishes,
            quantity: parseInt(n_dishes()),
          },
          {
            typeOfWork: 'House Cleaning',
            description: values.descriptionOfRooms,
            quantity: parseInt(n_rooms()),
          },
          {
            typeOfWork: 'Laundry',
            description: values.descriptionOfClothes,
            quantity: parseInt(n_clothes()),
          },
        ],
        promotionCode: isPromoAvailable === 'true' ? values.promotionCode : '',
      })
      .then(response => {
        console.log('put job/cost', response);
        setCostInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    jobPutCostAPI();
  }, [steps]);

  const getPromotioncodeAPI = () => {
    promotion
      .get(`/${values.promotionCode}`, {
        timeout: 5000,
      })
      .then(response => {
        setPromoAvailable('true');
        setPromoData(response.data);
        console.log('get promotion/{code}', response);
      })
      .catch(error => {
        console.error(error);
        setPromoData('');
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
            <Button onClick={getPromotioncodeAPI} width="100px">
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
              {costInfo.cost}
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
          {costInfo === undefined ? 'Loading...' : costInfo.work[0].cost}
        </Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body">
          {values.areaOfRooms == '' || values.isRooms === false ? '0' : values.areaOfRooms} Square
          meters of Rooms
        </Text>
        <Text fontFamily="body">
          {costInfo === undefined ? 'Loading...' : costInfo.work[1].cost}
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
          {costInfo === undefined ? 'Loading...' : costInfo.work[2].cost}
        </Text>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontFamily="body" fontWeight="bold">
          Total price
        </Text>
        <Text fontFamily="body" fontWeight="bold">
          {costInfo === undefined
            ? ''
            : costInfo.work[0].cost + costInfo.work[1].cost + costInfo.work[2].cost}
        </Text>
      </HStack>
      {promotionBox()}
    </FormControl>
  );
});

export default Page2Page3_calculatePrice;
