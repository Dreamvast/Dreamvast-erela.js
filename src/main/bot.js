const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Manager } = require("erela.js");
const Discord = require('discord.js');
const Spotify = require("../plugins/Spotify")
const Deezer = require("../plugins/Deezer");
const AppleMusic = require("erela.js-apple")
const Facebook = require("erela.js-facebook");
const { I18n } = require("@hammerhq/localization")
const Cluster = require('discord-hybrid-sharding');
const TIDAL  = require("erela.js-tidal");

class MainClient extends Client {
     constructor() {
        super({
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ]
        });
    this.config = require("../plugins/config.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    this.i18n = new I18n(this.config.LANGUAGE);
    if(!this.token) this.token = this.config.TOKEN;
    const clientID = this.config.SPOTIFY_ID
    const clientSecret = this.config.SPOTIFY_SECRET

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

	const client = this;

    this.manager = new Manager({
      nodes: this.config.NODES,
      autoPlay: true,
      plugins: [
        new Spotify({
          clientID,
          clientSecret
        }),
        new Facebook(),
        new Deezer(),
        new AppleMusic(),
        new TIDAL(),
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

    ["slash", "premiums"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase", "loadPlayer" ].forEach(x => require(`../handlers/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;