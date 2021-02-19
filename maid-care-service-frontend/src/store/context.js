import { useLocalObservable } from 'mobx-react-lite';
import { createContext } from 'react';
import UserStore from './User';

export const intialStores = {
  userStore: new UserStore(),
};

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const store = useLocalObservable(() => intialStores);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
