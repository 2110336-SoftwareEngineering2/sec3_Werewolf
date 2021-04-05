import axios from 'axios';
import { login, fetchCurrentUser, registerMaid } from './auth';
import { workspace, fetchWorkspaceById } from './workspace';
import { user, fetchUserById } from './user';
import { promotion } from './promotion';
import { job } from './job';
import { maid } from './maid';
import { review } from "./review";
import { refund } from "./refund";
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
export { job };
export { maid };
export { review };
export { refund };
