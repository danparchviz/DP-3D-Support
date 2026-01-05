/* Poptrox nav override — numeric next/prev + auto "Load More" (v1.1) */
(function(){
  if (window.__PoptroxNavOverrideLoaded__) return;
  window.__PoptroxNavOverrideLoaded__ = true;
  try { console.log('[Poptrox override] loaded v1.1'); } catch(e){}

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
      // close current popup (if any), then open desired anchor
      var closer = document.querySelector('.poptrox-popup .closer');
      if (closer) closer.click();
      setTimeout(function(){ $a[0].click(); }, 20);
      return;
    }
    // Not available yet: load more (if possible) and wait until the anchor appears.
    if (!isLoadMoreVisible()) return; // nothing else to load
    var gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // Watch the gallery until the desired anchor shows up
    var trying = true;
    var obs = new MutationObserver(function(){
      if (!trying) return;
      var $b = findAnchorByNum(n);
      if ($b.length){
        trying = false;
        obs.disconnect();
        var closer2 = document.querySelector('.poptrox-popup .closer');
        if (closer2) closer2.click();
        setTimeout(function(){ $b[0].click(); }, 20);
      }
    });
    obs.observe(gallery, { childList: true, subtree: true });

    // Trigger Load More; chain if needed
    function requestMore(){
      var btn = document.getElementById('loadMore');
      if (!btn) return;
      btn.click();
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
    // Fallback: try current anchor
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