const fs = require('fs');
const path = require('path');

/**
 * Bulk Import Gallery Items
 * Scans images/fulls/ folder and auto-generates gallery.json entries
 */

const MEDIA_FOLDER = path.join(__dirname, 'images', 'fulls');
const GALLERY_FILE = path.join(__dirname, 'content', 'gallery.json');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];

function bulkImport() {
  console.log('🔍 Scanning media folder...\n');

  // Check if media folder exists
  if (!fs.existsSync(MEDIA_FOLDER)) {
    console.error('❌ Media folder not found:', MEDIA_FOLDER);
    return;
  }

  // Read existing gallery
  let galleryData = { items: [] };
  if (fs.existsSync(GALLERY_FILE)) {
    galleryData = JSON.parse(fs.readFileSync(GALLERY_FILE, 'utf8'));
    console.log(`📋 Found ${galleryData.items.length} existing items`);
  }

  // Get existing media paths
  const existingPaths = new Set(galleryData.items.map(item => item.media));

  // Scan media folder
  const files = fs.readdirSync(MEDIA_FOLDER);
  const mediaFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext) || VIDEO_EXTENSIONS.includes(ext);
  });

  console.log(`📁 Found ${mediaFiles.length} media files\n`);

  // Find new files
  const newFiles = mediaFiles.filter(file => {
    const mediaPath = `/images/fulls/${file}`;
    return !existingPaths.has(mediaPath);
  });

  if (newFiles.length === 0) {
    console.log('✅ No new files to import. All files are already in gallery.');
    return;
  }

  console.log(`➕ Importing ${newFiles.length} new files:\n`);

  // Get highest order number
  let maxOrder = 0;
  if (galleryData.items.length > 0) {
    maxOrder = Math.max(...galleryData.items.map(item => item.order || 0));
  }

  // Add new items
  newFiles.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    const isVideo = VIDEO_EXTENSIONS.includes(ext);
    const mediaPath = `/images/fulls/${file}`;
    const title = path.basename(file, ext).replace(/[-_]/g, ' ');

    const newItem = {
      media: mediaPath,
      title: title,
      order: maxOrder + index + 1,
      type: isVideo ? 'video' : 'image',
      categories: ['exteriors'],
      published: true
    };

    galleryData.items.push(newItem);
    console.log(`  ✓ ${isVideo ? '🎥' : '🖼️ '} ${file} → Order ${newItem.order}`);
  });

  // Save gallery.json
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(galleryData, null, 2));

  console.log(`\n✅ Successfully imported ${newFiles.length} items!`);
  console.log(`📊 Total gallery items: ${galleryData.items.length}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Run: node build-gallery.js`);
  console.log(`   2. Refresh your website`);
  console.log(`   3. Edit titles/order in CMS if needed`);
}

// Run
try {
  bulkImport();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
