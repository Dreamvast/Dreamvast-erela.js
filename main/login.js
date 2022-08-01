const MainClient = require("./bot.js");
const client = new MainClient();

client.connect()
client.on('error', error => {
	console.error(error);
});
module.exports = client; 