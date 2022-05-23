const logger = require("../../settings/logger");

module.exports = async (client, error, id) => {
    logger.error(`Shard ${id} Errored!`);
}