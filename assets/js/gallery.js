/*!
 * CMS-Driven Gallery Loader
 * - Loads gallery items from CMS JSON files
 * - Supports both images and videos
 * - Respects order and category settings from CMS
 * - Falls back to legacy numbered system if no CMS data
 */
(function ($) {
  $(function () {
    // ===== CONFIGURATION =====
    var useCMS = true; // Set to false to use legacy numbered system
    var cmsGalleryPath = 'content/gallery/';
    var firstBatch = 30;
    var batchSize = 30;

    // ===== LEGACY CONFIGURATION (fallback) =====
    var totalImages = 133;
    var videoItems = [];
    var multiCategories = {
      'exteriors,product': [6, 11, 14, 16, 18, 19, 35, 45, 77, 80, 106, 131],
      'interiors,product': [46, 47, 48],
      'exteriors': [2, 5, 6, 7, 9, 10, 13, 15, 17, 20, 22, 28, 29, 30, 31, 36, 37, 41, 42, 43, 44, 53, 55, 56, 58, 65, 73, 74, 75, 76, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 94, 98, 99, 103, 104, 105, 112, 113, 114, 115, 116, 117, 118, 120, 122, 127, 128, 129, 130, 133, 130],
      'interiors': [1, 3, 4, 8, 12, 21, 23, 24, 25, 26, 27, 28, 32, 33, 34, 38, 39, 40, 54, 57, 59, 60, 61, 62, 69, 70, 71, 72, 89, 95, 96, 97, 100, 102, 105, 107, 108, 109, 110, 111, 123],
      'product': [15, 49, 50, 51, 52, 63, 64, 66, 67, 68, 90, 91, 92, 93, 97, 101, 119, 121, 124, 125, 126, 132, 133]
    };

    // ===== STATE =====
    var loaded  = 0;
    var loading = false;
    var currentFilter = 'all';
    var allImages = []; // Store all loaded images data
    var observer = null; // Intersection Observer
    var loadTrigger = null; // Element that triggers lazy loading
    var cmsItems = []; // Store CMS gallery items
    var cmsLoaded = false;

    var $gallery = $('.gallery');
    var $loader  = $('#gallery-loader');

    // ===== CMS LOADING =====
    function loadCMSGallery() {
      return fetch('content/gallery-index.json')
        .then(function(response) {
          if (!response.ok) throw new Error('CMS gallery not found');
          return response.json();
        })
        .then(function(data) {
          cmsItems = data.items || [];
          // Sort by order field
          cmsItems.sort(function(a, b) {
            return (a.order || 0) - (b.order || 0);
          });
          // Filter published items only
          cmsItems = cmsItems.filter(function(item) {
            return item.published !== false;
          });
          cmsLoaded = true;
          totalImages = cmsItems.length;
          return cmsItems;
        })
        .catch(function(error) {
          console.log('CMS gallery not available, using legacy system:', error);
          useCMS = false;
          cmsLoaded = false;
          return null;
        });
    }

    function buildCMSItem(item, index) {
      var isVid = item.type === 'video';
      var mediaUrl = item.media || '';
      var thumbUrl = item.thumbnail || item.media || '';
      var categories = item.categories || [];
      var primaryCategory = categories[0] || 'uncategorized';
      var allCats = categories.join(' ');

      var mediaHtml = '';
      if (isVid) {
        mediaHtml = '<video autoplay loop muted playsinline '
          + 'class="video-thumb" '
          + 'title="' + (item.title || 'Gallery video') + '">'
          + '<source src="' + thumbUrl + '" type="video/mp4">'
          + 'Your browser does not support the video tag.'
          + '</video>';
      } else {
        mediaHtml = '<img src="' + thumbUrl + '" '
          + 'alt="' + (item.title || 'Gallery image') + '" '
          + 'loading="lazy" decoding="async">';
      }

      return {
        number: index,
        category: primaryCategory,
        categories: categories,
        isVideo: isVid,
        title: item.title || '',
        html: ''
          + '<article class="' + (index % 2 === 0 ? 'from-right' : 'from-left') + '" '
          + 'data-category="' + primaryCategory + '" '
          + 'data-categories="' + allCats + '" '
          + 'data-image="' + index + '" '
          + 'data-is-video="' + isVid + '">'
          + '  <a href="' + mediaUrl + '" class="image fit" data-index="' + index + '" data-is-video="' + isVid + '">'
          + mediaHtml
          + '  </a>'
          + '</article>'
      };
    }

    // ===== LAZY LOADING SETUP =====
    function initLazyLoading() {
      // Create intersection observer
      observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && entry.target === loadTrigger) {
            loadMoreImages();
          }
        });
      }, {
        rootMargin: '300px' // Start loading 300px before trigger comes into view
      });
    }

    function createLoadTrigger() {
      // Remove existing trigger
      removeLoadTrigger();
      
      // Only create if there are more images to load
      if (loaded >= totalImages) return;
      
      // Create invisible trigger element
      loadTrigger = document.createElement('div');
      loadTrigger.className = 'lazy-load-trigger';
      loadTrigger.style.cssText = 'height: 1px; opacity: 0; pointer-events: none;';
      
      $gallery[0].appendChild(loadTrigger);
      observer.observe(loadTrigger);
    }

    function removeLoadTrigger() {
      if (loadTrigger) {
        observer.unobserve(loadTrigger);
        if (loadTrigger.parentNode) {
          loadTrigger.parentNode.removeChild(loadTrigger);
        }
        loadTrigger = null;
      }
    }

    function loadMoreImages() {
      if (loading || loaded >= totalImages) return;
      loadImages(batchSize);
    }

    // ===== HELPER FUNCTIONS =====
    function getImageCategories(imageNum) {
  var foundCategories = [];
  
  for (var key in multiCategories) {
    if (multiCategories[key].indexOf(imageNum) !== -1) {
      var cats = key.split(',');
      foundCategories = foundCategories.concat(cats);
    }
  }
  
  return foundCategories.length > 0 ? foundCategories : ['uncategorized'];
}

