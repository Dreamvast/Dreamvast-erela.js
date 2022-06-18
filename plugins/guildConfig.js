const mongoose = require('mongoose');

const CreateGuild = mongoose.Schema({
    guild: {
		type: String,
		required: true,
		unique: true,
	},
    enable: Boolean,
    channel: String,
    playmsg: String,
    queuemsg: String,
    language: {
        type: String,
        default: "en",
        required: true,
    },
    playerControl: {
        type: String,
        default: "disable",
        required: true,
    }
});

module.exports = mongoose.model('guildconfig', CreateGuild);