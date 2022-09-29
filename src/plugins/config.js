require("dotenv").config();
const { resolve } = require("path");

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: process.env.EMBED_COLOR || "#000001", //<= default is "#000001"

    OWNER_ID: process.env.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488"

    NP_REALTIME: process.env.NP_REALTIME || "BOOLEAN", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LEAVE_TIMEOUT: parseInt(process.env.LEAVE_TIMEOUT || "120000"), // leave timeout default "120000" = 2 minutes // 1000 = 1 seconds

    LANGUAGE: {
      defaultLocale: process.env.LANGUAGE || "en", // "en" = default language
      directory: resolve("./src/languages"), // <= location of language
    },

    DEV_ID: [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

    MONGO_URI: process.env.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri

    SPOTIFY_ID: process.env.SPOTIFY_ID,
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET,

    DEFAULT: ["yorushika", "yoasobi", "tuyu"],

    NODES: [
      { 
        name: process.env.NODE_NAME || "Main Lavalink",
        url: process.env.NODE_URL || "lavalink.oops.wtf:2000",
        auth: process.env.NODE_PASSWORD || "www.freelavalink.ga",
        secure: parseBoolean(process.env.NODE_SECURE || 'false')
      } 
    ],

    SHOUKAKU: [
      {
        moveOnDisconnect: false,
        resumable: false,
        resumableTimeout: 30,
        reconnectTries: 2,
        restTimeout: 10000
      }
    ]
}

function parseBoolean(value){
  if (typeof(value) === 'string'){
      value = value.trim().toLowerCase();
  }
  switch(value){
      case true:
      case "true":
          return true;
      default:
          return false;
  }
}