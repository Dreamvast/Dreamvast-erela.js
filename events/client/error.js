const logger = require("../../settings/logger");

module.exports = async (client) => {
    logger.error(`Errored ${client.user.tag} (${client.user.id})`);
};
