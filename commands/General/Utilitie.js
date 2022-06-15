const { MessageEmbed } = require('discord.js');
const GLang = require('../../plugins/models/Language.js'); 
const GControl = require('../../plugins/models/Control.js')

module.exports = { 
    name: "utilitie",
    description: "Utilitie Command!",
    options: [
        {
            name: "language",
            description: "Change the language for the bot",
            type: 1, /// SUBCOMMAND! = 1
            options: [
                {
                    name: "input",
                    description: "The new language",
                    required: true,
                    type: 3
                }
            ],
        },
        {
            name: "restart",
            description: "Shuts down the client!",
            type: 1 /// SUBCOMMMAND! = 1
        },
        {
            name: "control",
            description: "Enable or disable the player control",
            type: 1,
            options: [
                {
                    name: "toggle",
                    description: "Choose enable or disable",
                    required: true,
                    type: 3
                }
            ]
        }
    ],
run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        ///// CHANGE LANGUAGE COMMAND!
        if (interaction.options.getSubcommand() === "language") {
            const input = interaction.options.getString("input");

            if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            const languages = client.i18n.getLocales();
            if (!languages.includes(input)) return interaction.editReply(`${client.i18n.get(language, "utilities", "provide_lang", {
                languages: languages.join(', ')
            })}`);
    
            const newLang = await GLang.findOne({ guild: interaction.guild.id });
            if(!newLang) {
                const newLang = new GLang({
                    guild: interaction.guild.id,
                    language: input
                });
                newLang.save().then(() => {
                    const embed = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "utilities", "lang_set", {
                        language: input
                    })}`)
                    .setColor(client.color)
    
                    interaction.editReply({ content: " ", embeds: [embed] });
                }
                ).catch(() => {
                    interaction.editReply(`${client.i18n.get(language, "utilities", "Lang_error")}`);
                });
            }
            else if(newLang) {
                newLang.language = input;
                newLang.save().then(() => {
                    const embed = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "utilities", "lang_change", {
                        language: input
                    })}`)
                    .setColor(client.color)
        
                    interaction.editReply({ content: " ", embeds: [embed] });
                }
                ).catch(() => {
                    interaction.editReply(`${client.i18n.get(language, "utilities", "Lang_error")}`);
                });
            }
        }
        ///// RESTART COMMAND!
        if (interaction.options.getSubcommand() === "restart") {
            if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

            const restart = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
                .setColor(client.color);
        
            await interaction.editReply({ embeds: [restart] });
                    
            process.exit();
        }

        if (interaction.options.getSubcommand() === "control"){
            const toggle = interaction.options.getString("toggle");

            if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`${client.i18n.get(language, "utilities", "control_perm")}`);
            if(toggle !== 'enable' && toggle !== 'disable') return message.channel.send(`${client.i18n.get(language, "utilities", "control_invaild")}`);
            const guildControl = await GControl.findOne({ guild: interaction.guild.id });
            if(!guildControl) {
                const guildControl = new GControl({
                    guild: interaction.guild.id,
                    playerControl: toggle
                });
                guildControl.save().then(() => {
                    const embed = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                        toggle: toggle
                    })}`)
                    .setColor(client.color)

                    interaction.editReply({ embeds: [embed] });
                }
                ).catch((err) => {
                    interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`)
                    console.log(err)
                });
            }
            else if(guildControl) {
                guildControl.playerControl = toggle;
                guildControl.save().then(() => {
                    const embed = new MessageEmbed()
                    .setDescription(`${client.i18n.get(language, "utilities", "control_change", {
                        toggle: toggle
                    })}`)
                    .setColor(client.color)
        
                    interaction.editReply({ embeds: [embed] });
                }
                ).catch((err) => {
                    interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`);
                    console.log(err)
                });
            }
        }
    }
};