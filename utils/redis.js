const redis = require("redis");

const REDIS_USER = process.env.REDIS_USER;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const redisClient = redis.createClient({
  //Deploy to Heroku
  url: `${process.env.REDIS_URL}`,

  //Local Development Only
  //url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

exports.RedisCache = async (key, timeExpired, callback) => {
  redisClient.on("error", (err) => console.log("Redis Client Error : ", err));
  await redisClient.connect();

  return new Promise(async (resolve, reject) => {
    try {
      const data = await redisClient.get(key);
      if (data != null) {
        console.log("get from cache");
        await redisClient.quit();
        return resolve(JSON.parse(data));
      } else {
        console.log("get from api");
        const newData = await callback();
        await redisClient.setEx(key, timeExpired, JSON.stringify(newData));
        await redisClient.quit();
        return resolve(newData);
      }
    } catch (err) {
      await redisClient.quit();
      return reject(err);
    }
  });
};
