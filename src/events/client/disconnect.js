module.exports = async (client) => {
    client.logger.warn(`Disconnected ${client.user.tag} (${client.user.id})`);
};
