const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../plugins/schemas/playlist.js");

module.exports = {
    name: "pl-private",
    description: "Private a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getString("name");
        const PName = value.replace(/_/g, ' ');
 
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_owner")}`);

        const Private = await Playlist.findOne({ name: PName, private: true });
        if(Private) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_already")}`);

        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "private_loading")}`);

        playlist.private = true;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "private_success")}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
        });
    }
}