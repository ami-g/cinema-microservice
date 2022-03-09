'use strict'
const express = require('express')
const proxy = require('http-proxy-middleware')
const expressJwt = require('express-jwt')
const {JWT_SECRET} = require('./const')
const passport = require('passport')
const {loginStrategy, authenticateLocal} = require('./login')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./api.json')
const cors = require('cors')

const start = (container) => {
  return new Promise((resolve, reject) => {
    const {port} = container.resolve('serverSettings')
    const routes = container.resolve('routes')

    if (!routes) {
      reject(new Error('The server must be started with routes discovered'))
    }
    if (!port) {
      reject(new Error('The server must be started with an available port'))
    }

    const app = express()
    const unprotectedRoutes = ['/login', '/logout', '/docs']

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {swaggerOptions: {displayOperationId: true}}))

    passport.use(loginStrategy)
    app.use(cors())
    app.use(passport.initialize())
    app.use(cookieParser())

    app.post('/login', bodyParser.json(), async (req, res) => {
      try {
        let user = await authenticateLocal(req, res)
        let token = jwt.sign(user, JWT_SECRET, {expiresIn: '7d', algorithm: 'HS256'})

        res.cookie('authentication-token', token, {httpOnly: true, sameSite: false, secure: false})

        res.status(200).send({
          user,
          token
        })
      } catch (err) {
        res.status(403).send({message: err.message})
      }
    })

    app.post('/logout', async (req, res) => {
      for (let cookie in req.cookies) {
        res.clearCookie(cookie)
      }
      res.status(200).send({})
    })

    app.use(
      expressJwt({
        secret: JWT_SECRET,
        algorithms: ['HS256'],
        credentialsRequired: true,
        /*
         * Function to extract and parse JWT from response, the resulting
         * parsed token object will be available in req.user.
         */
        getToken: (req) => {
          if (req.query && req.query.token) {
            const token = req.query.token
            return token
          } else if (req.cookies['authentication-token']) {
            return req.cookies['authentication-token']
          }

          if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
          ) {
            const token = req.headers.authorization.split(' ')[1]
            return token
          }
          return null
        }
      }).unless({path: unprotectedRoutes})
    )

    for (let id of Reflect.ownKeys(routes)) {
      const {route, target} = routes[id]
      app.use(route, proxy({
        target,
        changeOrigin: true,
        logLevel: 'debug'
      }))
    }

    const server = app.listen(port, () => resolve(server))

    /*     if (process.env.NODE === 'test') {
          const server = app.listen(port, () => resolve(server))
        } else {
          const server = spdy.createServer(ssl, app)
            .listen(port, () => resolve(server))
        } */
  })
}

module.exports = Object.assign({}, {start})
