const _ = require('lodash');
const exec = require('child_process').exec;
const fs = require('fs-extra');
let cron = require('node-cron');
let Drive = require('./drive');
const zipFolder = require('zip-a-folder');
let dbOptions = require('./config.json');

/* return date object */
var stringToDate = function (dateString) {
    return new Date(dateString);
}

var dbAutoBackUp = function () {
    // check for auto backup is enabled or disabled
    try {

        if (dbOptions.autoBackup == true) {
            console.log(' ==> Backup startrd..')
            var date = new Date(); // current Date
            var beforeDate, oldBackupDir, oldBackupPath;
            currentDate = stringToDate(date); // Current date
            var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            // console.log("New Backup Directory : " + newBackupDir);
            var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
            // check for remove old backup after keeping # of days given in configuration
            if (dbOptions.removeOldBackup == true) {
                beforeDate = _.clone(currentDate);
                beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
                oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
                oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
                // console.log('Old BKP name : ' + oldBackupPath);
            }
            var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath; // Command for mongodb dump process

            exec(cmd, function (error, stdout, stderr) {
                if (error) {
                    // check for remove old backup after keeping # of days given in configuration
                    if (dbOptions.removeOldBackup == true) {
                        if (fs.existsSync(oldBackupPath)) {
                            exec("rm -rf " + oldBackupPath, function (err) {});
                        }
                    }
                    console.log(error)
                } else {
                    console.log(" ==> Data Backed Up ...")
                    removeOldBackup(oldBackupPath);
                    zip(newBackupPath);
                }
            });
        }
    } catch (exception) {
        console.log(exception)
    }
}

function removeOldBackup(oldFolderPath) {
    if (dbOptions.removeOldBackup) {
        fs.remove(oldFolderPath, err => {
            if (err) return console.error(err)
            console.log(' ==> success!')
        })
    }
}

function startCron() {
    console.log('Started Cron of Backup is : ' + dbOptions.corn.key + '  Info : ' + dbOptions.corn.descriptoins);
    cron.schedule(dbOptions.corn.key, () => {
        console.log('Last calculation of breaktime started at : ' + new Date());
    });
}

function zip(path) {
    zipFolder.zipFolder(path, path + ".zip", function (err, data) {
        if (err) {
            console.log('Something went wrong!', err);
        } else {
            console.log(" ==> File zipped : " + path + ".zip");
            Drive.uploadFilesAuth(path + ".zip");
        }
    });
}
// dbAutoBackUp();
startCron();