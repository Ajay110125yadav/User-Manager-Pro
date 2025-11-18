const redis = require("redis");
const config = require("../config/config");

const client = redis.createClient({
  socket: {
    host: config.redisHost,
    port: config.redisPort
  }
});

client.connect();
client.on("connect", () => console.log("Redis connected"));

module.exports = client;