/* ============================================================
   THE LIVING WORD — Main JavaScript
   Navigation, search, filters, cross-references
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile Navigation Toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');

      // Animate hamburger to X
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

    // Close nav when clicking a link
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


  /* --- Category Filter (Studies Page) --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const studyGrid = document.getElementById('studyGrid');

  if (filterButtons.length > 0 && studyGrid) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const cards = studyGrid.querySelectorAll('.study-card');

        cards.forEach(function (card) {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            const category = card.getAttribute('data-category') || '';
            if (category.includes(filter)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }


  /* --- Search (Studies Page) --- */
  const studySearch = document.getElementById('studySearch');
  if (studySearch && studyGrid) {
    studySearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const cards = studyGrid.querySelectorAll('.study-card');

      cards.forEach(function (card) {
        if (!query) {
          card.style.display = '';
          return;
        }

        const searchData = (card.getAttribute('data-search') || '').toLowerCase();
        const title = (card.querySelector('.card-title') || {}).textContent || '';
        const excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
        const combined = searchData + ' ' + title.toLowerCase() + ' ' + excerpt.toLowerCase();

        card.style.display = combined.includes(query) ? '' : 'none';
      });
    });
  }


  /* --- Search (Word Studies Page) --- */
  const wordSearch = document.getElementById('wordSearch');
  if (wordSearch) {
    wordSearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.word-index-item');
      const letters = document.querySelectorAll('.word-index-letter');

      items.forEach(function (item) {
        if (!query) {
          item.style.display = '';
          return;
        }

        const searchData = (item.getAttribute('data-search') || '').toLowerCase();
        const translit = (item.querySelector('.wi-translit') || {}).textContent || '';
        const meaning = (item.querySelector('.wi-meaning') || {}).textContent || '';
        const combined = searchData + ' ' + translit.toLowerCase() + ' ' + meaning.toLowerCase();

        item.style.display = combined.includes(query) ? '' : 'none';
      });

      // Show/hide letter headers based on whether they have visible items
      letters.forEach(function (letter) {
        if (!query) {
          letter.style.display = '';
          return;
        }

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


  /* --- Language Filter (Word Studies Page) --- */
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
          if (filter === 'all' || lang === filter) {
            section.style.display = '';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }


  /* --- Cross-Reference Verse Popups --- */
  const verseRefs = document.querySelectorAll('.verse-ref');
  verseRefs.forEach(function (ref) {
    ref.addEventListener('click', function (e) {
      e.preventDefault();

      // Close any open popups
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });

      // Check if this ref already has a popup
      let popup = ref.querySelector('.verse-popup');
      if (popup) {
        popup.classList.toggle('active');
      }
    });
  });

  // Close popups when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.verse-ref')) {
      document.querySelectorAll('.verse-popup.active').forEach(function (popup) {
        popup.classList.remove('active');
      });
    }
  });


  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')
          ? document.querySelector('.site-header').offsetHeight
          : 0;

        window.scrollTo({
          top: target.offsetTop - headerHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });


  /* --- Active Nav Link Highlighting --- */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });

});
