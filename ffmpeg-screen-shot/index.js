
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);


var proc = ffmpeg('https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8')
    // setup event handlers
    .on('filenames', function (filenames) {
        console.log('screenshots are ' + filenames.join(', '));
    })
    .on('end', function () {
        console.log('screenshots were saved');
    })
    .on('error', function (err) {
        console.log('an error happened: ' + err.message);
    })
    // take 2 screenshots at predefined timemarks and size
    .takeScreenshots({ count: 1, timemarks: ['00:00:02.000'], size: '1500x1000' }, __dirname);