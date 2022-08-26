const { EmbedBuilder } = require('discord.js');
const GLang = require('../../plugins/schemas/language.js'); 
const GControl = require('../../plugins/schemas/control.js')
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
    }
};