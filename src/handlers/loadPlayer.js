module.exports = (client) => {
    require("./Player/loadPlayer.js")(client);
    require("./Player/loadContent.js")(client);
    require("./Player/loadSetup.js")(client);
    require("./Player/loadUpdate.js")(client);
    client.logger.info('Player Events Loaded!');
};