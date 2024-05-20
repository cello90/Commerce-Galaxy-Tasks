export default () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
  mongo: {
    uri: process.env.MONGO_URI,
    db: process.env.MONGO_DB,
  },
  server: {
    port: +process.env.PORT || 3001,
    allowedIps: (process.env.ALLOWED_IPS || '').split(','),
  },
});