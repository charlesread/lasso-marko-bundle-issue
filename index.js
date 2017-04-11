'use strict'

const path = require('path')
const Hapi = require('hapi')

require('marko/node-require')
require('marko/compiler').defaultOptions.writeToDisk = false
require('lasso').configure({
  outputDir: path.join(__dirname, 'static'),
  urlPrefix: '/static',
  plugins: [
    'lasso-marko'
  ]
})

const slashPage = require(path.join(__dirname, 'pages', 'slash', 'index.marko'))
const server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: 8000
})

server.register(require('inert'), (err) => {
  if (err) {
    throw err
  }
  server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, 'static')
      }
    }
  })
})

server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    return reply(slashPage.stream())
  }
})


server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Server running at:', server.info.uri)
})