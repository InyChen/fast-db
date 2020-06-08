const { createRedisClient } = require("./index");
const { redis: redisConfig } = require("./config")
const chalk = require("chalk");

const redisClient = createRedisClient(redisConfig);

function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

async function test() {
    const key = "test_key";
    const rightValue = "hello";

    // 测试普通的get/set
    console.log(chalk.blue("test normal set&get"));
    console.log(chalk.blue("set to redis"));
    await redisClient.set(key, rightValue);
    console.log(chalk.green("set success"));
    console.log(chalk.blue("try get"));
    let value = await redisClient.get(key);
    console.log(chalk.green("get success,value:" + value));
    console.log(value == rightValue ? chalk.green("test success") : chalk.red("test failed"))

    console.log("\r\n");


    // 测试对象get/set
    console.log(chalk.blue("test object set&get"));
    await redisClient.set(key, { name: "chenjialin" });
    value = await redisClient.get(key);
    console.log(chalk.green("get success,value:", value));
    value = await redisClient.getObj(key);
    console.log(chalk.green("get obj success,value:", value));

    console.log("\r\n");


    // 测试过期时间
    console.log(chalk.blue("test set ex"));
    await redisClient.setEX(key, rightValue, 1000);
    await delay(2000);
    value = await redisClient.get(key);
    console.log(value == null ? chalk.green("test success") : chalk.red("test failed"))

    console.log("\r\n");

    // 测试CAS
    console.log(chalk.blue("test CAS SETNX"));
    let setSuccess = await redisClient.setNX(key, rightValue, 1000);
    console.log(setSuccess ? chalk.green("test success") : chalk.red("test failed"))
    setSuccess = await redisClient.setNX(key, rightValue, 1000);
    console.log(!setSuccess ? chalk.green("test success") : chalk.red("test failed"))
    await delay(1500);
    setSuccess = await redisClient.setNX(key, rightValue, 1000);
    console.log(setSuccess ? chalk.green("test success") : chalk.red("test failed"))

    console.log(chalk.blue("test CAS SETXX"));
    setSuccess = await redisClient.setXX(key, rightValue, 1000);
    console.log(setSuccess ? chalk.green("test success") : chalk.red("test failed"))
    await delay(1500);
    setSuccess = await redisClient.setXX(key, rightValue, 1000);
    console.log(!setSuccess ? chalk.green("test success") : chalk.red("test failed"))

    process.exit(0)
}

test();