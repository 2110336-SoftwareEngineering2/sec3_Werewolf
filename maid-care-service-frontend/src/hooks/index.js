import { useContext } from 'react';
import userStore from '../store/User';

// File to store customer hooks.
export const useStores = () => ({
  userStore: useContext(userStore),
});
