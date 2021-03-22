import axios from 'axios';
import { auth } from './auth';
import { workspace } from './workspace';
import { job } from './job';
import { promotion } from './promotion';

// use cors
axios.interceptors.request.use(config => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

export { auth, workspace, job, promotion };
