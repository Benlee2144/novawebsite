/**
 * Study Narrator — Full audio narration player for study pages
 * Adds a sticky audio player bar at the top of each study
 */
(function() {
  'use strict';

  const PLAYER_HTML = `
    <div id="study-narrator" style="display:none;">
      <div class="narrator-bar">
        <button id="narrator-play" class="narrator-btn" aria-label="Play narration">▶</button>
        <div class="narrator-progress-wrap">
          <div class="narrator-time" id="narrator-current">0:00</div>
          <input type="range" id="narrator-seek" class="narrator-seek" min="0" max="100" value="0" step="0.1">
          <div class="narrator-time" id="narrator-duration">0:00</div>
        </div>
        <div class="narrator-speed">
          <button id="narrator-speed-btn" class="narrator-speed-btn" aria-label="Playback speed">1×</button>
        </div>
        <button id="narrator-back" class="narrator-btn narrator-skip" aria-label="Back 15 seconds">⏪</button>
        <button id="narrator-fwd" class="narrator-btn narrator-skip" aria-label="Forward 15 seconds">⏩</button>
      </div>
    </div>
  `;

  const PLAYER_CSS = `
    #study-narrator {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 2px solid var(--gold, #c59612);
      border-radius: 10px;
      padding: 12px 16px;
      margin: 1.5rem 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .narrator-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: nowrap;
    }
    .narrator-btn {
      background: var(--gold, #c59612);
      border: none;
      color: #1a1a2e;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .narrator-btn:hover {
      transform: scale(1.1);
      background: #d4a717;
    }
    .narrator-skip {
      width: 32px;
      height: 32px;
      font-size: 12px;
      background: rgba(197,150,12,0.3);
      color: var(--gold, #c59612);
    }
    .narrator-skip:hover {
      background: rgba(197,150,12,0.5);
    }
    .narrator-progress-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .narrator-time {
      color: rgba(255,255,255,0.7);
      font-family: monospace;
      font-size: 0.8rem;
      min-width: 40px;
      text-align: center;
      flex-shrink: 0;
    }
    .narrator-seek {
      flex: 1;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255,255,255,0.15);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    }
    .narrator-seek::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--gold, #c59612);
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
    .narrator-seek::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--gold, #c59612);
      cursor: pointer;
      border: none;
    }
    .narrator-speed-btn {
      background: rgba(197,150,12,0.2);
      border: 1px solid rgba(197,150,12,0.4);
      color: var(--gold, #c59612);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      font-family: monospace;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .narrator-speed-btn:hover {
      background: rgba(197,150,12,0.4);
    }
    .narrator-label {
      color: rgba(255,255,255,0.5);
      font-size: 0.7rem;
      text-align: center;
      margin-top: 4px;
      font-family: var(--font-reading, sans-serif);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    @media (max-width: 600px) {
      .narrator-bar { gap: 6px; }
      .narrator-btn { width: 36px; height: 36px; font-size: 14px; }
      .narrator-skip { width: 28px; height: 28px; font-size: 10px; }
      .narrator-time { font-size: 0.7rem; min-width: 32px; }
    }
  `;

  function getBasePath() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    segments.pop(); // remove filename
    return segments.length > 1 ? '../'.repeat(segments.length - 1) : './';
  }

  function getStudySlug() {
    const path = window.location.pathname;
    const match = path.match(/\/studies\/([^/]+)\.html/);
    return match ? match[1] : null;
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  async function init() {
    const slug = getStudySlug();
    if (!slug) return; // Not a study page

    const basePath = getBasePath();

    // Check if audio exists
    try {
      const resp = await fetch(basePath + `audio/studies/${slug}.mp3`, { method: 'HEAD' });
      if (!resp.ok) return;
    } catch(e) {
      return;
    }

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = PLAYER_CSS;
    document.head.appendChild(style);

    // Find insertion point — after study header
    const header = document.querySelector('.study-header') || document.querySelector('.study-title');
    const divider = document.querySelector('hr.divider');
    const insertPoint = divider || (header ? header.nextElementSibling : null);

    if (!insertPoint) return;

    // Create player
    const container = document.createElement('div');
    container.innerHTML = PLAYER_HTML;
    const playerEl = container.firstElementChild;
    insertPoint.parentNode.insertBefore(playerEl, insertPoint.nextSibling);

    // Add label
    const label = document.createElement('div');
    label.className = 'narrator-label';
    label.textContent = '🎧 Listen to this study';
    playerEl.appendChild(label);

    playerEl.style.display = 'block';

    // Audio setup
    const audio = new Audio(basePath + `audio/studies/${slug}.mp3`);
    audio.preload = 'metadata';

    const playBtn = document.getElementById('narrator-play');
    const seekBar = document.getElementById('narrator-seek');
    const currentTime = document.getElementById('narrator-current');
    const durationEl = document.getElementById('narrator-duration');
    const speedBtn = document.getElementById('narrator-speed-btn');
    const backBtn = document.getElementById('narrator-back');
    const fwdBtn = document.getElementById('narrator-fwd');

    let playing = false;
    const speeds = [0.75, 1, 1.25, 1.5, 1.75, 2];
    let speedIdx = 1;

    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
      seekBar.max = audio.duration;
    });

    audio.addEventListener('timeupdate', () => {
      currentTime.textContent = formatTime(audio.currentTime);
      seekBar.value = audio.currentTime;
    });

    audio.addEventListener('ended', () => {
      playing = false;
      playBtn.textContent = '▶';
    });

    playBtn.addEventListener('click', () => {
      if (playing) {
        audio.pause();
        playBtn.textContent = '▶';
      } else {
        audio.play();
        playBtn.textContent = '⏸';
      }
      playing = !playing;
    });

    seekBar.addEventListener('input', () => {
      audio.currentTime = parseFloat(seekBar.value);
    });

    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      audio.playbackRate = speeds[speedIdx];
      speedBtn.textContent = speeds[speedIdx] + '×';
    });

    backBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    });

    fwdBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
    });

    // Save/restore position
    const storageKey = `narrator-${slug}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = parseFloat(saved);
      }, { once: true });
    }

    setInterval(() => {
      if (audio.currentTime > 0) {
        localStorage.setItem(storageKey, audio.currentTime);
      }
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
