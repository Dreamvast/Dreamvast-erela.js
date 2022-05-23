const logger = require("../../settings/logger");

module.exports = async (client) => {
    logger.info(`Disconnected ${client.user.tag} (${client.user.id})`);
};
