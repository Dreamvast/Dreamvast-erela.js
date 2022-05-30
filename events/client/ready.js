const logger = require("../../settings/logger");
const figlet = require('figlet');
const chalk = require('chalk');
const dreamvast = chalk.hex('#008dde');

module.exports = async (client) => {
    await client.manager.init(client.user.id);

    figlet(client.user.tag, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(dreamvast(data));
    });


    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        `with ${guilds} servers! | /music radio`,
        `with ${members} users! | /music play`,
        `with ${channels} users! | /filter nightcore`
    ]

    setInterval(() => {
        client.user.setActivity(`${activities[Math.floor(Math.random() * activities.length)]}`, { type: "STREAMING", url: "https://www.twitch.tv/lofichillnight" });
    }, 60000)
};
