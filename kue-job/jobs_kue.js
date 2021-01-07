var kue = require('kue')
  , queue = kue.createQueue();
queue.setMaxListeners(1000);
class QueueJobs {
  constructor() {
    let random_timeout = (Math.floor(Math.random() * 101) % 10) * 5000;
    // for (let i = 0; i < 10; i++)
    //   this.createJob(type, data);
    // this.processJob(type, 3);
    // queue.on('job enqueue', function (id, type) {
    //   console.log('Job %s got queued of type %s', id, type);
    // });
    // this.showError();total
    kue.Job.rangeByState( 'inactive', 0, -1, 'asc', function( err, jobs ) {
      jobs.forEach( function( job ) {
        // job.remove( function(){
        //   console.log( 'removed ', job.id );
        // });
      });
    });
    queue.inactiveCount(function (err, total) { // others are activeCount, completeCount, failedCount, delayedCount
      console.log('inactiveCount: ', total);
      console.log('*************************')
    });
    queue.activeCount(function (err, total) { // others are activeCount, completeCount, failedCount, delayedCount
      console.log('activeCount: ', total);
      console.log('*************************')
    });
    queue.complete(function (err, total) { // others are activeCount, completeCount, failedCount, delayedCount
      console.log('complete: ', total);
      console.log('*************************')
    });
    queue.failed(function (err, total) { // others are activeCount, completeCount, failedCount, delayedCount
      console.log('failed: ', total);
      console.log('*************************')
    });
    queue.inactive(function (err, ids) {
      ids.forEach(function (id) {
        kue.Job.get(id, function (err, job) {
          // console.log(job.id, job.type, job.data);
          // job.active();
        });
      });
    });
    queue.active(function (err, ids) {
      ids.forEach(function (id) {
        kue.Job.get(id, function (err, job) {
          // Your application should check if job is a stuck one
          // console.log('active', job.id, job.type, job.data);
          // job.inactive();
        });
      });
    });
    queue.failedCount('my-critical-job', function (err, total) {
      console.log('This is tOoOo bad', total);
    });
  }
  //clear list jobs when complete with state
  clearQueueWithState(state = 'complete') {
    console.log('clearQueue');
    kue.Job.rangeByState(state, 0, -1, 'asc', function (err, jobs) {
      jobs.forEach(function (job) {
        job.remove(function () {
          console.log('removed ', job.id);
        });
      });
    });
  }
  //clear list jobs when complete
  clearQueueWithType(type, state = 'failed') {
    console.log('clearQueue');
    kue.Job.rangeByType(type, state, 0, -1, 'asc', function (err, jobs) {
      jobs.forEach(function (job) {
        job.remove(function () {
          console.log('removed ', job.id);
        });
      });
    });
  }
  // create a new job
  createJob(type, data, priority = 'normal') {
    // low: 10   normal: 0   medium: -5   high: -10   critical: -15
    // with a default priority level of "normal"
    var job = queue.create(type, data).priority(priority).removeOnComplete(true).save(function (err) {
      if (!err) {
        console.log('create job: ', job.id)
      };
    });

    job.on('complete', function (result) {
      console.log('Job completed with data ', result);

    }).on('failed attempt', function (errorMessage, doneAttempts) {
      console.log('Job failed');

    }).on('failed', function (errorMessage) {
      console.log('Job failed');

    }).on('progress', function (progress, data) {
      console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);

    }).on("start", function (res) {
      console.log("Got start: " + res);

    }).on("remove", function (res) {
      console.log("Got remove: " + res);

    });
  }
  // active job
  processJob(type, number = 1) {
    queue.process(type, number, function (job, done) {
      // setTimeout(done,3000);
      console.log('process', job.data);
      done();
    });
  }
  // show error 
  showError() {
    queue.on('error', function (err) {
      console.log('Oops... ', err);
    });
  }
}
new QueueJobs();
// module.exports = QueueJobs
