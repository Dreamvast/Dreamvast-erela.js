const { PermissionsBitField, InteractionType, CommandInteraction } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const chalk = require('chalk');
const logger = require('../../plugins/logger.js')

 /**
  * @param {CommandInteraction} interaction
  */

module.exports = async(client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;

        let LANGUAGE = client.i18n;

		let guildModel = await GLang.findOne({ guild: interaction.guild.id });
        if(guildModel && guildModel.language) LANGUAGE = guildModel.language;

        const language = LANGUAGE;

        const command = client.slash.get(interaction.commandName);
        if(!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            logger.info(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        logger.info(`[COMMAND] ${command.options[0].name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`);

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

        try {
            command.run(interaction, client, language);
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
        }
    }
}