const { config } = require('dotenv')

config()

const configurations = {
  server: {
    host: process.env.SERVER_HOST || '127.0.0.1',
    port: parseInt(process.env.SERVER_PORT) || 3000,
  },
  dbUrl: process.env.DATABASE_URL,
}

module.exports = { configurations }
