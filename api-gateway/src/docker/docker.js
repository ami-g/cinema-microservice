'use strict'
const Docker = require('dockerode')

const discoverRoutes = (container) => {
  return new Promise(async (resolve, reject) => {
    const dockerSettings = container.resolve('dockerSettings')

    // const docker = new Docker(dockerSettings)
    // const docker = new Docker({socketPath: '/var/run/docker.sock'})

    const getUpstreamUrl = (serviceDetails) => {
      const {PublishedPort} = serviceDetails.Endpoint.Spec.Ports[0]
      return `http://${dockerSettings.host}:${PublishedPort}`
    }

    const addRoute = (routes, details) => {
      routes[details.Spec.Name] = {
        id: details.id || details.ID,
        route: details.route || details.Spec.Labels.apiRoute,
        target: details.target || getUpstreamUrl(details)
      }
    }

    let services = await getServices()

    const routes = new Proxy({}, {
      get (target, key) {
        console.log(`Get properties from -> "${key}" container`)
        return Reflect.get(target, key)
      },
      set (target, key, value) {
        console.log('Setting properties', key, value)
        return Reflect.set(target, key, value)
      }
    })

    services.forEach((service) => {
      addRoute(routes, service)
    })

    resolve(routes)
  })
}

module.exports = Object.assign({}, {discoverRoutes})

function getServices () {
  return new Promise((resolve, reject) => {
    resolve([{
      Spec: {
        Name: 'movies'
      },
      id: 'movies-service',
      route: '/movies',
      target: process.env.MOVIES_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'booking'
      },
      id: 'booking-service',
      route: '/booking',
      target: process.env.BOOKING_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'payment'
      },
      id: 'payment-service',
      route: '/payment',
      target: process.env.PAYMENT_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'cinema-catalog'
      },
      id: 'cinema-catalog',
      route: '/cinemas',
      target: process.env.CINEMA_CATALOG_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'countries'
      },
      id: 'countries-service',
      route: '/countries',
      target: process.env.CINEMA_CATALOG_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'states'
      },
      id: 'states-service',
      route: '/states',
      target: process.env.CINEMA_CATALOG_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'cities'
      },
      id: 'cities-service',
      route: '/cities',
      target: process.env.CINEMA_CATALOG_SERVICE_TARGET
    }, {
      Spec: {
        Name: 'notification'
      },
      id: 'notification',
      route: '/notification',
      target: process.env.NOTIFICATION_SERVICE_TARGET
    }])
  })
}

function getDockerservices (docker) {
  return new Promise((resolve, reject) => {
    docker.listServices((err, services) => {
      err ? reject(new Error('an error occured listing containers, err: ' + err)) : resolve(services)
    })
  })
}
