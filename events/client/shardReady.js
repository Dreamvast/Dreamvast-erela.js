const logger = require("../../settings/logger");

module.exports = async (client, id) => {
    logger.info(`Shard ${id} Ready!`);
}