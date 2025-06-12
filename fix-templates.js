import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory containing templates
const templatesDir = join(__dirname, 'src', 'templates');

// Function to recursively find all .njk files
function findNjkFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findNjkFiles(filePath, fileList);
    } else if (file.endsWith('.njk')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find all .njk files
const njkFiles = findNjkFiles(templatesDir);

// Process each file to remove JavaScript-style comments
njkFiles.forEach(filePath => {
  let content = readFileSync(filePath, 'utf8');
  
  // Check if the file starts with a JavaScript-style comment
  if (content.startsWith('//')) {
    // Remove the first line if it's a JavaScript-style comment
    content = content.replace(/^\/\/.*?\n/, '');
    writeFileSync(filePath, content);
    console.log(`Fixed JavaScript-style comment in: ${filePath}`);
  }
});

console.log(`Processed ${njkFiles.length} .njk files`);
