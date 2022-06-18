const { MessageEmbed } = require("discord.js");
const GControl = require("../../plugins/guildConfig.js")
const logger = require("../../plugins/logger");

module.exports = async (client, player, track, payload) => {

    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    let guildModel = await GControl.findOne({
      guild: channel.guild.id,
    });
    if (!guildModel) { guildModel = await GConfig.create({
        guild: channel.guild.id,
        enable: false,
        channel: "",
        playmsg: "",
        language: "en",
        playerControl: "disable",
    });
  }

    const { language } = guildModel;

    /////////// Update Music Setup ///////////

	  await client.UpdateMusic(player);

    /////////// Update Music Setup ///////////

    const embed = new MessageEmbed()
        .setColor(client.color)
        .setDescription(`${client.i18n.get(language, "player", "error_desc")}`);

    channel.send({ embeds: [embed] });

    logger.error(`Track Error in [${player.guild}] (GUILD ID). Auto-Leaved!`);
    if (!player.voiceChannel) player.destroy();

}