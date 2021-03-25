import { Box, Stack, Spinner } from '@chakra-ui/react';

const Page4_maidInfo = () => {
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