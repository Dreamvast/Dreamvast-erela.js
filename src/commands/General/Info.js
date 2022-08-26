const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
    name: "info",
    description: "Shows the information of the Bot",
    options: [
        {
            name: "status",
            description: "Shows the status information of the Bot",
            type: 1
        },
        {
            name: "developer",
            description: "Shows the developer information of the Bot (Credit)",
            type: 1
        },
        {
            name: "invite",
            description: "Shows the invite information of the Bot",
            type: 1
        },
        {
            name: "ping",
            description: "Shows the ping information of the Bot",
            type: 1
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        switch (interaction.options.getSubcommand()){
            case "status":
                const info = new EmbedBuilder()
                    .setTitle(client.user.tag + " Status")
                    .addFields([
                        { name: 'Uptime', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
                        { name: 'WebSocket Ping', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
                        { name: 'Memory', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
                        { name: 'Guild Count', value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``, inline: true },
                        { name: 'User Count', value: `\`\`\`${client.users.cache.size} users\`\`\``, inline: true },
                        { name: 'Node', value: `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, inline: true },
                        { name: 'Cached Data', value: `\`\`\`${client.users.cache.size} users\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
                        { name: 'Discord.js', value: `\`\`\`${version}\`\`\``, inline: true },
                    ])
                    .setTimestamp()
                    .setFooter({ text: "Hope you like me!" })
                    .setColor(client.color);

                const row = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Invite Me")
                        .setStyle("Link")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
      
                await interaction.editReply({ embeds: [info], components: [row] });
            break;

            case "developer":
                const xeondex = new EmbedBuilder()
                    .setTitle("Adivise/XeonDex | I'm just remake from Adivise")
                    .setDescription("This is a remade music bot with added features. Special thanks to Adivise.")
                    .setFooter({ text: "Consider Joining the server or Inviting the Bot :) This would help me alot!" })
                    .setColor(client.color);

                const row1 = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Github (Adivise)")
                        .setStyle("Link")
                        .setURL("https://github.com/Adivise")
                    )
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Github (XeonDex)")
                        .setStyle("Link")
                        .setURL("https://github.com/XeonE52680v3")
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Support Server")
                            .setStyle("Link")
                            .setURL("https://discord.com/invite/xHvsCMjnhU")
                    )

                  
                    await interaction.editReply({ embeds: [xeondex], components: [row1] });
            break;

            case "invite":
                const invite = new EmbedBuilder()
                    .setTitle(`**Thanks for Inviting ${client.user.username}**`)
                    .setDescription(`**${client.user.username} Powered by Adivise/XeonDex**`)
                    .addFields([
                        { name: 'Nanospace', value: 'https://github.com/Adivise/NanoSpacePlus', inline: false }
                    ])
                    .setTimestamp()
                    .setColor(client.color);

                const row2 = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Invite Me")
                        .setStyle("Link")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
                  
                await interaction.editReply({ embeds: [invite], components: [row2] });
            break;

            case "ping":
                const ping = new EmbedBuilder()
                    .setTitle("**Ping of **" + client.user.username)
                    .setDescription(`My Ping is ***${client.ws.ping}ms***`)
                    .setTimestamp()
                    .setColor(client.color);

                const row3 = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Invite Me")
                        .setStyle("Link")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
              
                await interaction.editReply({ embeds: [ping], components: [row3] });
            break;
        }          
    }
};