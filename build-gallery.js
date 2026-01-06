const fs = require('fs');
const path = require('path');

/**
 * Build Gallery Index
 * Reads gallery items from content/gallery.json
 * and creates gallery-index.json
 */

const GALLERY_FILE = path.join(__dirname, 'content', 'gallery.json');
const OUTPUT_FILE = path.join(__dirname, 'content', 'gallery-index.json');

function buildGalleryIndex() {
  console.log('Building gallery index...');

  // Check if gallery.json exists
  if (!fs.existsSync(GALLERY_FILE)) {
    console.log('No gallery.json found, creating empty gallery...');
    const emptyGallery = {
      items: []
    };
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(emptyGallery, null, 2));
  }

  // Read gallery.json
  const galleryData = JSON.parse(fs.readFileSync(GALLERY_FILE, 'utf8'));
  const items = galleryData.items || [];

  console.log(`Found ${items.length} gallery items`);

  // Sort by order
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  // Filter published items
  const publishedItems = items.filter(item => item.published !== false);

  console.log(`${publishedItems.length} published items`);

  // Create index
  const index = {
    generated: new Date().toISOString(),
    count: publishedItems.length,
    items: publishedItems
  };

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`\n✓ Gallery index created: ${publishedItems.length} items`);
  console.log(`  Output: ${OUTPUT_FILE}`);
}

// Run if called directly
if (require.main === module) {
  buildGalleryIndex();
}

module.exports = { buildGalleryIndex };
