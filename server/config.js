const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/mern-starter',
  port: process.env.OPENSHIFT_NODEJS_PORT || 8,
};

export default config;
