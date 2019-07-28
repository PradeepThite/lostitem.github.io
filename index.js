const {
    google
} = require('googleapis');
let GDAuth = require("./auth");

class G_Drive extends GDAuth {
    constructor() {
        super();
    }

    getListFiles() {
        this.getAuth().then((auth) => {
            this.listFiles(auth);
        }, (err) => {
            console.log(err)
        })
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    listFiles(auth) {
        const drive = google.drive({
            version: 'v3',
            auth
        });
        drive.files.list({
            pageSize: 5,
            fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                    console.log(`Name: ${file.name} id: (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }
        });
    }

    downloadFilesAuth(fileID) {
        this.getAuth().then((auth) => {
            this.downloadFiles(auth, fileID).then((success) => {
                console.log(success)
            }, (err) => {
                console.log(err)
            })
        }, (err) => {
            console.log(err)
        })
    }

    uploadFilesAuth(fileName) {
        this.getAuth().then((auth) => {
            this.uploadFiles(auth, fileName).then((success) => {
                console.log(success)
            }, (err) => {
                console.log(err)
            })
        }, (err) => {
            console.log(err)
        })
    }

}
let drive = new G_Drive();
drive.getListFiles('./song.mp3');