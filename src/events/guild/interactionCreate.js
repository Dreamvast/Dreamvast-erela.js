const { PermissionsBitField, InteractionType, CommandInteraction } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const chalk = require('chalk');
const logger = require('../../plugins/logger.js')
const YouTube = require("youtube-sr").default;
const { DEFAULT } = require("../../plugins/config.js")
var playlistRegExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
var videoRegEx = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

 /**
  * @param {CommandInteraction} interaction
  */

module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild || interaction.user.bot) return;

        let LANGUAGE = client.i18n;

		let guildModel = await GLang.findOne({ guild: interaction.guild.id });
        if(guildModel && guildModel.language) LANGUAGE = guildModel.language;

        const language = LANGUAGE;

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const url = interaction.options.get("search").value
            const matchPlaylist = playlistRegExp.test(url);
            const matchVideo = videoRegEx.test(url)
            if (interaction.commandName == "play") {
                if (matchPlaylist === true){
                    let choice = []
                    choice.push({ name: url, value: url })
                    await interaction.respond(choice).catch(() => { });
                } else if(matchVideo === true) {
                    let choice = []
                    choice.push({ name: url, value: url })
                    await interaction.respond(choice).catch(() => { });
                } else {
                    const Random = DEFAULT[Math.floor(Math.random() * DEFAULT.length)];
                    let choice = []
                    await YouTube.search(interaction.options.get("search").value || Random, { safeSearch: true, limit: 10 }).then(result => {
                        result.forEach((x) => { choice.push({ name: x.title, value: x.url }) })
                    });
                    await interaction.respond(choice).catch(() => { });
                }
            }
        }

        const command = client.slash.get(interaction.commandName);

        if(!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            logger.info(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        logger.info(`[COMMAND] ${command.name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`);

        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

    if (!command) return;
    if (command) {
        try {
            command.run(interaction, client, language);
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
        }}
    }
}