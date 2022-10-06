const PORT = process.env.PORT || 1573
require('dotenv').config
const logger = require('./utils/logger')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)

logger.info(`Started the api at port ${PORT}`)