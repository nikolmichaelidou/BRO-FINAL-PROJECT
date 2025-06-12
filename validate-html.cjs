const validator = require('html-validator');
const fs = require('fs');
const path = require('path');

// HTML files to validate
const files = [
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\index.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\blog.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\catalog.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\contact.html'
];

// Process each file
async function validateFiles() {
  for (const filePath of files) {
    try {
      console.log(`Validating file: ${path.basename(filePath)}`);
      
      // Read the file content
      const html = fs.readFileSync(filePath, 'utf8');
      
      // Options for validator
      const options = {
        data: html,
        format: 'text',
        isFragment: false
      };
      
      // Validate the HTML
      try {
        const result = await validator(options);
        console.log(result);
      } catch (error) {
        console.error(`Validation error for ${path.basename(filePath)}:`, error.message);
      }
      
      console.log('-------------------------------------------');
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }
}

// Run validation
validateFiles().catch(console.error);
