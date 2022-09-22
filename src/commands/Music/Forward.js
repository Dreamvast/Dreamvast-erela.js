const { EmbedBuilder } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
const fastForwardNum = 10;

// Main code
module.exports = { 
    name: "forward",
    description: "Forward timestamp in the song!",
    options: [
        {
            name: "seconds",
            description: "The number of seconds to forward the timestamp by.",
            type: 4,
            required: false
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const value = interaction.options.getInteger("seconds");
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "forward_loading")}`);
           
        const player = client.manager.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);

        if (value && !isNaN(value)) {
            if((player.position + value * 1000) < song.duration) {

                player.seek(player.position + value * 1000);
                
                const forward1 = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "forward_msg", {
                    duration: CurrentDuration
                })}`)
                .setColor(client.color);

                msg.edit({ content: " ", embeds: [forward1] });

            } else { 
                return msg.edit(`${client.i18n.get(language, "music", "forward_beyond")}`);
            }
        }
        else if (value && isNaN(value)) { 
            return msg.edit(`${client.i18n.get(language, "music", "forward_invalid", {
                prefix: "/"
            })}`);
        }

        if (!value) {
            if((player.position + fastForwardNum * 1000) < song.duration) {
                player.seek(player.position + fastForwardNum * 1000);
                
                const forward2 = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "forward_msg", {
                    duration: CurrentDuration
                    })}`)
                .setColor(client.color);

                msg.edit({ content: " ", embeds: [forward2] });

            } else {
                return msg.edit(`${client.i18n.get(language, "music", "forward_beyond")}`);
            }
        }
    }
};
