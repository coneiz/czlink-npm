const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const express = require('express');
const colors = require('colors');

let inputPath;
let outputPath;
let userPort;

const czlinkDir = path.join(__dirname, 'czlink');
const zipFilePath = path.join(czlinkDir, 'czlink.zip');

function set({ port, input }) {
    inputPath = input;
    userPort = port;

    if (fs.existsSync(czlinkDir)) {
        fs.rmdirSync(czlinkDir, { recursive: true });
    }
    fs.mkdirSync(czlinkDir);

    outputPath = zipFilePath;

    zipIt().then(startServer);
}

function startServer() {
    const app = express();

    app.get('/download', (req, res) => {
        const fileSize = fs.statSync(zipFilePath).size;
        let downloaded = 0;

        res.setHeader('Content-Disposition', 'attachment; filename=czlink.zip');
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        const readStream = fs.createReadStream(zipFilePath);

        readStream.on('data', (chunk) => {
            downloaded += chunk.length;
            const progress = (downloaded / fileSize * 100).toFixed(2);
            process.stdout.write(`Download progress: ${progress}%\r`.yellow);
        });

        readStream.pipe(res);

        readStream.on('end', () => {
            console.log('Download completed'.green);
        });

        readStream.on('error', (err) => {
            console.error(`Error: ${err.message}`.red);
            if (!res.headersSent) {
                res.status(500).send(`Error: ${err.message}`);
            }
        });

        res.on('finish', () => {
            console.log('Download completed'.green);
            res.end(`<h1>CzLink by Coneiz</h1><p>Download completed. Thank you for using CzLink!</p>`);
        });
    });

    app.use(express.static(path.join(__dirname, 'public')));

    app.listen(userPort, () => {
        console.log(`CzLink server running on port ${userPort}`);
        console.log(`Access the file at http://localhost:${userPort}/download`.cyan);
    });
}

async function zipIt() {
    if (!inputPath || !fs.existsSync(inputPath)) {
        console.log('Error: Invalid input path'.red);
        return;
    }

    try {
        const stats = fs.lstatSync(inputPath);

        if (stats.isDirectory()) {
            console.log(`Zipping directory: ${inputPath}`.yellow);
            await zipDirectory(inputPath, outputPath);
        } else if (stats.isFile()) {
            console.log(`Zipping file: ${inputPath}`.yellow);
            await zipFile(inputPath, outputPath);
        } else {
            console.log('Error: Input path is neither a file nor a directory.'.red);
        }
    } catch (err) {
        console.error(`Error: ${err.message}`.red);
    }
}

function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive.directory(source, false)
            .on('error', reject)
            .pipe(stream);

        stream.on('close', resolve);
        archive.finalize();
    });
}

function zipFile(filePath, out) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive.file(filePath, { name: path.basename(filePath) })
            .on('error', reject)
            .pipe(stream);

        stream.on('close', resolve);
        archive.finalize();
    });
}

module.exports = {
    set
};
