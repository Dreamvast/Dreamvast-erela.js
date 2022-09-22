const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: "stop",
    description: "Stop and clear the queue without leave!",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "stop_loading")}`);

        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
        await player.pause(player.playing);
        await player.queue.clear();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "stop_msg")}`)
            .setColor(client.color);

        msg.edit({ content: " ", embeds: [embed] });
    }
};
