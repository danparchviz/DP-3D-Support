# Gallery CMS - Quick Guide

## ✅ New Simplified System

Your gallery is now managed in **ONE place** - no need to create individual items!

## How to Add Images

### Step 1: Access CMS
Go to: `https://yoursite.netlify.app/admin/`

### Step 2: Open Gallery
1. Click **"Gallery"** in the left sidebar
2. Click **"Gallery Images"**

### Step 3: Add Multiple Images
1. Click **"Add Gallery Items +"** button
2. Fill in the form for each image:
   - **Title**: Name of the image
   - **Type**: image or video
   - **Media File**: Upload your image/video
   - **Categories**: Select one or more (exteriors, interiors, product)
   - **Order**: Number (0, 1, 2, 3... lower = first)
   - **Published**: ✓ (checked to show)

3. Click **"Add Gallery Items +"** again to add more
4. Repeat for all your images

### Step 4: Save
Click **"Publish"** → **"Publish now"**

Wait 1-2 minutes for Netlify to rebuild, then your gallery will show all images!

## Managing Gallery

### Reorder Items
1. Edit the gallery
2. Change the **Order** numbers
3. Publish

### Add More Images
1. Edit the gallery
2. Click **"Add Gallery Items +"**
3. Fill in details
4. Publish

### Delete Images
1. Edit the gallery
2. Click the **X** button on the item
3. Publish

### Hide Images
1. Edit the gallery
2. Uncheck **"Published"** on items you want to hide
3. Publish

## Tips

- **Order by 10s**: Use 0, 10, 20, 30... (easy to insert later)
- **Bulk upload**: Add all items at once, then publish
- **Categories**: Select multiple for items that fit in multiple filters
- **Videos**: Just select "video" type and upload MP4

## Example

Adding 5 images:
1. Open Gallery → Gallery Images
2. Click "Add Gallery Items +" 5 times
3. Fill in each:
   - Item 1: Order 0, exteriors
   - Item 2: Order 1, interiors
   - Item 3: Order 2, product
   - Item 4: Order 3, exteriors + product
   - Item 5: Order 4, interiors
4. Publish
5. Done! All 5 images in gallery

## Current Setup

- **Gallery file**: `content/gallery.json`
- **All items in one place**: No separate files per image
- **Easy management**: Add/edit/delete all in one screen
- **Auto-build**: Netlify rebuilds on every save

That's it! Much simpler than before.
