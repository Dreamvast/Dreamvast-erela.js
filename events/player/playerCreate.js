const logger = require("../../settings/logger");
module.exports = async (client, player) => {
	logger.info(`Player Created from [${player.guild}] (GUILD ID)`);
}