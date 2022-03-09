const dbSettings = {
  db: process.env.DB || 'movies',
  user: process.env.DB_USER || 'root',
  pass: process.env.DB_PASS || '123123',
  servers: [process.env.DB_SERVERS],
  dbParameters: () => ({
    w: 'majority',
    wtimeout: 10000,
    j: true,
    readPreference: 'ReadPreference.SECONDARY_PREFERRED',
    native_parser: false
  }),
  serverParameters: () => ({
    autoReconnect: true,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  })
}

const serverSettings = {
  port: process.env.PORT || 3000,
  ssl: require('./ssl')
}

module.exports = Object.assign({}, { dbSettings, serverSettings })
