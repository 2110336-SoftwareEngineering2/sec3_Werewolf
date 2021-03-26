import React, { useEffect } from 'react';
import { Box, Stack, Spinner } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { job } from '../../../api';

const Page4_maidInfo = ( {setSteps, isPromoAvailable, setMaidId} ) => {
  const { values } = useFormikContext();
  let getStatusFindmaidInterval;

  const handleIncrement = () => {
      setSteps(previousStep => previousStep + 1);
  };

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
        console.log('postJobAPI : ', response);
        var jobId = response.data._id;
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
        console.log('FindmaidAPI : ', response);
        const findmaidID = response.data._id;
        getStatusFindmaidInterval = setInterval( () => getFindmaidStatusAPI(findmaidID) , 5000);
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
        console.log('getFindmaidStatusAPI : ', response);
        console.log(response.data.state);
        if (response.data.state == 'matched') {
          console.log("We are matched");
          clearInterval(getStatusFindmaidInterval);
          handleIncrement();
          var maidId = response.data.maidId;
          setMaidId(maidId);
          console.log("This is your maid", response.data.maidId);
        }
        
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    postJob_findmaidAPI();
  }, [])

    return(
        <>
        <Box
            fontSize={{ base: 'xl', md: '2xl' }}
            width="100%"
            fontWeight="bold"
            textAlign="center"
            mb="50px"
            >
            We are finding a Maid for you
            <br />
            Please wait !
          </Box>
          <Stack direction="row" spacing={4}>
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
            />
          </Stack>
        </>
    );
}

export default Page4_maidInfo