const Cluster = require('discord-hybrid-sharding');
require("dotenv").config();
const logger = require('./plugins/logger.js')

const manager = new Cluster.Manager(`./main/login.js`, {
    totalShards: 'auto', // or 'auto'
    shardsPerClusters: 2,
    mode: 'process', // you can also choose "worker"
    token: process.env.TOKEN,
});

manager.on('clusterCreate', cluster => logger.info(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });