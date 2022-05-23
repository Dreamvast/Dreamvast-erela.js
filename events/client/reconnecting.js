const logger = require("../../settings/logger");

module.exports = async (client) => {
    logger.info(`Reconnected ${client.user.tag} (${client.user.id})`);
};
