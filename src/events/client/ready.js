const logger = require("../../plugins/logger");
const figlet = require('figlet');
const chalk = require('chalk');
const dreamvast = chalk.hex('#008dde');

module.exports = async (client) => {
    await client.manager.init(client.user.id);
    logger.info(`${client.user.tag} is ready!`)

    figlet(client.user.tag, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(dreamvast(data));
    });


    let guilds = client.guilds.cache.size;

    client.user.setPresence({
        activities: [{ name: `/music | ${guilds} servers`, type: 2 }],
        status: 'online',
    });
};
