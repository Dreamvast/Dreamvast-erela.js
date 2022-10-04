const { EmbedBuilder } = require('discord.js');
module.exports = { 
  name: "announcements",
  description: "Send the announcelements to all servers!",
  options: [
    {
        name: "message",
        description: "The message you want to send",
        type: 3,
        required: true
    }
  ], 
run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const value = interaction.options.get("message").value;

        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

        const restart = new EmbedBuilder()
          .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`, `${value}`)
          .setColor(client.color);
        
        await interaction.editReply({ embeds: [restart] });
        client.guild.channels.cache.map((guild) => {
         console.log(guild) 
        })


    }
};