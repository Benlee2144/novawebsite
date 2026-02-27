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
     ============================================================ */
  var bibleCover = document.getElementById('bibleCover');
  if (bibleCover && !sessionStorage.getItem('coverOpened')) {
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

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    var coverObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        isAnimating = true;
        drawParticles();
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
  var studyBody = document.querySelector('.study-body');
  var bookPage = document.querySelector('.book-page');
  if (studyBody && bookPage) {
    var ribbon = document.createElement('div');
    ribbon.className = 'ribbon-bookmark';
    ribbon.setAttribute('aria-hidden', 'true');
    ribbon.innerHTML = '<div class="ribbon-body"></div><div class="ribbon-tail"></div>';
    bookPage.appendChild(ribbon);
  }

  /* ============================================================
     PARALLAX PARCHMENT — REMOVED (was causing major lag)
     The mousemove listener was firing on every pixel of movement,
     recalculating and applying a CSS gradient each time.
     Replaced with a static subtle vignette via CSS.
     ============================================================ */

  /* ============================================================
     CATEGORY FILTERS (Studies Page)
     ============================================================ */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var studyGrid = document.getElementById('studyGrid');

  if (filterButtons.length > 0 && studyGrid) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        var cards = studyGrid.querySelectorAll('.study-card');
        cards.forEach(function (card) {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            var category = card.getAttribute('data-category') || '';
            card.style.display = category.includes(filter) ? '' : 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     SEARCH (Studies Page)
     ============================================================ */
  var studySearch = document.getElementById('studySearch');
  if (studySearch && studyGrid) {
    var searchTimer;
    studySearch.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var self = this;
      searchTimer = setTimeout(function () {
        var query = self.value.toLowerCase().trim();
        var cards = studyGrid.querySelectorAll('.study-card');
        cards.forEach(function (card) {
          if (!query) { card.style.display = ''; return; }
          var searchData = (card.getAttribute('data-search') || '').toLowerCase();
          var title = (card.querySelector('.card-title') || {}).textContent || '';
          var excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
          var combined = searchData + ' ' + title.toLowerCase() + ' ' + excerpt.toLowerCase();
          card.style.display = combined.includes(query) ? '' : 'none';
        });
      }, 150);
    });
  }

  /* ============================================================
     SEARCH (Word Studies Page)
     ============================================================ */
  var wordSearch = document.getElementById('wordSearch');
  if (wordSearch) {
    var wordSearchTimer;
    wordSearch.addEventListener('input', function () {
      clearTimeout(wordSearchTimer);
      var self = this;
      wordSearchTimer = setTimeout(function () {
        var query = self.value.toLowerCase().trim();
        var items = document.querySelectorAll('.word-index-item');
        var letters = document.querySelectorAll('.word-index-letter');
        items.forEach(function (item) {
          if (!query) { item.style.display = ''; return; }
          var searchData = (item.getAttribute('data-search') || '').toLowerCase();
          var translit = (item.querySelector('.wi-translit') || {}).textContent || '';
          var meaning = (item.querySelector('.wi-meaning') || {}).textContent || '';
          var combined = searchData + ' ' + translit.toLowerCase() + ' ' + meaning.toLowerCase();
          item.style.display = combined.includes(query) ? '' : 'none';
        });
        letters.forEach(function (letter) {
          if (!query) { letter.style.display = ''; return; }
          var nextEl = letter.nextElementSibling;
          var hasVisible = false;
          while (nextEl && !nextEl.classList.contains('word-index-letter')) {
            if (nextEl.classList.contains('word-index-list')) {
              var visibleItems = nextEl.querySelectorAll('.word-index-item:not([style*="display: none"])');
              if (visibleItems.length > 0) hasVisible = true;
            }
            nextEl = nextEl.nextElementSibling;
          }
          letter.style.display = hasVisible ? '' : 'none';
        });
      }, 150);
    });
  }

  /* ============================================================
     LANGUAGE FILTER (Word Studies Page)
     ============================================================ */
  var langFilters = document.querySelectorAll('.filter-btn[data-filter="hebrew"], .filter-btn[data-filter="greek"]');
  if (langFilters.length > 0) {
    var allFilterBtns = document.querySelectorAll('.filter-btn');
    var wordSections = document.querySelectorAll('.word-index-section');
    allFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!btn.closest('.filter-bar') || wordSections.length === 0) return;
        allFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        wordSections.forEach(function (section) {
          var lang = section.getAttribute('data-lang');
          section.style.display = (filter === 'all' || lang === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ============================================================
     CROSS-REFERENCE VERSE POPUPS
     ============================================================ */
  document.addEventListener('click', function (e) {
    var ref = e.target.closest('.verse-ref');
    if (ref) {
      e.preventDefault();
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });
      var popup = ref.querySelector('.verse-popup');
      if (popup) popup.classList.toggle('active');
    } else {
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });
    }
  });

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    var target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      var headerHeight = document.querySelector('.site-header')
        ? document.querySelector('.site-header').offsetHeight : 0;
      window.scrollTo({
        top: target.offsetTop - headerHeight - 20,
        behavior: 'smooth'
      });
    }
  });

  /* ============================================================
     ACTIVE NAV HIGHLIGHTING
     ============================================================ */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     SCROLL REVEAL — Optimized
     Only on study pages (not interlinear/lexicon which have 100s of elements)
     Uses CSS class toggle instead of inline styles for GPU compositing
     ============================================================ */
  if (studyBody) {
    var revealElements = document.querySelectorAll(
      '.hebrew-block, .greek-block, .cross-ref-box, .scripture-quote, blockquote, figure, .timeline, .study-table'
    );

    // Only attach if reasonable number of elements (study pages, not lexicon)
    if (revealElements.length > 0 && revealElements.length < 200 && 'IntersectionObserver' in window) {
      revealElements.forEach(function (el) {
        el.classList.add('reveal-hidden');
      });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-hidden');
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      revealElements.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ============================================================
     READING PROGRESS BAR (study pages only)
     Throttled with requestAnimationFrame
     ============================================================ */
  if (studyBody) {
    var progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
          progressBar.style.width = pct + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

});
