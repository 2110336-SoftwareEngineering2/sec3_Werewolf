import { useLocalObservable } from 'mobx-react-lite';
import { createContext } from 'react';
import JobsStore from './Jobs';
import UserStore from './User';
import {MultiImageStore, SingleImageStore} from './Image';

const userStore = new UserStore();
const jobStore = new JobsStore({ userStore: userStore });

export const intialStores = {
  userStore: new UserStore(),
  jobStore: new JobsStore(),
  multiImageStore: new MultiImageStore(),
  singleImageStore: new SingleImageStore(),
};

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const store = useLocalObservable(() => intialStores);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
