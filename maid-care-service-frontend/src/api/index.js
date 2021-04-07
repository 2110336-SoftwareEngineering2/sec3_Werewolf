import axios from 'axios';
import { login, fetchCurrentUser, registerMaid } from './auth';
import { workspace, fetchWorkspaceById } from './workspace';
import { user, fetchUserById } from './user';
import { promotion } from './promotion';
import { job, uploadImageURL, deleteImageURL } from './job';
import { maid, updateLocation } from './maid';
import { review } from './review';
import { refund } from './refund';
import { customer, fetchCustomerAllJobs } from './customer';
// use cors
axios.interceptors.request.use((config) => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

export { login, fetchCurrentUser, registerMaid };
export { user, fetchUserById };
export { workspace, fetchWorkspaceById };
export { promotion };
export { job, uploadImageURL, deleteImageURL };
export { maid, updateLocation };
export { review };
export { refund };
export { customer, fetchCustomerAllJobs };
