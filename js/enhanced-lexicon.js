/**
 * Enhanced Lexicon — adds STEPBible data (transliteration, morphology, expanded definitions)
 * to existing lexicon pages. Loads data/enhanced_lexicon.json.
 */
(function() {
  // Only run on lexicon pages
  const path = window.location.pathname;
  const match = path.match(/lexicon\/([hg]\d{4})\.html/i);
  if (!match) return;
  
  const strongs = match[1].toUpperCase();
  const basePath = (function() {
    const scripts = document.querySelectorAll('script[src*="enhanced-lexicon"]');
    if (scripts.length) {
      const src = scripts[scripts.length - 1].getAttribute('src');
      return src.replace(/js\/enhanced-lexicon\.js.*/, '');
    }
    return '../';
  })();

  fetch(basePath + 'data/enhanced_lexicon.json')
    .then(r => r.json())
    .then(data => {
      const entry = data[strongs];
      if (!entry) return;

      // Find insertion point — after the first heading or definition area
      const container = document.querySelector('.lex-entry, .page-container main, main');
      if (!container) return;

      // Check if enhancement already exists
      if (document.getElementById('stepbible-enhanced')) return;

      const div = document.createElement('div');
      div.id = 'stepbible-enhanced';
      div.style.cssText = 'margin:1.5rem 0;padding:1.2rem;background:rgba(197,150,12,0.04);border:1px solid rgba(197,150,12,0.15);border-radius:10px;';
      
      let html = '<div style="font-size:0.75rem;color:var(--gold,#c5960c);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem;">STEPBible Enhanced Data</div>';
      
      if (entry.translit) {
        html += `<div style="margin:0.3rem 0;font-size:0.95rem;"><strong>Transliteration:</strong> <em>${entry.translit}</em></div>`;
      }
      if (entry.morph) {
        html += `<div style="margin:0.3rem 0;font-size:0.95rem;"><strong>Morphology:</strong> <code style="background:rgba(0,0,0,0.05);padding:2px 6px;border-radius:3px;">${entry.morph}</code></div>`;
      }
      if (entry.gloss) {
        html += `<div style="margin:0.3rem 0;font-size:0.95rem;"><strong>Gloss:</strong> ${entry.gloss}</div>`;
      }
      if (entry.definition) {
        html += `<div style="margin:0.6rem 0;font-size:0.9rem;line-height:1.7;border-top:1px solid rgba(197,150,12,0.1);padding-top:0.5rem;">${entry.definition}</div>`;
      }
      
      html += '<div style="font-size:0.7rem;color:var(--text-faded,#888);margin-top:0.5rem;">Data: STEPBible.org (CC BY 4.0) — Tyndale House, Cambridge</div>';
      
      div.innerHTML = html;
      
      // Insert after the first heading or at the start
      const heading = container.querySelector('h1, h2');
      if (heading && heading.nextSibling) {
        heading.parentNode.insertBefore(div, heading.nextSibling);
      } else {
        container.prepend(div);
      }
    })
    .catch(() => {}); // Silent fail
})();
