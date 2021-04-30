import axios from 'axios';
export * from './auth';
export * from './workspace';
export * from './user';
export * from './promotion';
export * from './job';
export * from './maid';
export * from './review';
export * from './refund';
export * from './customer';
// use cors
axios.interceptors.request.use((config) => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});
