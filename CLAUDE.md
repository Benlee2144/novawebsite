# CLAUDE.md — The Living Word Bible Study Website

## What This Is
A deep, scholarly Bible study website at https://benlee2144.github.io/novawebsite/ with an illuminated manuscript / ancient book aesthetic. Every study goes back to the original Hebrew, Greek, and Aramaic texts. No surface-level theology. No half-measures. Every claim backed by Scripture, every word traced to its root. The visual design should feel like opening a real ancient book on a dark leather desk — not a modern themed website.

## Project Structure
```
/
├── index.html              # Homepage (no book spine, has cover animation)
├── css/style.css           # All styling (~1837 lines, parchment/leather/gold theme)
├── js/main.js              # Cover animation, gold particles, ribbon, parallax, scroll reveal, progress bar (~15.6KB)
├── images/
│   ├── ornaments/          # SVG assets: border-h.svg, border-v.svg, corner-tl.svg, divider-ornate.svg, celtic-cross.svg, drop-cap-F.svg
│   └── studies/            # Study images (hosted locally when possible)
├── studies/
│   ├── index.html          # Studies listing page
│   └── *.html              # Individual study pages
├── interlinear/
│   ├── index.html          # Bible book/chapter navigator
│   └── *.html              # 1,189 chapter pages (Hebrew OT + Greek NT)
├── lexicon/
│   ├── index.html          # Strong's Concordance browser
│   ├── greek-*.html        # Range pages (100 entries each)
│   ├── hebrew-*.html       # Range pages (100 entries each)
│   └── [hg]*.html          # 14,197 individual entry pages
├── reference/
│   ├── index.html          # Reference library index
│   ├── easton-*.html       # Easton's Bible Dictionary (25 A-Z pages)
│   ├── isbe-*.html         # ISBE Encyclopedia (26 A-Z pages)
│   └── josephus/           # 380 Josephus chapter pages + 2 index pages
├── search.html             # Client-side search (34,194 entries)
├── search-index.json       # Search data (~6.6MB)
├── sitemap.xml             # SEO sitemap (1,357 URLs)
├── robots.txt              # Search engine directives
└── *.md                    # Source markdown files (conversation transcripts)
```

## Visual Design — CRITICAL

### Illuminated Manuscript Aesthetic
- **Body background**: Dark wood desk texture (grain lines + noise + vignette via CSS)
- **Book page**: Content sits inside `.book-page` wrapper with `.illuminated-border` — looks like a real book lying on a desk
- **Book spine**: `position: fixed` on left side of inner pages (NOT homepage), hidden below 1100px viewport
- **SVG vine borders**: Hand-crafted SVG corner pieces and repeating edge borders (not CSS patterns)
- **Parchment texture**: CSS noise + gradient layers for authentic manuscript look
- **Gold elements**: Title text has animated gold leaf shimmer (`goldShimmer` keyframe, 8s cycle)
- **Manuscript fonts**: Uncial Antiqua, Cormorant Garamond, EB Garamond, Cinzel, Cinzel Decorative
- **Color palette**: Ultramarine (lapis lazuli), vermillion (cinnabar), verdigris, ochre — authentic illuminated manuscript pigments

### Interactive Elements (built in js/main.js)
- **Leather cover opening animation**: 3D CSS `rotateY` from left, plays once per session via `sessionStorage`
- **Gold dust particles**: Canvas-based, 40 particles, 5 gold colors, IntersectionObserver pauses off-screen
- **Silk ribbon bookmark**: Crimson ribbon on study pages (`.study-body` required), sway animation, V-cut tail, hidden at <768px
- **Parallax parchment**: Light-follow on mouse move
- **Scroll reveal**: Hebrew/Greek blocks, quotes, figures animate in on scroll
- **Reading progress bar**: Gold bar on study pages
- **h2 ornate SVG divider**: Appears underneath h2 headings (disabled on cards/study headers)

### Design Rules
- **NO iPhone/color emojis** — Use typographic symbols only (◊ lozenge, ❦ floral hearts, ✦ diamond ornaments, Hebrew/Greek letters)
- **NO modern UI elements** — No border-radius on cards, no hover lift animations, no gradient buttons
- **Nav links are manuscript chapter entries** with ✦ flanking ornaments
- **Rubricated h3 headings** with ❦ floral prefix (vermillion red)
- **Strong's numbers** styled as ultramarine badges
- **Scripture quote borders** in vermillion
- **Corner ornaments** 120px, border vines opacity 0.85

