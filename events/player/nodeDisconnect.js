const logger = require("../../plugins/logger");

module.exports = async (client, node, error) => {
	logger.info(`Node ${node.options.identifier} Disconnected!`);
}