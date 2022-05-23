const logger = require("../../settings/logger");

module.exports = async (client, info) => {
    logger.error(`Rate Limited, Sleeping for ${0} seconds`);
}