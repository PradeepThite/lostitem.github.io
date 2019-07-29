const fs = require('fs');
const os = require('os');
const uuid = require('uuid');
const path = require('path');
const readline = require('readline');
const {
    google
} = require('googleapis');

class Operations {

    async downloadFiles(auth, fileId) {
        const drive = google.drive({
            version: 'v3',
            auth
        });

        return new Promise(async (resolve, reject) => {
            const filePath = path.join(os.tmpdir(), uuid.v4());
            console.log(`writing to ${filePath}`);
            const dest = fs.createWriteStream(filePath);
            let progress = 0;
            // For converting document formats, and for downloading template
            // documents, see the method drive.files.export():
            // https://developers.google.com/drive/api/v3/manage-downloads
            const res = await drive.files.get({
                fileId,
                alt: 'media'
            }, {
                responseType: 'stream'
            })
            res.data
                .on('end', () => {
                    console.log('Done downloading file.');
                    resolve(filePath);
                })
                .on('error', err => {
                    console.error('Error downloading file.');
                    reject(err);
                })
                .on('data', d => {
                    progress += d.length;
                    if (process.stdout.isTTY) {
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                        process.stdout.write(`Downloaded ${progress} bytes`);
                    }
                })
                .pipe(dest);
        });
    }

    async uploadFiles(auth, fileName) {
        const drive = google.drive({
            version: 'v3',
            auth
        });

        const fileSize = fs.statSync(fileName).size;
        const res = await drive.files.create({
            requestBody: {
                name: fileName.split("//")[fileName.split("//").length-1].split('.')[0]
                // a requestBody element is required if you want to use multipart
            },
            media: {
                body: fs.createReadStream(fileName),
            },
        }, {
            // Use the `onUploadProgress` event from Axios to track the
            // number of bytes uploaded to this point.
            onUploadProgress: evt => {
                const progress = (evt.bytesRead / fileSize) * 100;
                readline.clearLine();
                readline.cursorTo(0);
                process.stdout.write(`${Math.round(progress)}% -- `);
            },
        });
        // console.log(res.data);
        return res.data;
    }

}


module.exports = Operations;