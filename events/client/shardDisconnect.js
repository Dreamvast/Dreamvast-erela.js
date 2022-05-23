const logger = require("../../settings/logger");

module.exports = async (client, error, id) => {
    logger.info(`Shard ${id} Shard Disconnected!`);
}