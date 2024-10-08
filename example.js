const czlink = require('czlink');

czlink({
  sourceFolder: './data',  // Folder to be zipped
  outputFolder: './backups',  // Folder where the zip files will be saved
  expressAlr: false,  // If true, it will not start the express server
  port: 4000  // Custom port for the Express server
});
