const { readdirSync } = require("fs");
const logger = require("../plugins/logger");

module.exports = async (client) => {
    try {
        readdirSync("./src/events/node/").forEach(file => {
            const event = require(`../events/node/${file}`);
            let eventName = file.split(".")[0];
            client.manager.shoukaku.on(eventName, (...args) => event.run(this, ...args));
        });
        logger.info('Node Events Loaded!');
    } catch (e) {
        console.log(e);
    }
};
