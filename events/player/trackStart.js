const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, } = require("discord.js");
const formatduration = require('../../structures/FormatDuration.js');
const GConfig = require("../../plugins/guildConfig.js")
  
module.exports = async (client, player, track, payload) => {
  let GuildControl = await GConfig.findOne({ guild: player.guild });
  if (!GuildControl) {
    GuildControl = await GConfig.create({
      guild: player.guild,
      enable: false,
      channel: "",
      playmsg: "",
      language: "en",
      playerControl: "disable",
    });
  }

  if (GuildControl.playerControl === 'enable'){
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    let guildModel = await GConfig.findOne({
      guild: channel.guild.id,
    });
    if (!guildModel) {
      guildModel = await GConfig.create({
        guild: channel.guild.id,
        enable: false,
        channel: "",
        playmsg: "",
        language: "en",
        playerControl: "disable",
      });
    }
    const { language } = guildModel;
  
    const embeded = new EmbedBuilder()
      .setAuthor({ name: `${client.i18n.get(language, "player", "track_title")}`, iconURL: `${client.i18n.get(language, "player", "track_icon")}` })
      .setDescription(`**[${track.title}](${track.uri})**`)
      .setColor(client.color)
      .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/hqdefault.jpg`)
      .addField(`${client.i18n.get(language, "player", "author_title")}`, `${track.author}`, true)
      .addField(`${client.i18n.get(language, "player", "request_title")}`, `${track.requester}`, true)
      .addField(`${client.i18n.get(language, "player", "volume_title")}`, `${player.volume}%`, true)
      .addField(`${client.i18n.get(language, "player", "queue_title")}`, `${player.queue.length}`, true)
      .addField(`${client.i18n.get(language, "player", "duration_title")}`, `${formatduration(track.duration, true)}`, true)
      .addField(`${client.i18n.get(language, "player", "total_duration_title")}`, `${formatduration(player.queue.duration)}`, true)
      .addField(`${client.i18n.get(language, "player", "current_duration_title", {
        current_duration: formatduration(track.duration, true),
      })}`, `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``)
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("pause")
          .setEmoji("⏯")
          .setStyle("Success")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("replay")
          .setEmoji("⬅")
          .setStyle("Primary")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("✖")
          .setStyle("Danger")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("skip")
          .setEmoji("➡")
          .setStyle("Primary")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji("🔄")
          .setStyle("Success")
      )
    
    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji("🔀")
          .setStyle("Success")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("voldown")
          .setEmoji("🔉")
          .setStyle("Primary")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("clear")
          .setEmoji("🗑")
          .setStyle("Danger")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("volup")
          .setEmoji("🔊")
          .setStyle("Primary")
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("queue")
          .setEmoji("📋")
          .setStyle("Success")
      )
    
    const nplaying = await client.channels.cache.get(player.textChannel).send({ embeds: [embeded], components: [row, row2] });

    const filter = (message) => {
      if(message.guild.me.voice.channel && message.guild.me.voice.channelId === message.member.voice.channelId) return true;
      else {
        message.reply({ content: `${client.i18n.get(language, "player", "join_voice")}`, ephemeral: true });
      }
    };
    const collector = nplaying.createMessageComponentCollector({ filter, time: track.duration });

    collector.on('collect', async (message) => {
      const id = message.customId;
      if(id === "pause") {
      if(!player) {
          collector.stop();
      }
        await player.pause(!player.paused);
        const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
              pause: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if (id === "skip") {
        if(!player) {
          collector.stop();
        }
        await player.stop();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "skip_msg")}`)
            .setColor(client.color);

        await nplaying.edit({ embeds: [embeded], components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "stop") {
        if(!player) {
          collector.stop();
        }

        await player.stop();
        await player.destroy();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
            .setColor(client.color);
        
        await nplaying.edit({ embeds: [embeded], components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "shuffle") {
        if(!player) {
          collector.stop();
        }
        await player.queue.shuffle();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "shuffle_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "loop") {
        if(!player) {
          collector.stop();
        }
        await player.setTrackRepeat(!player.trackRepeat);
        const uni = player.trackRepeat ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
              loop: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "volup") {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume + 5);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "volup_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "voldown") {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume - 5);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "voldown_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "replay") {
        if(!player) {
          collector.stop();
        }
        await player.seek(0);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "replay_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "queue") {
        if(!player) {
          collector.stop();
        }
        const song = player.queue.current;
        const qduration = `${formatduration(player.queue.duration)}`;
        const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;
    
        let pagesNum = Math.ceil(player.queue.length / 10);
        if(pagesNum === 0) pagesNum = 1;
    
        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
          const song = player.queue[i];
          songStrings.push(
            `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatduration(song.duration)}]\` • ${song.requester}
            `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
          const str = songStrings.slice(i * 10, i * 10 + 10).join('');
    
          const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.i18n.get(language, "player", "queue_author", {
              guild: message.guild.name,
            })}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(thumbnail)
            .setColor(client.color)
            .setDescription(`${client.i18n.get(language, "player", "queue_description", {
              track: song.title,
              track_url: song.uri,
              duration: formatduration(song.duration),
              requester: song.requester,
              list_song: str == '' ? '  Nothing' : '\n' + str,
            })}`)
            .setFooter({ text: `${client.i18n.get(language, "player", "queue_footer", {
              page: i + 1,
              pages: pagesNum,
              queue_lang: player.queue.length,
              total_duration: qduration,
            })}` });
    
          pages.push(embed);
        }
        message.reply({ embeds: [pages[0]], ephemeral: true });
      }
      else if(id === "clear") {
        if(!player) {
          collector.stop();
        }
        await player.queue.clear();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "clear_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
    });
    collector.on('end', async (collected, reason) => {
      if(reason === "time") {
        nplaying.edit({ embeds: [embeded], components: [] })
      }
    });
  } else if(GuildControl.playerControl === 'disable'){
    null
  }
}