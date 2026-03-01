/**
 * Background Music Player — Ambient worship music while reading
 * Persists volume/mute state. Works alongside study narrator.
 */
(function() {
  'use strict';

  function getBasePath() {
    // Find our own script tag and derive base from its src
    const scripts = document.querySelectorAll('script[src*="bg-music"]');
    if (scripts.length > 0) {
      const src = scripts[0].getAttribute('src');
      // src is like "../js/bg-music.js" or "./js/bg-music.js"
      return src.replace('js/bg-music.js', '');
    }
    // Fallback
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    segments.pop();
    return segments.length > 1 ? '../'.repeat(segments.length - 1) : './';
  }

  // Check if mobile device (do this outside init for template use)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  function init() {
    const basePath = getBasePath();
    // Use smaller file for mobile devices
    const audioFile = isMobile ? 'bg-music-mobile.mp3' : 'bg-music.mp3';
    const audioSrc = basePath + 'audio/' + audioFile;
    console.log('🎵 Loading audio:', audioFile, 'for', isMobile ? 'mobile' : 'desktop');

    // Create audio element with mobile-optimized settings
    const audio = document.createElement('audio');
    audio.id = 'bg-music-audio';
    audio.loop = true;
    audio.preload = isMobile ? 'metadata' : 'auto'; // Less aggressive on mobile
    if (isIOS) {
      audio.playsInline = true;
      audio.setAttribute('playsinline', 'true');
    }
    
    // For mobile, set src directly (avoid source elements on iOS)
    if (isMobile) {
      audio.src = audioSrc;
    } else {
      const source = document.createElement('source');
      source.src = audioSrc;
      source.type = 'audio/mpeg';
      audio.appendChild(source);
    }
    document.body.appendChild(audio);
    
    // Restore saved state
    const savedVol = localStorage.getItem('bgMusicVol');
    const savedMute = localStorage.getItem('bgMusicMute');
    audio.volume = savedVol ? parseFloat(savedVol) : 0.15;
    let muted = savedMute === 'true';
    
    // Status updates visible in panel
    function setStatus(msg) {
      const el = document.getElementById('bgm-status');
      if (el) el.textContent = msg;
    }
    audio.addEventListener('error', () => {
      const err = audio.error;
      let errMsg = 'unknown error';
      if (err) {
        // Decode specific error codes for debugging
        const errorCodes = {
          1: 'MEDIA_ERR_ABORTED - playback aborted',
          2: 'MEDIA_ERR_NETWORK - network error during load', 
          3: 'MEDIA_ERR_DECODE - error decoding audio',
          4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - audio format not supported'
        };
        errMsg = errorCodes[err.code] || `Error code ${err.code}`;
      }
      setStatus('Error: ' + errMsg);
      console.error('🎵 Audio error:', errMsg, 'readyState:', audio.readyState, 'src:', audio.src);
    });
    audio.addEventListener('canplay', () => setStatus('Ready'));
    audio.addEventListener('playing', () => setStatus('Playing ♪'));
    audio.addEventListener('waiting', () => setStatus('Loading...'));
    audio.addEventListener('loadstart', () => setStatus('Loading audio...'));
    
    // iOS-specific debugging
    if (isIOS) {
      audio.addEventListener('stalled', () => setStatus('Network stalled'));
      audio.addEventListener('suspend', () => setStatus('Loading suspended'));
      console.log('🎵 iOS device detected, using mobile-optimized settings');
    }

    // Create floating music button
    const container = document.createElement('div');
    container.id = 'bg-music-widget';
    container.innerHTML = `
      <button id="bg-music-toggle" title="Background Music">🎵</button>
      <div id="bg-music-panel">
        <div class="bgm-header">
          <span>🎵 Worship Music</span>
          <button id="bgm-close">✕</button>
        </div>
        <div class="bgm-controls">
          <button id="bgm-play" class="bgm-play-btn">▶</button>
          <div class="bgm-vol-wrap">
            <span id="bgm-vol-icon">🔊</span>
            <input type="range" id="bgm-volume" min="0" max="100" value="${Math.round(audio.volume * 100)}" class="bgm-slider">
          </div>
        </div>
        <p class="bgm-note">Plays alongside study narration</p>
        <p id="bgm-status" class="bgm-note" style="color:#c59612;"></p>
        ${isMobile ? '<p class="bgm-note" style="color:#ff9800;">📱 Mobile: May require multiple taps</p>' : ''}
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #bg-music-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9990;
        font-family: var(--font-reading, sans-serif);
      }
      #bg-music-toggle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 2px solid var(--gold, #c59612);
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #bg-music-toggle:hover { transform: scale(1.1); }
      #bg-music-toggle.playing {
        animation: pulse-music 2s infinite;
        border-color: #28a745;
      }
      @keyframes pulse-music {
        0%, 100% { box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        50% { box-shadow: 0 4px 20px rgba(197,150,12,0.4); }
      }
      #bg-music-panel {
        display: none;
        position: absolute;
        bottom: 56px;
        right: 0;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid var(--gold, #c59612);
        border-radius: 12px;
        padding: 0;
        min-width: 220px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        overflow: hidden;
      }
      #bg-music-panel.open { display: block; }
      .bgm-header {
        background: linear-gradient(135deg, var(--gold, #c59612), #d4a717);
        color: #1a1a2e;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        font-size: 0.85rem;
      }
      #bgm-close {
        background: none;
        border: none;
        color: #1a1a2e;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
      }
      .bgm-controls {
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .bgm-play-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: var(--gold, #c59612);
        color: #1a1a2e;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.2s;
      }
      .bgm-play-btn:hover { transform: scale(1.1); }
      .bgm-vol-wrap {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
      }
      #bgm-vol-icon {
        font-size: 14px;
        cursor: pointer;
        flex-shrink: 0;
      }
      .bgm-slider {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255,255,255,0.15);
        border-radius: 2px;
        outline: none;
      }
      .bgm-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--gold, #c59612);
        cursor: pointer;
      }
      .bgm-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--gold, #c59612);
        border: none;
        cursor: pointer;
      }
      .bgm-note {
        color: rgba(255,255,255,0.4);
        font-size: 0.7rem;
        text-align: center;
        padding: 0 12px 10px;
        margin: 0;
      }
      @media (max-width: 600px) {
        #bg-music-widget { bottom: 12px; right: 12px; }
        #bg-music-toggle { width: 42px; height: 42px; font-size: 18px; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(container);

    const toggleBtn = document.getElementById('bg-music-toggle');
    const panel = document.getElementById('bg-music-panel');
    const playBtn = document.getElementById('bgm-play');
    const volSlider = document.getElementById('bgm-volume');
    const volIcon = document.getElementById('bgm-vol-icon');
    const closeBtn = document.getElementById('bgm-close');

    let playing = false;

    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
    });

    playBtn.addEventListener('click', async () => {
      if (playing) {
        audio.pause();
        playBtn.textContent = '▶';
        toggleBtn.classList.remove('playing');
        playing = false;
      } else {
        // Set volume first
        audio.volume = muted ? 0 : parseFloat(volSlider.value) / 100;
        
        // Enhanced mobile play handling
        try {
          // For iOS, ensure audio is ready
          if (isIOS && audio.readyState < 2) {
            setStatus('Loading audio...');
            await new Promise((resolve) => {
              const canPlayHandler = () => {
                audio.removeEventListener('canplay', canPlayHandler);
                audio.removeEventListener('loadeddata', canPlayHandler);
                resolve();
              };
              audio.addEventListener('canplay', canPlayHandler);
              audio.addEventListener('loadeddata', canPlayHandler);
              audio.load();
              
              // Timeout after 15 seconds
              setTimeout(() => {
                audio.removeEventListener('canplay', canPlayHandler);
                audio.removeEventListener('loadeddata', canPlayHandler);
                resolve();
              }, 15000);
            });
          }
          
          // Try to play with retries for mobile
          const maxRetries = isMobile ? 3 : 1;
          let success = false;
          
          for (let attempt = 1; attempt <= maxRetries && !success; attempt++) {
            try {
              setStatus(attempt > 1 ? `Retry ${attempt}...` : 'Starting...');
              await audio.play();
              success = true;
              console.log(`🎵 BG Music playing (attempt ${attempt})`);
              playBtn.textContent = '⏸';
              toggleBtn.classList.add('playing');
              playing = true;
            } catch (playErr) {
              console.warn(`🎵 Play attempt ${attempt} failed:`, playErr.message);
              if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500));
                audio.load();
              } else {
                setStatus('Playback failed on this device');
                console.error('🎵 All play attempts failed');
              }
            }
          }
        } catch (err) {
          console.error('🎵 Play setup failed:', err);
          setStatus('Error: ' + err.message);
        }
      }
    });

    volSlider.addEventListener('input', () => {
      const vol = parseInt(volSlider.value) / 100;
      audio.volume = vol;
      muted = false;
      localStorage.setItem('bgMusicVol', vol);
      localStorage.setItem('bgMusicMute', 'false');
      updateVolIcon(vol);
    });

    volIcon.addEventListener('click', () => {
      muted = !muted;
      audio.volume = muted ? 0 : parseFloat(volSlider.value) / 100;
      localStorage.setItem('bgMusicMute', muted);
      updateVolIcon(muted ? 0 : audio.volume);
    });

    function updateVolIcon(vol) {
      volIcon.textContent = vol === 0 ? '🔇' : vol < 0.3 ? '🔈' : vol < 0.7 ? '🔉' : '🔊';
    }

    // Close panel on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
