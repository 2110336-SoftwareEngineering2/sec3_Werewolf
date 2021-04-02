import { useLocalObservable } from 'mobx-react-lite';
import { createContext } from 'react';
import JobsStore from './Jobs';
import UserStore from './User';
import ImageStore from './Image';

export const intialStores = {
  userStore: new UserStore(),
  jobStore: new JobsStore(),
  imageStore: new ImageStore(),
};

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const store = useLocalObservable(() => intialStores);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
