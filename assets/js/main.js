window.USE_POPTROX = false; // disable default Poptrox lightbox (using custom one)
/*
	Big Picture by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$all = $body.add($header);

	// Breakpoints.
		breakpoints({
			xxlarge: [ '1681px',  '1920px' ],
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '1001px',  '1280px' ],
			medium:  [ '737px',   '1000px' ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch mode.
		if (browser.mobile)
			$body.addClass('is-touch');
		else {

			breakpoints.on('<=small', function() {
				$body.addClass('is-touch');
			});

			breakpoints.on('>small', function() {
				$body.removeClass('is-touch');
			});

		}

	// Fix: IE flexbox fix.
		if (browser.name == 'ie') {

			var $main = $('.main.fullscreen'),
				IEResizeTimeout;

			$window
				.on('resize.ie-flexbox-fix', function() {

					clearTimeout(IEResizeTimeout);

					IEResizeTimeout = setTimeout(function() {

						var wh = $window.height();

						$main.each(function() {

							var $this = $(this);

							$this.css('height', '');

							if ($this.height() <= wh)
								$this.css('height', (wh - 50) + 'px');

						});

					});

				})
				.triggerHandler('resize.ie-flexbox-fix');

		}

	// Gallery.
		$window.on('load', function() {

			var $gallery = $('.gallery');

			if (window.USE_POPTROX) {
$gallery.poptrox({
				baseZIndex: 10001,
				useBodyOverflow: false,
				usePopupEasyClose: false,
				overlayColor: '#1f2328',
				overlayOpacity: 0.65,
				usePopupDefaultStyling: false,
				usePopupCaption: true,
				popupLoaderText: '',
				windowMargin: 50,
				usePopupNav: true
			});
}


			// Hack: Adjust margins when 'small' activates.
				breakpoints.on('>small', function() {
					$gallery.each(function() {
						$(this)[0]._poptrox.windowMargin = 50;
					});
				});

				breakpoints.on('<=small', function() {
					$gallery.each(function() {
						$(this)[0]._poptrox.windowMargin = 5;
					});
				});

		});

	// Section transitions.
		if (browser.canUse('transition')) {

			var on = function() {

				// Galleries.
// (disabled) — removed scrollex on gallery to prevent scatter
// Generic sections.
					$('.main.style1')
						.scrollex({
							mode:		'middle',
							delay:		100,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

					$('.main.style2')
						.scrollex({
							mode:		'middle',
							delay:		100,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

				// Contact.
					$('#contact')
						.scrollex({
							top:		'50%',
							delay:		50,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

			};

			var off = function() {

				// Galleries.
// (disabled) — removed unscrollex for gallery
// Generic sections.
					$('.main.style1')
						.unscrollex();

					$('.main.style2')
						.unscrollex();

				// Contact.
					$('#contact')
						.unscrollex();

			};

			breakpoints.on('<=small', off);
			breakpoints.on('>small', on);

		}

	// Events.
		var resizeTimeout, resizeScrollTimeout;

		$window
			.on('resize', function() {

				// Disable animations/transitions.
					$body.addClass('is-resizing');

				clearTimeout(resizeTimeout);

				resizeTimeout = setTimeout(function() {

					// Update scrolly links.
					//	$('a[href^="#"]').scrolly({
					//		speed: 1500,
					//		offset: $header.outerHeight() - 1
					//	});

					// Re-enable animations/transitions.
						setTimeout(function() {
							$body.removeClass('is-resizing');
							$window.trigger('scroll');
						}, 0);

				}, 100);

			})
			.on('load', function() {
				$window.trigger('resize');
			});

})(jQuery);

// === Row-wise masonry: compute grid row spans so items keep natural heights ===
(function(){
  function setupGridMasonry() {
    var gallery = document.querySelector('.gallery');
    if (!gallery) return;

    function num(val){ return Number(String(val).replace('px','')) || 0; }

    function resizeItem(item) {
      var rowH = num(getComputedStyle(gallery).gridAutoRows) || 4;
      var gap  = num(getComputedStyle(gallery).rowGap) || 16;
      var target = item.querySelector('.image') || item;
      var h = target.getBoundingClientRect().height;
      var span = Math.ceil((h + gap) / (rowH + gap));
      item.style.gridRowEnd = 'span ' + span;
    }

    function resizeAll() {
      var items = gallery.querySelectorAll('article');
      items.forEach(resizeItem);
    }

    window.addEventListener('resize', resizeAll);

    var imgs = gallery.querySelectorAll('img');
    imgs.forEach(function(img){
      if (img.complete) return;
      img.addEventListener('load', function(){
        var a = img.closest('article');
        if (a) resizeItem(a);
      });
    });

    var mo = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if (node.nodeType === 1 && node.matches('article')) {
            var innerImg = node.querySelector('img');
            if (innerImg && !innerImg.complete) {
              innerImg.addEventListener('load', function(){ resizeItem(node); });
            } else {
              resizeItem(node);
            }
          }
        });
      });
    });
    mo.observe(gallery, { childList: true });

    // Initial pass
    resizeAll();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupGridMasonry();
  } else {
    document.addEventListener('DOMContentLoaded', setupGridMasonry);
  }
})();

// === Lazy loading for gallery images (IO + blur-up) ===
(function(){
  var PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  var PRELOAD_MARGIN = 300; // px before viewport

  function initLazy(){
    var gallery = document.querySelector('#work .gallery');
    if (!gallery) return;

    function prepare(img){
      if (img.dataset.lazyPrepared) return;
      img.dataset.lazyPrepared = '1';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.setAttribute('fetchpriority', 'low');
      img.classList.add('lazy');
      // If it's already near viewport, keep src; otherwise defer
      try {
        var rect = img.getBoundingClientRect();
        var near = rect.top <= (window.innerHeight + PRELOAD_MARGIN);
        if (!near) {
          if (!img.dataset.src) img.dataset.src = img.getAttribute('src') || '';
          if (img.dataset.src) img.setAttribute('src', PLACEHOLDER);
        }
      } catch(e){ /* ignore */ }
      // When it loads, flip classes
      img.addEventListener('load', function onload(){
        img.classList.remove('lazy');
        img.classList.add('lazy-loaded');
      }, { once: true });
    }

    function load(img){
      var ds = img.getAttribute('data-src');
      if (ds) {
        img.setAttribute('src', ds);
        img.removeAttribute('data-src');
      } else {
        // If there was no data-src, native 'loading=lazy' will do the job
      }
    }

    var supportsIO = 'IntersectionObserver' in window;
    var io = supportsIO ? new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var img = entry.target;
          load(img);
          io.unobserve(img);
        }
      });
    }, { root: null, rootMargin: PRELOAD_MARGIN + 'px 0px', threshold: 0.01 }) : null;

    // Prepare all existing images
    var imgs = gallery.querySelectorAll('img');
    imgs.forEach(function(img){
      prepare(img);
      if (io) io.observe(img);
    });

    // Watch for new images (Load More)
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if (node.nodeType === 1) {
            // If an <article> was appended, prepare its <img>
            if (node.matches('article')) {
              var img = node.querySelector('img');
              if (img) {
                prepare(img);
                if (io) io.observe(img);
              }
            }
            // Or if an <img> was appended directly
            if (node.matches('img')) {
              prepare(node);
              if (io) io.observe(node);
            }
          }
        });
      });
    });
    mo.observe(gallery, { childList: true, subtree: true });

    // Fallback for browsers without IO:
    if (!io && !('loading' in HTMLImageElement.prototype)) {
      // Simple immediate load for all prepared images (older browsers).
      imgs.forEach(load);
      // And for future nodes:
      document.addEventListener('scroll', function onScrollOnce(){
        var qs = gallery.querySelectorAll('img[data-src]');
        qs.forEach(load);
      }, { passive: true });
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initLazy();
  } else {
    document.addEventListener('DOMContentLoaded', initLazy);
  }
})();


