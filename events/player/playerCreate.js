const logger = require("../../plugins/logger");
module.exports = async (client, player) => {
	logger.info(`Player Created from [${player.guild}] (GUILD ID)`);
}