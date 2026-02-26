# CLAUDE.md — The Living Word Bible Study Website

## What This Is
A deep, scholarly Bible study website at https://benlee2144.github.io/novawebsite/. Every study goes back to the original Hebrew, Greek, and Aramaic texts. No surface-level theology. No half-measures. Every claim backed by Scripture, every word traced to its root.

## Project Structure
```
/
├── index.html              # Homepage (Bible cover design)
├── css/style.css           # All styling (parchment theme, Hebrew/Greek blocks, etc.)
├── js/main.js              # Mobile nav toggle
├── studies/
│   ├── index.html          # Studies listing page
│   └── *.html              # Individual study pages
├── words/
│   └── index.html          # Word studies listing
├── books/
│   └── index.html          # Books of the Bible listing
├── topics/
│   └── index.html          # Topics listing
└── *.md                    # Source markdown files (conversation transcripts)
```

## How to Build a Study

### Source Material
Each `.md` file in the root is a conversation transcript between Ben and Fredrick. These are the RAW content — use them as the foundation but go WAY deeper. The markdown is a starting point, not the ceiling.

### HTML Template Structure
Every study follows this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Study Title] — The Living Word</title>
  <meta name="description" content="[SEO description with keywords]">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <!-- HEADER (sticky nav) -->
  <header class="site-header">
    <div class="nav-container">
      <a href="../" class="site-logo">The Living Word</a>
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="./">Studies</a></li>
        <li><a href="../words/">Word Studies</a></li>
        <li><a href="../books/">Books</a></li>
        <li><a href="../topics/">Topics</a></li>
      </ul>
    </div>
  </header>

  <main class="page-container">
    <article class="study-article">
      <!-- Study Header -->
      <header class="study-header">
        <div class="study-category">Category • Category • Category</div>
        <h1 class="study-title">Main Title</h1>
        <p class="study-subtitle">Subtitle with em dashes</p>
        <div class="study-meta">
          <span>~XX min read</span>
          <span class="separator">•</span>
          <span>XX Hebrew & Greek words explored</span>
          <span class="separator">•</span>
          <span>XX+ cross-references</span>
        </div>
      </header>

      <!-- Opening Scripture -->
      <blockquote class="scripture-quote">
        Scripture text...
        <cite class="scripture-ref">— Book Chapter:Verse</cite>
      </blockquote>

      <hr class="divider">

      <!-- Study sections follow... -->
    </article>
  </main>

  <!-- FOOTER -->
  <footer class="site-footer">
    <p class="footer-scripture">"Relevant closing verse"</p>
    <p class="footer-ref">BOOK CHAPTER:VERSE</p>
    <p class="footer-copy">The Living Word — Soli Deo Gloria</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

### CSS Classes Available

#### Text & Layout
- `.study-body` — Main content sections (justified text, 1.85 line-height)
- `.drop-cap` — First paragraph of each major section (decorative first letter)
- `.divider` — Gold gradient horizontal rule between major sections
- `.divider-cross` — Cross ornament divider (use `&#10013;` inside)
- `.study-header` — Centered header block with category/title/subtitle/meta

#### Scripture & Quotes
- `.scripture-quote` / `blockquote` — Gold left-border block quote with large opening quote mark
- `.scripture-ref` / `cite` — Right-aligned reference (use `&mdash;` before book name)
- For non-Scripture quotes (historical, etc.): add `style="font-style: normal;"` to the blockquote

#### Original Language Blocks
- `.hebrew-block` / `.greek-block` — Centered card with original text, transliteration, pronunciation, Strong's number, definition
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
      <a href="#" class="verse-ref">Book Chapter:Verse</a> —
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

#### Timelines (for historical sections)
```html
<div class="timeline">
  <div class="timeline-entry">
    <div class="timeline-date">DATE</div>
    <div class="timeline-content">Description</div>
  </div>
</div>
```

#### Study Cards (for "Continue the Journey" section)
```html
<div class="study-grid">
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
Use HTML entities for special characters:
- `&ldquo;` `&rdquo;` — Smart double quotes
- `&lsquo;` `&rsquo;` — Smart single quotes
- `&mdash;` — Em dash
- `&ndash;` — En dash
- `&hellip;` — Ellipsis
- `&bull;` — Bullet (for category separators)
- `&#10013;` — Cross symbol (for divider-cross)
- `&rarr;` — Right arrow

## Content Standards — THE RULES

### Depth Requirements
1. **MINIMUM 15 Hebrew/Greek words** fully broken down per study (with .hebrew-block or .greek-block for each major word)
2. **MINIMUM 50 cross-references** — every claim backed by at least one verse
3. **MINIMUM ~60 min read time** — these are DEEP studies, not blog posts
4. **Every verse examined in its original language** — don't just quote English
5. **Historical context for everything** — who wrote it, when, why, what was happening
6. **Church history section** — how the doctrine developed, who taught what, when things changed
7. **Early church fathers** — what did the Greek-speaking fathers actually teach?
8. **Complete word study summary table** at the end of every study

