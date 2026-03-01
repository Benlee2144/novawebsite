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
  // FEATURE 9: 3D Rotating Codex (Homepage/Index)
  // ============================================================
  function initRotatingCodex() {
    const target = document.querySelector('.book-cover, .cover-section, .hero-section, .studies-hero, .studies-header');
    if (!target || document.querySelector('.codex-3d')) return;

    const codex = document.createElement('div');
    codex.className = 'codex-3d';
    codex.setAttribute('aria-hidden', 'true');
    codex.innerHTML = `
      <div class="codex-scene">
        <div class="codex-book">
          <div class="codex-face codex-front">
            <div class="codex-emboss">✝</div>
            <div class="codex-title-emboss">The Unveiled Word</div>
            <div class="codex-border-detail"></div>
          </div>
          <div class="codex-face codex-back"></div>
          <div class="codex-face codex-spine">
            <div class="codex-spine-bands"></div>
          </div>
          <div class="codex-face codex-top"></div>
          <div class="codex-face codex-bottom"></div>
          <div class="codex-face codex-pages-edge"></div>
        </div>
      </div>
    `;
    target.appendChild(codex);
  }

  // ============================================================
  // FEATURE 11: Verse Constellation Map
  // Built as a standalone tool — see tools/verse-constellations.html
  // Init adds a subtle star-field background to study pages
  // ============================================================
  function initStarField() {
    if (!document.querySelector('.study-article') || window.innerWidth < 768) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'star-field-bg';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = [];
    const NUM_STARS = 60;

    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.03 + 0.01,
        speed: Math.random() * 0.0005 + 0.0002,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Draw cross-reference lines between nearby stars
    function drawConnections() {
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.015;
            ctx.strokeStyle = `rgba(197, 150, 12, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      stars.forEach(s => {
        const twinkle = Math.sin(frame * s.speed * 60 + s.phase) * 0.5 + 0.5;
        const alpha = s.a * (0.5 + twinkle * 0.5);
        ctx.fillStyle = `rgba(197, 150, 12, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // ============================================================
  // FEATURE 12: Hebrew Letter Particle Effects
  // Hover shows proto-Sinaitic ancestor forms briefly
  // ============================================================
  function initHebrewParticles() {
    const hebrewWords = document.querySelectorAll('.hebrew-block .original-word');
    if (!hebrewWords.length) return;

    const protoMap = {
      'א': '𐤀', 'ב': '𐤁', 'ג': '𐤂', 'ד': '𐤃', 'ה': '𐤄',
      'ו': '𐤅', 'ז': '𐤆', 'ח': '𐤇', 'ט': '𐤈', 'י': '𐤉',
      'כ': '𐤊', 'ך': '𐤊', 'ל': '𐤋', 'מ': '𐤌', 'ם': '𐤌',
      'נ': '𐤍', 'ן': '𐤍', 'ס': '𐤎', 'ע': '𐤏', 'פ': '𐤐',
      'ף': '𐤐', 'צ': '𐤑', 'ץ': '𐤑', 'ק': '𐤒', 'ר': '𐤓',
      'ש': '𐤔', 'ת': '𐤕'
    };

    hebrewWords.forEach(el => {
      el.style.cursor = 'pointer';
      el.title = 'Hover to see proto-Sinaitic form';
      
      el.addEventListener('mouseenter', function() {
        if (this.dataset.animating) return;
        this.dataset.animating = 'true';
        const original = this.textContent;

        // Convert to proto-Sinaitic
        let proto = '';
        for (const ch of original) {
          const base = ch.replace(/[\u0591-\u05C7\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g, '');
          proto += protoMap[base] || ch;
        }

        this.classList.add('hebrew-morphing');
        this.textContent = proto;

        // Create floating particles of the original letters
        const rect = this.getBoundingClientRect();
        for (const ch of original.replace(/[\u0591-\u05C7\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\s]/g, '')) {
          const particle = document.createElement('span');
          particle.className = 'hebrew-particle';
          particle.textContent = ch;
          particle.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            font-size: ${14 + Math.random() * 10}px;
            color: var(--gold-leaf);
            pointer-events: none;
            z-index: 10000;
            opacity: 0.8;
          `;
          document.body.appendChild(particle);
          
          const dx = (Math.random() - 0.5) * 80;
          const dy = -30 - Math.random() * 60;
          particle.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 0.8 },
            { transform: `translate(${dx}px, ${dy}px) rotate(${(Math.random()-0.5)*90}deg)`, opacity: 0 }
          ], { duration: 1000 + Math.random() * 500, easing: 'ease-out' }).onfinish = () => particle.remove();
        }

        setTimeout(() => {
          this.textContent = original;
          this.classList.remove('hebrew-morphing');
          delete this.dataset.animating;
        }, 1200);
      });
    });
  }

  // ============================================================
  // FEATURE 15: DNA of a Word (Word Family Tree)
  // Shows related words branching from root on Greek/Hebrew blocks
  // ============================================================
  function initWordDNA() {
    // Add expandable root-word indicators to word blocks
    const wordBlocks = document.querySelectorAll('.greek-block, .hebrew-block');
    if (!wordBlocks.length) return;

    wordBlocks.forEach(block => {
      const defEl = block.querySelector('.word-definition');
      if (!defEl) return;
      
      // Look for "From X + Y" patterns in the definition
      const text = defEl.textContent;
      const fromMatch = text.match(/From\s+(\w+)\s+\(([^)]+)\)/i);
      if (!fromMatch) return;

      const rootIndicator = document.createElement('div');
      rootIndicator.className = 'word-dna-root';
      rootIndicator.innerHTML = `
        <span class="dna-icon">🧬</span>
        <span class="dna-label">Word Root: <em>${fromMatch[1]}</em> — ${fromMatch[2]}</span>
      `;
      rootIndicator.style.cssText = `
        margin-top: 8px;
        padding: 6px 10px;
        background: rgba(197, 150, 12, 0.05);
        border-left: 2px solid rgba(197, 150, 12, 0.2);
        border-radius: 0 4px 4px 0;
        font-size: 0.8rem;
        color: var(--ink-faded);
        cursor: default;
        opacity: 0.7;
        transition: opacity 0.3s;
      `;
      rootIndicator.addEventListener('mouseenter', () => rootIndicator.style.opacity = '1');
      rootIndicator.addEventListener('mouseleave', () => rootIndicator.style.opacity = '0.7');
      
      block.appendChild(rootIndicator);
    });
  }

  // ============================================================
  // INIT ALL FEATURES
  // ============================================================
  function initAll() {
    const isStudy = document.querySelector('.study-article');
    const isContent = document.querySelector('.book-page');
    const isHome = document.querySelector('.book-cover');
    const isIndex = document.querySelector('.studies-header');

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
      initStarField();
      initHebrewParticles();
      initWordDNA();
    }

    if (isHome || isIndex) {
      initRotatingCodex();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
