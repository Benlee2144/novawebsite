/**
 * Audio Pronunciation System — Natural Neural Voice Edition
 * 
 * Priority order:
 * 1. Pre-generated Microsoft Neural TTS (sounds human) — 900+ words
 * 2. Google Translate TTS (clear, natural) — fallback for all other words
 * 3. Browser Speech API — last resort
 */

(function() {
  'use strict';

  let audioIndex = null;
  let indexLoaded = false;

  const BUTTON_STYLE = `
    .speak-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border: 1px solid rgba(197,150,12,0.4);
      border-radius: 50%;
      background: rgba(197,150,12,0.08);
      color: #c59612;
      cursor: pointer;
      font-size: 14px;
      margin-left: 4px;
      padding: 0;
      vertical-align: middle;
      transition: all 0.2s ease;
      line-height: 1;
      flex-shrink: 0;
    }
    .speak-btn:hover {
      background: #c59612;
      color: white;
      transform: scale(1.15);
    }
    .speak-btn.speaking {
      background: #c59612;
      color: white;
      animation: pulse-speak 0.8s infinite;
    }
    @keyframes pulse-speak {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    .interlinear-word .speak-btn {
      width: 20px;
      height: 20px;
      font-size: 11px;
      margin: 2px auto 0;
    }
  `;

  const style = document.createElement('style');
  style.textContent = BUTTON_STYLE;
  document.head.appendChild(style);

  // Determine base path for audio files
  function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    // /novawebsite/studies/foo.html → depth 2 → ../
    // /novawebsite/index.html → depth 1 → ./
    // Handle GitHub Pages path
    const segments = path.split('/').filter(Boolean);
    // Remove filename
    segments.pop();
    // Remove 'novawebsite' base if present
    const base = segments.length > 1 ? '../'.repeat(segments.length - 1) : './';
    return base;
  }

  // Load pre-generated audio index
  async function loadAudioIndex() {
    try {
      const basePath = getBasePath();
      const resp = await fetch(basePath + 'audio/index.json');
      if (resp.ok) {
        audioIndex = await resp.json();
        indexLoaded = true;
        console.log(`🔊 Loaded audio index: ${Object.keys(audioIndex.hebrew || {}).length} Hebrew + ${Object.keys(audioIndex.greek || {}).length} Greek pre-generated voices`);
      }
    } catch(e) {
      console.log('🔊 No pre-generated audio index, using Google TTS');
      indexLoaded = true;
    }
  }

  let audioEl = null;
  function getAudio() {
    if (!audioEl) { audioEl = new Audio(); audioEl.volume = 1.0; }
    return audioEl;
  }

  function speakText(text, lang, btn) {
    if (!text) return;
    
    const audio = getAudio();
    audio.pause();
    audio.currentTime = 0;
    
    document.querySelectorAll('.speak-btn.speaking').forEach(b => b.classList.remove('speaking'));
    if (btn) btn.classList.add('speaking');
    
    const onEnd = () => { if (btn) btn.classList.remove('speaking'); };
    
    // 1. Try pre-generated neural audio first
    if (audioIndex && audioIndex[lang] && audioIndex[lang][text]) {
      const basePath = getBasePath();
      audio.src = basePath + audioIndex[lang][text];
      audio.playbackRate = 1.0;
      audio.onended = onEnd;
      audio.onerror = () => speakGoogleTTS(text, lang, btn);
      audio.play().catch(() => speakGoogleTTS(text, lang, btn));
      return;
    }
    
    // 2. Fall back to Google Translate TTS
    speakGoogleTTS(text, lang, btn);
  }

  function speakGoogleTTS(text, lang, btn) {
    const langCode = lang === 'hebrew' ? 'iw' : lang === 'greek' ? 'el' : 'en';
    const cleanText = text.replace(/[\/\-]/g, ' ').trim();
    if (!cleanText) return;
    
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(cleanText)}`;
    
    const audio = getAudio();
    document.querySelectorAll('.speak-btn.speaking').forEach(b => b.classList.remove('speaking'));
    if (btn) btn.classList.add('speaking');
    
    audio.src = ttsUrl;
    audio.playbackRate = 0.85;
    audio.onended = () => { if (btn) btn.classList.remove('speaking'); };
    audio.onerror = () => {
      if (btn) btn.classList.remove('speaking');
      fallbackBrowserSpeak(cleanText, lang, btn);
    };
    audio.play().catch(() => fallbackBrowserSpeak(cleanText, lang, btn));
  }

  function fallbackBrowserSpeak(text, lang, btn) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.65;
    const voices = speechSynthesis.getVoices();
    const code = lang === 'hebrew' ? 'he' : 'el';
    const v = voices.find(v => v.lang.startsWith(code));
    if (v) u.voice = v;
    if (btn) btn.classList.add('speaking');
    u.onend = () => { if (btn) btn.classList.remove('speaking'); };
    u.onerror = () => { if (btn) btn.classList.remove('speaking'); };
    speechSynthesis.speak(u);
  }

  function createSpeakButton(text, lang) {
    const btn = document.createElement('button');
    btn.className = 'speak-btn';
    btn.innerHTML = '🔊';
    btn.title = 'Hear pronunciation';
    btn.setAttribute('aria-label', 'Play pronunciation');
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      speakText(text, lang, btn);
    });
    return btn;
  }

  function enhanceStudyBlocks() {
    document.querySelectorAll('.greek-block, .hebrew-block').forEach(block => {
      if (block.querySelector('.speak-btn')) return;
      const lang = block.classList.contains('greek-block') ? 'greek' : 'hebrew';
      const origEl = block.querySelector('.original-word');
      const originalText = origEl ? origEl.textContent.trim() : '';
      if (!originalText) return;
      
      if (origEl) {
        const btn = createSpeakButton(originalText, lang);
        origEl.style.display = 'flex';
        origEl.style.alignItems = 'center';
        origEl.style.justifyContent = 'center';
        origEl.style.gap = '6px';
        origEl.appendChild(btn);
      }
    });
  }

  function enhanceInterlinearWords() {
    document.querySelectorAll('.interlinear-word').forEach(word => {
      if (word.querySelector('.speak-btn')) return;
      const originalEl = word.querySelector('.word-original');
      const originalText = originalEl ? originalEl.textContent.trim() : '';
      if (!originalText) return;
      const isHebrew = originalEl && originalEl.classList.contains('hebrew');
      const btn = createSpeakButton(originalText, isHebrew ? 'hebrew' : 'greek');
      word.appendChild(btn);
    });
  }

  function enhanceLexiconWords() {
    const lexWord = document.querySelector('.lex-word');
    if (!lexWord || lexWord.querySelector('.speak-btn')) return;
    const isHebrew = lexWord.classList.contains('hebrew');
    const originalText = lexWord.textContent.trim();
    if (!originalText) return;
    
    const btn = createSpeakButton(originalText, isHebrew ? 'hebrew' : 'greek');
    btn.style.marginLeft = '8px';
    const parent = lexWord.parentElement;
    parent.style.display = 'flex';
    parent.style.alignItems = 'center';
    parent.style.justifyContent = 'center';
    parent.style.gap = '8px';
    parent.appendChild(btn);
  }

  function enhanceAll() {
    enhanceStudyBlocks();
    enhanceInterlinearWords();
    enhanceLexiconWords();
  }

  async function init() {
    await loadAudioIndex();
    enhanceAll();
    setTimeout(enhanceAll, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
