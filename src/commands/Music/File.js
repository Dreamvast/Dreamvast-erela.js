const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
// Main code
module.exports = { 
    name: "file-play",
    description: "Play the music file for the bot",
    options: [
        {
            name: "input",
            description: "The music file to play",
            type: 11,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
    
        const file = await interaction.options.getAttachment("input")
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "play_loading")}`);
        const { channel } = interaction.member.voice;
        if (!channel) return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);
        if (file.contentType !== "audio/mpeg" && file.contentType !== "audio/ogg") return msg.edit(`${client.i18n.get(language, "music", "play_invalid_file")}`)
        if (!file.contentType) {
            msg.edit(`${client.i18n.get(language, "music", "play_warning_file")}`)
        }
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,
        });
        const state = player.state;
        if (state != "CONNECTED") await player.connect();
        const res = await client.manager.search(file.attachment, interaction.user);
        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                player.queue.add(res.tracks[0]);
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_track", {
                        title: file.name,
                        url: file.url,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            }
            else if(res.loadType == "PLAYLIST_LOADED") {
                player.queue.add(res.tracks)
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                        title: file.name,
                        url: file.url,
                        duration: convertTime(res.playlist.duration),
                        songs: res.tracks.length,
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            }
            else if(res.loadType == "SEARCH_RESULT") {
                player.queue.add(res.tracks[0]);
                const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_result", {
                        title: file.name,
                        url: file.url,
                        duration: convertTime(res.tracks[0].duration, true),
                        request: res.tracks[0].requester
                    })}`)
                    .setColor(client.color)
                msg.edit({ content: " ", embeds: [embed] });
                if(!player.playing) player.play();
            }
            else if(res.loadType == "LOAD_FAILED") {
                msg.edit(`${client.i18n.get(language, "music", "play_fail")}`); 
                player.destroy();
            }
        }
        else {
            msg.edit(`${client.i18n.get(language, "music", "play_match")}`); 
            player.destroy();
        }
    }
};
