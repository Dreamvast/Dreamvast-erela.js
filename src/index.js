const MainClient = require("./main/bot.js");
const client = new MainClient();

client.connect()
client.on("error", (err) => {
  console.log(err);
 });
module.exports = client; 