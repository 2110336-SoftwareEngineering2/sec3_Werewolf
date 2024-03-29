import React, { useEffect, useState } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { job } from '../../../api';

const Page4_maidInfo = ({
  setSteps,
  handleIncrement,
  isPromoAvailable,
  setConfirm,
  setMaidId,
  setJobId,
}) => {
  const { values } = useFormikContext();
  const [works, setWorks] = useState([]);
  let getStatusFindmaidInterval;

  const PostJob_findmaidAPI = () => {
    const n_dishes = () => (values.isDishes === false ? 0 : values.amountOfDishes);
    const n_rooms = () => (values.isRooms === false ? 0 : values.areaOfRooms);
    const n_clothes = () => (values.isClothes === false ? 0 : values.amountOfClothes);
    let works = [];

    console.log('isDishes', values.isDishes);
    if (values.isDishes) {
      works = [
        ...works,
        {
          typeOfWork: 'Dish Washing',
          description: values.descriptionOfDishes,
          quantity: parseInt(n_dishes()),
        },
      ];
    }

    if (values.isRooms) {
      works = [
        ...works,
        {
          typeOfWork: 'House Cleaning',
          description: values.descriptionOfRooms,
          quantity: parseInt(n_rooms()),
        },
      ];
    }

    if (values.isClothes) {
      works = [
        ...works,
        {
          typeOfWork: 'Laundry',
          description: values.descriptionOfClothes,
          quantity: parseInt(n_clothes()),
        },
      ];
    }

    job
      .post('/', {
        workplaceId: values.workplaceId,
        work: works,
        promotionCode: isPromoAvailable === 'true' ? values.promotionCode : '',
      })
      .then((response) => {
        console.log('post job/ : ', response);
        var jobId = response.data._id;
        setJobId(jobId);
        jobPutFindmaidAPI(jobId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const jobPutFindmaidAPI = (jobID) => {
    job
      .put(`/${jobID}/find-maid`)
      .then((response) => {
        console.log('put job/{uid}/find-maid : ', response);
        const findmaidID = response.data._id;
        getStatusFindmaidInterval = setInterval(() => getFindmaidStatusAPI(findmaidID), 5000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getFindmaidStatusAPI = (findMaidID) => {
    job
      .get(`/${findMaidID}`, {
        timeout: 5000,
      })
      .then((response) => {
        console.log('get job/{jobId} : ', response);
        if (response.data.state == 'matched') {
          clearInterval(getStatusFindmaidInterval);
          var maidId = response.data.maidId;
          setMaidId(maidId);
          handleIncrement();
          console.log('This is your maid', response.data.maidId);
        }
      })
      .catch((error) => {
        console.error(error);
        clearInterval(getStatusFindmaidInterval);
        setConfirm('noMatch');
        setSteps(6);
      });
  };

  useEffect(() => {
    PostJob_findmaidAPI();
  }, []);

  return (
    <>
      <Box
        fontSize={{ base: 'xl', md: '2xl' }}
        width="100%"
        fontWeight="bold"
        textAlign="center"
        mb="50px">
        We are finding a Maid for you
        <br />
        Please wait !
      </Box>
      <VStack direction="row" spacing={10}>
        <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="green.500" />
      </VStack>
    </>
  );
};

export default Page4_maidInfo;
