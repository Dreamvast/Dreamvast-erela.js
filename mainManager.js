const { Client, Intents, Collection } = require("discord.js");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify")
const Deezer = require("./settings/Deezer");
const AppleMusic = require("erela.js-apple")
const Facebook = require("erela.js-facebook");
const { I18n } = require("locale-parser")

class MainClient extends Client {
     constructor() {
        super({
            shards: "auto",
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_MESSAGES,
            ]
        });
    this.config = require("./settings/config.js");
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
        new AppleMusic()
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

    ["slash", "premiums"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase", "loadPlayer" ].forEach(x => require(`./handlers/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};
module.exports = MainClient;