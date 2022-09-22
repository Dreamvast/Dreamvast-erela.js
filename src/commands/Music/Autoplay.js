const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: "autoplay",
    description: "Autoplay music (Random play songs)",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });

        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "autoplay_loading")}`);
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const autoplay = player.get("autoplay");

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        if (autoplay === true) {

            await player.set("autoplay", false);
            await player.queue.clear();

            const off = new MessageEmbed()
            .setDescription(`${client.i18n.get(language, "music", "autoplay_off")}`)
            .setColor(client.color);

            msg.edit({ content: " ", embeds: [off] });
        } else {

            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, interaction.user);

            await player.set("autoplay", true);
            await player.set("requester", interaction.user);
            await player.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const on = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "autoplay_on")}`)
            .setColor(client.color);

            msg.edit({ content: " ", embeds: [on] });
        }
    }
};
