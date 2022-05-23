const logger = require("../../settings/logger");
module.exports = async (client, node, error) => {
	logger.error(`Node ${node.options.identifier} Errored!`);
}