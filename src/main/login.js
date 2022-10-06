const MainClient = require("./bot.js");
const client = new MainClient();
const logger = require('../plugins/logger')

client.connect()
client.on("error", (err) => {
  logger.error(err);
 });