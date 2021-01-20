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

        // test drain
        // setInterval(() => {
        //     console.log('queue', msg);
        // }, 1000);
        // nc.drain((err) => {
        //     if (err) {
        //         console.log('Nat:', err);
        //     }
        //     console.log('Nat connection is closed:', nc.closed);
        // });
    })
}

// nc.drain((err) => {
//     if (err) {
//         console.log('Nat:' ,err);
//     }
//     console.log('Nat connection is closed:', nc.closed);
// });

subscribe('trongnv.hello');
// subscribe('trongnv.*');
// subscribe('trongnv.>');

queue('trongnv.>');
// queue('trongnv');
// queue('trongnv.>');