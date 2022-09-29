const { Client } = require('discord.js');
const { Shoukaku, Connectors } = require('shoukaku');
const Nodes = [{
    name: 'Localhost',
    url: 'localhost:6969',
    auth: 'marin_kitagawa'
}];
const client = new Client();
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);
// ALWAYS handle error, logging it will do
shoukaku.on('error', (_, error) => console.error(error));
client.login('token');