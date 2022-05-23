const logger = require("../../settings/logger");
module.exports = async (client, player) => {
	logger.info(`Player Destroyed from [${player.guild}] (GUILD ID)`);
}