const fs = require('fs');
const path = require('path');

// HTML files to process
const files = [
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\index.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\blog.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\catalog.html',
  'c:\\Users\\Nikol\\Documents\\GitHub\\BRO-FINAL-PROJECT\\public\\contact.html'
];

// Process each file to remove the JavaScript-style comment
files.forEach(filePath => {
  try {
    console.log(`Processing ${path.basename(filePath)}...`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has the comment
    if (content.startsWith('// filepath:')) {
      // Replace only the first line if it contains "// filepath:"
      content = content.replace(/^\/\/\s*filepath:.*(\r?\n|$)/, '');
      
      // Write updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`- Comment removed from ${path.basename(filePath)}`);
    } else {
      console.log(`- No comment found in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});
