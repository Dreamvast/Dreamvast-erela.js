const { EmbedBuilder } = require('discord.js');
const GLang = require('../../plugins/schemas/language.js'); 
const GControl = require('../../plugins/schemas/control.js');
const Setup = require('../../plugins/schemas/setup.js')
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
                    name: "type",
                    description: "Choose enable or disable",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Enable",
                            value: "enable"
                        },
                        {
                            name: "Disable",
                            value: "disable"
                        }
                    ]
                }
            ]
        },
        {
            name: "setup",
            description: "Setup channel song request",
            type: 1,
            options: [
                {
                    name: "type",
                    description: "Type of channel",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Create",
                            value: "create"
                        },
                        {
                            name: "Delete",
                            value: "delete"
                        }
                    ]
                },
            ]
        }
    ],
run: async (interaction, client, language) => {
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
                    language: input,
                });
                newLang.save().then(() => {
                    const embed = new EmbedBuilder()
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
                    const embed = new EmbedBuilder()
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

            const restart = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
                .setColor(client.color);
        
            await interaction.editReply({ embeds: [restart] });
                    
            process.exit();
        }
        ///// CONTROL COMMAND!
        if (interaction.options.getSubcommand() === "control"){

            if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`${client.i18n.get(language, "utilities", "control_perm")}`);
            const Control = await GControl.findOne({ guild: interaction.guild.id });
            if(interaction.options._hoistedOptions.find(c => c.value === "enable")) {
                if(!Control) {
                    const Control = new GControl({
                        guild: interaction.guild.id,
                        playerControl: "enable"
                    });
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                            toggle: "enable"
                        })}`)
                        .setColor(client.color)
    
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`)
                        console.log(err)
                    });
                }
                else if(Control) {
                    Control.playerControl = "enable";
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_change", {
                            toggle: "enable"
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
            else if(interaction.options._hoistedOptions.find(c => c.value === "disable")) {
                if(!Control) {
                    const Control = new GControl({
                        guild: interaction.guild.id,
                        playerControl: "disable"
                    });
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                            toggle: "disable"
                        })}`)
                        .setColor(client.color)
    
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`)
                        console.log(err)
                    });
                }
                else if(Control) {
                    Control.playerControl = "disable"
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_change", {
                            toggle: "disable"
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

        /// Setup command
        if (interaction.options.getSubcommand() === "setup") {
            if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            if(interaction.options._hoistedOptions.find(c => c.value === "create")) {
                // Create voice
                await interaction.guild.channels.create({
                    name: "song-request",
                    type: 0, // 0 = text, 2 = voice
                    topic: `${client.i18n.get(language, "setup", "setup_topic")}`,
                    parent_id: interaction.channel.parentId,
                    user_limit: 3,
                    rate_limit_per_user: 3, 
                }).then(async (channel) => {

                    const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

                    const playEmbed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
                        .setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`)
                        .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc")}`)
                        .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer")}` });

                        await channel.send({ content: `${queueMsg}`, embeds: [playEmbed], components: [client.diSwitch] }).then(async (playmsg) => {
                            await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                                guild: interaction.guild.id,
                                enable: true,
                                channel: channel.id,
                                playmsg: playmsg.id,
                            }, { upsert: true, new: true });

                            const embed = new EmbedBuilder()
                                .setDescription(`${client.i18n.get(language, "setup", "setup_msg", {
                                    channel: channel,
                                })}`)
                                .setColor(client.color);
                                return interaction.followUp({ embeds: [embed] });
                            })
                        });
                    }
                if(interaction.options._hoistedOptions.find(c => c.value === "delete")) {
                    await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                            guild: interaction.guild.id,
                            enable: false,
                            channel: "",
                            playmsg: "",
                        });
                        
                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "setup", "setup_deleted")}`)
                        .setColor(client.color);

                    return interaction.editReply({ embeds: [embed] });
                }
        }
    }
};