## How to Build a Study

### Source Material
Each `.md` file in the root is a conversation transcript. These are RAW content — use them as the foundation but go WAY deeper. The markdown is a starting point, not the ceiling.

### HTML Template Structure
Every study follows this exact structure. **Note the book-page and illuminated-border wrappers!**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Study Title] &mdash; The Living Word</title>
  <meta name="description" content="[SEO description with keywords]">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

  <!-- HEADER -->
  <header class="site-header">
    <div class="nav-container">
      <a href="../" class="site-logo">The Living Word</a>
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="./">Studies</a></li>
        <li><a href="../interlinear/">Interlinear</a></li>
        <li><a href="../lexicon/">Lexicon</a></li>
        <li><a href="../reference/">Reference</a></li>
        <li><a href="../search.html">Search</a></li>
      </ul>
    </div>
  </header>

  <!-- BOOK PAGE WRAPPER (required for illuminated manuscript look) -->
  <div class="book-page">
    <div class="illuminated-border">
      <div class="border-left"></div>
      <div class="border-right"></div>
      <div class="corner-tl"></div>
      <div class="corner-tr"></div>
      <div class="corner-bl"></div>
      <div class="corner-br"></div>

  <main class="page-container">
    <article class="study-article">

      <!-- Study Header -->
      <header class="study-header">
        <div class="study-category">Category &bull; Category &bull; Category</div>
        <h1 class="study-title">Main Title</h1>
        <p class="study-subtitle">Subtitle with em dashes</p>
        <div class="study-meta">
          <span>~XX min read</span>
          <span class="separator">&bull;</span>
          <span>XX Hebrew &amp; Greek words explored</span>
          <span class="separator">&bull;</span>
          <span>XX+ cross-references</span>
        </div>
      </header>

      <!-- Opening Scripture -->
      <blockquote class="scripture-quote">
        Scripture text...
        <cite class="scripture-ref">&mdash; Book Chapter:Verse</cite>
      </blockquote>

      <hr class="divider">

      <!-- Study sections in <section class="study-body">...</section> -->
      <!-- Use <hr class="divider"> between major sections -->
      <!-- End with: Key Verses boxes, Word Study Table, Go Study It Yourself, Continue the Journey -->

    </article>
  </main>

    </div><!-- /illuminated-border -->
  </div><!-- /book-page -->

  <div class="book-spine" aria-hidden="true"></div>

  <!-- FOOTER -->
  <footer class="site-footer">
    <p class="footer-scripture">&ldquo;Relevant closing verse&rdquo;</p>
    <p class="footer-ref">BOOK CHAPTER:VERSE</p>
    <p class="footer-copy">The Living Word &mdash; Soli Deo Gloria</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

### CSS Classes Available

#### Text & Layout
- `.study-body` — Main content sections (justified text, 1.85 line-height). **REQUIRED for ribbon bookmark to appear.**
- `.drop-cap` — First paragraph of each major section (decorative first letter with gold shadow)
- `.divider` — Gold gradient horizontal rule between major sections
- `.study-header` — Centered header block with category/title/subtitle/meta

#### Scripture & Quotes
- `.scripture-quote` / `blockquote` — Vermillion left-border block quote with large opening quote mark
- `.scripture-ref` / `cite` — Right-aligned reference (use `&mdash;` before book name)

#### Original Language Blocks
- `.hebrew-block` / `.greek-block` — Centered card with original text, transliteration, pronunciation, Strong's number, definition. These animate in on scroll.
  ```html
  <div class="hebrew-block">  <!-- or greek-block -->
    <div class="original-word">Hebrew/Greek characters</div>
    <div class="transliteration">Transliterated</div>
    <div class="pronunciation">pronunciation guide</div>
    <div><span class="strongs-number">H0000 or G0000</span></div>
    <div class="word-definition">Definition and notes.</div>
  </div>
  ```

#### Cross-Reference Boxes
```html
<div class="cross-ref-box">
  <h4>Section Title</h4>
  <ul>
    <li>
      <a href="#" class="verse-ref">Book Chapter:Verse</a> &mdash;
      <span class="ref-text">Explanation of the verse.</span>
    </li>
  </ul>
</div>
```

