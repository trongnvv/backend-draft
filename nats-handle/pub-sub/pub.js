const NATS = require('nats')
const nc = NATS.connect()

// Simple Publisher
nc.publish('foo', 'Hello World!');