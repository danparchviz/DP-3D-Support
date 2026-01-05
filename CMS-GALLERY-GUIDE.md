# CMS Gallery Management Guide

Your gallery is now fully managed through Netlify CMS! You can upload images and videos directly through the CMS interface, and they'll be automatically organized by the order you specify.

## How It Works

1. **Upload through CMS** → Files are saved to your repository
2. **Netlify builds** → Runs `build-gallery.js` to create index
3. **Gallery loads** → Reads `gallery-index.json` and displays items in order

## Adding Gallery Items via CMS

### Step 1: Access the CMS
Go to `https://yoursite.netlify.app/admin/`

### Step 2: Add New Gallery Item
1. Click **"Gallery Items"** in the sidebar
2. Click **"New Gallery Item"** button
3. Fill in the form:

#### Form Fields:

**Title** (required)
- Name for this item (e.g., "Modern Kitchen Render")
- Used for organization and alt text

**Type** (required)
- Choose **"image"** for photos/renders
- Choose **"video"** for animations

**Media File** (required)
- Click to upload your image (JPG/PNG) or video (MP4)
- This is the full-size file shown in lightbox
- Recommended: Images 1920x1080 or higher, Videos under 10MB

**Thumbnail** (optional)
- Upload a custom thumbnail if you want
- Leave empty to use the media file as thumbnail
- Useful for videos: upload a still frame as thumbnail

**Categories** (required)
- Select one or more: **exteriors**, **interiors**, **product**
- Multiple categories = item appears in multiple filters
- Example: An exterior product shot can be both "exteriors" and "product"

**Description** (optional)
- Add notes or description (not currently displayed on site)

**Order** (required)
- Number that controls position (0, 1, 2, 3...)
- Lower numbers appear first
- Example: Order 0 = first item, Order 10 = eleventh item
- You can use decimals (0.5, 1.5) to insert between items

**Published** (required)
- Check to show in gallery
- Uncheck to hide (useful for drafts)

### Step 3: Save
Click **"Publish"** → **"Publish now"**

### Step 4: Wait for Build
- Netlify automatically rebuilds your site (takes 1-2 minutes)
- The new item will appear in your gallery

## Managing Gallery Order

### Reordering Items
1. Go to CMS → Gallery Items
2. Click on an item to edit
3. Change the **Order** number
4. Save and publish

### Order Examples:
```
Order 0  → First item
Order 1  → Second item
Order 2  → Third item
Order 10 → Eleventh item
Order 5.5 → Between 5 and 6
```

### Tips:
- Use increments of 10 (0, 10, 20, 30...) to leave room for insertions
- Use decimals to insert items without renumbering everything
- The CMS can sort by order - click the "Order" column header

## Video Guidelines

### Format
- **Must be MP4** format
- H.264 codec recommended
- Max 1920x1080 resolution

### File Size
- Keep under 10MB for fast loading
- Under 5MB is ideal
- Use video compression tools if needed

### Duration
- 3-10 seconds works best for gallery
- Longer videos are fine but may slow loading

### Optimization Tools
- **HandBrake** (free, desktop)
- **FFmpeg** (command line)
- **Online converters** (search "compress mp4 online")

### Video Behavior
- **In gallery**: Autoplay, loop, muted (like animated GIF)
- **In lightbox**: Full controls, sound enabled, loop

## Categories & Filtering

### Single Category
If an item belongs to one category:
- Select just that category
- Item appears only in that filter

### Multiple Categories
If an item fits multiple categories:
- Select all that apply
- Item appears in all selected filters
- Example: Exterior product render → "exteriors" + "product"

### Category Options
- **exteriors** - Outdoor scenes, buildings, landscapes
- **interiors** - Indoor spaces, rooms, furniture
- **product** - Product renders, close-ups, commercial

## Workflow Examples

### Example 1: Adding a New Render
```
Title: "Luxury Bathroom Interior"
Type: image
Media File: [upload bathroom.jpg]
Thumbnail: [leave empty]
Categories: interiors
Order: 25
Published: ✓
```

