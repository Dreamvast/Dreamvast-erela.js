const { Permissions } = require("discord.js");
const GConfig = require("../../plugins/guildConfig.js")
const chalk = require('chalk');
const logger = require("../../plugins/logger");

module.exports = async(client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;

        let LANGUAGE = client.i18n;

		let guildModel = await GConfig.findOne({ guild: interaction.guild.id });
        if(guildModel && guildModel.language) LANGUAGE = guildModel.language;

        const language = LANGUAGE;

        const command = client.slash.get(interaction.commandName);
        if(!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            logger.debug(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) return;
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.SPEAK)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.CONNECT)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

        if (command) {
            try {
                command.run(interaction, client, language);
            } catch (error) {
                console.log(error)
                await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
            }
        }
    }
}