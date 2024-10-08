const express = require('express');
const cron = require('node-cron');
const archiver = require('archiver');
const fs = require('fs-extra');
const path = require('path');

const zipFiles = (sourceFolder, outputFolder) => {
    const zipFilePath = path.join(outputFolder, `backup.zip`);

    return new Promise((resolve, reject) => {
        if (fs.existsSync(zipFilePath)) {
            fs.removeSync(zipFilePath);
        }

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(zipFilePath));
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(sourceFolder, false);
        archive.finalize();
    });
};

const initExpress = (outputFolder, port) => {
    const app = express();
    app.use('/download', express.static(outputFolder));

    app.listen(port, () => {
        console.log(`Express server running on port ${port}. Download your zips from /download`);
    });
};

const startCZLink = ({ sourceFolder, outputFolder, expressAlr = false, port = 3000 }) => {
    console.log(`Output folder: ${outputFolder}`);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    cron.schedule('0 * * * *', async () => {
        console.log('Zipping files...');
        try {
            const zipFilePath = await zipFiles(sourceFolder, outputFolder);
            console.log(`Files zipped successfully: ${zipFilePath}`);
        } catch (error) {
            console.error(`Error while zipping files: ${error.message}`);
        }
    });

    if (!expressAlr) {
        initExpress(outputFolder, port);
    }
};

module.exports = startCZLink;
