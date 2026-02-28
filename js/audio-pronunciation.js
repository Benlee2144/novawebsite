/**
 * Audio Pronunciation System — Clear Voice Edition
 * Uses Google Translate TTS for natural, clear pronunciation.
 * Falls back to browser Speech API if Google is unavailable.
 * 
 * Adds 🔊 buttons to:
 * - Study pages: .greek-block / .hebrew-block
 * - Interlinear pages: .interlinear-word
 * - Lexicon pages: .lex-word
 */

(function() {
  'use strict';

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

  // Inject styles
  const style = document.createElement('style');
  style.textContent = BUTTON_STYLE;
  document.head.appendChild(style);

  // Audio player (reuse one element)
  let audioEl = null;
  function getAudio() {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.volume = 1.0;
    }
    return audioEl;
  }

  /**
   * Speak text using Google Translate TTS (clear, natural voice).
   * Falls back to browser SpeechSynthesis if blocked.
   */
  function speakText(text, lang, btn) {
    if (!text) return;

    // Google Translate language codes
    const langCode = lang === 'hebrew' ? 'iw' : lang === 'greek' ? 'el' : 'en';
    
    // Clean text for TTS
    const cleanText = text
      .replace(/[\/\-]/g, ' ')      // Replace slashes/hyphens with spaces
      .replace(/[^\w\s\u0370-\u03FF\u0590-\u05FF]/g, '') // Keep letters + Hebrew/Greek
      .trim();
    
    if (!cleanText) return;

    // Try Google Translate TTS first (much better voice quality)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(cleanText)}`;
    
    const audio = getAudio();
    
    // Stop any currently playing audio
    audio.pause();
    audio.currentTime = 0;
    
    // Mark button as speaking
    document.querySelectorAll('.speak-btn.speaking').forEach(b => b.classList.remove('speaking'));
    if (btn) btn.classList.add('speaking');
    
    audio.src = ttsUrl;
    audio.playbackRate = 0.85; // Slightly slower for clarity
    
    audio.onended = () => { if (btn) btn.classList.remove('speaking'); };
    audio.onerror = () => {
      // Fallback to browser speech synthesis
      if (btn) btn.classList.remove('speaking');
      fallbackSpeak(cleanText, lang, btn);
    };
    
    audio.play().catch(() => {
      // If autoplay blocked, fall back
      fallbackSpeak(cleanText, lang, btn);
    });
  }

  /**
   * Fallback: Browser's built-in SpeechSynthesis
   */
  function fallbackSpeak(text, lang, btn) {
    if (!('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.65;
    utterance.pitch = 1.0;
    
    const voices = speechSynthesis.getVoices();
    if (lang === 'hebrew') {
      const v = voices.find(v => v.lang.startsWith('he'));
      if (v) utterance.voice = v;
    } else if (lang === 'greek') {
      const v = voices.find(v => v.lang.startsWith('el'));
      if (v) utterance.voice = v;
    }
    
    if (btn) btn.classList.add('speaking');
    utterance.onend = () => { if (btn) btn.classList.remove('speaking'); };
    utterance.onerror = () => { if (btn) btn.classList.remove('speaking'); };
    speechSynthesis.speak(utterance);
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
      const pronEl = block.querySelector('.pronunciation');
      const transEl = block.querySelector('.transliteration');
      const origEl = block.querySelector('.original-word');
      
      // Use original word for Google TTS (it knows Hebrew/Greek), 
      // pronunciation text as fallback
      const originalText = origEl ? origEl.textContent.trim() : '';
      const pronText = (pronEl && pronEl.textContent.trim()) || 
                       (transEl && transEl.textContent.trim()) || originalText;
      
      if (!pronText) return;
      
      // For Google TTS, send the original script (βαπτίζω not "baptizo")
      // It pronounces original scripts much better
      const speakOriginal = originalText || pronText;
      
      if (origEl) {
        const btn = createSpeakButton(speakOriginal, lang);
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
      const translitEl = word.querySelector('.word-translit');
      
      // Use original script for Google TTS
      const originalText = originalEl ? originalEl.textContent.trim() : '';
      const translitText = translitEl ? translitEl.textContent.trim() : '';
      const speakText = originalText || translitText;
      
      if (!speakText) return;
      
      const isHebrew = originalEl && originalEl.classList.contains('hebrew');
      const lang = isHebrew ? 'hebrew' : 'greek';
      
      const btn = createSpeakButton(speakText, lang);
      word.appendChild(btn);
    });
  }

  function enhanceLexiconWords() {
    const lexWord = document.querySelector('.lex-word');
    if (!lexWord || lexWord.querySelector('.speak-btn')) return;
    
    const isHebrew = lexWord.classList.contains('hebrew');
    const lang = isHebrew ? 'hebrew' : 'greek';
    
    // Use the original word for Google TTS
    const originalText = lexWord.textContent.trim();
    if (!originalText) return;
    
    const btn = createSpeakButton(originalText, lang);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAll);
  } else {
    enhanceAll();
  }
  
  setTimeout(enhanceAll, 1000);
})();
