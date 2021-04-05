import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { observer } from 'mobx-react-lite';
import { Redirect, Route } from 'react-router-dom';
import { useStores } from '../hooks/use-stores';

const ProtectedRoute = observer(({ component: Component, permission = [], ...rest }) => {
  const { userStore } = useStores();
  const user = userStore.userData;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (userStore.isAuthenticated) {
          if (permission.length >= 0) {
            if (!user)
              return (
                <Flex justifyContent="center" alignContent="center">
                  <Spinner thickness={4} size={`xl`} />
                </Flex>
              );
          }
          if (permission.length === 0 || (user && permission.includes(user.role)))
            return <Component {...rest} {...props} />;
        }
        return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
      }}
    />
  );
});

export default ProtectedRoute;
