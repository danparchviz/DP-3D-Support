const fs = require('fs');
const path = require('path');

/**
 * Build Gallery Index
 * Reads all gallery items from content/gallery/*.md files
 * and creates a single gallery-index.json file
 */

const GALLERY_DIR = path.join(__dirname, 'content', 'gallery');
const OUTPUT_FILE = path.join(__dirname, 'content', 'gallery-index.json');

function parseMarkdownFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const data = {};
  
  // Parse YAML-like frontmatter
  const lines = frontmatter.split('\n');
  let currentKey = null;
  let currentArray = null;
  
  lines.forEach(line => {
    // Array items
    if (line.trim().startsWith('- ')) {
      if (currentArray) {
        currentArray.push(line.trim().substring(2).trim());
      }
      return;
    }
    
    // Key-value pairs
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      // Handle numbers
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value);
      }
      
      // Check if next line might be an array
      currentKey = key;
      if (value === '') {
        currentArray = [];
        data[key] = currentArray;
      } else {
        data[key] = value;
        currentArray = null;
      }
    }
  });
  
  return data;
}

function buildGalleryIndex() {
  console.log('Building gallery index...');
  
  // Create content/gallery directory if it doesn't exist
  if (!fs.existsSync(GALLERY_DIR)) {
    fs.mkdirSync(GALLERY_DIR, { recursive: true });
    console.log('Created content/gallery directory');
  }
  
  // Read all markdown files from gallery directory
  let files = [];
  try {
    files = fs.readdirSync(GALLERY_DIR)
      .filter(file => file.endsWith('.md'));
  } catch (err) {
    console.log('No gallery files found yet');
    files = [];
  }
  
  const items = [];
  
  files.forEach(file => {
    const filePath = path.join(GALLERY_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = parseMarkdownFrontmatter(content);
    
    if (data) {
      // Ensure categories is an array
      if (data.categories && !Array.isArray(data.categories)) {
        data.categories = [data.categories];
      }
      
      items.push(data);
      console.log(`  ✓ Loaded: ${data.title || file}`);
    }
  });
  
  // Sort by order
  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Create index
  const index = {
    generated: new Date().toISOString(),
    count: items.length,
    items: items
  };
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`\n✓ Gallery index created: ${items.length} items`);
  console.log(`  Output: ${OUTPUT_FILE}`);
}

// Run if called directly
if (require.main === module) {
  buildGalleryIndex();
}

module.exports = { buildGalleryIndex };
