const logger = require("../../settings/logger");

module.exports = async (client) => {
    logger.info(`Warned ${client.user.tag} (${client.user.id})`);
};