// Keep backwards compatibility
     function getImageCategory(imageNum) {
     var cats = getImageCategories(imageNum);
     return cats[0]; // Return first category for existing code
}

    // Check if item is a video (legacy)
    function isVideo(itemNum) {
      return videoItems.indexOf(itemNum) !== -1;
    }

    function buildItems(start, end) {
      var html = "";
      var items = [];

      // Use CMS items if available
      if (useCMS && cmsLoaded) {
        for (var i = start; i <= end && i < cmsItems.length; i++) {
          var item = buildCMSItem(cmsItems[i], i);
          items.push(item);
          allImages.push(item);
          html += item.html;
        }
        return html;
      }

      // Legacy numbered system
      for (var i = start; i <= end; i++) {
        var categories = getImageCategories(i);
        var category = categories[0];
        var allCats = categories.join(' ');
        var isVid = isVideo(i);
        var fileExt = isVid ? '.mp4' : '.jpg';
        var thumbExt = isVid ? '.mp4' : '.jpg';

        var mediaHtml = '';
        if (isVid) {
          mediaHtml = '<video src="images/thumbs/' + i + thumbExt + '" '
            + 'autoplay loop muted playsinline '
            + 'class="video-thumb" '
            + 'alt="Gallery video ' + i + '" '
            + 'loading="lazy">'
            + '</video>';
        } else {
          mediaHtml = '<img src="images/thumbs/' + i + thumbExt + '" '
            + 'alt="Gallery image ' + i + '" '
            + 'loading="lazy" decoding="async">';
        }

        var item = {
          number: i,
          category: category,
          isVideo: isVid,
          html: ''
            + '<article class="' + (i % 2 === 0 ? 'from-right' : 'from-left') + '" '
            + 'data-category="' + category + '" '
            + 'data-categories="' + allCats + '" '
            + 'data-image="' + i + '" '
            + 'data-is-video="' + isVid + '">'
            + '  <a href="images/fulls/' + i + fileExt + '" class="image fit" data-index="' + i + '" data-is-video="' + isVid + '">'
            + mediaHtml
            + '  </a>'
            + '</article>'
        };

        items.push(item);
        allImages.push(item);
        html += item.html;
      }

      return html;
    }

    function getTotalImagesInCategory(filter) {
      if (filter === 'all') return totalImages;
      return categories[filter] ? categories[filter].length : 0;
    }

    function getLoadedImagesInCategory(filter) {
      if (filter === 'all') return loaded;
      
      var count = 0;
      allImages.forEach(function(item) {
        if (item.category === filter) count++;
      });
      return count;
    }

    function loadImages(count) {
      if (loading) return;
      if (loaded >= totalImages) return;
      loading = true;

      // Remove current trigger while loading
      removeLoadTrigger();

      if ($loader.length) $loader.show();

      var start = loaded + 1;
      var end   = Math.min(loaded + count, totalImages);

      // Async append (keeps UI smooth)
      window.setTimeout(function () {
        var html = buildItems(start, end);
        $gallery.append(html);
        loaded  = end;
        loading = false;
        if ($loader.length) $loader.hide();
        
        // Apply current filter to newly loaded items
        applyFilter(currentFilter);
        
        // Create new trigger if more images remain
        createLoadTrigger();

        // Notify others (lightbox, etc.) that new items exist
        document.dispatchEvent(new CustomEvent('gallery:updated', { bubbles: false }));
      }, 100); // Small delay to show loader
    }

    function applyFilter(filter) {
  currentFilter = filter;
  
  $gallery.find('article').each(function() {
    var $item = $(this);
    var itemCategories = $item.data('categories') || $item.data('category') || '';
    var categoryArray = itemCategories.split(' ');
    
    if (filter === 'all' || categoryArray.indexOf(filter) !== -1) {
      $item.removeClass('filtered-out').show();
    } else {
      $item.addClass('filtered-out').hide();
    }
  });
      
      // Check if we need to load more images for this filter
      // If filtered items are few and more exist, load immediately
      var visibleItems = $gallery.find('article:visible').length;
      if (visibleItems < 10 && loaded < totalImages) {
        setTimeout(function() {
          loadMoreImages();
        }, 100);
      }
    }

    // ===== FILTER FUNCTIONALITY =====
    function initFilters() {
      // Filter functionality is handled by the existing script in HTML
      // We just need to make sure our applyFilter function is accessible
    }

    // ===== INITIALIZATION =====
    function init() {
      initLazyLoading();
      initFilters();

      if (useCMS) {
        // Load CMS gallery first
        loadCMSGallery().then(function() {
          loadImages(firstBatch);
        });
      } else {
        // Use legacy system
        loadImages(firstBatch);
      }
    }

    init();

    // ===== PUBLIC API =====
    window.GalleryState = {
      get total()  { return totalImages; },
      get loaded() { return loaded; },
      get loading(){ return loading; },
      get currentFilter() { return currentFilter; },
      get categories() { return categories; },
      applyFilter: applyFilter,
      getImageCategory: getImageCategory,
      loadMore: loadMoreImages // Keep this for manual triggering if needed
    };

    // ===== CATEGORY STATS (for debugging) =====
       console.log('Gallery Categories:', {
  total: totalImages,
  lazyLoading: 'enabled',
  multiCategory: 'supported'
});
    
    // === Custom Lightbox ===
    (function(){
      var lightbox   = document.getElementById('lightbox');
      var img        = lightbox.querySelector('.lightbox-img');
      var video      = lightbox.querySelector('.lightbox-video');
      var closeBtn   = lightbox.querySelector('.close');
      var prevBtn    = lightbox.querySelector('.prev');
      var nextBtn    = lightbox.querySelector('.next');
      var galleryEls = [];
      var currentIndex = -1;

      function openLightbox(index){
        var el = galleryEls[index];
        if (!el) return;
        currentIndex = index;

        var isVid = el.getAttribute('data-is-video') === 'true';

        if (isVid) {
          // Show video, hide image
          img.style.display = 'none';
          img.src = '';
          video.style.display = 'block';
          video.src = el.href;
          video.load();
          video.play();
        } else {
          // Show image, hide video
          video.style.display = 'none';
          video.pause();
          video.src = '';
          img.style.display = 'block';
          img.src = el.href;
        }

        lightbox.classList.remove('hidden');
      }

      function closeLightbox(){
        lightbox.classList.add('hidden');
        img.src = '';
        video.pause();
        video.src = '';
        currentIndex = -1;
      }

      function showPrev(){ openLightbox((currentIndex - 1 + galleryEls.length) % galleryEls.length); }
      function showNext(){ openLightbox((currentIndex + 1) % galleryEls.length); }

      // Event bindings
      document.addEventListener('click', function(e){
        var a = e.target.closest('.gallery a.image');
        if (a) {
          e.preventDefault();
          galleryEls = Array.from(document.querySelectorAll('.gallery a.image'));
          openLightbox(galleryEls.indexOf(a));
        }
      });

      closeBtn.addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', showPrev);
      nextBtn.addEventListener('click', showNext);

      // Close on overlay click
      lightbox.addEventListener('click', function(e){
        if (e.target === lightbox) closeLightbox();
      });

      // Keyboard support
      document.addEventListener('keydown', function(e){
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      });

      // Rebuild galleryEls whenever new items load
      document.addEventListener('gallery:updated', function(){
        galleryEls = Array.from(document.querySelectorAll('.gallery a.image'));
      });
    })();

  });
})(jQuery);