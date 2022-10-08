const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../plugins/schemas/playlist.js");

module.exports = {
    name: "pl-public",
    description: "Public a playlist",
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
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_owner")}`);

        const Public = await Playlist.findOne({ name: PName, private: false });
        if(Public) return interaction.editReply(`${client.i18n.get(language, "playlist", "public_already")}`);

        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "public_loading")}`);

        playlist.private = false;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "public_success")}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
        });
    }
}