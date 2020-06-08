const moment = require("moment")
let level = "INFO";
let logger = {
    info(...args){
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}][${level}]`,...args);
    }
};

module.exports.init = function(_logger,_level){
    logger = _logger;
    level= _level
}

module.exports.debug = function (...args) {
    if(level=="DEBUG"){
        logger.debug(...args)
    }
}

module.exports.info = function (...args) {
    logger.info(...args)
}