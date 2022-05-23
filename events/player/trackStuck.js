const { MessageEmbed } = require("discord.js");
const GLang = require("../../settings/models/Language.js");
const logger = require("../../settings/logger");

module.exports = async (client, player, track, payload) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    let guildModel = await GLang.findOne({
      guild: channel.guild.id,
    });
    if (!guildModel) {
      guildModel = await GLang.create({
        guild: channel.guild.id,
        language: "en",
      });
    }

    const { language } = guildModel;

    /////////// Update Music Setup ///////////

	  await client.UpdateMusic(player);

	  /////////// Update Music Setup ///////////

    const embed = new MessageEmbed()
        .setColor(client.color)
        .setDescription(`${client.i18n.get(language, "player", "error_desc")}`);

    channel.send({embeds: [embed]});
    
    logger.debug(`Track Stuck in [${player.guild}] (GUILD ID). Auto-Leaved!`);
    if (!player.voiceChannel) player.destroy();

}