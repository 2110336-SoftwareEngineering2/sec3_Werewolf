import { Spinner } from '@chakra-ui/spinner';
import { Switch, Route } from 'react-router-dom';
import { useStores } from '../../../hooks/use-stores';
import MaidProfilePage from './profilepage';
import CustomerProfilePage from './profile_customer_view';

const Profile = () => {
  const { userStore } = useStores();
  const curUser = userStore.userData;

  if (!curUser) {
    return (
      <>
        <Spinner thickness={4} size={`xl`}></Spinner>
      </>
    );
  }

  return (
    <Switch>
      <Route
        exact
        path="/profile"
        component={curUser.role === 'maid' ? MaidProfilePage : CustomerProfilePage}
      />
    </Switch>
  );
};

export default Profile;
