/**
 * Created by Saku Rautio on 17.9.2018 while losing his mind in the army.
 */

var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

function log(message) {
    logger.info(message);
}

module.exports = {
    log: log
}