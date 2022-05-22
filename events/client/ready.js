const { green, white } = require('chalk');

module.exports = async (client) => {
    await client.manager.init(client.user.id);

    console.log(white('[') + green('INFO') + white('] ') + green(`${client.user.tag} (${client.user.id})`) + white(` is Ready!`));


    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        `/premium setup | ${guilds} servers`,
        `/music play <input> | ${members} users`,
        `/filter doubletime | ${channels} channels`,
    ]

    setInterval(() => {
        client.user.setActivity(`${activities[Math.floor(Math.random() * activities.length)]}`, { type: 'WATCHING' });
    }, 15000)

};
