# DP 3D Support - Portfolio Website

A modern portfolio website for 3D rendering and design work, featuring a CMS-managed gallery with support for both images and videos.

## ✨ Features

- 🎨 **CMS-Managed Gallery** - Upload and organize through Netlify CMS
- 🎬 **Video Support** - Autoplay video thumbnails in gallery
- 🏷️ **Category Filtering** - Filter by exteriors, interiors, product
- 📱 **Responsive Design** - Works on all devices
- 🖼️ **Lightbox Viewer** - Full-screen image/video viewing
- ⚡ **Lazy Loading** - Fast performance with progressive loading
- 📧 **Contact Form** - Netlify Forms integration

## 🚀 Quick Start

### For Content Editors

1. **Access CMS**: Go to `https://yoursite.netlify.app/admin/`
2. **Add Gallery Items**: Upload images/videos with order and categories
3. **Publish**: Changes deploy automatically

See **QUICK-START-CMS-GALLERY.md** for detailed instructions.

### For Developers

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd DP-3D-Support
   ```

2. **Test locally**
   ```bash
   # Open index.html in browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Build gallery index**
   ```bash
   npm run build:gallery
   ```

4. **Deploy to Netlify**
   - Connect repository to Netlify
   - Build command: `npm run build:gallery`
   - Publish directory: `.`

## 📁 Project Structure

```
DP-3D-Support/
├── index.html              # Main website
├── admin/
│   ├── index.html         # CMS interface
│   └── config.yml         # CMS configuration
├── assets/
│   ├── css/
│   │   ├── main.css       # Base styles
│   │   ├── main.min.css   # Minified styles
│   │   └── overrides.css  # Custom styles
│   └── js/
│       ├── gallery.js     # Gallery system
│       └── main.js        # Main scripts
├── content/
│   ├── gallery/           # CMS gallery items (*.md)
│   └── gallery-index.json # Generated gallery index
├── images/
│   ├── fulls/            # Full-size images/videos
│   └── thumbs/           # Thumbnails
├── build-gallery.js      # Gallery index builder
├── netlify.toml          # Netlify configuration
├── package.json          # Node.js configuration
└── *.md                  # Documentation files
```

## 📚 Documentation

- **QUICK-START-CMS-GALLERY.md** - Quick start for CMS users
- **CMS-GALLERY-GUIDE.md** - Complete CMS gallery guide
- **VIDEO-GALLERY-GUIDE.md** - Video-specific information
- **CMS-SETUP-GUIDE.md** - Initial CMS setup instructions

## 🎨 Gallery Management

### Through CMS (Recommended)

1. Go to `/admin/`
2. Add/edit gallery items
3. Set order, categories, publish status
4. Automatic deployment

### Legacy System (Fallback)

If CMS fails, gallery falls back to numbered files:
- `images/fulls/1.jpg`, `images/fulls/2.jpg`, etc.
- Configure in `assets/js/gallery.js`

## 🎬 Video Support

- **Format**: MP4 (H.264 codec)
- **Size**: Under 10MB recommended
- **Behavior**: 
  - Gallery: Autoplay, loop, muted
  - Lightbox: Full controls with sound

## 🏷️ Categories

- **exteriors** - Outdoor scenes, buildings
- **interiors** - Indoor spaces, rooms
- **product** - Product renders, close-ups

Items can have multiple categories.

## 🔧 Configuration

### CMS Configuration
Edit `admin/config.yml` to customize:
- Collections
- Fields
- Media folders
- Workflows

### Gallery Configuration
Edit `assets/js/gallery.js`:
- `useCMS` - Enable/disable CMS (line ~10)
- `firstBatch` - Initial items to load
- `batchSize` - Lazy load batch size

### Build Configuration
Edit `netlify.toml`:
- Build command
- Environment variables
- Plugins

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect Repository**
   - Go to Netlify dashboard
   - "New site from Git"
   - Select your repository

2. **Configure Build**
   - Build command: `npm run build:gallery`
   - Publish directory: `.`
   - (Or use netlify.toml settings)

3. **Enable Identity**
   - Site settings → Identity → Enable
   - Enable Git Gateway
   - Invite users

4. **Deploy**
   - Automatic on git push
   - Manual: Click "Trigger deploy"

### Other Hosts

1. Build gallery index: `npm run build:gallery`
2. Upload all files to host
3. CMS requires Git Gateway (Netlify-specific)

## 🔐 CMS Access

### Setup Users

1. Netlify dashboard → Identity
2. "Invite users"
3. Enter email
4. User receives invitation
5. User sets password
6. Access at `/admin/`

### Roles

- **Admin** - Full access
- **Editor** - Can edit content

Configure in Netlify Identity settings.

## 🛠️ Development

### Local Development

```bash
# Serve locally
python -m http.server 8000
# or
npx http-server

# Build gallery
npm run build:gallery

# Watch for changes (manual refresh needed)
```

### Testing CMS Locally

CMS requires Git Gateway, so local testing is limited. Options:
1. Use Netlify Dev: `netlify dev`
2. Test on staging branch
3. Use test mode in CMS config

## 📝 Adding Content

### Gallery Items

**Via CMS** (Recommended):
1. `/admin/` → Gallery Items → New
2. Upload media, set order, categories
3. Publish

**Via Files** (Advanced):
1. Create `content/gallery/item-name.md`
2. Add frontmatter (see example-item.md)
3. Run `npm run build:gallery`
4. Commit and push

### Page Content

Edit through CMS:
- Home Page content
- Section headings
- Background images
- Social media links

## 🎯 Best Practices

1. **Optimize Images**
   - Max 1920x1080 for web
   - Compress before upload
   - Use JPG for photos, PNG for graphics

2. **Optimize Videos**
   - Keep under 10MB
   - 3-10 seconds for gallery
   - H.264 codec, MP4 container

3. **Order Management**
   - Use increments (0, 10, 20...)
   - Leaves room for insertions
   - Use decimals for fine-tuning

4. **Categories**
   - Use multiple when appropriate
   - Consistent naming
   - Don't over-categorize

5. **Publishing**
   - Test with one item first
   - Use unpublish vs delete
   - Check on mobile after deploy

## 🐛 Troubleshooting

### Gallery not loading
- Check `content/gallery-index.json` exists
- Check browser console (F12)
- Verify build script ran
- Check Netlify deploy logs

### CMS not accessible
- Verify Netlify Identity enabled
- Check user invited and confirmed
- Clear browser cache
- Try incognito mode

### Videos not playing
- Verify MP4 format
- Check file size
- Test in different browser
- Check browser console

### Build failing
- Check Node.js version (18+)
- Verify package.json exists
- Check netlify.toml syntax
- Review deploy logs

## 📊 Performance

- **Lazy Loading** - Loads 30 items initially, more on scroll
- **Optimized Images** - Thumbnails for gallery, full-size in lightbox
- **Async Loading** - Non-blocking gallery load
- **Caching** - Browser caches static assets

## 🔄 Updates

### Updating Gallery System

1. Edit `assets/js/gallery.js`
2. Test locally
3. Commit and push
4. Netlify redeploys

### Updating CMS Config

1. Edit `admin/config.yml`
2. Test in CMS
3. Commit and push
4. Refresh CMS interface

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Support

For issues or questions:
1. Check documentation files
2. Review troubleshooting sections
3. Check browser console
4. Review Netlify deploy logs

## 🎉 Credits

- **Template**: Based on Aerial by HTML5 UP
- **CMS**: Netlify CMS
- **Hosting**: Netlify
- **Icons**: Font Awesome

---

**Ready to start?** Check out **QUICK-START-CMS-GALLERY.md**!
