const NATS = require('nats')

let nc = NATS.connect({ json: true });
// set up a subscription to process the request
const subscribe = (subject) => {
    nc.subscribe(subject, (msg, reply, subject, sid) => {
        console.log('sub', msg);
        if (reply) {
            nc.publish(reply, { date: new Date().toLocaleTimeString() });
        }
    });
}

const queue = (subject, queue) => {
    nc.subscribe(subject, { queue }, function (msg, reply, subject, sid) {
        console.log('queue', msg);
    })
}
nc.on('error', (err) => {
    console.log(err)
})

// connect callback provides a reference to the connection as an argument
nc.on('connect', (nc) => {
    console.log(`connect to ${nc.currentServer.url.host}`)
})

// emitted whenever the client disconnects from a server
nc.on('disconnect', () => {
    console.log('disconnect')
})

// emitted whenever the client is attempting to reconnect
nc.on('reconnecting', () => {
    console.log('reconnecting')
})

// emitted whenever the client reconnects
// reconnect callback provides a reference to the connection as an argument
nc.on('reconnect', (nc) => {
    console.log(`reconnect to ${nc.currentServer.url.host}`)
})

// emitted when the connection is closed - once a connection is closed
// the client has to create a new connection.
nc.on('close', function () {
    console.log('close')
})

// emitted whenever the client unsubscribes
nc.on('unsubscribe', function (sid, subject) {
    console.log('unsubscribed subscription', sid, 'for subject', subject)
})

// emitted whenever the server returns a permission error for
// a publish/subscription for the current user. This sort of error
// means that the client cannot subscribe and/or publish/request
// on the specific subject
nc.on('permission_error', function (err) {
    console.error('got a permissions error', err.message)
})

subscribe('trongnv.hello');
subscribe('trongnv.*');
subscribe('trongnv.>');

queue('trongnv');
queue('trongnv');
queue('trongnv.>');