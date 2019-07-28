const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');
let Operations = require('./operations');


// If modifying these scopes, delete token.json.
//Drive API, v3
//https://www.googleapis.com/auth/drive	See, edit, create, and delete all of your Google Drive files
//https://www.googleapis.com/auth/drive.file View and manage Google Drive files and folders that you have opened or created with this app
//https://www.googleapis.com/auth/drive.metadata.readonly View metadata for files in your Google Drive
//https://www.googleapis.com/auth/drive.photos.readonly View the photos, videos and albums in your Google Photos
//https://www.googleapis.com/auth/drive.readonly See and download all your Google Drive files

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



class GDAuth extends Operations {

    getAuth() {
        return new Promise((success, reject) => {
            this.readCredentials(success, reject);
        });
    }
    readCredentials(success, reject) {
        // Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
            if (err) {
                reject('Error loading client secret file:' + JSON.stringify(err));
                console.log('Error loading client secret file:', err);
                return;
            };
            // Authorize a client with credentials, then call the Google Drive API.
            this.authorize(JSON.parse(content), success, reject);
        });
    }


    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(credentials, success, reject) {
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                return this.getAccessToken(oAuth2Client, success, reject)
            };
            oAuth2Client.setCredentials(JSON.parse(token));
            success(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    getAccessToken(oAuth2Client, success, reject) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    reject('Error retrieving access token' + JSON.stringify(err));
                    console.error('Error retrieving access token', err);
                    return;
                };
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) {
                        reject(err);
                        return console.error(err)
                    };
                    console.log('Token stored to', TOKEN_PATH);
                });
                success(oAuth2Client);
            });
        });
    }
}

module.exports = GDAuth;