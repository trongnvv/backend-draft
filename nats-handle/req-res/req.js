let nc = NATS.connect();
// set up a subscription to process the request
nc.subscribe('time', (msg, reply) => {
    if (reply) {
        nc.publish(reply, new Date().toLocaleTimeString());
    }
});

// create a subscription subject that the responding send replies to
let inbox = NATS.createInbox();
nc.subscribe(inbox, { max: 1 }, (msg) => {
    t.log('the time is', msg);
    nc.close();
});

nc.publish('time', "", inbox);