const logger = require("../../settings/logger");

module.exports = async (client, node, error) => {
	logger.info(`Node ${node.options.identifier} Disconnected!`);
}