export default () => ({
  redis: {
    host: 'localhost',
    port: 6379,
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