// === Poptrox nav override: numeric next/prev + auto "Load More" chaining ===
(function(){
  function numFromUrl(u){
    if(!u) return NaN;
    var m = String(u).match(/(?:^|\/)(\d+)\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?|$)/i);
    return m ? parseInt(m[1], 10) : NaN;
  }
  function findAnchorByNum(n){
    var $cands = $('.gallery a.image');
    for (var i=0;i<$cands.length;i++){
      var a = $cands[i];
      var href = a.getAttribute('href') || '';
      if (numFromUrl(href) === n) return $(a);
    }
    return $();
  }
  function isLoadMoreVisible(){
    var el = document.getElementById('loadMore');
    return !!el && el.offsetParent !== null;
  }
  function openNumber(n){
    var $a = findAnchorByNum(n);
    if ($a.length){
      // Close current popup, then open desired anchor
      var closer = document.querySelector('.poptrox-popup .closer');
      if (closer) closer.click();
      setTimeout(function(){ $a[0].click(); }, 20);
      return;
    }
    // Not available yet: load more (if possible) and wait until the anchor appears.
    if (!isLoadMoreVisible()) return; // nothing else to load
    var gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // Start a one-shot observer that waits for the desired anchor
    var trying = true;
    var obs = new MutationObserver(function(){
      if (!trying) return;
      var $b = findAnchorByNum(n);
      if ($b.length){
        trying = false;
        obs.disconnect();
        // Open it
        var closer2 = document.querySelector('.poptrox-popup .closer');
        if (closer2) closer2.click();
        setTimeout(function(){ $b[0].click(); }, 20);
      }
    });
    obs.observe(gallery, { childList: true, subtree: true });

    // Trigger Load More; if it's still visible afterward, trigger again after small delay
    function requestMore(){
      var btn = document.getElementById('loadMore');
      if (!btn) return;
      btn.click();
      // If we're still at the end and the anchor didn't appear, chain another request
      setTimeout(function(){
        if (trying && isLoadMoreVisible()) requestMore();
      }, 150);
    }
    requestMore();
  }

  function nextNumberFromPopup(){
    var src = $('.poptrox-popup .pic img').attr('src') || '';
    var n = numFromUrl(src);
    if (!isNaN(n)) return n + 1;
    // Fallback: try current highlighted anchor
    var $current = $('.gallery a.image').filter('.active, .current').first();
    var nn = numFromUrl($current.attr('href'));
    return isNaN(nn) ? NaN : nn + 1;
  }
  function prevNumberFromPopup(){
    var src = $('.poptrox-popup .pic img').attr('src') || '';
    var n = numFromUrl(src);
    return isNaN(n) ? NaN : Math.max(1, n - 1);
  }

  // Intercept on-screen nav
  $(document).on('click', '.poptrox-popup .nav-next', function(e){
    e.preventDefault(); e.stopImmediatePropagation();
    var t = nextNumberFromPopup();
    if (!isNaN(t)) openNumber(t);
  });
  $(document).on('click', '.poptrox-popup .nav-previous', function(e){
    e.preventDefault(); e.stopImmediatePropagation();
    var t = prevNumberFromPopup();
    if (!isNaN(t)) openNumber(t);
  });

  // Intercept keyboard arrows while popup is open
  $(document).on('keydown', function(e){
    var hasPopup = document.querySelector('.poptrox-popup') !== null;
    if (!hasPopup) return;
    if (e.key === 'ArrowRight'){
      e.preventDefault(); e.stopImmediatePropagation();
      var t = nextNumberFromPopup();
      if (!isNaN(t)) openNumber(t);
    } else if (e.key === 'ArrowLeft'){
      e.preventDefault(); e.stopImmediatePropagation();
      var t = prevNumberFromPopup();
      if (!isNaN(t)) openNumber(t);
    }
  });
})();
