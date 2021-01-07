const Minio = require('minio');
const Fs = require('fs');
const config = require('./config');

class MinioHandle {
    constructor() {
        this.connect();
    }

    connect() {
        this.minioClient = new Minio.Client({
            endPoint: config.minio.endPoint,
            port: config.minio.port,
            useSSL: config.minio.useSSL,
            accessKey: config.minio.accessKey,
            secretKey: config.minio.secretKey
        });
    }

    getButkets() {
        this.minioClient.listBuckets(function (err, buckets) {
            if (err) return console.log(err)
            console.log('buckets :', buckets)
        })
    }

    setButket(butket_name) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.minioClient.bucketExists(butket_name, function (err, exists) {
                if (err) resolve(err);
                if (exists) {
                    self.checkPolicy(butket_name);
                    return resolve('Bucket exists.');
                } else {
                    self.minioClient.makeBucket(butket_name, '', function (err) {
                        if (err) reject(err);
                        self.checkPolicy(butket_name);
                        resolve('success');
                    });
                }
            })
        });
    }

    listObjects(name_butket) {
        var stream = this.minioClient.listObjects(name_butket, '', true)
        stream.on('data', function (obj) { console.log(obj) })
        stream.on('error', function (err) { console.log(err) })
    }

    getUrlObject(params) {
        return new Promise(async (resolve, reject) => {
            this.minioClient.presignedGetObject(params.name_butket, params.name_file, 24 * 60 * 60 * 7, function (err, presignedUrl) {
                if (err) return reject(err);
                console.log('url :', presignedUrl);
                resolve(presignedUrl);
            })
        });
    }

    getUrlAvatar(video_id) {
        return (config.minio.useSSL ? "https" : "http") + "://" + config.minio.endPoint + ":" + config.minio.port + "/avatar/images/" + video_id + ".png";
    }


    putObject(obj) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            await self.setButket(obj.name_butket);
            self.minioClient.putObject(obj.name_butket, obj.name_file, obj.file_stream, obj.size_file, function (err, etag) {
                console.log('putObject: ', err, etag);
                if (err) return reject();
                return resolve(etag);
            });
        })
    }

    putObjectFromLocal(file_url) {
        return new Promise((resolve, reject) => {
            try {
                let self = this;
                var fileStream = Fs.createReadStream(file_url)
                Fs.stat(file_url, async function (err, stats) {
                    if (err) {
                        console.log(err)
                        return reject();
                    }
                    let arr = file_url.split("/");
                    let file_name = 'images/' + arr[arr.length - 1];
                    await self.setButket('avatar');
                    self.minioClient.putObject('avatar', file_name, fileStream, stats.size, function (err, etag) {
                        console.log(err, etag) // err should be null
                        if (err) {
                            console.log(err)
                            return reject();
                        }
                        return resolve();
                    })
                })
            } catch (error) {
                console.log(error);
            }
        })
    }

    async checkPolicy(bucket) {
        try {
            let res = await this.minioClient.getBucketPolicy(bucket)
            console.log('checkPolicy res: %j', res)
            return
        } catch (e) {
            let policy = `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetBucketLocation","s3:ListBucket"],"Resource":["arn:aws:s3:::${
                bucket
                }"]},{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::${
                bucket
                }/*"]}]}`
            await this.minioClient.setBucketPolicy(bucket, policy)
            await this.checkPolicy()
        }
        return
    }


}

// module.exports = MinioHandle;

var a = new MinioHandle();
