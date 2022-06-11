const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const { SlashPage } = require('../../structures/PageQueue.js');
const Setup = require("../../settings/models/Setup.js");
const lyricsfinder = require('lyrics-finder');

const fastForwardNum = 10;
const rewindNum = 10;
const { Radiostations } = require("../../settings/radioLink.js")

// Main code
module.exports = { 
    name: "music",
    description: "Music Command!",
    options: [
        {
            name: "radio",
            description: "Play radio in voice channel",
            type: 1,
            options:[
                {
                    name: "radio_number",
                    description: "The number of radio to choose the radio station",
                    type: 4,
                    required: false
                }
            ]
        },
        {
            name: "autoplay",
            description: "Autoplay music (Random play songs)",
            type: 1
        },
        {
            name: "clear",
            description: "Clear song in queue!",
            type: 1
        },
        {
            name: "forward",
            description: "Forward timestamp in the song!",
            type: 1,
            options: [
                {
                    name: "seconds",
                    description: "The number of seconds to forward the timestamp by.",
                    type: 4,
                    required: false
                }
            ],
        },
        {
            name: "join",
            description: "Make the bot join the voice channel.",
            type: 1
        },
        {
            name: "leave",
            description: "Make the bot leave the voice channel.",
            type: 1
        },
        {
            name: "loop",
            description: "Loop song in queue type all/current!",
            type: 1,
            options: [
                {
                    name: "type",
                    description: "Type of loop",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Current",
                            value: "current"
                        },
                        {
                            name: "Queue",
                            value: "queue"
                        }
                    ]
                }
            ],
        },
        {
            name: "loopall",
            description: "Loop all songs in queue!",
            type: 1
        },
        {
            name: "lyrics",
            description: "Display lyrics of a song.",
            type: 1,
            options: [
                {
                    name: "input",
                    description: "The song you want to find lyrics for",
                    type: 3,
                    required: false,
                }
            ],
        },
        {
            name: "nowplaying",
            description: "Display the song currently playing.",
            type: 1
        },
        {
            name: "pause",
            description: "Pause the music!",
            type: 1
        },
        {
            name: "play",
            description: "Play a song from any types.",
            type: 1,
            options: [
                {
                    name: "input",
                    description: "The input of the song",
                    type: 3,
                    required: true,
                }
            ], 
        },
        {
            name: "previous",
            description: "Play the previous song in the queue.",
            type: 1
        },
        {
            name: "queue",
            description: "Show the queue of songs.",
            type: 1,
            options: [
                {
                    name: "page",
                    description: "Page number to show.",
                    type: 4,
                    required: false,
                }
            ],
        },
        {
            name: "replay",
            description: "Replay the current song!",
            type: 1
        },
        {
            name: "resume",
            description: "Resume the music!",
            type: 1
        },
        {
            name: "rewind",
            description: "Rewind timestamp in the song!",
            type: 1,
            options: [
                {
                    name: "seconds",
                    description: "Rewind timestamp in the song!",
                    type: 4,
                    required: false,
                }
            ],
        },
        {
            name: "search",
            description: "Search for a song!",
            type: 1,
            options: [
                {
                    name: "input",
                    description: "The input of the song",
                    type: 3,
                    required: true,
                }
            ],
        },
        {
            name: "seek",
            description: "Seek timestamp in the song!",
            type: 1,
            options: [
                {
                    name: "seconds",
                    description: "The number of seconds to seek the timestamp by.",
                    type: 4,
                    required: true,
                }
            ],
        },
        {
            name: "shuffle",
            description: "Shuffle song in queue!",
            type: 1
        },
        {
            name: "skip",
            description: "Skips the song currently playing.",
            type: 1
        },
        {
            name: "skipto",
            description: "Skips to a certain song in the queue.",
            type: 1,
            options: [
                {
                    name: "position",
                    description: "The position of the song in the queue.",
                    type: 4,
                    required: true,
                }
            ],
        },
        {
            name: "volume",
            description: "Adjusts the volume of the bot.",
            type: 1,
            options: [
                {
                    name: "amount",
                    description: "The amount of volume to set the bot to.",
                    type: 4,
                    required: false,
                }
            ],
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.options.getSubcommand() === "autoplay") {
                const msg = await interaction.editReply(`${client.i18n.get(language, "music", "autoplay_loading")}`);
    
                const player = client.manager.get(interaction.guild.id);
                if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        
                const autoplay = player.get("autoplay");
        
                const { channel } = interaction.member.voice;
                if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
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
        
                    const on = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "autoplay_on")}`)
                    .setColor(client.color);
        
                    msg.edit({ content: " ", embeds: [on] });
                }
        }
        if (interaction.options.getSubcommand() === "clear") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "clearqueue_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            await player.queue.clear();
            
            const cleared = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "clearqueue_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [cleared] });
        }
        if (interaction.options.getSubcommand() === "forward") {
            const value = interaction.options.getInteger("seconds");
            const msg = await interaction.channel.send(`${client.i18n.get(language, "music", "forward_loading")}`);
               
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            const song = player.queue.current;
            const CurrentDuration = formatDuration(player.position);
    
            if (value && !isNaN(value)) {
                if((player.position + value * 1000) < song.duration) {
    
                    player.seek(player.position + value * 1000);
                    
                    const forward1 = new MessageEmbed()
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
                    
                    const forward2 = new MessageEmbed()
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
        if (interaction.options.getSubcommand() === "join") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "join_loading")}`);

            const { channel } = interaction.member.voice;
            if(!channel) return msg.edit(`${client.i18n.get(language, "music", "join_voice")}`);
    
            const player = client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
            });
    
            await player.connect();
    
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "join_msg", {
                    channel: channel.name
                })}`)
                .setColor(client.color)
    
            msg.edit({ content: " ", embeds: [embed] })
        }
        if (interaction.options.getSubcommand() === "leave") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "leave_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            await player.destroy();
            await client.UpdateMusic(player);
    
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "leave_msg", {
                    channel: channel.name
                })}`)
                .setColor(client.color);   
    
            msg.edit({ content: " ", embeds: [embed] })
        }
        if (interaction.options.getSubcommand() === "loop") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "loop_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if(interaction.options._hoistedOptions.find(c => c.value === "current")) {
                if (player.trackRepeat === false) {
                    player.setTrackRepeat(true);
    
                    const looped = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "loop_current")}`)
                        .setColor(client.color);
    
                        return msg.edit({ content: " ", embeds: [looped] });
                } else {
                    player.setTrackRepeat(false);
    
                    const unlooped = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "unloop_current")}`)
                        .setColor(client.color);
    
                        return msg.edit({ content: " ", embeds: [unlooped] });
                }
            }
            else if(interaction.options._hoistedOptions.find(c => c.value === "queue")) {
                if (player.queueRepeat === true) {
                    player.setQueueRepeat(false);
    
                    const unloopall = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "unloop_all")}`)
                        .setColor(client.color);
    
                        return msg.edit({ content: " ", embeds: [unloopall] });
                }
                else {
                    player.setQueueRepeat(true);
    
                    const loopall = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "loop_all")}`)
                        .setColor(client.color);
    
                        return msg.edit({ content: " ", embeds: [loopall] });
                }
            }
        }
        if (interaction.options.getSubcommand() === "loopall") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "loopall_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if (player.queueRepeat === true) {
                player.setQueueRepeat(false)
                
                const unloopall = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "unloopall")}`)
                    .setColor(client.color);
    
                    return msg.edit({ content: ' ', embeds: [unloopall] });
            } else {
                player.setQueueRepeat(true);
                
                const loopall = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "loopall")}`)
                    .setColor(client.color);
    
                    return msg.edit({ content: ' ', embeds: [loopall] });
            }
        }
        if (interaction.options.getSubcommand() === "lyrics") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "lyrics_loading")}`);
            const value = interaction.options.getString("input");
    
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            let song = value;
                let CurrentSong = player.queue.current;
            if (!song && CurrentSong) song = CurrentSong.title;
    
            let lyrics = null;
    
            try {
                lyrics = await lyricsfinder(song, "");
                if (!lyrics) return msg.edit(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
            } catch (err) {
                console.log(err);
                return msg.edit(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
            }
            let lyricsEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle(`${client.i18n.get(language, "music", "lyrics_title", {
                    song: song
                })}`)
                .setDescription(`${lyrics}`)
                .setFooter({ text: `Requested by ${interaction.user.username}`})
                .setTimestamp();
    
            if (lyrics.length > 2048) {
                lyricsEmbed.setDescription(`${client.i18n.get(language, "music", "lyrics_toolong")}`);
            }
    
            msg.edit({ content: ' ', embeds: [lyricsEmbed] });
        }
        if (interaction.options.getSubcommand() === "nowplaying") {
            let database = await Setup.findOne({ guild: interaction.guild.id });
            const realtime = client.config.NP_REALTIME;
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "np_loading")}`);
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
    
            const song = player.queue.current;
            const CurrentDuration = formatDuration(player.position);
            const TotalDuration = formatDuration(song.duration);
            const Thumbnail = `https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`;
            const Part = Math.floor(player.position / song.duration * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";
    
            const embeded = new MessageEmbed()
                .setAuthor({ name: player.playing ? `${client.i18n.get(language, "music", "np_title")}` : `${client.i18n.get(language, "music", "np_title_pause")}`, iconURL: `${client.i18n.get(language, "music", "np_icon")}` })
                .setColor(client.color)
                .setDescription(`**[${song.title}](${song.uri})**`)
                .setThumbnail(Thumbnail)
                .addField(`${client.i18n.get(language, "music", "np_author")}`, `${song.author}`, true)
                .addField(`${client.i18n.get(language, "music", "np_request")}`, `${song.requester}`, true)
                .addField(`${client.i18n.get(language, "music", "np_volume")}`, `${player.volume}%`, true)
                // .addField(`${client.i18n.get(language, "music", "np_view")}`, `${views}`, true)
                // .addField(`${client.i18n.get(language, "music", "np_upload")}`, `${uploadat}`, true)
                .addField(`${client.i18n.get(language, "music", "np_download")}`, `**[Click Here](https://www.mp3fromlink.com/watch?v=${song.identifier})**`, true)
                .addField(`${client.i18n.get(language, "music", "np_current_duration", {
                    current_duration: CurrentDuration,
                    total_duration: TotalDuration
                })}`, `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``)
                .setTimestamp();
    
            const NEmbed = await msg.edit({ content: " ", embeds: [embeded] });
            var interval = null;
    
            if (realtime === 'true') {
            interval = setInterval(async () => {
                if (!player.playing) return;
                const CurrentDuration = formatDuration(player.position);
                const Part = Math.floor(player.position / song.duration * 30);
                const Emoji = player.playing ? "🔴 |" : "⏸ |";
    
                embeded.fields[6] = { name: `${client.i18n.get(language, "music", "np_current_duration", {
                    current_duration: CurrentDuration,
                    total_duration: TotalDuration
                })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` };
    
                if (NEmbed) NEmbed.edit({ content: " ", embeds: [embeded] })
            }, 5000);
            } else if (realtime === 'false') {
                if (!player.playing) return;
                if (NEmbed) NEmbed.edit({ content: " ", embeds: [embeded] });
            }
    
        }
        if (interaction.options.getSubcommand() === "pause") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "pause_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
            
            await player.pause(player.playing);
            const uni = player.paused ? `${client.i18n.get(language, "music", "pause_switch_pause")}` : `${client.i18n.get(language, "music", "pause_switch_resume")}`;
    
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "pause_msg", {
                    pause: uni
                })}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "play") {
            const value = interaction.options.get("input").value;
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "play_loading")}`);
            
            const { channel } = interaction.member.voice;
            if (!channel) return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
            if (!channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.CONNECT)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
            if (!channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.SPEAK)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);
    
            const player = await client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
            });
            
            const state = player.state;
            if (state != "CONNECTED") await player.connect();
            const res = await client.manager.search(value, interaction.user);
            if(res.loadType != "NO_MATCHES") {
                if(res.loadType == "TRACK_LOADED") {
                    player.queue.add(res.tracks[0]);
                    const embed = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "play_track", {
                            title: res.tracks[0].title,
                            url: res.tracks[0].uri,
                            duration: convertTime(res.tracks[0].duration, true),
                            request: res.tracks[0].requester
                        })}`)
                        .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(res.tracks)
                    const embed = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                            title: res.playlist.name,
                            url: value,
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
                    const embed = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "play_result", {
                            title: res.tracks[0].title,
                            url: res.tracks[0].uri,
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
        if (interaction.options.getSubcommand() === "previous") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "previous_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if (!player.queue.previous) return msg.edit(`${client.i18n.get(language, "music", "previous_notfound")}`);
    
            await player.queue.unshift(player.queue.previous);
            await player.stop();
    
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "queue") {
            const value = interaction.options.getInteger("page");

            const player = client.manager.get(interaction.guild.id);
            if (!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            const song = player.queue.current;
            const qduration = `${formatDuration(player.queue.duration)}`;
            const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;
    
            let pagesNum = Math.ceil(player.queue.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            const songStrings = [];
            for (let i = 0; i < player.queue.length; i++) {
                const song = player.queue[i];
                songStrings.push(
                    `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.duration)}]\` • ${song.requester}
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = songStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${client.i18n.get(language, "music", "queue_author", {
                        guild: interaction.guild.name,
                    })}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(thumbnail)
                    .setColor(client.color)
                    .setDescription(`${client.i18n.get(language, "music", "queue_description", {
                        title: song.title,
                        url: song.uri,
                        duration: formatDuration(song.duration),
                        request: song.requester,
                        rest: str == '' ? '  Nothing' : '\n' + str,
                    })}`)
                    .setFooter({ text: `${client.i18n.get(language, "music", "queue_footer", {
                        page: i + 1,
                        pages: pagesNum,
                        queue_lang: player.queue.length,
                        duration: qduration,
                    })}` });
    
                pages.push(embed);
            }
    
            if (!value) {
                if (pages.length == pagesNum && player.queue.length > 10) SlashPage(client, interaction, pages, 60000, player.queue.length, qduration, language);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "music", "queue_notnumber")}`);
                if (value > pagesNum) return interaction.editReply(`${client.i18n.get(language, "music", "queue_page_notfound", {
                    page: pagesNum,
                })}`);
                const pageNum = value == 0 ? 1 : value - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
        }
        if (interaction.options.getSubcommand() === "replay") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "replay_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            await player.seek(0);
    
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "replay_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "resume") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "resume_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
            
            await player.pause(player.playing);
            const uni = player.paused ? `${client.i18n.get(language, "music", "resume_switch_pause")}` : `${client.i18n.get(language, "music", "resume_switch_resume")}`;
    
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "resume_msg", {
                    resume: uni
                })}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "rewind") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "rewind_loading")}`);
            const value = interaction.options.getInteger("seconds");
    
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            const CurrentDuration = formatDuration(player.position);
    
            if(value && !isNaN(value)) {
                if((player.position - value * 1000) > 0) {
                    await player.seek(player.position - value * 1000);
                    
                    const rewind1 = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "rewind_msg", {
                        duration: CurrentDuration,
                    })}`)
                    .setColor(client.color);
    
                    msg.edit({ content: " ", embeds: [rewind1] });
                }
                else {
                    return msg.edit(`${client.i18n.get(language, "music", "rewind_beyond")}`);
                }
            }
            else if(value && isNaN(value)) {
                return msg.edit(`${client.i18n.get(language, "music", "rewind_invalid", {
                    prefix: "/"
                })}`);
            }
    
            if(!value) {
                if((player.position - rewindNum * 1000) > 0) {
                    await player.seek(player.position - rewindNum * 1000);
                    
                    const rewind2 = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "rewind_msg", {
                        duration: CurrentDuration,
                    })}`)
                    .setColor(client.color);
    
                    msg.edit({ content: " ", embeds: [rewind2] });
                }
                else {
                    return msg.edit(`${client.i18n.get(language, "music", "rewind_beyond")}`);
                }
            }
        }
        if (interaction.options.getSubcommand() === "search") {
            const value = interaction.options.get("input").value;
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "search_loading")}`);
    
            const { channel } = interaction.member.voice;
            if (!channel) return msg.edit(`${client.i18n.get(language, "music", "search_invoice")}`);
            if (!channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.CONNECT)) return msg.edit(`${client.i18n.get(language, "music", "search_join")}`);
            if (!channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.SPEAK)) return msg.edit(`${client.i18n.get(language, "music", "search_speak")}`);
    
            const player = client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
            });
    
            const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("one")
                .setEmoji("1️⃣")
                .setStyle("SECONDARY")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("two")
                .setEmoji("2️⃣")
                .setStyle("SECONDARY")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("three")
                .setEmoji("3️⃣")
                .setStyle("SECONDARY")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("four")
                .setEmoji("4️⃣")
                .setStyle("SECONDARY")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("five")
                .setEmoji("5️⃣")
                .setStyle("SECONDARY")
            )
    
            const search = value;
    
            const state = player.state;
            if (state != "CONNECTED") await player.connect();
            const res = await client.manager.search(search, interaction.user);
            if(res.loadType != "NO_MATCHES") {
                if(res.loadType == "TRACK_LOADED") {
                    player.queue.add(res.tracks[0]);
                    const embed = new MessageEmbed() //`**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                        .setDescription(`${client.i18n.get(language, "music", "search_result", {
                            title: res.tracks[0].title,
                            url: res.tracks[0].uri,
                            duration: convertTime(res.tracks[0].duration, true),
                            request: res.tracks[0].requester
                        })}`)
                        .setColor(client.color)
                        msg.edit({ content: " ", embeds: [embed] });
                        if (!player.playing) player.play();
                    }
                    else if(res.loadType == "SEARCH_RESULT") {
                        let index = 1;
                        const results = res.tracks
                            .slice(0, 5) //**(${index++}.) [${video.title}](${video.uri})** \`${convertTime(video.duration)}\` Author: \`${video.author}\`
                            .map(video => `${client.i18n.get(language, "music", "search_select", {
                                num: index++,
                                title: video.title,
                                url: video.uri,
                                duration: convertTime(video.duration),
                                author: video.author
                            })}`)
                            .join("\n");
                        const playing = new MessageEmbed()
                            .setAuthor({ name: `${client.i18n.get(language, "music", "search_title")}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setColor(client.color)
                            .setDescription(results)
                            .setFooter({ text: `${client.i18n.get(language, "music", "search_footer")}` })
                        await msg.edit({ content: " ", embeds: [playing], components: [row] });
    
                        const collector = msg.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, time: 30000, max: 1 });
    
                        collector.on('collect', async (interaction) => {
                            if(!player && !collector.ended) return collector.stop();
                            const id = interaction.customId;
    
                            if(id === "one") {
                                player.queue.add(res.tracks[0]);
                                if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
    
                                const embed = new MessageEmbed() //**Queued • [${res.tracks[0].title}](${res.tracks[0].uri})** \`${convertTime(res.tracks[0].duration, true)}\` • ${res.tracks[0].requester}
                                    .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                        title: res.tracks[0].title,
                                        url: res.tracks[0].uri,
                                        duration: convertTime(res.tracks[0].duration, true),
                                        request: res.tracks[0].requester
                                    })}`)
                                    .setColor(client.color)
             
                                if(msg) await msg.edit({ embeds: [embed], components: [] });
                            } else if(id === "two") {
                                player.queue.add(res.tracks[1]);
                                if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
    
                                const embed = new MessageEmbed() //**Queued • [${res.tracks[1].title}](${res.tracks[1].uri})** \`${convertTime(res.tracks[1].duration, true)}\` • ${res.tracks[1].requester}
                                    .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                        title: res.tracks[1].title,
                                        url: res.tracks[1].uri,
                                        duration: convertTime(res.tracks[1].duration, true),
                                        request: res.tracks[1].requester
                                    })}`)
                                    .setColor(client.color)
            
                                if(msg) await msg.edit({ embeds: [embed], components: [] });
                            } else if(id === "three") {
                                player.queue.add(res.tracks[2]);
                                if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
    
                                const embed = new MessageEmbed() //**Queued • [${res.tracks[2].title}](${res.tracks[2].uri})** \`${convertTime(res.tracks[2].duration, true)}\` • ${res.tracks[2].requester}
                                    .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                        title: res.tracks[2].title,
                                        url: res.tracks[2].uri,
                                        duration: convertTime(res.tracks[2].duration, true),
                                        request: res.tracks[2].requester
                                    })}`)
                                    .setColor(client.color)
            
                                if(msg) await msg.edit({ embeds: [embed], components: [] });
                            } else if(id === "four") {
                                player.queue.add(res.tracks[3]);
                                if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
    
                                const embed = new MessageEmbed() //**Queued • [${res.tracks[3].title}](${res.tracks[3].uri})** \`${convertTime(res.tracks[3].duration, true)}\` • ${res.tracks[3].requester}
                                    .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                        title: res.tracks[3].title,
                                        url: res.tracks[3].uri,
                                        duration: convertTime(res.tracks[3].duration, true),
                                        request: res.tracks[3].requester
                                        })}`)
                                    .setColor(client.color)
            
                                if(msg) await msg.edit({ embeds: [embed], components: [] });
                            } else if(id === "five") {
                                player.queue.add(res.tracks[4]);
                                if(player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) await player.play();
    
                                const embed = new MessageEmbed() //**Queued • [${res.tracks[4].title}](${res.tracks[4].uri})** \`${convertTime(res.tracks[4].duration, true)}\` • ${res.tracks[4].requester}
                                    .setDescription(`${client.i18n.get(language, "music", "search_result", {
                                        title: res.tracks[4].title,
                                        url: res.tracks[4].uri,
                                        duration: convertTime(res.tracks[4].duration, true),
                                        request: res.tracks[4].requester
                                        })}`)
                                    .setColor(client.color)
            
                                if(msg) await msg.edit({ embeds: [embed], components: [] });
                            }
                        });
    
                        collector.on('end', async (collected, reason) => {
                            if(reason === "time") {
                                msg.edit({ content: `${client.i18n.get(language, "music", "search_no_response")}`, embeds: [], components: [] });
                                player.destroy();
                            }
                        });
    
                    }
                    else if(res.loadType == "PLAYLIST_LOADED") {
                        player.queue.add(res.tracks)
                        const playlist = new MessageEmbed() //**Queued** • [${res.playlist.name}](${search}) \`${convertTime(res.playlist.duration)}\` (${res.tracks.length} tracks) • ${res.tracks[0].requester}
                            .setDescription(`${client.i18n.get(language, "music", "search_playlist", {
                                title: res.playlist.name,
                                url: search,
                                duration: convertTime(res.playlist.duration),
                                songs: res.tracks.length,
                                request: res.tracks[0].requester
                            })}`)
                            .setColor(client.color)
                        msg.edit({ content: " ", embeds: [playlist] });
                            if(!player.playing) player.play()
                        }
                        else if(res.loadType == "LOAD_FAILED") {
                            msg.edit(`${client.i18n.get(language, "music", "search_fail")}`);
                            player.destroy();
                        }
                    }
                    else {
                        msg.edit(`${client.i18n.get(language, "music", "search_match")}`);
                        player.destroy();
                    }
        }
        if (interaction.options.getSubcommand() === "seek") {
            const value = interaction.options.getInteger("seconds");
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "seek_loading")}`);
            
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if(value * 1000 >= player.playing.length || value < 0) return msg.edit(`${client.i18n.get(language, "music", "seek_beyond")}`);
            await player.seek(value * 1000);
    
            const Duration = formatDuration(player.position);
    
            const seeked = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "seek_msg", {
                    duration: Duration
                })}`)
                .setColor(client.color);
    
            msg.edit({ content: ' ', embeds: [seeked] });
        }
        if (interaction.options.getSubcommand() === "shuffle") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "shuffle_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            await player.queue.shuffle();
    
            const shuffle = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "shuffle_msg")}`)
                .setColor(client.color);
            
            msg.edit({ content: " ", embeds: [shuffle] });
        }
        if (interaction.options.getSubcommand() === "skip") {
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "skip_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if (player.queue.size == 0) {
                await player.destroy();
                await client.UpdateMusic(player);
    
                const skipped = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                    .setColor(client.color);
        
                msg.edit({ content: " ", embeds: [skipped] });
            } else {
                await player.stop();
    
                const skipped = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                    .setColor(client.color);
        
                msg.edit({ content: " ", embeds: [skipped] });
            }
        }
        if (interaction.options.getSubcommand() === "skipto") {
            const value = interaction.options.getInteger("position");
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "skipto_loading")}`);
    
            if (value === 0) return msg.edit(`${client.i18n.get(language, "music", "skipto_arg", {
                prefix: "/"
            })}`);
    
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if ((value > player.queue.length) || (value && !player.queue[value - 1])) return msg.edit(`${client.i18n.get(language, "music", "skipto_invalid")}`);
            if (value == 1) player.stop();
    
            await player.queue.splice(0, value - 1);
            await player.stop();
            
            const skipto = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "skipto_msg", {
                    position: value
                })}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [skipto] });
        }
        if (interaction.options.getSubcommand() === "volume") {
            const value = interaction.options.getInteger("amount");
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "volume_loading")}`);
    
            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            if (!value) return msg.edit(`${client.i18n.get(language, "music", "volume_usage", {
                volume: player.volume
            })}`);
            if (Number(value) <= 0 || Number(value) > 100) return msg.edit(`${client.i18n.get(language, "music", "volume_invalid")}`);
    
            await player.setVolume(Number(value));
    
            const changevol = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "music", "volume_msg", {
                    volume: value
                })}`)
                .setColor(client.color);
            
            msg.edit({ content: " ", embeds: [changevol] });
        }
        if (interaction.options.getSubcommand() === "radio"){
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "radio_loading")}`);
            const value = interaction.options.getInteger("radio_number");
            const { channel } = interaction.member.voice;
            if (!channel) return msg.edit(`${client.i18n.get(language, "music", "search_invoice")}`);
            if (!channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.CONNECT)) return msg.edit(`${client.i18n.get(language, "music", "radio_join")}`);
            if (!channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.SPEAK)) return msg.edit(`${client.i18n.get(language, "music", "radio_speak")}`);

            const resultsEmbed = new MessageEmbed()
              .setTitle(`${client.i18n.get(language, "radio", "available_radio")}`)//
              .addFields(
                {
                  name: `${client.i18n.get(language, "radio", "standard_radio")}`, value: `**1:  ** [\`${Radiostations[1 - 1].split(" ")[0]}\`](${Radiostations[1 - 1].split(" ")[1]})
                **2:  ** [\`${Radiostations[2 - 1].split(" ")[0]}\`](${Radiostations[2 - 1].split(" ")[1]})
                **3:  ** [\`${Radiostations[3 - 1].split(" ")[0]}\`](${Radiostations[3 - 1].split(" ")[1]})
                **4:  ** [\`${Radiostations[4 - 1].split(" ")[0]}\`](${Radiostations[4 - 1].split(" ")[1]})
                **5:  ** [\`${Radiostations[5 - 1].split(" ")[0]}\`](${Radiostations[5 - 1].split(" ")[1]})
                ` , inline: true
                }, {
                  name: `${client.i18n.get(language, "radio", "standard_radio")}`, value: `**6:  ** [\`${Radiostations[6 - 1].split(" ")[0]}\`](${Radiostations[6 - 1].split(" ")[1]})
                **7:  ** [\`${Radiostations[7 - 1].split(" ")[0]}\`](${Radiostations[7 - 1].split(" ")[1]})
                **8:  ** [\`${Radiostations[8 - 1].split(" ")[0]}\`](${Radiostations[8 - 1].split(" ")[1]})
                **9:  ** [\`${Radiostations[9 - 1].split(" ")[0]}\`](${Radiostations[9 - 1].split(" ")[1]})
                **10: ** [\`${Radiostations[10 - 1].split(" ")[0]}\`](${Radiostations[10 - 1].split(" ")[1]})
                ` , inline: true
                },
                { name: `\u200b`, value: `\u200b`, inline: true },

                {
                  name: `***🇬🇧 British RADIO:***`, value: `**11: ** [\`${Radiostations[11 - 1].split(" ")[0]}\`](${Radiostations[11 - 1].split(" ")[1]})
        **12: ** [\`${Radiostations[12 - 1].split(" ")[0]}\`](${Radiostations[12 - 1].split(" ")[1]})
        ` , inline: true
                },
                {
                  name: `***🇬🇧 British RADIO:***`, value: `
        **13: ** [\`${Radiostations[13 - 1].split(" ")[0]}\`](${Radiostations[13 - 1].split(" ")[1]})
        **14: ** [\`${Radiostations[14 - 1].split(" ")[0]}\`](${Radiostations[14 - 1].split(" ")[1]})
        ` , inline: true
                },
                {
                  name: `***🇬🇧 British RADIO:***`, value: `
        **15: ** [\`${Radiostations[15 - 1].split(" ")[0]}\`](${Radiostations[15 - 1].split(" ")[1]})
        **16: ** [\`${Radiostations[16 - 1].split(" ")[0]}\`](${Radiostations[16 - 1].split(" ")[1]})
        ` , inline: true
                },

                {
                  name: `***🇦🇺 AUSTRALIA RADIO:***`, value: `**17: ** [\`${Radiostations[17 - 1].split(" ")[0]}\`](${Radiostations[17 - 1].split(" ")[1]})
        **18: ** [\`${Radiostations[18 - 1].split(" ")[0]}\`](${Radiostations[18 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇦🇹 AUSTRIA RADIO:***`, value: `**19: ** [\`${Radiostations[19 - 1].split(" ")[0]}\`](${Radiostations[19 - 1].split(" ")[1]})
        **20: ** [\`${Radiostations[20 - 1].split(" ")[0]}\`](${Radiostations[20 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇫🇷 France RADIO:***`, value: ` **21: ** [\`${Radiostations[21 - 1].split(" ")[0]}\`](${Radiostations[21 - 1].split(" ")[1]})
        **22: ** [\`${Radiostations[22 - 1].split(" ")[0]}\`](${Radiostations[22 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇮🇹 Italy RADIO:***`, value: `**23: ** [\`${Radiostations[23 - 1].split(" ")[0]}\`](${Radiostations[23 - 1].split(" ")[1]})
        **24: ** [\`${Radiostations[24 - 1].split(" ")[0]}\`](${Radiostations[24 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇪🇪 Estonia RADIO:***`, value: `**25: ** [\`${Radiostations[25 - 1].split(" ")[0]}\`](${Radiostations[25 - 1].split(" ")[1]})
        **26: ** [\`${Radiostations[26 - 1].split(" ")[0]}\`](${Radiostations[26 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇪🇸 Spain RADIO:***`, value: `**27: ** [\`${Radiostations[27 - 1].split(" ")[0]}\`](${Radiostations[27 - 1].split(" ")[1]})
        **28: ** [\`${Radiostations[28 - 1].split(" ")[0]}\`](${Radiostations[28 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇨🇿 Czech RADIO:***`, value: `**29: ** [\`${Radiostations[29 - 1].split(" ")[0]}\`](${Radiostations[29 - 1].split(" ")[1]})
        **30: ** [\`${Radiostations[30 - 1].split(" ")[0]}\`](${Radiostations[30 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇳🇱 Netherlands RADIO:***`, value: `**31: ** [\`${Radiostations[31 - 1].split(" ")[0]}\`](${Radiostations[31 - 1].split(" ")[1]})
        **32: ** [\`${Radiostations[32 - 1].split(" ")[0]}\`](${Radiostations[32 - 1].split(" ")[1]})`, inline: true
                },

                {
                  name: `***🇵🇱 Polska RADIO:***`, value: `**33: ** [\`${Radiostations[33 - 1].split(" ")[0]}\`](${Radiostations[33 - 1].split(" ")[1]})
        **34: ** [\`${Radiostations[34 - 1].split(" ")[0]}\`](${Radiostations[34 - 1].split(" ")[1]})`, inline: true
                },
              )
              .setColor(client.color)
              .setFooter({text:`Type: /radio <1-34>`})
              .setTimestamp();

            if (!value){
                return msg.edit({ content: " ", embeds: [resultsEmbed] })
            }

            if (Number(value) > 34 || Number(value) < 0) { 
                    return msg.edit(`${client.i18n.get(language, "music", "radio_invalid", {
                        prefix: "/"
                    })}`);
                }

            const player = await client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
            });

            let i;

            for (i = 1; i <= 1 + Radiostations.length; i++) {
              if (Number(value) === Number(i)) {
                break;
              }
            }

            const args2 = Radiostations[i - 1].split(` `);

            const song = args2[1]
            const state = player.state;
            if (state != "CONNECTED") await player.connect();

            const res = await client.manager.search(song, interaction.user);

            switch (res.loadType) {
                case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);
                    const embed = new MessageEmbed()
                        .setDescription(`${client.i18n.get(language, "music", "play_track", {
                            title: args2[0],
                            url: res.tracks[0].uri,
                            duration: convertTime(res.tracks[0].duration, true),
                            request: res.tracks[0].requester
                        })}`)
                        .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                    if(!player.playing) player.play();
                break;
                case "NO_MATCHES":
                msg.edit(`${client.i18n.get(language, "music", "radio_match")}`);
                player.destroy();
            }
            player.twentyFourSeven = true;
        }
    }
};