// require("dotenv").config();
// const logger = require('./plugins/logger')
// const { ShardingManager } = require('discord.js');

// const manager = new ShardingManager('./src/main/login.js', { totalShards: 3,
//      token: process.env.TOKEN });

// manager.on('shardCreate', shard => logger.info(`Launched shard ${shard.id}`));

// manager.spawn({timeout: Infinity});

require('./main/login')
require('./api/index')