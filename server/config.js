const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/mern-starter',
  port: process.env.OPENSHIFT_NODEJS_PORT || 8,
};


export const baseURL = typeof window === 'undefined' ? 
      process.env.BASE_URL || (`http://localhost:${config.port}`) : '';


export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test') ?
  process.env.BASE_URL || (`http://localhost:${process.env.PORT || config.port}/api`) :
  '/api';


export default config;
