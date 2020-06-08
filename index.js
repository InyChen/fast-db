const createRedisClient = require("./src/redis/Redis");
const createMysqlClient = require("./src/mysql/client")
module.exports.createRedisClient = createRedisClient;
module.exports.createMysqlClient = createMysqlClient;