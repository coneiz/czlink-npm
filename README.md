# CzLink

`CzLink` is a Node.js package for creating and serving zip files from specified input paths. It includes basic functionality to zip files or directories and serve them over HTTP with progress updates.

## Installation

To install `CzLink`, run:

```bash
npm install czlink
```

## Usage

### 1. Setup and Zip

First, you need to set up the zip process and start the server:

```javascript
const czlink = require('czlink');

czlink.set({
    port: 3000,          // Port number for the server
    input: './path/to/input' // Path to the file or directory to zip
});
```

### 2. Access the File

Once the server is running, you can download the zip file using the following URL:

```
http://localhost:PORT/download
```

Replace `PORT` with the port number specified in the `set` function.

[Optional] You can expose the localhost with tunnels like ngrok or localtunnel 
## Commands

### `czlink.set(options)`

Sets up the zip process and starts the server.

**Parameters:**

- `port` (number): The port number to start the server on.
- `input` (string): The path to the file or directory to zip.

### HTTP GET `/download`

Starts the download of the zip file.

## Notes

- The zip file will be named `czlink.zip` and stored in the `czlink` directory.
- The `czlink` directory is recreated each time `czlink.set()` is called.
- The server logs download progress in the console.

## License

This project is licensed under the MIT License.
Made by Coneiz.
