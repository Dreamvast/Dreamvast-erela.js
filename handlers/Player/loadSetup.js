const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  
  /**
   *
   * @param {Client} client
   */

module.exports = async (client) => {

    client.enSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle("Success")
                .setCustomId("spause")
                .setEmoji("⏯"),
            new ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("sprevious")
                .setEmoji("⬅"),
            new ButtonBuilder()
                .setStyle("Danger")
                .setCustomId("sstop")
                .setEmoji("⏹"),
            new ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("sskip")
                .setEmoji("➡"),
            new ButtonBuilder()
                .setStyle("Success")
                .setCustomId("sloop")
                .setEmoji("🔄"),
        ]);

    client.diSwitch = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setStyle("Secondary")
                .setCustomId("spause")
                .setEmoji("⏯")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle("Secondary")
                .setCustomId("sprevious")
                .setEmoji("⬅")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle("Secondary")
                .setCustomId("sstop")
                .setEmoji("⏹")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle("Secondary")
                .setCustomId("sskip")
                .setEmoji("➡")
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle("Secondary")
                .setCustomId("sloop")
                .setEmoji("🔄")
                .setDisabled(true),
        ]);
};