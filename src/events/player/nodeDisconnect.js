module.exports = async (client, node, error) => {
	client.logger.warn(`Node ${node.options.identifier} Disconnected!`);
}