const logger = require("../../settings/logger");

module.exports = async (client, node) => {
	logger.info(`Node ${node.options.identifier} Connected!`);
}