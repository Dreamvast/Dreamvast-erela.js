module.exports = async (client) => {
    await client.manager.init(client.user.id);
    client.logger.info(`${client.user.tag} is ready!`)

    let guilds = client.guilds.cache.size;

    client.user.setPresence({
        activities: [{ name: `/music | ${guilds} servers`, type: 2 }],
        status: 'online',
    });
};
