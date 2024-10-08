# CzLink

`CzLink` is a Node.js package for creating and serving zip files from specified input paths. It includes basic functionality to zip files or directories and serve them over HTTP with progress updates.

## Installation

To install `CzLink`, run:

```bash
npm install czlink
```

## Usage

### 1. Setup and Zip

First, set up the zip process and start the server:

```javascript
const czlink = require('czlink');

czlink({
  sourceFolder: './data',  // Folder to be zipped
  outputFolder: './backups',  // Folder where the zip files will be saved
  expressAlr: false,  // If true, it will not start the express server
  port: 4000  // Custom port for the Express server
});
```

### 2. Access the File

Once the server is running, you can download the zip file using the following URL:

```
http://localhost:PORT/download/backup.zip
```

Replace `PORT` with the port number specified in the `czlink()` function call.

### If Express Server is Already Running

If an Express server is already running, you can serve the zip files without starting a new server by setting `expressAlr: true` in the options:

```javascript
const czlink = require('czlink');

czlink({
  sourceFolder: './data', // Folder to be Backup
  outputFolder: './backups', // Folder where the zip files will be saved
  expressAlr: true,  // If true, it will not start the express server
  port: 4000 // Custom port for the Express server
});
```

Then, in your existing Express server, add this route to serve the zip file:

```javascript
let outputFolder = "your_output_folder_goes_here";
app.use('/download', express.static(outputFolder));
```

This will allow your server to serve the zip files created by `CzLink` at the `/download` endpoint.

## API

### `czlink(options)`

Sets up the zip process and optionally starts an Express server.

#### Parameters

- `sourceFolder` (string): The path to the folder or directory that will be zipped.
- `outputFolder` (string): The path to the folder where the zip files will be saved.
- `expressAlr` (boolean): If `true`, it will not start a new Express server but expects an existing one to handle file downloads.
- `port` (number, optional): The port number to start the Express server on if `expressAlr` is `false` (default is `3000`).

### HTTP GET `/download/backup.zip`

Starts the download of the zip file.

---

## Notes

- The zip file will be named `backup.zip` and stored in the `outputFolder`.
- The `outputFolder` is recreated each time the zip process runs.
- The server logs zip progress in the console.
- If an Express server is already running and `expressAlr` is `true`, you can use the `outputFolder` path to serve the zip file from your existing server.

## License

This project is licensed under the MIT License.  
Made by Coneiz.
