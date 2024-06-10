const fs = require('fs').promises;
const path = require('path');

async function autoCleanUp() {
  const downloadsDir = path.join(__dirname, '../', 'downloads');

  try {
    // Check if the directory exists
    await fs.access(downloadsDir);

    // Read the contents of the directory
    const files = await fs.readdir(downloadsDir);

    // Check if the directory is empty
    if (files.length === 0) {
      console.log('Downloads directory is already empty.');
      return; 
    }

    // Iterate through each file and delete it (only if directory is not empty)
    for (const file of files) {
      const filePath = path.join(downloadsDir, file);
      await fs.unlink(filePath);
    }

    console.log('All files Downloads folder have been deleted.');
  } catch (error) {
    // Handle errors, including when the directory doesn't exist
    if (error.code === 'ENOENT') {
      console.log('downloads directory does not exist.');
    } else {
      console.error('Error cleaning up downloads:', error);
    }
  }
}

module.exports = { autoCleanUp };
