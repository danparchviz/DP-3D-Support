# Quick Start: CMS Gallery System

## ✅ What's New

Your gallery is now **fully CMS-managed**! You can:
- ✅ Upload images and videos through the CMS interface
- ✅ Control the order of items (no more numbered files!)
- ✅ Assign multiple categories to each item
- ✅ Show/hide items without deleting
- ✅ No manual file management needed

## 🚀 Getting Started

### 1. Access Your CMS
Go to: `https://yoursite.netlify.app/admin/`

### 2. Add Your First Gallery Item

1. Click **"Gallery Items"** in sidebar
2. Click **"New Gallery Item"**
3. Fill in:
   - **Title**: "My First Render"
   - **Type**: image
   - **Media File**: Upload your image
   - **Categories**: Select one or more
   - **Order**: 0 (first item)
   - **Published**: ✓ (checked)
4. Click **"Publish"** → **"Publish now"**

### 3. Wait for Build
- Netlify rebuilds automatically (1-2 minutes)
- Your item appears in the gallery!

## 📝 Key Concepts

### Order Numbers
- **Lower = Earlier** in gallery
- Use: 0, 1, 2, 3... or 0, 10, 20, 30...
- Decimals work: 5.5 goes between 5 and 6

### Categories
- **Single**: Item in one filter
- **Multiple**: Item in multiple filters
- Options: exteriors, interiors, product

### Media Types
- **Image**: JPG, PNG (recommended under 2MB)
- **Video**: MP4 only (recommended under 10MB)

## 🎬 Adding Videos

Same as images, just:
1. **Type**: Select "video"
2. **Media File**: Upload .mp4 file
3. **Thumbnail** (optional): Upload a still frame
4. Videos autoplay on loop in gallery (muted)
5. Full controls in lightbox

## 📂 Files You'll See

After adding items in CMS:
- `content/gallery/*.md` - Your gallery items
- `content/gallery-index.json` - Auto-generated index

**Don't edit these manually!** Use the CMS.

## 🔧 How It Works

```
You add item in CMS
    ↓
Saves to GitHub
    ↓
Netlify detects change
    ↓
Runs build script (creates index)
    ↓
Deploys updated site
    ↓
Gallery shows new item!
```

## 🆘 Troubleshooting

**Item not showing?**
- Wait 2-3 minutes for build
- Check "Published" is checked
- Clear browser cache

**Wrong order?**
- Check Order numbers (lower = first)
- Edit item and change Order

**Video not playing?**
- Must be MP4 format
- Keep under 10MB
- Check browser console (F12)

## 📚 Full Documentation

- **CMS-GALLERY-GUIDE.md** - Complete guide with examples
- **VIDEO-GALLERY-GUIDE.md** - Video-specific tips (legacy)

## 🎯 Quick Tips

1. **Start simple**: Add one image first
2. **Use increments**: Order by 10s (0, 10, 20...)
3. **Optimize files**: Compress before upload
4. **Test categories**: Try multi-category items
5. **Use unpublish**: Hide instead of delete

## 🔄 Migrating Old Gallery

Your old numbered images (1.jpg, 2.jpg...) still work as fallback!

To migrate to CMS:
1. Add items through CMS with same images
2. Set proper order and categories
3. Old system automatically disabled when CMS has items

## ⚙️ Advanced: Local Testing

If you want to test locally:

```bash
# Install Node.js first, then:
npm run build:gallery
```

This regenerates the gallery index from your CMS files.

## 🎨 Example Workflow

**Morning**: Upload 5 new renders
1. Go to CMS
2. Add 5 items (Order: 0, 1, 2, 3, 4)
3. Publish each one
4. Wait for build
5. Check gallery - all there!

**Afternoon**: Reorder items
1. Edit item with Order 2
2. Change to Order 0.5
3. Publish
4. Now it's second (between 0 and 1)

**Evening**: Hide old work
1. Edit old items
2. Uncheck "Published"
3. Publish
4. Items hidden but not deleted

## 🎉 You're Ready!

Start adding your gallery items through the CMS. It's that simple!

Questions? Check **CMS-GALLERY-GUIDE.md** for detailed instructions.
