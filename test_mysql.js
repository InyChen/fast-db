const { createMysqlClient } = require("./index");
const { mysql: mysqlConfig } = require("./config");

async function test(){
    const client = createMysqlClient(mysqlConfig);
    const list = await client.select("quick_database");
    console.log(list)

    process.exit(0);
}
test();