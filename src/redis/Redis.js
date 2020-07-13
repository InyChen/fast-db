const redis = require('redis');

function RedisClient(config, options = {}) {
  const client = redis.createClient(config);

  async function sendCommand(command, ...args) {
    return new Promise((resolve, reject) => {
      client.send_command(command, args, function (err, rs) {
        if (err) {
          reject(err);
        } else {
          resolve(rs);
        }
      })
    })
  }

  /** 序列化对象 */
  function seriate(value){
    if(typeof(value)==="object"){
      return JSON.stringify(value)
    }
    return value;
  }

  /** 直接发送命令 */
  this.sendCommand = sendCommand;

  /** 普通的获取键值 */
  this.get = async (key) => {
    return await sendCommand("GET", key)
  }

  /** 获取对象 */
  this.getObj = async(key)=>{
    const val = await this.get(key);
    if(val){
      return JSON.parse(val);
    }
    return val;
  }

  /** 普通的设置键值 */
  this.set = async (key, value,expire) => {
    if(expire){
      return await sendCommand("SET", key, seriate(value), "PX", expire)
    }
    return await sendCommand("SET", key, seriate(value))
  }

  /** 目标键值存在时设置成功 */
  this.setEX = async (key, value, expire) => {
    if (expire) {
      return await sendCommand("SET", key, seriate(value), "PX", expire, "EX")
    }
    return await sendCommand("SET", key, seriate(value), "EX")
  }

  /** 目标键值不存在时设置成功 */
  this.setNX = async (key, value, expire) => {
    if (expire) {
      return await sendCommand("SET", key, seriate(value), "PX", expire, "NX")
    }
    return await sendCommand("SET", key, seriate(value), "NX")
  }

  /** 目标值存在时设置成功 */
  this.setXX = async (key, value, expire) => {
    if (expire) {
      return await sendCommand("SET", key, seriate(value), "PX", expire, "XX")
    }
    return await sendCommand("SET", key, seriate(value), "XX")
  }

  /** 目标键是否存在 */
  this.exists = async key=>{
    const rs = await sendCommand("EXISTS", key);
    return rs == 1;
  }

  // 映射所有其他对象
  Object.keys(client).forEach(key=>{
    if(!this[key]){
      this[key] = client[key];
    }
  })
}


module.exports = function (config, options) {
  return new RedisClient(config, options);
}