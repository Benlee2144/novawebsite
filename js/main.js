/* ============================================================
   THE LIVING WORD — Manuscript Interactive Engine (v2 – Performance)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     MOBILE NAVIGATION
     ============================================================ */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        var spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  /* ============================================================
     FEATURE 1: LEATHER COVER OPENING ANIMATION (homepage only)
     FIXED: Cover always visible, animation only runs once per session
     ============================================================ */
  var bibleCover = document.getElementById('bibleCover');
  if (bibleCover) {
    // ENSURE COVER IS ALWAYS VISIBLE
    bibleCover.style.display = 'flex';
    
    // Only run opening animation if haven't seen it this session
    if (!sessionStorage.getItem('coverOpened')) {
      var overlay = document.createElement('div');
      overlay.className = 'cover-opening';
      overlay.innerHTML =
        '<div class="cover-front">' +
          '<div class="cover-clasp">' +
            '<img class="cover-clasp-icon" src="images/ornaments/celtic-cross.svg" alt="" loading="lazy">' +
            '<div class="cover-clasp-text">The Unveiled Word</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      setTimeout(function () {
        overlay.classList.add('opened');
        document.body.style.overflow = '';
        sessionStorage.setItem('coverOpened', '1');
        // Remove overlay from DOM after animation completes
        setTimeout(function () { overlay.remove(); }, 1000);
      }, 3200);
    }
  }

  /* ============================================================
     FEATURE 2: FLOATING GOLD DUST PARTICLES (homepage only)
     Optimized: reduced count, uses will-change, pauses off-screen
     ============================================================ */
  if (bibleCover) {
    var canvas = document.createElement('canvas');
    canvas.id = 'goldParticles';
    canvas.style.willChange = 'contents';
    bibleCover.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 25; // Reduced from 40
    var animationId;
    var isAnimating = false;

    function resizeCanvas() {
      canvas.width = bibleCover.offsetWidth;
      canvas.height = bibleCover.offsetHeight;
    }
    resizeCanvas();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    });

    var goldColors = [
      'rgba(232, 195, 74, ',
      'rgba(218, 165, 32, ',
      'rgba(197, 150, 12, ',
      'rgba(166, 124, 0, ',
      'rgba(255, 245, 204, ',
    ];

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: Math.random() * -0.4 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        opacityDir: (Math.random() - 0.5) * 0.008,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        angle: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.5 + 0.2,
      });
    }

    function drawParticles() {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.angle += p.twinkleSpeed;
        p.x += p.speedX + Math.sin(p.angle) * p.drift * 0.3;
        p.y += p.speedY;
        p.opacity += p.opacityDir;
        if (p.opacity > 0.6 || p.opacity < 0.05) p.opacityDir *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color + (p.opacity * 0.8) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isAnimating) animationId = requestAnimationFrame(drawParticles);
    }

    // Pause animation when cover is not in viewport for performance
    var coverObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!isAnimating) {
          isAnimating = true;
          drawParticles();
        }
      } else {
        isAnimating = false;
        cancelAnimationFrame(animationId);
      }
    }, { threshold: 0.1 });
    coverObserver.observe(bibleCover);
  }

  /* ============================================================
     FEATURE 3: SILK RIBBON BOOKMARK (study pages only)
     ============================================================ */
  if (document.querySelector('.study-title')) {
    var ribbon = document.createElement('div');
    ribbon.className = 'silk-ribbon';
    ribbon.innerHTML = '<div class="ribbon-tip"></div>';
    document.body.appendChild(ribbon);

    // Position ribbon to start of content
    setTimeout(function () {
      var studyTitle = document.querySelector('.study-title');
      if (studyTitle) {
        var rect = studyTitle.getBoundingClientRect();
        ribbon.style.top = (rect.top + window.pageYOffset - 20) + 'px';
      }
    }, 100);
  }

  /* ============================================================
     FEATURE 4: HOVERING REVELATION VERSE (interlinear only)
     ============================================================ */
  var interlinearWords = document.querySelectorAll('.word-hebrew, .word-greek');
  if (interlinearWords.length > 0) {
    var revealMist = document.createElement('div');
    revealMist.className = 'revelation-mist';
    document.body.appendChild(revealMist);

    var currentMistWord = null;

    interlinearWords.forEach(function (word) {
      word.addEventListener('mouseenter', function () {
        if (currentMistWord === word) return;
        currentMistWord = word;
        var rect = word.getBoundingClientRect();
        revealMist.style.left = (rect.left - 20) + 'px';
        revealMist.style.top = (rect.top + window.pageYOffset - 20) + 'px';
        revealMist.style.width = (rect.width + 40) + 'px';
        revealMist.style.height = (rect.height + 40) + 'px';
        revealMist.classList.add('active');
      });

      word.addEventListener('mouseleave', function () {
        revealMist.classList.remove('active');
        currentMistWord = null;
      });
    });
  }

  /* ============================================================
     FEATURE 5: PARCHMENT SCROLL EFFECT (study pages)
     ============================================================ */
  var studyContent = document.querySelector('.study-content');
  if (studyContent) {
    var scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.innerHTML = '<div class="scroll-unfurled"></div>';
    document.body.appendChild(scrollProgress);

    var progressBar = scrollProgress.querySelector('.scroll-unfurled');

    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (scrolled / maxScroll) * 100;
      progressBar.style.height = Math.min(progress, 100) + '%';

      if (progress > 95) {
        scrollProgress.classList.add('scroll-complete');
      } else {
        scrollProgress.classList.remove('scroll-complete');
      }
    });
  }

  /* ============================================================
     FEATURE 6: STUDY SEARCH + WORD CLOUDS
     ============================================================ */
  if (typeof studySearchData !== 'undefined') {
    var searchInput = document.getElementById('studySearch');
    var studyCards = document.querySelectorAll('.study-card');

    if (searchInput && studyCards.length > 0) {
      searchInput.addEventListener('input', function () {
        var query = this.value.toLowerCase().trim();
        studyCards.forEach(function (card) {
          var searchText = card.dataset.search || '';
          var titleText = card.textContent || '';
          var visible = query === '' ||
            searchText.toLowerCase().includes(query) ||
            titleText.toLowerCase().includes(query);
          card.style.display = visible ? 'block' : 'none';
        });
      });
    }
  }

  /* ============================================================
     HOMEPAGE NAVIGATION FIX
     Ensure cover navigation is always accessible
     ============================================================ */
  
  // Fix for homepage navigation disappearing bug
  if (bibleCover) {
    // Function to ensure cover is visible and functional
    function ensureCoverVisibility() {
      bibleCover.style.display = 'flex';
      bibleCover.style.visibility = 'visible';
      bibleCover.style.opacity = '1';
    }
    
    // Call immediately
    ensureCoverVisibility();
    
    // Call after DOM is fully loaded
    setTimeout(ensureCoverVisibility, 100);
    
    // Call when page becomes visible (handles back navigation)
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        setTimeout(ensureCoverVisibility, 50);
      }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('pageshow', function(event) {
      setTimeout(ensureCoverVisibility, 50);
    });
  }

});
/* Fix: bfcache can leave animated elements invisible after back-navigation */
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    document.querySelectorAll('.study-card, .page-container, .featured-section').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.animation = 'none';
    });
  }
});
