/* ============================================================
   THE LIVING WORD — $10M Manuscript Interactive Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     MOBILE NAVIGATION
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
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
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  /* ============================================================
     FEATURE 1: LEATHER COVER OPENING ANIMATION
     Only on homepage. Shows a leather cover that swings open.
     Uses sessionStorage so it only plays once per session.
     ============================================================ */
  const bibleCover = document.getElementById('bibleCover');
  if (bibleCover && !sessionStorage.getItem('coverOpened')) {
    // Create the opening cover overlay
    var overlay = document.createElement('div');
    overlay.className = 'cover-opening';
    overlay.innerHTML =
      '<div class="cover-front">' +
        '<div class="cover-clasp">' +
          '<img class="cover-clasp-icon" src="images/ornaments/celtic-cross.svg" alt="">' +
          '<div class="cover-clasp-text">The Living Word</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden';

    // Clean up after animation
    setTimeout(function () {
      overlay.classList.add('opened');
      document.body.style.overflow = '';
      sessionStorage.setItem('coverOpened', '1');
    }, 3200);
  }

  /* ============================================================
     FEATURE 2: FLOATING GOLD DUST PARTICLES
     Canvas-based gold flecks that drift across the cover section.
     Subtle, warm, like candlelight catching gold leaf.
     ============================================================ */
  if (bibleCover) {
    var canvas = document.createElement('canvas');
    canvas.id = 'goldParticles';
    bibleCover.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 40;
    var animationId;

    function resizeCanvas() {
      canvas.width = bibleCover.offsetWidth;
      canvas.height = bibleCover.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gold color palette
    var goldColors = [
      'rgba(232, 195, 74, ',   // bright gold
      'rgba(218, 165, 32, ',   // goldenrod
      'rgba(197, 150, 12, ',   // antique gold
      'rgba(166, 124, 0, ',    // dark gold
      'rgba(255, 245, 204, ',  // pale gold highlight
    ];

    // Create particles
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Update position
        p.angle += p.twinkleSpeed;
        p.x += p.speedX + Math.sin(p.angle) * p.drift * 0.3;
        p.y += p.speedY;

        // Twinkle opacity
        p.opacity += p.opacityDir;
        if (p.opacity > 0.6 || p.opacity < 0.05) {
          p.opacityDir *= -1;
        }

        // Wrap around
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Draw the particle — small glowing dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();

        // Add a glow halo on larger particles
        if (p.size > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (p.opacity * 0.15) + ')';
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    // Only animate when cover is visible
    var coverObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        drawParticles();
      } else {
        cancelAnimationFrame(animationId);
      }
    }, { threshold: 0.1 });
    coverObserver.observe(bibleCover);
  }

  /* ============================================================
     FEATURE 3: SILK RIBBON BOOKMARK
     Injected into book-page on study pages (pages with .study-body)
     ============================================================ */
  var studyBody = document.querySelector('.study-body');
  var bookPage = document.querySelector('.book-page');
  if (studyBody && bookPage) {
    var ribbon = document.createElement('div');
    ribbon.className = 'ribbon-bookmark';
    ribbon.setAttribute('aria-hidden', 'true');
    ribbon.innerHTML =
      '<div class="ribbon-body"></div>' +
      '<div class="ribbon-tail"></div>';
    bookPage.appendChild(ribbon);
  }

  /* ============================================================
     PARALLAX PARCHMENT TEXTURE
     ============================================================ */
  if (bookPage && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      var lightX = (e.clientX / window.innerWidth) * 100;
      var lightY = (e.clientY / window.innerHeight) * 100;
      bookPage.style.background =
        'radial-gradient(ellipse at ' + lightX + '% ' + lightY + '%, rgba(255,248,230,0.3) 0%, transparent 50%), ' +
        '#f0e4c8';
    });
  }

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
    studySearch.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var cards = studyGrid.querySelectorAll('.study-card');
      cards.forEach(function (card) {
        if (!query) { card.style.display = ''; return; }
        var searchData = (card.getAttribute('data-search') || '').toLowerCase();
        var title = (card.querySelector('.card-title') || {}).textContent || '';
        var excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
        var combined = searchData + ' ' + title.toLowerCase() + ' ' + excerpt.toLowerCase();
        card.style.display = combined.includes(query) ? '' : 'none';
      });
    });
  }

  /* ============================================================
     SEARCH (Word Studies Page)
     ============================================================ */
  var wordSearch = document.getElementById('wordSearch');
  if (wordSearch) {
    wordSearch.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
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
  document.querySelectorAll('.verse-ref').forEach(function (ref) {
    ref.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });
      var popup = ref.querySelector('.verse-popup');
      if (popup) popup.classList.toggle('active');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.verse-ref')) {
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });
    }
  });

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
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
     SCROLL REVEAL
     ============================================================ */
  var revealElements = document.querySelectorAll(
    '.hebrew-block, .greek-block, .cross-ref-box, .scripture-quote, blockquote, figure, .timeline, .study-table'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     READING PROGRESS BAR (study pages)
     ============================================================ */
  if (studyBody) {
    var progressBar = document.createElement('div');
    progressBar.style.cssText =
      'position: fixed; top: 70px; left: 0; width: 0%; height: 3px; ' +
      'background: linear-gradient(90deg, #a67c00, #e8c34a, #a67c00); ' +
      'z-index: 999; transition: width 0.1s linear; box-shadow: 0 0 6px rgba(197,150,12,0.3);';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
      var rect = studyBody.getBoundingClientRect();
      var total = studyBody.scrollHeight;
      var scrolled = Math.max(0, -rect.top);
      var pct = Math.min(100, (scrolled / (total - window.innerHeight)) * 100);
      progressBar.style.width = pct + '%';
    });
  }

});