#### Tables
```html
<table class="study-table">
  <thead><tr><th>Header</th>...</tr></thead>
  <tbody><tr><td>Data</td>...</tr></tbody>
</table>
```

#### Timelines
```html
<div class="timeline">
  <div class="timeline-entry">
    <div class="timeline-date">DATE</div>
    <div class="timeline-content">Description</div>
  </div>
</div>
```

#### Study Cards (for "Continue the Journey")
```html
<div class="study-grid" style="margin-top: var(--spacing-lg);">
  <div class="study-card">
    <div class="card-category">Category</div>
    <h3 class="card-title"><a href="url">Title</a></h3>
    <p class="card-excerpt">Description</p>
    <div class="card-meta"><span>XX min read</span></div>
  </div>
</div>
```
- Add `style="opacity: 0.5;"` for "Coming Soon" studies

### HTML Entity Reference
- `&ldquo;` `&rdquo;` — Smart double quotes
- `&lsquo;` `&rsquo;` — Smart single quotes
- `&mdash;` — Em dash
- `&ndash;` — En dash
- `&hellip;` — Ellipsis
- `&bull;` — Bullet (for category separators)
- `&rarr;` — Right arrow

## Content Standards — THE RULES

### Depth Requirements
1. **MINIMUM 15 Hebrew/Greek words** fully broken down per study (with .hebrew-block or .greek-block)
2. **MINIMUM 50 cross-references** — every claim backed by at least one verse
3. **MINIMUM ~60 min read time** — these are DEEP studies, not blog posts
4. **Every verse examined in its original language** — don't just quote English
5. **Historical context for everything** — who wrote it, when, why, what was happening
6. **Church history section** — how the doctrine developed, who taught what, when things changed
7. **Early church fathers** — what did the Greek-speaking fathers actually teach?
8. **Complete word study summary table** at the end of every study

### Accuracy Requirements — DO NOT MAKE THINGS UP
1. **Strong's numbers must be correct.** Verify every single one. 100% right.
2. **Hebrew/Greek characters must be accurate.** No garbled Unicode.
3. **Verse references must be real.** Never invent a verse. Never misquote.
4. **Historical claims must be verifiable.** Name the source, name the date.
5. **Etymology must be traceable.** If you claim a word comes from a root, the root must be real.
6. **Church father quotes must be real.** Name the work, name the chapter if possible.
7. **Don't make things up.** If you're not sure, research it or leave it out. Wrong is worse than absent.

### Writing Style
- **Voice:** "Brilliant professor at a bar" — authoritative but accessible, direct, confident
- **Tone:** Never mocking believers. Target is bad doctrine, not the people taught it.
- **Opening paragraphs** use `.drop-cap` — hook immediately
- **Each major section** starts with `<h2>` and uses `.drop-cap` on first paragraph
- **Bold** for key Greek/Hebrew words and critical phrases
- **Italic** for transliterations and emphasis
- **Rhetorical questions** to lead readers to conclusions

### Required Sections in Every Study
1. **Opening Scripture** — One verse capturing the thesis
2. **Introduction** — Hook, state the problem, promise what reader will learn
3. **Primary Word Studies** — Main Hebrew/Greek words, full etymology
4. **Verse-by-Verse Analysis** — Key passages broken down in original languages
5. **Historical/Church History Section** — How wrong teaching developed, who introduced it
6. **Early Church Fathers** — What Greek-speaking fathers actually taught
7. **Implications / "What This Changes"** — Practical application
8. **The Bottom Line** — Thesis restated with evidence
9. **Key Verses** — Organized cross-reference boxes by theme
10. **Complete Word Study Summary Table** — Every word: characters, language, transliteration, Strong's, meaning
11. **Go Study It Yourself** — Resources section ending with Acts 17:11. Include Blue Letter Bible, Bible Hub, STEP Bible, Bible Gateway, New Advent Church Fathers, CCEL, Bill Mounce, Aleph with Beth. Tone: "Don't take our word for it."
12. **Continue the Journey** — Links to related studies (built = linked, unbuilt = 0.5 opacity "Coming Soon")

### File Naming
- Lowercase, hyphens: `the-study-title-here.html`

