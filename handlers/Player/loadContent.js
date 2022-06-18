const { MessageEmbed, Client } = require("discord.js");
const GConfig = require("../../plugins/guildConfig.js")
const delay = require("delay");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
try {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.isButton()) {
            const { customId, member } = interaction;
            let voiceMember = interaction.guild.members.cache.get(member.id);
            let channel = voiceMember.voice.channel;

            let player = await client.manager.get(interaction.guild.id);
            if (!player) return;

            const playChannel = client.channels.cache.get(player.textChannel);
            if (!playChannel) return;
        
            let guild_config = await GConfig.findOne({ guild: playChannel.guild.id });
            if (!guild_config) { guild_config = await GConfig.create({
                    guild: playChannel.guild.id,
                    enable: false,
                    channel: "",
                    playmsg: "",
                    language: "en",
                    playerControl: "disable",
                });
            }

            const { language } = guild_config;

            switch (customId) {
                case "sprevious":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player || !player.queue.previous) {
                            return interaction.reply(`${client.i18n.get(language, "music", "previous_notfound")}`);
                        } else {
                            await player.queue.unshift(player.queue.previous);
                            await player.stop();

                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sskip":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {}
                        if (player.queue.size == 0) {
                            await player.destroy();
                            await client.UpdateMusic(player);

                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        } else {
                            await player.stop();

                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sstop":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.destroy();
                            await client.UpdateMusic(player);

                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "spause":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.pause(!player.paused);
                            const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
                                pause: uni,
                                })}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                    break;

                case "sloop":
                    {
                        if (!channel) { 
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(channel)) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                        } else if (!player) {
                            return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                        } else {
                            await player.setQueueRepeat(!player.queueRepeat);
                            const uni = player.queueRepeat ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;
                    
                            const embed = new MessageEmbed()
                                .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
                                loop: uni,
                                })}`)
                                .setColor(client.color);

                            interaction.reply({ embeds: [embed] });
                        }
                    }
                break;
            default:
                break;
            }
        }
    });
    } catch (e) {
        console.log(e);
}

client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;
        let config = await GConfig.findOne({ guild: message.guild.id });
        if (!config) return GConfig.create({
            guild: message.guildId,
            enable: false,
            channel: "",
            playmsg: "",
            language: "en",
            playerControl: "disable",
        });
        if (config.enable === false) return;

        let channel = await message.guild.channels.cache.get(config.channel);
        if (!channel) return;

        if (config.channel != message.channel.id) return;

        const { language } = guildModel;

        if (message.author.id === client.user.id) {
            await delay(3000);
                message.delete()
        }

        if (message.author.bot) return;

            let song = message.cleanContent;
            await message.delete();

            let voiceChannel = await message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`).then((msg) => { 
                setTimeout(() => {
                    msg.delete()
                }, 4000);
            });

            const player = await client.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
            });

            const state = player.state;
            if (state != "CONNECTED") await player.connect();
            const res = await client.manager.search(song, message.author);
            if(res.loadType != "NO_MATCHES") {
                if(res.loadType == "TRACK_LOADED") {
                    player.queue.add(res.tracks[0]);
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "PLAYLIST_LOADED") {
                    player.queue.add(res.tracks)
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "SEARCH_RESULT") {
                    player.queue.add(res.tracks[0]);
                    if(!player.playing) player.play();
                }
                else if(res.loadType == "LOAD_FAILED") {
                    message.channel.send(`${client.i18n.get(language, "music", "play_fail")}`).then((msg) => { 
                        setTimeout(() => {
                            msg.delete()
                        }, 4000);
                    }).catch((e) => {});
                        player.destroy();
                }
            } else {
                message.channel.send(`${client.i18n.get(language, "music", "play_match")}`).then((msg) => { 
                    setTimeout(() => {
                        msg.delete()
                    }, 4000);
                }).catch((e) => {});
                    player.destroy();
                }

                if (player) {
                    client.UpdateQueueMsg(player);
                }
        });
};