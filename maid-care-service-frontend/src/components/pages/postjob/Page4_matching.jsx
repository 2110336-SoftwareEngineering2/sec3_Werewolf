import React, { useEffect } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { job } from '../../../api';

const Page4_maidInfo = ({ setSteps, handleIncrement, isPromoAvailable, setConfirm, setMaidId, setJobId }) => {
  const { values } = useFormikContext();
  let getStatusFindmaidInterval;

  const postJob_findmaidAPI = () => {
    const n_dishes = () => (values.isDishes === false ? 0 : values.amountOfDishes);
    const n_rooms = () => (values.isRooms === false ? 0 : values.areaOfRooms);
    const n_clothes = () => (values.isClothes === false ? 0 : values.amountOfClothes);

    job
      .post('/', {
        workplaceId: values.workplaceId,
        work: [
          {
            typeOfWork: 'Dish Washing',
            description: 'None',
            quantity: parseInt(n_dishes()),
          },
          {
            typeOfWork: 'House Cleaning',
            description: 'None',
            quantity: parseInt(n_rooms()),
          },
          {
            typeOfWork: 'Laundry',
            description: 'None',
            quantity: parseInt(n_clothes()),
          },
        ],
        promotionCode: isPromoAvailable === 'true' ? values.promotionCode : '',
      })
      .then(response => {
        console.log('post job/ : ', response);
        var jobId = response.data._id;
        setJobId(jobId);
        jobPutFindmaidAPI(jobId);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const jobPutFindmaidAPI = jobID => {
    job
      .put(`/${jobID}/find-maid`)
      .then(response => {
        console.log('put job/{uid}/find-maid : ', response);
        const findmaidID = response.data._id;
        getStatusFindmaidInterval = setInterval(() => getFindmaidStatusAPI(findmaidID), 5000);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getFindmaidStatusAPI = findMaidID => {
    job
      .get(`/${findMaidID}`, {
        timeout: 5000,
      })
      .then(response => {
        console.log('get job/{jobId} : ', response);
        if (response.data.state == 'matched') {
          clearInterval(getStatusFindmaidInterval);
          var maidId = response.data.maidId;
          setMaidId(maidId);
          handleIncrement();
          console.log('This is your maid', response.data.maidId);
        }
      })
      .catch(error => {
        console.error(error);
        clearInterval(getStatusFindmaidInterval);
        setConfirm('noMatch');
        setSteps(6);
      });
  };

  useEffect(() => {
    postJob_findmaidAPI();
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
        <VStack mt="20px">
          <Text color="green">The system will notify you when pairing is complete.</Text>
        </VStack>
      </VStack>
    </>
  );
};

export default Page4_maidInfo;
