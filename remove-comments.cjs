const fs = require('fs');
const path = require('path');

// Html files to process
const files = [
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\index.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\blog.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\catalog.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\contact.html'
];

// Process each file
files.forEach(filePath => {
  try {
    console.log(`Processing file: ${filePath}`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has the comment
    if (content.includes('// filepath:')) {
      console.log(`Found comment in ${path.basename(filePath)}`);
      
      // Remove the comment line
      const updatedContent = content.replace(/^\/\/\sfilepath:.*[\r\n]+/m, '');
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Removed comment from ${path.basename(filePath)}`);
    } else {
      console.log(`No comment found in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
});

console.log('Done processing files');
