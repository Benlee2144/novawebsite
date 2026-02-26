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
     PARALLAX PARCHMENT TEXTURE — mouse moves the grain subtly
     ============================================================ */
  const bookPage = document.querySelector('.book-page');
  if (bookPage && window.innerWidth > 768) {
    document.addEventListener('mousemove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      bookPage.style.setProperty('--parallax-x', x + 'px');
      bookPage.style.setProperty('--parallax-y', y + 'px');
      
      // Subtle light shift on the parchment
      const lightX = (e.clientX / window.innerWidth) * 100;
      const lightY = (e.clientY / window.innerHeight) * 100;
      bookPage.style.background = 
        'radial-gradient(ellipse at ' + lightX + '% ' + lightY + '%, rgba(255,248,230,0.3) 0%, transparent 50%), ' +
        'var(--vellum)';
    });
  }

  /* ============================================================
     CATEGORY FILTERS (Studies Page)
     ============================================================ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const studyGrid = document.getElementById('studyGrid');

  if (filterButtons.length > 0 && studyGrid) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const cards = studyGrid.querySelectorAll('.study-card');

        cards.forEach(function (card) {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            const category = card.getAttribute('data-category') || '';
            card.style.display = category.includes(filter) ? '' : 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     SEARCH (Studies Page)
     ============================================================ */
  const studySearch = document.getElementById('studySearch');
  if (studySearch && studyGrid) {
    studySearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const cards = studyGrid.querySelectorAll('.study-card');

      cards.forEach(function (card) {
        if (!query) { card.style.display = ''; return; }

        const searchData = (card.getAttribute('data-search') || '').toLowerCase();
        const title = (card.querySelector('.card-title') || {}).textContent || '';
        const excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
        const combined = searchData + ' ' + title.toLowerCase() + ' ' + excerpt.toLowerCase();

        card.style.display = combined.includes(query) ? '' : 'none';
      });
    });
  }

  /* ============================================================
     SEARCH (Word Studies Page)
     ============================================================ */
  const wordSearch = document.getElementById('wordSearch');
  if (wordSearch) {
    wordSearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.word-index-item');
      const letters = document.querySelectorAll('.word-index-letter');

      items.forEach(function (item) {
        if (!query) { item.style.display = ''; return; }
        const searchData = (item.getAttribute('data-search') || '').toLowerCase();
        const translit = (item.querySelector('.wi-translit') || {}).textContent || '';
        const meaning = (item.querySelector('.wi-meaning') || {}).textContent || '';
        const combined = searchData + ' ' + translit.toLowerCase() + ' ' + meaning.toLowerCase();
        item.style.display = combined.includes(query) ? '' : 'none';
      });

      letters.forEach(function (letter) {
        if (!query) { letter.style.display = ''; return; }
        let nextEl = letter.nextElementSibling;
        let hasVisible = false;
        while (nextEl && !nextEl.classList.contains('word-index-letter')) {
          if (nextEl.classList.contains('word-index-list')) {
            const visibleItems = nextEl.querySelectorAll('.word-index-item:not([style*="display: none"])');
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
  const langFilters = document.querySelectorAll('.filter-btn[data-filter="hebrew"], .filter-btn[data-filter="greek"]');
  if (langFilters.length > 0) {
    const allFilterBtns = document.querySelectorAll('.filter-btn');
    const wordSections = document.querySelectorAll('.word-index-section');

    allFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!btn.closest('.filter-bar') || wordSections.length === 0) return;
        allFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        wordSections.forEach(function (section) {
          const lang = section.getAttribute('data-lang');
          section.style.display = (filter === 'all' || lang === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ============================================================
     CROSS-REFERENCE VERSE POPUPS
     ============================================================ */
  const verseRefs = document.querySelectorAll('.verse-ref');
  verseRefs.forEach(function (ref) {
    ref.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });
      let popup = ref.querySelector('.verse-popup');
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
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')
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
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     SCROLL REVEAL — Fade in elements as you scroll past them
     ============================================================ */
  const revealElements = document.querySelectorAll(
    '.hebrew-block, .greek-block, .cross-ref-box, .scripture-quote, blockquote, figure, .timeline, .study-table'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observer = new IntersectionObserver(function (entries) {
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
  const studyBody = document.querySelector('.study-body');
  if (studyBody) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 
      'position: fixed; top: 70px; left: 0; width: 0%; height: 3px; ' +
      'background: linear-gradient(90deg, var(--gold-antique), var(--gold-foil), var(--gold-antique)); ' +
      'z-index: 999; transition: width 0.1s linear; box-shadow: 0 0 6px rgba(197,150,12,0.3);';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
      const rect = studyBody.getBoundingClientRect();
      const total = studyBody.scrollHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / (total - window.innerHeight)) * 100);
      progressBar.style.width = pct + '%';
    });
  }

});
