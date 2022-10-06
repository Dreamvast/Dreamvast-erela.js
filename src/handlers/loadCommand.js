const { readdirSync } = require('fs');
const logger = require("../plugins/logger");

module.exports = async (client) => {
    readdirSync("./src/commands/").map(async dir => {
        const commands = readdirSync(`./src/commands/${dir}/`).map(async (cmd) => {
            const pull = require(`../commands/${dir}/${cmd}`)
            client.slash.set(pull.name, pull);
            if (pull.aliases) {
                pull.aliases.map(x => client.slash.set(x, pull));
            }
        });
    })
    if (client.slash.size) {
        logger.info(`Loaded ${client.slash.size} interactions!`)
    } else {
        logger.warn(`No interactions loaded, is everything ok?`);
    }
}