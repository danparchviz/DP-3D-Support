/* Smooth-scrolling for in-page anchors (excludes filter buttons and #loadMore) */
(function () {
  var DURATION = 1200;   // ms (increase for slower scroll, e.g., 1600–2000)
  var OFFSET   = 0;      // px (set to fixed header height if needed)

  // Disable CSS smooth so our timing is consistent
  try { document.documentElement.style.scrollBehavior = 'auto'; } catch (e) {}

  function easeInOutCubic(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
  function smoothTo(targetY, duration, done){
    var startY = window.pageYOffset;
    var startT = null;
    function step(ts){
      if (!startT) startT = ts;
      var p = Math.min((ts - startT) / duration, 1);
      var y = startY + (targetY - startY) * easeInOutCubic(p);
      window.scrollTo(0, y);
      if (p < 1) requestAnimationFrame(step); else if (done) done();
    }
    requestAnimationFrame(step);
  }

  // Capture-phase so we preempt default instant jump
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href || href === '#' || href === '#0') return;

    // Never intercept filter buttons or Load More button
    if (a.id === 'loadMore' || 
        href === '#loadMore' || 
        a.classList.contains('filter-btn') ||
        a.closest('.filter-controls')) {
      return;
    }

    var id = href.slice(1);
    var el = document.getElementById(id);
    if (!el) return;

    // Do our smooth scroll instead of the instant jump
    e.preventDefault();
    var target = el.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    smoothTo(target, DURATION, function(){ 
      try { 
        history.replaceState(null, '', '#' + id); 
      } catch (e) {} 
    });
  }, true);
})();