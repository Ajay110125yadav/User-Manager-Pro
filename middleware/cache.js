const redis = require("../utils/redis");

module.exports = async (req, res, next ) => {
  const Key = req.originalUrl;


  const cachedData = await redis.get(Key);

  if(cachedData){
    return res.json({
      success: true,
      cached: true,
      data: JSON.parse(cachedData),
    });
  }

  res.sendResponse = req.json;

  res.json = async (body) => {
    await redis.set(Key, JSON.stringify(body), { EX:60 }); // cache 60 sec.
    res.sendResponse(body);
  };

  next();
};