## Studies Completed
- `genesis-1-1-in-the-beginning.html` — Word-by-word Hebrew of Genesis 1:1, 7 words
- `blood-covenants-why-jesus-had-to-die.html` — Covenant theology, 12 words, 40+ refs
- `repent-does-not-mean-for-your-sins.html` — Metanoia study, 18 words, 65+ refs, ~90 min
- `hell-the-three-words-they-mashed-into-one.html` — Sheol/Hades/Gehenna/Tartarus, 22 words, 85+ refs, ~120 min
- `where-do-believers-go-when-they-die.html` — Paradise/Abraham's Bosom/Absent from body, 19 words, 60+ refs, ~80 min
- `body-soul-spirit-the-three-part-human.html` — Trichotomy, nephesh/psyche/pneuma/ruach, 21 words, 55+ refs, ~90 min
- `what-the-bible-actually-says-about-satan.html` — Ha-satan/diabolos/helel, 20 words, 55+ refs, ~85 min
- `authority-vs-power-why-your-prayers-dont-work.html` — Exousia/dynamis/tetelestai, 22 words, 65+ refs, ~70 min
- `how-were-truly-saved-the-narrow-road.html` — Sōzō/pisteuō eis/anōthen/ginōskō, 24 words, 70+ refs, ~80 min
- `how-to-actually-pray-and-be-intimate-with-god.html` — Proseuchē/deēsis/enteuxis/raphah/koinōnia, 20 words, 60+ refs, ~75 min
- `how-to-actually-operate-from-your-spirit.html` — Pneumatikos/psychikos/brabeuō/phronēma/peripateo, 21 words, 65+ refs, ~75 min
- `what-heaven-is-actually-like.html` — Shamayim/ouranos/paradeisos/kainos/sōma pneumatikon, 23 words, 75+ refs, ~80 min

## Studies Remaining (source .md files exist in root)
- Things Twisted In The Bible — Full Breakdown
- When Bills Are Behind — Faith Meets Real Life
- Where Do People Actually End Up — The Three Views
- Why God Allowed The Bible To Be Twisted

## After Building a Study
1. Create the HTML file in `studies/`
2. Add a study card to `studies/index.html` (match existing card format with data-category and data-search attributes)
3. Update homepage `index.html` featured study card if appropriate
4. Update "Coming Soon" references in other studies' "Continue the Journey" sections
5. Update this CLAUDE.md's "Studies Completed" list and remove from "Remaining"
6. Commit and push to `main` (auto-deploys via GitHub Pages)

## Deployment
- GitHub Pages: https://benlee2144.github.io/novawebsite/
- Push to `main` branch → auto-deploys via `.github/workflows/static.yml`
- No build step — pure static HTML/CSS/JS

## Image Strategy
- **Wikimedia Commons**: Best source for historical/public domain images, but CLI downloads get rate-limited (429s). Link directly to Wikimedia URLs in `<img>` tags as fallback.
- **Local hosting**: `images/studies/` for images that download successfully
- **Known bad files**: Some images in repo are tiny error pages (~2KB) — verify file size before using

## Reference Files
- **Best reference study to match**: `studies/blood-covenants-why-jesus-had-to-die.html` (original template)
- **Most recent study**: `studies/authority-vs-power-why-your-prayers-dont-work.html` (latest patterns)
- **CSS**: `css/style.css` — do NOT modify, use existing classes
- **JS**: `js/main.js` — do NOT modify, interactive effects already built

## Nav Links (Current)
The nav across all pages should be:
```
Studies | Interlinear | Lexicon | Reference | Search
```
Old nav items (Words, Topics, LXX, Books) have been removed. Do NOT re-add them.

## Data Infrastructure — The Living Library

