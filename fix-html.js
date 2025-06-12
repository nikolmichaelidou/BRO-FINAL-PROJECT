import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory containing HTML files
const htmlDir = join(__dirname, 'public');

// Find all HTML files in the public directory
function findHtmlFiles(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  
  return files
    .filter(file => !file.isDirectory() && file.name.endsWith('.html'))
    .map(file => join(dir, file.name));
}

// Process each HTML file to remove JavaScript-style comments
const htmlFiles = findHtmlFiles(htmlDir);
htmlFiles.forEach(filePath => {
  let content = readFileSync(filePath, 'utf8');
  
  // Check if the file starts with a JavaScript-style comment
  if (content.includes('// filepath:')) {
    // Remove any JavaScript-style comments
    content = content.replace(/^\/\/.*?\n/gm, '');
    writeFileSync(filePath, content);
    console.log(`Fixed JavaScript-style comment in: ${filePath}`);
  }
});

console.log(`Processed ${htmlFiles.length} HTML files`);
