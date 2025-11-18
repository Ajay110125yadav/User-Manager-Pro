const { mongo } = require("mongoose");

require ("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "30d",
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  env: process.env.NODE_ENV || "development",
};