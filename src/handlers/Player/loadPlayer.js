const { readdirSync } = require("fs");

module.exports = async (client) => {
    try {
        readdirSync("./src/events/shoukaku/").forEach(file => {
            const event = require(`../../events/shoukaku/${file}`);
            let eventName = file.split(".")[0];
            client.manager.on(eventName, (...args) => event.run(this, ...args));
        });
    } catch (e) {
        console.log(e);
    }
};
