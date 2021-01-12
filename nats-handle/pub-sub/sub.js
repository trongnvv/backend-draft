const NATS = require('nats')
const nc = NATS.connect()

// Simple Subscriber
const sid = nc.subscribe('foo', function (msg) {
  console.log('Received a message: ' + msg)
})

// nc.unsubscribe(sid)