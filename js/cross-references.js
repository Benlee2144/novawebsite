/**
 * Cross-Reference System — 334,992 cross-references from Treasury of Scripture Knowledge
 * Loads per-book data lazily. Shows related verses for any verse on interlinear pages.
 */
(function() {
  'use strict';

  const OSIS_BOOKS = {
    'gen':'Gen','exo':'Exod','lev':'Lev','num':'Num','deu':'Deut',
    'jos':'Josh','jdg':'Judg','rut':'Ruth','1sa':'1Sam','2sa':'2Sam',
    '1ki':'1Kgs','2ki':'2Kgs','1ch':'1Chr','2ch':'2Chr','ezr':'Ezra',
    'neh':'Neh','est':'Esth','job':'Job','psa':'Ps','pro':'Prov',
    'ecc':'Eccl','sng':'Song','isa':'Isa','jer':'Jer','lam':'Lam',
    'ezk':'Ezek','dan':'Dan','hos':'Hos','jol':'Joel','amo':'Amos',
    'oba':'Obad','jon':'Jonah','mic':'Mic','nam':'Nah','hab':'Hab',
    'zep':'Zeph','hag':'Hag','zec':'Zech','mal':'Mal',
    'mat':'Matt','mrk':'Mark','luk':'Luke','jhn':'John','act':'Acts',
    'rom':'Rom','1co':'1Cor','2co':'2Cor','gal':'Gal','eph':'Eph',
    'php':'Phil','col':'Col','1th':'1Thess','2th':'2Thess',
    '1ti':'1Tim','2ti':'2Tim','tit':'Titus','phm':'Phlm','heb':'Heb',
    'jas':'Jas','1pe':'1Pet','2pe':'2Pet','1jn':'1John','2jn':'2John',
    '3jn':'3John','jud':'Jude','rev':'Rev'
  };

  let crossRefData = null;
  let currentBook = null;

  function getBasePath() {
    const scripts = document.querySelectorAll('script[src*="cross-references"]');
    if (scripts.length > 0) return scripts[0].getAttribute('src').replace('js/cross-references.js', '').replace(/\?.*/, '');
    const segs = window.location.pathname.split('/').filter(Boolean);
    segs.pop();
    return segs.length > 1 ? '../'.repeat(segs.length - 1) : './';
  }

  function getPageInfo() {
    const path = window.location.pathname;
    const match = path.match(/interlinear\/([a-z0-9]+)-(\d+)\.html/);
    if (!match) return null;
    return { siteBook: match[1], chapter: match[2], osisBook: OSIS_BOOKS[match[1]] };
  }

  async function loadCrossRefs(osisBook) {
    if (currentBook === osisBook && crossRefData) return;
    const base = getBasePath();
    try {
      const resp = await fetch(base + 'data/crossrefs/' + osisBook + '.json');
      if (resp.ok) {
        crossRefData = await resp.json();
        currentBook = osisBook;
      }
    } catch(e) { console.error('Cross-refs load failed:', e); }
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .xref-panel {
        position: fixed;
        right: 0;
        top: 0;
        width: 320px;
        height: 100vh;
        background: var(--vellum-light, #faf5e8);
        border-left: 3px solid var(--gold, #c59612);
        box-shadow: -4px 0 20px rgba(0,0,0,0.15);
        z-index: 9999;
        overflow-y: auto;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: var(--font-reading, serif);
      }
      .xref-panel.open { transform: translateX(0); }
      .xref-header {
        background: linear-gradient(135deg, var(--gold, #c59612), #d4a717);
        color: #1a1a2e;
        padding: 15px;
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .xref-header h3 { margin: 0; font-size: 1rem; font-family: var(--font-heading, serif); }
      .xref-close {
        background: none;
        border: none;
        color: #1a1a2e;
        font-size: 1.3rem;
        cursor: pointer;
        padding: 0;
      }
      .xref-verse-title {
        padding: 12px 15px;
        background: rgba(197,150,12,0.1);
        font-weight: 700;
        color: var(--ink, #3c2f2f);
        border-bottom: 1px solid rgba(197,150,12,0.2);
      }
      .xref-list { list-style: none; padding: 0; margin: 0; }
      .xref-item {
        padding: 10px 15px;
        border-bottom: 1px solid rgba(0,0,0,0.06);
        transition: background 0.2s;
      }
      .xref-item:hover { background: rgba(197,150,12,0.08); }
      .xref-item a {
        color: var(--ultramarine, #2c5282);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .xref-item a:hover { text-decoration: underline; }
      .xref-votes {
        float: right;
        background: rgba(197,150,12,0.15);
        color: var(--gold, #c59612);
        padding: 1px 6px;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 700;
      }
      .xref-count {
        padding: 8px 15px;
        color: var(--text-faded, #888);
        font-size: 0.8rem;
        font-style: italic;
      }
      .verse-xref-btn {
        display: inline-block;
        background: rgba(197,150,12,0.1);
        border: 1px solid rgba(197,150,12,0.3);
        color: var(--gold, #c59612);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        cursor: pointer;
        margin-left: 4px;
        transition: all 0.2s;
        vertical-align: middle;
      }
      .verse-xref-btn:hover {
        background: var(--gold, #c59612);
        color: white;
      }
      .xref-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.3);
        z-index: 9998;
        display: none;
      }
      .xref-overlay.open { display: block; }
      @media (max-width: 600px) {
        .xref-panel { width: 85vw; }
      }
    `;
    document.head.appendChild(style);
  }

  function createPanel() {
    const overlay = document.createElement('div');
    overlay.className = 'xref-overlay';
    overlay.addEventListener('click', closePanel);
    document.body.appendChild(overlay);

    const panel = document.createElement('div');
    panel.className = 'xref-panel';
    panel.id = 'xref-panel';
    panel.innerHTML = `
      <div class="xref-header">
        <h3>📖 Cross References</h3>
        <button class="xref-close" onclick="document.getElementById('xref-panel').classList.remove('open');document.querySelector('.xref-overlay').classList.remove('open');">✕</button>
      </div>
      <div id="xref-content"></div>
    `;
    document.body.appendChild(panel);
  }

  function closePanel() {
    document.getElementById('xref-panel').classList.remove('open');
    document.querySelector('.xref-overlay').classList.remove('open');
  }

  function showCrossRefs(osisRef) {
    const refs = crossRefData ? crossRefData[osisRef] : null;
    const content = document.getElementById('xref-content');
    const base = getBasePath();

    if (!refs || refs.length === 0) {
      content.innerHTML = `
        <div class="xref-verse-title">${osisRef}</div>
        <div class="xref-count">No cross-references found for this verse.</div>
      `;
    } else {
      const items = refs.map(r => {
        const url = base + 'interlinear/' + r.p + '.html';
        return `<li class="xref-item">
          <a href="${url}">${r.d}</a>
          <span class="xref-votes">${r.v}</span>
        </li>`;
      }).join('');

      content.innerHTML = `
        <div class="xref-verse-title">${osisRef.replace(/\./g, ' ').replace(/ (\d+)$/, ':$1')}</div>
        <div class="xref-count">${refs.length} cross-reference${refs.length > 1 ? 's' : ''} from Treasury of Scripture Knowledge</div>
        <ul class="xref-list">${items}</ul>
      `;
    }

    document.getElementById('xref-panel').classList.add('open');
    document.querySelector('.xref-overlay').classList.add('open');
  }

  function addXrefButtons(pageInfo) {
    // Find verse markers on interlinear pages
    const verseEls = document.querySelectorAll('.verse-number, .verse-num, [data-verse]');
    
    // Also try to find verse groupings
    const verseGroups = document.querySelectorAll('.interlinear-verse, .verse-group, .verse');

    // Fallback: scan for verse number patterns in the page
    if (verseEls.length === 0 && verseGroups.length === 0) {
      // Add a floating button instead
      const btn = document.createElement('button');
      btn.className = 'verse-xref-btn';
      btn.style.cssText = 'position:fixed;bottom:70px;right:20px;padding:8px 14px;font-size:0.9rem;z-index:9990;border-radius:8px;';
      btn.innerHTML = '📖 Cross Refs';
      btn.title = 'View cross-references for this chapter';
      btn.addEventListener('click', () => {
        // Show all cross-refs for this chapter
        const refs = [];
        if (crossRefData) {
          Object.entries(crossRefData).forEach(([key, val]) => {
            if (key.startsWith(pageInfo.osisBook + '.' + pageInfo.chapter + '.')) {
              refs.push({ verse: key, refs: val });
            }
          });
        }
        showChapterRefs(refs, pageInfo);
      });
      document.body.appendChild(btn);
      return;
    }

    verseEls.forEach(el => {
      if (el.querySelector('.verse-xref-btn')) return;
      const verseNum = el.textContent.trim().replace(/[^\d]/g, '');
      if (!verseNum) return;
      
      const osisRef = `${pageInfo.osisBook}.${pageInfo.chapter}.${verseNum}`;
      const refs = crossRefData ? crossRefData[osisRef] : null;
      if (!refs || refs.length === 0) return;

      const btn = document.createElement('button');
      btn.className = 'verse-xref-btn';
      btn.innerHTML = `✝ ${refs.length}`;
      btn.title = `${refs.length} cross-references`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showCrossRefs(osisRef);
      });
      el.appendChild(btn);
    });
  }

  function showChapterRefs(verseRefs, pageInfo) {
    const content = document.getElementById('xref-content');
    const base = getBasePath();

    if (verseRefs.length === 0) {
      content.innerHTML = '<div class="xref-count">No cross-references for this chapter.</div>';
    } else {
      let html = '';
      verseRefs.forEach(({ verse, refs }) => {
        const vNum = verse.split('.')[2];
        html += `<div class="xref-verse-title" style="cursor:pointer;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
          Verse ${vNum} <span style="float:right;font-size:0.8rem;color:var(--gold);">${refs.length} refs ▾</span>
        </div>`;
        html += '<ul class="xref-list">';
        refs.slice(0, 15).forEach(r => {
          const url = base + 'interlinear/' + r.p + '.html';
          html += `<li class="xref-item"><a href="${url}">${r.d}</a><span class="xref-votes">${r.v}</span></li>`;
        });
        if (refs.length > 15) html += `<li class="xref-count">+${refs.length - 15} more</li>`;
        html += '</ul>';
      });
      content.innerHTML = html;
    }

    document.getElementById('xref-panel').classList.add('open');
    document.querySelector('.xref-overlay').classList.add('open');
  }

  async function init() {
    const pageInfo = getPageInfo();
    if (!pageInfo) return; // Not an interlinear page

    injectStyles();
    createPanel();
    await loadCrossRefs(pageInfo.osisBook);
    
    if (crossRefData) {
      const count = Object.keys(crossRefData).length;
      console.log(`📖 Loaded ${count} verse cross-references for ${pageInfo.osisBook}`);
      addXrefButtons(pageInfo);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