### Build Scripts
All in `/tmp/novawebsite/build/scripts/`:
- `build_interlinear.py` — Generates all 1,189 interlinear chapter pages + 14,197 lexicon pages from STEPBible data
- `build_mega_upgrade.py` — Integrates all reference data (TBESG/TBESH/TFLSJ lexicons, Easton's, ISBE, TSK, translation notes, Josephus, morphology)
- `rebuild_new_pages.py` — Rebuilds reference library, search, Josephus with correct site template
- `fix_connections.py` — Hyperlinks Strong's numbers in studies → lexicon, verse refs → interlinear, study back-links in lexicon, nav cleanup

### Data Sources (all in `build/data/`)
| File | Source | License | What It Is |
|------|--------|---------|------------|
| `tagnt-*.txt` | STEPBible TAGNT | CC BY 4.0 | Greek NT word-by-word tagged text |
| `tahot-*.txt` | STEPBible TAHOT | CC BY 4.0 | Hebrew OT word-by-word tagged text |
| `strongs-greek-raw.js` | OpenScriptures | Public Domain | Basic Strong's Greek dictionary |
| `strongs-hebrew-raw.js` | OpenScriptures | Public Domain | Basic Strong's Hebrew dictionary |
| `tbesg-greek-lexicon.txt` | STEPBible | CC BY 4.0 | Extended Greek lexicon (Abbott-Smith) — **HAS THEOLOGICAL BIAS** |
| `tbesh-hebrew-lexicon.txt` | STEPBible | CC BY 4.0 | Extended Hebrew lexicon — **HAS THEOLOGICAL BIAS** |
| `tflsj-greek-full.txt` | STEPBible/LSJ | CC BY 4.0 | Full Liddell-Scott-Jones classical Greek — **MOST NEUTRAL SOURCE** |
| `tflsj-greek-extra.txt` | STEPBible/LSJ | CC BY 4.0 | LSJ extra entries |
| `tsk.txt` | OpenBible.info | CC BY | Treasury of Scripture Knowledge cross-refs (344,800 lines) — **CLEAN, just verse links** |
| `easton-dict.json` | SWORD/CrossWire | Public Domain | Easton's Bible Dictionary (3,961 entries) — **HAS THEOLOGICAL BIAS** |
| `isbe-dict.json` | SWORD/CrossWire | Public Domain | ISBE encyclopedia (9,380 entries) — **HAS THEOLOGICAL BIAS** |
| `josephus-antiquities.txt` | Project Gutenberg | Public Domain | Josephus Antiquities — **CLEAN, primary source** |
| `josephus-wars.txt` | Project Gutenberg | Public Domain | Josephus Wars — **CLEAN, primary source** |
| `tegmc-greek-morph.txt` | STEPBible | CC BY 4.0 | Greek morphology code expansions — **CLEAN, pure grammar** |
| `tehmc-hebrew-morph.txt` | STEPBible | CC BY 4.0 | Hebrew morphology code expansions — **CLEAN, pure grammar** |
| `tipnr-proper-names.txt` | STEPBible | CC BY 4.0 | Proper names with all references |
| `openbible-geocoding.csv` | OpenBible.info | CC BY | Biblical location coordinates |
| `_uw_tn/` | unfoldingWord | CC BY-SA 4.0 | Translation notes (103K lines) — **MOSTLY CLEAN but has evangelical perspective** |
| `_uw_tw/` | unfoldingWord | CC BY-SA 4.0 | Translation words (953 terms) — **MOSTLY CLEAN** |
| `lxx-*.txt` | jtauber/lxx-swete | Public Domain | Septuagint (Swete's edition) word-per-line |

### ⚠️ "OUR ANALYSIS DIFFERS" POLICY — CRITICAL

**This is mandatory for every new study and every data integration.**

Many imported reference works (Easton's, ISBE, Abbott-Smith/TBESG) inject traditional theological interpretations as if they were facts. When the site's studies present evidence that contradicts these traditional definitions, we add a red-bordered "Our Analysis Differs" note.

#### When to Add a Note
Add an "Our Analysis Differs" note whenever:
1. A lexicon definition adds meaning the original word doesn't carry (e.g., "repentance **from sin**" when the Greek just says "change of mind")
2. An encyclopedia article presents church tradition as biblical fact (e.g., "pastor = minister appointed over a congregation")
3. A dictionary entry defines a word through theological rather than linguistic lens (e.g., "eternal" for aionios when it means "age-lasting")
4. Any reference work teaches something the site's studies directly challenge with original-language evidence

#### Where to Add Notes
- **Lexicon pages** (`lexicon/g*.html`, `lexicon/h*.html`): After the Extended Lexicon section, before Classical Usage
- **ISBE pages** (`reference/isbe/isbe-*.html`): Before the entry's main text paragraph
- **Easton's pages** (`reference/easton/easton-*.html`): Before the entry's main text paragraph
- **Reference library index** (`reference/index.html`): Blanket disclaimer at top

#### Note HTML Template
```html
<div class="site-analysis-note" style="margin:1rem 0;padding:1rem 1.2rem;background:rgba(196,30,58,0.06);border-left:3px solid var(--vermillion, #c41e3a);border-radius:0 6px 6px 0;">
  <h4 style="font-family:var(--font-heading);color:var(--vermillion, #c41e3a);margin:0 0 0.4rem;font-size:0.95rem;">&#9888; Our Analysis Differs</h4>
  <p style="font-family:var(--font-reading);line-height:1.7;font-size:0.95rem;margin:0;">[Explanation of what's wrong and why]
  <br><a href="../studies/[relevant-study].html" style="color:var(--ultramarine);font-weight:600;">Read the full study &rarr;</a></p>
</div>
```

#### Currently Flagged Words
**Lexicon pages with notes:**
- G3340 (metanoeo), G3341 (metanoia) — "repentance from sin" is theological addition
- H7585 (sheol), G86 (hades), G1067 (gehenna), G5020 (tartaroo) — not "hell"
- G165 (aion), G166 (aionios) — "age," not "eternal"
- G1577 (ekklesia) — "assembly," not "church"
- G4166 (poimen) — "shepherd," not "pastor" as office
- G4102 (pistis) — active trust, not passive belief
- G907 (baptizo) — "immerse," deliberately not translated
- G5293 (hypotasso) — military ordering term, not blanket submission

**ISBE entries with notes:** HELL, REPENTANCE, CHURCH, PASTOR, TRINITY, PREDESTINATION, FAITH, ETERNAL, TITHE, SOUL, SPIRIT, SALVATION, ATONEMENT, BORN AGAIN

**Easton's entries with notes:** Hell, Repentance, Church, Tithe, Atonement, Faith, Baptism Christian, Eternal death, Eternal life, Spirit, Heaven

### Hyperlink Policy — Everything Connects
When building new studies or pages:
1. **All Strong's numbers** must be hyperlinked to lexicon pages: `<a href="../lexicon/g1234.html">G1234</a>`
2. **All verse references** must link to interlinear pages: `<a href="../interlinear/gen-1.html" class="verse-ref">Genesis 1:1</a>`
3. **Lexicon pages** should have "Discussed in Studies" back-links when relevant
4. **Run `fix_connections.py`** after adding new studies to update all links

### Page Template (for reference/search/library pages)
Use the EXACT same HTML structure as existing pages:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Title] &mdash; The Living Word</title>
  <link rel="stylesheet" href="[depth]css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="nav-container">
      <a href="[depth]" class="site-logo">The Living Word</a>
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="[depth]studies/">Studies</a></li>
        <li><a href="[depth]interlinear/">Interlinear</a></li>
        <li><a href="[depth]lexicon/">Lexicon</a></li>
        <li><a href="[depth]reference/">Reference</a></li>
        <li><a href="[depth]search.html">Search</a></li>
      </ul>
    </div>
  </header>
  <div class="book-page">
    <div class="illuminated-border">
      <div class="border-left"></div>
      <div class="border-right"></div>
      <div class="corner-tl"></div>
      <div class="corner-tr"></div>
      <div class="corner-bl"></div>
      <div class="corner-br"></div>
      <main class="page-container">
        [CONTENT]
      </main>
    </div>
  </div>
  <div class="book-spine" aria-hidden="true"></div>
  <footer class="site-footer">
    <p class="footer-scripture">&ldquo;[verse]&rdquo;</p>
    <p class="footer-ref">[REF]</p>
    <p class="footer-copy">The Living Word &mdash; Soli Deo Gloria</p>
  </footer>
  <script src="[depth]js/main.js"></script>
</body>
</html>
```
Where `[depth]` is `../` for 1 level deep, `../../` for 2 levels deep, etc.

### Total Site Stats (as of Feb 2026)
- ~15,500+ HTML files deployed
- 14,197 lexicon entries (Greek + Hebrew)
- 1,189 interlinear chapter pages (every chapter of the Bible)
- 911 LXX Septuagint pages
- 14+ deep study articles
- 3,961 Easton's dictionary entries (A-Z browsable)
- 9,380 ISBE encyclopedia entries (A-Z browsable)
- 59 Josephus chapter pages
- 32,983 searchable entries
- TSK cross-references on every interlinear page (29,365 verses)
- Cultural/translation notes on 29,116 verses
- 241 lexicon pages with study back-links
