// Script to remove filepath comments from HTML files
const fs = require('fs');
const path = require('path');

// Get all HTML files in the public directory
const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(publicDir, file));

// Process each file
htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove filepath comments
  const updatedContent = content.replace(/^\/\/\sfilepath:.*$/m, '');
  
  // Only write if the content has changed
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Removed filepath comment from: ${path.basename(filePath)}`);
  }
});

console.log(`Processed ${htmlFiles.length} HTML files`);
