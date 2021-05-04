import React from 'react';
import { Button } from '@chakra-ui/button';
import { Container, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import PromotionCreate from './promotion-create';

const Promotion = () => {
  const { path } = useRouteMatch();
  const history = useHistory();

  return (
    <Switch>
      <Route exact path={path}>
        <VStack bgColor="gray.200" h="100vh" justifyContent="center" alignItems="center">
          <Container as="section" bgColor="white" borderRadius={5} p={8} maxW={1200} w={`60%`}>
            <Heading as="h1">Promotion Management</Heading>
            <HStack justifyContent="flex-end">
              <Button
                bgColor="brandGreen"
                color="white"
                onClick={() => history.push('/promotion/create')}>
                Create Promotion
              </Button>
            </HStack>
            {/* TODO: Promotion Table */}
            <Text textAlign="center">Table will be place here.</Text>
          </Container>
        </VStack>
      </Route>
      <Route path={`${path}/create`}>
        <PromotionCreate />
      </Route>
      <Route path={`${path}/:code/edit`}>
        <PromotionCreate />
      </Route>
    </Switch>
  );
};

export default Promotion;