### Example 2: Adding an Animation
```
Title: "Product Rotation 360"
Type: video
Media File: [upload rotation.mp4]
Thumbnail: [upload rotation-thumb.jpg] (optional still frame)
Categories: product
Order: 30
Published: ✓
```

### Example 3: Multi-Category Item
```
Title: "Modern House Exterior"
Type: image
Media File: [upload house.jpg]
Categories: exteriors, product
Order: 15
Published: ✓
```

## Editing Existing Items

1. Go to CMS → Gallery Items
2. Click on the item you want to edit
3. Make changes
4. Click "Publish" → "Publish now"
5. Wait for Netlify to rebuild

## Deleting Items

1. Go to CMS → Gallery Items
2. Click on the item
3. Click "Delete entry" (top right)
4. Confirm deletion
5. Wait for Netlify to rebuild

## Unpublishing (Hiding) Items

Instead of deleting, you can hide items:
1. Edit the item
2. Uncheck "Published"
3. Save
4. Item stays in CMS but won't show on site

## Bulk Operations

### Reordering Multiple Items
1. Plan your new order on paper
2. Edit items one by one, updating Order numbers
3. Or use increments: 0, 10, 20, 30... (easy to insert later)

### Replacing All Gallery Items
1. Unpublish old items (uncheck Published)
2. Add new items with Order 0, 1, 2, 3...
3. Delete old items when ready

## Troubleshooting

### Item not showing after publish
- Wait 2-3 minutes for Netlify build to complete
- Check "Published" is checked
- Check Netlify deploy log for errors
- Clear browser cache and refresh

### Wrong order
- Check Order numbers in CMS
- Lower numbers = earlier in gallery
- Make sure items are saved

### Video not playing
- Check file is MP4 format
- Check file size (under 10MB recommended)
- Test in different browser
- Check browser console for errors

### Image not loading
- Check file uploaded correctly
- Check file format (JPG, PNG, GIF supported)
- Check file size (under 5MB recommended)

## Legacy System Fallback

If the CMS system fails, the gallery automatically falls back to the old numbered system:
- Images in `images/fulls/1.jpg`, `images/fulls/2.jpg`, etc.
- Configured in `assets/js/gallery.js`

To disable CMS and use legacy system:
1. Open `assets/js/gallery.js`
2. Find `var useCMS = true;` (line ~10)
3. Change to `var useCMS = false;`

## Technical Details

### Files Created by CMS
- `content/gallery/*.md` - Individual gallery item files
- `content/gallery-index.json` - Generated index (auto-created on build)

### Build Process
1. You save in CMS → Commits to GitHub
2. Netlify detects change → Starts build
3. Runs `node build-gallery.js` → Creates index
4. Deploys site with new gallery

### Manual Build (Local Testing)
```bash
npm run build:gallery
```

This creates/updates `content/gallery-index.json` from your CMS files.

## Best Practices

1. **Use consistent naming**: "Project Name - View Type"
2. **Order in increments**: 0, 10, 20, 30 (easy to insert)
3. **Optimize files**: Compress before uploading
4. **Test on mobile**: Check loading speed
5. **Use categories wisely**: Multi-category for crossover items
6. **Keep videos short**: 3-10 seconds for gallery
7. **Add descriptions**: Helps you remember what's what
8. **Use unpublish**: Don't delete, just hide temporarily

## Quick Reference

| Action | Steps |
|--------|-------|
| Add item | CMS → Gallery Items → New → Fill form → Publish |
| Edit item | CMS → Gallery Items → Click item → Edit → Publish |
| Reorder | Edit item → Change Order number → Publish |
| Hide item | Edit item → Uncheck Published → Publish |
| Delete item | Edit item → Delete entry → Confirm |
| Add video | Type: video → Upload MP4 → Publish |
| Multi-category | Select multiple in Categories field |

## Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console (F12)
3. Verify files in GitHub repository
4. Test with a simple image first
5. Check this guide's troubleshooting section
