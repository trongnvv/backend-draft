const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const Agenda = require('agenda');
// const agenda = new Agenda({ db: { address: mongoConnectionString } });

// Or override the default collection name:
const agenda = new Agenda({
    db: {
        address: mongoConnectionString,
        collection: 'agenda-test',
        options: {
            autoReconnect: true,
            // reconnectTries: 60,
            // reconnectInterval: 1000
        }
    },
});

// or pass additional connection options:
// const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobCollectionName', options: {ssl: true}}});

// or pass in an existing mongodb-native MongoClient instance
// const agenda = new Agenda({mongo: myMongoClient});
async function delay(t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), t || 10000);
    })
}
agenda.define('demo', { concurrency: 1 }, async (job, done) => {
    console.log('trongnv', job.attrs.data);
    await delay();
    done();
    // User.remove({ lastLogIn: { $lt: twoDaysAgo } }, done);
});

(async function () { // IIFE to give access to async/awaits
    await agenda.start()

    agenda.on('ready', function () {
        console.log(
            '/********************* Agenda Ready ****************************/'
        )
        agenda.start();
        // ready = true
    })

    agenda.on('start', function (job) {
        console.log('Job id:%s name:%s starting', job.attrs._id, job.attrs.name)
    })

    agenda.on('complete', function (job) {
        console.log('Job %s finished', job.attrs.data.id)
    })

    agenda.on('fail', (err, job) => {
        console.log(err)
    })

    for (let i = 5; i < 10; i++) {
        var job = agenda.create('demo', { id: i });
        job.priority('low');
        await job.save();
    }

})();