### Accuracy Requirements — DO NOT HALF-ASS THIS
1. **Strong's numbers must be correct.** Verify every single one.
2. **Hebrew/Greek characters must be accurate.** No garbled Unicode.
3. **Verse references must be real.** Never invent a verse. Never misquote.
4. **Historical claims must be verifiable.** Name the source, name the date.
5. **Etymology must be traceable.** If you claim a word comes from a root, the root must be real.
6. **Church father quotes must be real.** Name the work, name the chapter if possible.
7. **Don't make things up.** If you're not sure, research it or leave it out. Wrong is worse than absent.

### Writing Style
- **Opening paragraph** uses `.drop-cap` class — should hook the reader immediately
- **Voice:** Authoritative but not academic. Accessible but not shallow. Think "brilliant professor at a bar explaining something he's passionate about."
- **Tone:** Direct, confident, occasionally pointed (especially when exposing mistranslations or institutional corruption). Never mean. Never mocking believers. The target is bad doctrine, not the people who were taught it.
- **Each major section** starts with an `<h2>` and uses `.drop-cap` on the first paragraph
- **Use bold** for emphasis on key Greek/Hebrew words and critical phrases
- **Use italic** for transliterations and for emphasis within arguments
- **Rhetorical questions** are powerful — use them to lead readers to conclusions
- **Repeat key patterns** — "Notice what is NOT in this word," "The Greek says X, not Y"

### Structure of Each Study
1. **Opening Scripture** — One powerful verse that captures the study's thesis
2. **Introduction** — Hook. State the problem. State what's wrong. Promise what the reader will learn.
3. **Primary Word Studies** — The main Hebrew/Greek words. Full etymology. Every use in Scripture.
4. **Verse-by-Verse Analysis** — Take the key passages and break them down in the original languages
5. **The Misread Verses** — Take the verses people THINK support the wrong view and show what they actually say
6. **Historical Section** — How did the wrong teaching develop? Who introduced it? When? Why?
7. **Early Church Fathers** — What did the people closest to the original languages actually believe?
8. **Implications / "What This Changes"** — So what? How does the correct understanding change everything?
9. **The Bottom Line** — Concise summary. The thesis restated with all the evidence behind it.
10. **Key Verses** — Organized cross-reference boxes by category
11. **Complete Word Study Summary Table** — Every word studied, language, meaning, occurrences, Strong's
12. **Go Study It Yourself** — Resources section so readers can verify EVERYTHING themselves. Include:
    - Blue Letter Bible, Bible Hub Interlinear, STEP Bible, Strong's Concordance Online
    - Bible Gateway, Bible Hub Parallel, Scripture4All (compare translations)
    - New Advent Church Fathers, CCEL (read the fathers)
    - World History Encyclopedia, JSTOR (verify historical claims)
    - Bill Mounce Greek, Aleph with Beth Hebrew, Unfoldingword Hebrew Grammar (learn the languages)
    - End with Acts 17:11 ("searched the Scriptures daily")
    - Customize the Strong's number examples to match the study's key words
    - Tone: "Don't take our word for it. Open the Greek. Open the Hebrew."
13. **Continue the Journey** — Links to related studies (built ones linked, unbuilt ones at 0.5 opacity)

### File Naming
- Lowercase, hyphens: `the-study-title-here.html`
- Match the study title but keep it reasonable length

### Metadata
- Update `study-meta` span with accurate counts
- Read time: estimate ~200 words/minute for dense theological content
- Count actual Hebrew/Greek word blocks for "words explored"
- Count actual verse references for "cross-references"

## Studies Completed
- `blood-covenants-why-jesus-had-to-die.html` — Covenant theology, 12 words, 40+ refs
- `genesis-1-1-in-the-beginning.html` — Word-by-word Hebrew of Genesis 1:1
- `repent-does-not-mean-for-your-sins.html` — Metanoia study, 18 words, 65+ refs
- `hell-the-three-words-they-mashed-into-one.html` — Sheol/Hades/Gehenna/Tartarus, 22 words, 85+ refs

## Studies Remaining (source .md files exist)
- Authority vs Power — Why Your Prayers Don't Work
- Body Soul Spirit — The Three-Part Human Deep Dive
- How To Actually Operate From Your Spirit
- How To Actually Pray and Be Intimate With God
- How We're Truly Saved — The Narrow Road
- Things Twisted In The Bible — Full Breakdown
- What The Bible Actually Says About Satan
- When Bills Are Behind — Faith Meets Real Life
- Where Do Believers Go When They Die — The Timeline
- Where Do People Actually End Up — The Three Views
- Why God Allowed The Bible To Be Twisted

## Deployment
- GitHub Pages: https://benlee2144.github.io/novawebsite/
- Push to `main` branch → auto-deploys via `.github/workflows/static.yml`
- No build step needed — pure static HTML/CSS/JS

## After Building a Study
1. Commit and push to main
2. Update the studies/index.html listing page (if it exists and has a card list)
3. Update any "Coming Soon" references in other studies to link to the new one
4. Update this CLAUDE.md's "Studies Completed" list
