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
├── words/
│   └── index.html          # Word studies listing
├── topics/
│   └── index.html          # Topics listing
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
        <li><a href="../words/">Word Studies</a></li>
        <li><a href="../topics/">Topics</a></li>
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

## Studies Remaining (source .md files exist in root)
- How To Actually Operate From Your Spirit
- How To Actually Pray and Be Intimate With God
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
