/**
 * Audio Pronunciation System
 * Adds 🔊 speaker buttons to every Hebrew/Greek word across the entire site.
 * Uses the browser's built-in Web Speech API (free, no API key).
 * 
 * Supports:
 * - Study pages: .greek-block / .hebrew-block with .pronunciation or .transliteration
 * - Interlinear pages: .interlinear-word with .word-translit
 * - Lexicon pages: .lex-word with transliteration in subtitle
 */

(function() {
  'use strict';

  // Don't run if speech synthesis not available
  if (!('speechSynthesis' in window)) return;

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
    /* Speaker button in interlinear words */
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

  function speakText(text, lang) {
    // Cancel any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.65;  // Slow for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to pick a voice matching the language
    const voices = speechSynthesis.getVoices();
    if (lang === 'hebrew') {
      const heVoice = voices.find(v => v.lang.startsWith('he'));
      if (heVoice) utterance.voice = heVoice;
    } else if (lang === 'greek') {
      const elVoice = voices.find(v => v.lang.startsWith('el'));
      if (elVoice) utterance.voice = elVoice;
    }
    
    speechSynthesis.speak(utterance);
    return utterance;
  }

  function createSpeakButton(text, lang) {
    const btn = document.createElement('button');
    btn.className = 'speak-btn';
    btn.innerHTML = '🔊';
    btn.title = 'Hear pronunciation';
    btn.setAttribute('aria-label', 'Play pronunciation of ' + text);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove speaking class from all buttons
      document.querySelectorAll('.speak-btn.speaking').forEach(b => b.classList.remove('speaking'));
      
      btn.classList.add('speaking');
      const utterance = speakText(text, lang);
      utterance.onend = () => btn.classList.remove('speaking');
      utterance.onerror = () => btn.classList.remove('speaking');
    });
    
    return btn;
  }

  function enhanceStudyBlocks() {
    // Study pages: .greek-block and .hebrew-block
    document.querySelectorAll('.greek-block, .hebrew-block').forEach(block => {
      if (block.querySelector('.speak-btn')) return; // Already enhanced
      
      const isGreek = block.classList.contains('greek-block');
      const lang = isGreek ? 'greek' : 'hebrew';
      
      // Get pronunciation text (prefer .pronunciation, fall back to .transliteration)
      const pronEl = block.querySelector('.pronunciation');
      const transEl = block.querySelector('.transliteration');
      const text = (pronEl && pronEl.textContent.trim()) || 
                   (transEl && transEl.textContent.trim()) || '';
      
      if (!text) return;
      
      // Add button next to the original word
      const wordEl = block.querySelector('.original-word');
      if (wordEl) {
        const btn = createSpeakButton(text, lang);
        wordEl.style.display = 'flex';
        wordEl.style.alignItems = 'center';
        wordEl.style.justifyContent = 'center';
        wordEl.style.gap = '6px';
        wordEl.appendChild(btn);
      }
    });
  }

  function enhanceInterlinearWords() {
    // Interlinear pages: .interlinear-word with .word-translit
    document.querySelectorAll('.interlinear-word').forEach(word => {
      if (word.querySelector('.speak-btn')) return;
      
      const translitEl = word.querySelector('.word-translit');
      const originalEl = word.querySelector('.word-original');
      const text = (translitEl && translitEl.textContent.trim()) || '';
      
      if (!text) return;
      
      const isHebrew = originalEl && originalEl.classList.contains('hebrew');
      const lang = isHebrew ? 'hebrew' : 'greek';
      
      const btn = createSpeakButton(text, lang);
      word.appendChild(btn);
    });
  }

  function enhanceLexiconWords() {
    // Lexicon pages: .lex-word with transliteration in subtitle
    const lexWord = document.querySelector('.lex-word');
    if (!lexWord || lexWord.querySelector('.speak-btn')) return;
    
    const isHebrew = lexWord.classList.contains('hebrew');
    const lang = isHebrew ? 'hebrew' : 'greek';
    
    // Get transliteration from subtitle
    const subtitle = document.querySelector('.study-subtitle');
    if (!subtitle) return;
    
    const subtitleText = subtitle.textContent.trim();
    // Subtitle format: "ʼâb — H1"
    const text = subtitleText.split('—')[0].trim();
    
    if (!text) return;
    
    const btn = createSpeakButton(text, lang);
    btn.style.marginLeft = '8px';
    lexWord.parentElement.style.display = 'flex';
    lexWord.parentElement.style.alignItems = 'center';
    lexWord.parentElement.style.justifyContent = 'center';
    lexWord.parentElement.style.gap = '8px';
    lexWord.parentElement.appendChild(btn);
  }

  function enhanceAll() {
    enhanceStudyBlocks();
    enhanceInterlinearWords();
    enhanceLexiconWords();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAll);
  } else {
    enhanceAll();
  }

  // Also run after a short delay to catch dynamically loaded content
  setTimeout(enhanceAll, 1000);

  // Chrome needs voices to load async
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = function() {};
  }

})();
