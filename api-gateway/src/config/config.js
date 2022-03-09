const fs = require('fs')

const serverSettings = {
  port: process.env.PORT || 8080,
  ssl: require('./ssl')
}

const machine = process.env.DOCKER_HOST
const tls = process.env.DOCKER_TLS_VERIFY
const certDir = process.env.DOCKER_CERT_PATH

if (!machine) {
 // throw new Error('You must set the DOCKER_HOST environment variable')
}
if (tls === 1) {
  throw new Error('When using DOCKER_TLS_VERIFY=1 you must specify the property DOCKER_CERT_PATH for certificates')
}
if (!certDir) {
  //throw new Error('You must set the DOCKER_CERT_PATH environment variable')
}

const dockerSettings = {
  protocol: 'https',
  host: machine ? machine.substr(machine.indexOf(':', 0) + 3, machine.indexOf(':', 6) - 6) : '127.0.0.1',
  port: machine ? parseInt(machine.substr(-4), 10) : undefined,
  checkServerIdentity: false,
  ca: certDir ? fs.readFileSync(certDir + '/ca.pem') : undefined,
  cert: certDir ? fs.readFileSync(certDir + '/cert.pem') : undefined,
  key: certDir ? fs.readFileSync(certDir + '/key.pem') : undefined,
  version: 'v1.25'
}

module.exports = Object.assign({}, { serverSettings, dockerSettings })
