const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

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
      console.log(`\nValidating file: ${path.basename(filePath)}`);
      
      // Read the file content
      const html = fs.readFileSync(filePath, 'utf8');
      
      // Parse the HTML with JSDOM
      const { window } = new JSDOM(html);
      const document = window.document;
      
      // Check for basic HTML validation issues
      console.log('Basic validation checks:');
      
      // 1. Check for any JavaScript-style comments
      if (html.includes('// filepath:')) {
        console.log('- Found JavaScript-style comments (// filepath:)');
      }
      
      // 2. Check for unclosed HTML tags
      const issues = findUnclosedTags(html);
      if (issues.length > 0) {
        console.log('- Found potential unclosed tags:');
        issues.forEach(issue => console.log(`  * ${issue}`));
      }
      
      // 3. Check for missing alt attributes on images
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'));
      if (imagesWithoutAlt.length > 0) {
        console.log('- Found images without alt attributes:');
        imagesWithoutAlt.forEach(img => {
          console.log(`  * ${img.outerHTML.substring(0, 100)}...`);
        });
      }
      
      // 4. Check for duplicate IDs
      const ids = {};
      const duplicateIds = [];
      document.querySelectorAll('[id]').forEach(el => {
        const id = el.getAttribute('id');
        if (ids[id]) {
          duplicateIds.push(id);
        } else {
          ids[id] = true;
        }
      });
      
      if (duplicateIds.length > 0) {
        console.log('- Found duplicate IDs:');
        duplicateIds.forEach(id => console.log(`  * ${id}`));
      }
      
      console.log('-------------------------------------------');
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }
}

// Helper function to find potentially unclosed tags
function findUnclosedTags(html) {
  const issues = [];
  
  // Check for tags that are commonly problematic
  const tags = ['div', 'span', 'p', 'a', 'li', 'ul', 'ol', 'table', 'tr', 'td', 'th'];
  
  tags.forEach(tag => {
    const openingTags = (html.match(new RegExp(`<${tag}[^>]*>`, 'g')) || []).length;
    const closingTags = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    
    if (openingTags !== closingTags) {
      issues.push(`${tag}: ${openingTags} opening tags, ${closingTags} closing tags`);
    }
  });
  
  return issues;
}

// Install JSDOM if not already installed
function installJsdom() {
  try {
    require.resolve('jsdom');
    console.log('JSDOM is already installed.');
    return Promise.resolve();
  } catch (e) {
    console.log('Installing JSDOM...');
    const { spawn } = require('child_process');
    return new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install', 'jsdom']);
      
      npm.stdout.on('data', data => {
        console.log(data.toString());
      });
      
      npm.stderr.on('data', data => {
        console.error(data.toString());
      });
      
      npm.on('close', code => {
        if (code === 0) {
          console.log('JSDOM installed successfully.');
          resolve();
        } else {
          reject(new Error(`npm install exited with code ${code}`));
        }
      });
    });
  }
}

// Run the validation
async function main() {
  try {
    await installJsdom();
    await validateFiles();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
