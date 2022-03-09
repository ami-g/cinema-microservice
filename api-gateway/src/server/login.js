const {Strategy} = require('passport-local')
const passport = require('passport')

const USERS = [{
  email: 'alex@specula.io',
  password: 'alex'
}, {
  email: 'amikam@specula.io',
  password: 'amikam'
}, {
  email: 'eyal',
  password: 'eyal'
}]

const loginStrategy = new Strategy({usernameField: 'email', passwordField: 'password', session: false}, async (email, password, done) => {
  let user = USERS.find(u => u.email === email && u.password === password)
  if (user) {
    return done(undefined, user)
  }

  return done(undefined, false, {message: `Error: Unauthorized`})
})

async function authenticateLocal (req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'local',
      {session: false},
      async (err, user, info) => {
        if (!user || err) {
          return reject(new Error(info.message))
        }

        // A user was found, generating token and returning in response.
        return resolve(user)
      }
    )(req, res)
  })
}

exports.loginStrategy = loginStrategy
exports.authenticateLocal = authenticateLocal
