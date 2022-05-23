const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
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
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        switch (interaction.options.getSubcommand()){
            case "status":
                const info = new MessageEmbed()
                    .setTitle(client.user.tag + " Status")
                    .addField('Uptime', `\`\`\`${ms(client.uptime)}\`\`\``, true)
                    .addField('WebSocket Ping', `\`\`\`${client.ws.ping}ms\`\`\``, true)
                    .addField('Memory', `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, true)
                    .addField('Guild Count', `\`\`\`${client.guilds.cache.size} guilds\`\`\``, true)
                    .addField(`User Count`, `\`\`\`${client.users.cache.size} users\`\`\``, true)
                    .addField('Node', `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, true)
                    .addField('Cached Data', `\`\`\`${client.users.cache.size} users\n${client.emojis.cache.size} emojis\`\`\``, true)
                    .addField('Discord.js', `\`\`\`v13\`\`\``, true)
                    .setTimestamp()
                    .setFooter({ text: "Hope you like me!" })
                    .setColor(client.color);

                const row = new MessageActionRow()
                    .addComponents(
                      new MessageButton()
                        .setLabel("Invite Me")
                        .setStyle("LINK")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
      
                await interaction.editReply({ embeds: [info], components: [row] });
            break;

            case "developer":
                const xeondex = new MessageEmbed()
                .setTitle("Adivise/XeonDex | I'm just remake from Adivise")
                .setDescription("This is a remade music bot with added features. Special thanks to Adivise.")
                .setFooter({ text: "Consider Joining the server or Inviting the Bot :) This would help me alot!" })
                .setColor(client.color);

                const row1 = new MessageActionRow()
                    .addComponents(
                      new MessageButton()
                        .setLabel("Github (Adivise)")
                        .setStyle("LINK")
                        .setURL("https://github.com/Adivise")
                    )
                    .addComponents(
                      new MessageButton()
                        .setLabel("Github (XeonDex)")
                        .setStyle("LINK")
                        .setURL("https://github.com/XeonE52680v3")
                    )
                    .addComponents(
                        new MessageButton()
                            .setLabel("Support Server")
                            .setStyle("LINK")
                            .setURL("https://discord.com/invite/xHvsCMjnhU")
                    )

                  
                    await interaction.editReply({ embeds: [xeondex], components: [row1] });
            break;

            case "invite":
                const invite = new MessageEmbed()
                    .setTitle(`**Thanks for Inviting ${client.user.username}**`)
                    .setDescription(`**${client.user.username} Powered by Adivise/XeonDex**`)
                    .addField('Nanospace:', `https://github.com/Adivise/NanoSpacePlus`)
                    .addField(`${client.user.username}`, `https://top.gg/bot/958642964018642944`)
                    .setTimestamp()
                    .setColor(client.color);

                const row2 = new MessageActionRow()
                    .addComponents(
                      new MessageButton()
                        .setLabel("Invite Me")
                        .setStyle("LINK")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
                  
                await interaction.editReply({ embeds: [invite], components: [row2] });
            break;

            case "ping":
                const ping = new MessageEmbed()
                    .setTitle("**Ping of **" + client.user.username)
                    .setDescription(`My Ping is ***${client.ws.ping}ms***`)
                    .setTimestamp()
                    .setColor(client.color);

                const row3 = new MessageActionRow()
                    .addComponents(
                      new MessageButton()
                        .setLabel("Invite Me")
                        .setStyle("LINK")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
              
                await interaction.editReply({ embeds: [ping], components: [row3] });
            break;
        }          
    }
};