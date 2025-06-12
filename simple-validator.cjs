const { JSDOM } = require('jsdom');
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
      console.log(`\nValidating file: ${path.basename(filePath)}`);
      
      // Read the file content
      const html = fs.readFileSync(filePath, 'utf8');
      console.log('File read successfully');
      
      // Parse the HTML with JSDOM
      const { window } = new JSDOM(html);
      const document = window.document;
      console.log('DOM parsed successfully');
      
      console.log('HTML validation checks:');
      
      // 1. Check for missing alt attributes on images
      const images = Array.from(document.querySelectorAll('img'));
      const imagesWithoutAlt = images.filter(img => !img.hasAttribute('alt'));
      
      console.log(`Total images found: ${images.length}`);
      console.log(`Images without alt attribute: ${imagesWithoutAlt.length}`);
      
      if (imagesWithoutAlt.length > 0) {
        console.log('Images missing alt attributes:');
        imagesWithoutAlt.forEach((img, index) => {
          const src = img.getAttribute('src') || 'no-src';
          console.log(`${index + 1}. <img src="${src}">`);
        });
      }
        // 2. Check for duplicate IDs
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
      
      console.log(`\nTotal unique IDs found: ${Object.keys(ids).length}`);
      console.log(`Duplicate IDs found: ${duplicateIds.length}`);
      
      if (duplicateIds.length > 0) {
        console.log('Duplicate IDs:');
        duplicateIds.forEach((id, index) => {
          console.log(`${index + 1}. "${id}"`);
        });
      }
      
      // 3. Check for HTML5 semantic elements
      const semanticElements = ['header', 'footer', 'main', 'nav', 'section', 'article', 'aside'];
      console.log('\nHTML5 semantic elements:');
      semanticElements.forEach(el => {
        const count = document.querySelectorAll(el).length;
        console.log(`${el}: ${count}`);
      });
      
      // 4. Check for invalid HTML attributes
      console.log('\nChecking for deprecated or invalid attributes:');
      const deprecatedAttrs = [
        { tag: 'a', attr: 'target', requiredAttr: 'rel', requiredValue: 'noopener' }
      ];
      
      deprecatedAttrs.forEach(item => {
        const elements = document.querySelectorAll(`${item.tag}[${item.attr}]`);
        const invalid = Array.from(elements).filter(el => {
          const attrValue = el.getAttribute(item.requiredAttr);
          return !attrValue || !attrValue.includes(item.requiredValue);
        });
        
        if (invalid.length > 0) {
          console.log(`Found ${invalid.length} <${item.tag}> with ${item.attr} but without ${item.requiredAttr}="${item.requiredValue}"`);
        }
      });
      
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }
}

// Run the validation
validateFiles().catch(console.error);
