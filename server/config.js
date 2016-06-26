const config = {
  mongoURL: process.env.OPENSHIFT_MONGODB_DB_URL + 'tmcharts' || 'mongodb://localhost:27017/mern-starter',
  port: process.env.OPENSHIFT_NODEJS_PORT || 8000,
};

export default config;
