const fs = require('fs');
const path = require('path');
const https = require('https');
const querystring = require('querystring');

// HTML files to validate
const files = [
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\index.html'
];

// Validate a single HTML file
function validateHtml(html, filename) {
  return new Promise((resolve, reject) => {
    // W3C validator API parameters
    const params = querystring.stringify({
      out: 'text',
      content: html
    });

    // API request options
    const options = {
      hostname: 'validator.w3.org',
      path: '/nu/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(params),
        'User-Agent': 'Node.js HTML Validator'
      }
    };

    // Make the request
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Validation results for ${filename}:`);
        console.log(data);
        console.log('-------------------------------------------');
        resolve(data);
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    // Send the request
    req.write(params);
    req.end();
  });
}

// Process each file
async function validateFiles() {
  for (const filePath of files) {
    try {
      console.log(`Reading file: ${path.basename(filePath)}`);
      
      // Read the file content
      const html = fs.readFileSync(filePath, 'utf8');
      
      // Validate the HTML
      await validateHtml(html, path.basename(filePath));
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }
}

// Run validation
validateFiles().catch(console.error);
