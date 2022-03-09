'use strict'
require('dotenv').config()
const tracer = require('./specula-auto-tracer')
tracer.initialize({
  clientId: process.env.CLIENT_ID,
  auth: process.env.CLIENT_SECRET,
  endpoint: process.env.SPECULA_APM_ENDPOINT,
  serviceName: 'cinema-microservice::booking-service',
  instrumentations: ['express', 'http', 'mongodb']
})
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const di = require('./config')
const mediator = new EventEmitter()

console.log('--- Booking Service ---')
console.log('Connecting to booking repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('di.ready', (container) => {
  repository.connect(container)
    .then(repo => {
      console.log('Connected. Starting Server')
      container.registerValue({repo})
      return server.start(container)
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${container.cradle.serverSettings.port}.`)
      app.on('close', () => {
        container.resolve('repo').disconnect()
      })
    })
})

di.init(mediator)

mediator.emit('init')
