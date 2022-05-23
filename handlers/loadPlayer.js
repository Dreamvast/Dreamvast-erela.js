const { white, green } = require("chalk");
const logger = require("../settings/logger");

module.exports = (client) => {
    require("./Player/loadPlayer.js")(client);
    require("./Player/loadContent.js")(client);
    require("./Player/loadSetup.js")(client);
    require("./Player/loadUpdate.js")(client);
    logger.info('Player Events Loaded!');
};