/**
 * Ancient Manuscript Effects — The Unveiled Word
 * 15 immersive features to make the site feel like a real ancient manuscript
 */

(function() {
  'use strict';

  // ============================================================
  // FEATURE 1: Aging Parchment on Scroll
  // The page gradually darkens and shows wear as you read deeper
  // ============================================================
  function initAgingParchment() {
    const bookPage = document.querySelector('.book-page');
    if (!bookPage) return;

    // Create overlay for aging effects
    const ageOverlay = document.createElement('div');
    ageOverlay.className = 'age-overlay';
    bookPage.style.position = 'relative';
    bookPage.appendChild(ageOverlay);

    // Create coffee ring stains at semi-random positions
    const stainPositions = [
      { top: '15%', left: '8%', size: 120, opacity: 0 },
      { top: '35%', right: '5%', size: 90, opacity: 0 },
      { top: '55%', left: '12%', size: 100, opacity: 0 },
      { top: '75%', right: '10%', size: 80, opacity: 0 },
      { top: '90%', left: '20%', size: 110, opacity: 0 },
    ];

    const stains = stainPositions.map(pos => {
      const stain = document.createElement('div');
      stain.className = 'coffee-stain';
      stain.style.cssText = `
        position: absolute;
        top: ${pos.top};
        ${pos.left ? 'left:' + pos.left : 'right:' + pos.right};
        width: ${pos.size}px;
        height: ${pos.size}px;
        border-radius: 50%;
        background: radial-gradient(ellipse at 40% 40%, 
          transparent 50%, 
          rgba(139, 105, 20, 0.04) 55%, 
          rgba(139, 105, 20, 0.08) 60%, 
          rgba(139, 105, 20, 0.04) 70%, 
          transparent 75%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.8s ease;
        z-index: 1;
        transform: rotate(${Math.random() * 360}deg);
      `;
      bookPage.appendChild(stain);
      return { el: stain, threshold: parseFloat(pos.top) / 100 };
    });

    // Create tattered edge elements
    const tatteredLeft = document.createElement('div');
    tatteredLeft.className = 'tattered-edge tattered-left';
    const tatteredRight = document.createElement('div');
    tatteredRight.className = 'tattered-edge tattered-right';
    bookPage.appendChild(tatteredLeft);
    bookPage.appendChild(tatteredRight);

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollHeight > 0 ? window.scrollY / scrollHeight : 0, 1);

        // Darken the parchment as you scroll
        const darken = progress * 0.08;
        const sepia = progress * 0.15;
        ageOverlay.style.cssText = `
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            180deg,
            transparent ${Math.max(0, (1 - progress) * 30)}%,
            rgba(101, 78, 40, ${darken}) 100%
          );
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
          transition: none;
        `;

        // Reveal stains as you scroll past them
        stains.forEach(s => {
          s.el.style.opacity = progress > s.threshold ? Math.min((progress - s.threshold) * 3, 0.9) : 0;
        });

        // Tattered edges intensify with scroll
        const tatterOpacity = Math.min(progress * 0.6, 0.4);
        tatteredLeft.style.opacity = tatterOpacity;
        tatteredRight.style.opacity = tatterOpacity;

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial state
  }

  // ============================================================
  // FEATURE 2: Ink Bleed-In on Scroll (Intersection Observer)
  // Paragraphs fade in like ink spreading on parchment
  // ============================================================
  function initInkBleed() {
    const studyBody = document.querySelectorAll('.study-body p, .study-body h2, .study-body h3, .study-body blockquote, .study-body ul, .study-body ol, .study-body table');
    if (!studyBody.length) return;

    // Add initial hidden state
    studyBody.forEach(el => {
      el.classList.add('ink-hidden');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ink-visible');
          entry.target.classList.remove('ink-hidden');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    studyBody.forEach(el => observer.observe(el));
  }

  // ============================================================
  // FEATURE 3: Illuminated Drop Caps with Gold Shimmer
  // First letter of .drop-cap gets ornate styling + animation
  // ============================================================
  function initIlluminatedDropCaps() {
    const dropCaps = document.querySelectorAll('.drop-cap');
    if (!dropCaps.length) return;

    dropCaps.forEach(p => {
      // Already handled by CSS — we enhance with shimmer
      p.classList.add('illuminated-drop');
    });
  }

  // ============================================================
  // FEATURE 4: Wax Seal Navigation
  // Study cards and "Continue the Journey" links get wax seals
  // ============================================================
  function initWaxSeals() {
    const studyCards = document.querySelectorAll('.study-grid .study-card a, .continue-journey a');
    if (!studyCards.length) return;

    // Add seal effect to Continue the Journey cards
    document.querySelectorAll('.study-grid .study-card').forEach((card, i) => {
      if (card.querySelector('.wax-seal')) return;
      const seal = document.createElement('div');
      seal.className = 'wax-seal';
      const symbols = ['✝', '☧', '☦', 'Α', 'Ω', '🕊'];
      seal.innerHTML = `<span class="seal-symbol">${symbols[i % symbols.length]}</span>`;
      seal.addEventListener('click', () => {
        seal.classList.add('seal-cracked');
      });
      card.style.position = 'relative';
      card.appendChild(seal);
    });
  }

  // ============================================================
  // FEATURE 5: Parallax Leather Desk
  // Background moves at different rate than content
  // ============================================================
  function initParallaxDesk() {
    const body = document.body;
    // Create desk layer with quill and inkwell
    const deskLayer = document.createElement('div');
    deskLayer.className = 'desk-layer';
    deskLayer.innerHTML = `
      <div class="desk-quill" aria-hidden="true">🪶</div>
      <div class="desk-inkwell" aria-hidden="true">🏺</div>
      <div class="desk-candle" aria-hidden="true">🕯️</div>
    `;
    body.insertBefore(deskLayer, body.firstChild);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scroll = window.scrollY;
        deskLayer.style.transform = `translateY(${scroll * 0.15}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // ============================================================
  // FEATURE 10: Audio Ambience (Scriptorium Sounds)
  // Toggle ambient background sound
  // ============================================================
  function initAmbience() {
    // Don't add on index pages or tool pages
    if (!document.querySelector('.study-article')) return;

    const btn = document.createElement('button');
    btn.className = 'ambience-toggle';
    btn.innerHTML = '🕯️';
    btn.title = 'Toggle scriptorium ambience';
    btn.setAttribute('aria-label', 'Toggle ambient sound');

    let playing = false;
    let audioCtx = null;
    let noiseSource = null;
    let gainNode = null;
    let crackleSrc = null;

    function createFireCrackle() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create brown noise for fire ambience
      const bufferSize = audioCtx.sampleRate * 4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
        // Add crackle pops
        if (Math.random() < 0.001) {
          data[i] += (Math.random() - 0.5) * 0.3;
        }
      }

      noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter to sound like fire
      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 400;

      const highpass = audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 60;

      gainNode = audioCtx.createGain();
      gainNode.gain.value = 0;

      noiseSource.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      noiseSource.start();

      // Fade in
      gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 2);
    }

    btn.addEventListener('click', () => {
      if (!playing) {
        createFireCrackle();
        btn.classList.add('ambience-active');
        btn.innerHTML = '🔥';
        playing = true;
      } else {
        if (gainNode) {
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
          setTimeout(() => {
            if (noiseSource) { noiseSource.stop(); noiseSource = null; }
          }, 1200);
        }
        btn.classList.remove('ambience-active');
        btn.innerHTML = '🕯️';
        playing = false;
      }
    });

    document.body.appendChild(btn);
  }

  // ============================================================
  // FEATURE 13: Scroll-Triggered Margin Notes
  // Handwritten-style annotations appear in the margins
  // ============================================================
  function initMarginNotes() {
    // Only on study pages, skip on mobile
    if (!document.querySelector('.study-article') || window.innerWidth < 1200) return;

    const marginNotes = [
      { selector: '.study-body:first-of-type h2', note: 'nota bene ✦', side: 'left' },
      { selector: '.greek-block:nth-of-type(2)', note: 'vide supra', side: 'right' },
      { selector: '.scripture-quote:nth-of-type(3)', note: 'cave lector ☞', side: 'left' },
      { selector: '.cross-ref-box:first-of-type', note: 'cf. parallela', side: 'right' },
    ];

    marginNotes.forEach(({ selector, note, side }) => {
      const target = document.querySelector(selector);
      if (!target) return;

      const noteEl = document.createElement('div');
      noteEl.className = `margin-note margin-note-${side}`;
      noteEl.innerHTML = `<span class="margin-note-text">${note}</span>`;
      target.style.position = 'relative';
      target.appendChild(noteEl);

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            noteEl.classList.add('margin-note-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(target);
    });
  }

  // ============================================================
  // FEATURE 14: Candle-Lit Reading Mode
  // A warm, dim, flickering reading experience
  // ============================================================
  function initCandleLitMode() {
    if (!document.querySelector('.study-article')) return;

    const btn = document.createElement('button');
    btn.className = 'candle-mode-toggle';
    btn.innerHTML = '🕯️<span class="candle-label">Candlelight</span>';
    btn.title = 'Toggle candlelight reading mode';

    let active = false;

    btn.addEventListener('click', () => {
      active = !active;
      document.body.classList.toggle('candle-mode', active);
      btn.innerHTML = active 
        ? '☀️<span class="candle-label">Daylight</span>' 
        : '🕯️<span class="candle-label">Candlelight</span>';
      
      // Save preference
      try { localStorage.setItem('uvw-candle-mode', active ? '1' : '0'); } catch(e) {}
    });

    // Restore preference
    try {
      if (localStorage.getItem('uvw-candle-mode') === '1') {
        active = true;
        document.body.classList.add('candle-mode');
        btn.innerHTML = '☀️<span class="candle-label">Daylight</span>';
      }
    } catch(e) {}

    document.body.appendChild(btn);
  }

  // ============================================================
  // INIT ALL FEATURES
  // ============================================================
  function initAll() {
    // Only init on study/content pages, not tools or index
    const isStudy = document.querySelector('.study-article');
    const isContent = document.querySelector('.book-page');

    if (isContent) {
      initAgingParchment();
      initParallaxDesk();
    }

    if (isStudy) {
      initInkBleed();
      initIlluminatedDropCaps();
      initWaxSeals();
      initAmbience();
      initMarginNotes();
      initCandleLitMode();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
