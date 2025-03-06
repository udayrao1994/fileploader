const express = require('express');
const cors = require('cors');
const generateReports = require('./reportService');
const path = require('path');
const fs = require('fs'); // To read files in the directory

const app = express();

// Enable CORS for all origins (or restrict to specific origins if needed)
app.use(cors());

// Route to generate reports
app.get('/generate-reports', async (req, res) => {
  try {
    await generateReports(); // Generate reports (e.g., PDF, Excel)
    res.send('Reports generated successfully!');
  } catch (err) {
    res.status(500).send('Error generating reports: ' + err.message);
  }
});

// Route to get list of available files from the 'reports' directory
app.get('/files', (req, res) => {
  const reportsDir = path.join(__dirname, 'reports');  // Directory where reports are stored
  fs.readdir(reportsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading files: ' + err.message);
    }

    // Filter out non-PDF and non-XLSX files
    const availableFiles = files.filter(file => 
      file.endsWith('.pdf') || file.endsWith('.xlsx')
    );
    res.json(availableFiles);  // Return the list of files as a JSON response
  });
});

// Route to download a file (dynamic route)
app.get('/download/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, 'reports', fileName);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found: ' + fileName);
    }

    res.download(filePath, fileName);  // Download the file with the specified name
  });
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
