/**
 * Biblical Pronunciation System
 * Adds authentic Hebrew/Greek pronunciation to Strong's numbers and original language text
 * Uses pre-generated audio files hosted on Cloudflare
 */

class BiblicalPronunciation {
    constructor(options = {}) {
        this.options = {
            audioURL: options.audioURL || 'https://your-site.pages.dev/audio',
            dataURL: options.dataURL || 'https://your-site.pages.dev/data',
            autoEnhance: options.autoEnhance !== false,
            showIPA: options.showIPA !== false,
            showRomanization: options.showRomanization !== false,
            playOnHover: options.playOnHover === true,
            ...options
        };
        
        this.pronunciationData = null;
        this.audioCache = new Map();
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadPronunciationData();
            
            if (this.options.autoEnhance) {
                this.enhanceExistingContent();
            }
            
            this.initialized = true;
            console.log('🔊 Biblical Pronunciation System initialized');
            
            // Fire ready event
            document.dispatchEvent(new CustomEvent('pronunciation:ready'));
            
        } catch (error) {
            console.error('❌ Failed to initialize pronunciation system:', error);
        }
    }
    
    async loadPronunciationData() {
        try {
            const response = await fetch(`${this.options.dataURL}/biblical_pronunciation.json`);
            this.pronunciationData = await response.json();
            console.log('📚 Loaded pronunciation data:', 
                this.pronunciationData.metadata.total_words, 'words');
        } catch (error) {
            console.error('❌ Failed to load pronunciation data:', error);
            // Fallback to embedded data
            this.pronunciationData = this.getEmbeddedData();
        }
    }
    
    enhanceExistingContent() {
        // Enhance Strong's numbers
        this.enhanceStrongsNumbers();
        
        // Enhance Hebrew/Greek text
        this.enhanceOriginalLanguageText();
        
        // Enhance lexicon entries
        this.enhanceLexiconEntries();
    }
    
    enhanceStrongsNumbers() {
        // Find all Strong's references (H1234, G5678 patterns)
        const strongsPattern = /\\b[HG]\\d{1,4}\\b/g;
        
        document.querySelectorAll('.strongs, .strong-number, [class*="strong"]').forEach(element => {
            const text = element.textContent;
            const matches = text.match(strongsPattern);
            
            if (matches) {
                matches.forEach(strongsRef => {
                    this.addPronunciationToStrongRef(element, strongsRef);
                });
            }
        });
    }
    
    enhanceOriginalLanguageText() {
        // Find Hebrew text (Unicode range U+0590 to U+05FF)
        const hebrewPattern = /[\\u0590-\\u05FF]+/g;
        // Find Greek text (Unicode range U+0370 to U+03FF, U+1F00 to U+1FFF)
        const greekPattern = /[\\u0370-\\u03FF\\u1F00-\\u1FFF]+/g;
        
        this.processLanguageText(hebrewPattern, 'hebrew');
        this.processLanguageText(greekPattern, 'greek');
    }
    
    processLanguageText(pattern, language) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (!parent || 
                        parent.tagName === 'SCRIPT' || 
                        parent.tagName === 'STYLE' ||
                        parent.classList.contains('pronunciation-enhanced')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return pattern.test(node.textContent) ? 
                        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const matches = text.match(pattern);
            
            if (matches) {
                let enhancedHTML = text;
                matches.forEach(word => {
                    const pronunciation = this.getPronunciation(word, language);
                    if (pronunciation) {
                        const enhancedWord = this.createPronunciationElement(word, pronunciation, language);
                        enhancedHTML = enhancedHTML.replace(word, enhancedWord);
                    }
                });
                
                if (enhancedHTML !== text) {
                    const wrapper = document.createElement('span');
                    wrapper.innerHTML = enhancedHTML;
                    wrapper.classList.add('pronunciation-enhanced');
                    
                    textNode.parentNode.insertBefore(wrapper, textNode);
                    textNode.parentNode.removeChild(textNode);
                }
            }
        });
    }
    
    enhanceLexiconEntries() {
        // Enhance existing lexicon entries
        document.querySelectorAll('.lexicon-entry, .word-entry, [class*="lexicon"]').forEach(entry => {
            this.enhanceElement(entry);
        });
    }
    
    addPronunciationToStrongRef(element, strongsRef) {
        // Find matching pronunciation data
        const pronunciation = this.getStrongsPronunciation(strongsRef);
        
        if (pronunciation) {
            const button = this.createPronunciationButton(strongsRef, pronunciation);
            
            // Add after the Strong's reference
            if (element.nextSibling) {
                element.parentNode.insertBefore(button, element.nextSibling);
            } else {
                element.parentNode.appendChild(button);
            }
        }
    }
    
    createPronunciationButton(identifier, pronunciation) {
        const container = document.createElement('span');
        container.className = 'pronunciation-container';
        
        // Audio button
        const button = document.createElement('button');
        button.className = 'pronunciation-btn';
        button.innerHTML = '🔊';
        button.title = `Play pronunciation: ${pronunciation.ipa || pronunciation.romanization}`;
        
        // Click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.playPronunciation(identifier, pronunciation);
        });
        
        // Hover handler if enabled
        if (this.options.playOnHover) {
            button.addEventListener('mouseenter', () => {
                this.playPronunciation(identifier, pronunciation);
            });
        }
        
        container.appendChild(button);
        
        // Add IPA display if enabled
        if (this.options.showIPA && pronunciation.ipa) {
            const ipa = document.createElement('span');
            ipa.className = 'ipa-text';
            ipa.textContent = `[${pronunciation.ipa}]`;
            container.appendChild(ipa);
        }
        
        // Add romanization if enabled
        if (this.options.showRomanization && pronunciation.romanization) {
            const roman = document.createElement('span');
            roman.className = 'romanization-text';
            roman.textContent = pronunciation.romanization;
            container.appendChild(roman);
        }
        
        return container;
    }
    
    createPronunciationElement(word, pronunciation, language) {
        const id = this.generateWordId(word, language);
        
        return `<span class="original-word ${language}" data-word-id="${id}">
            ${word}
            <button class="pronunciation-btn" onclick="window.biblicalPronunciation.playWord('${id}')" title="Play pronunciation">🔊</button>
            ${this.options.showIPA && pronunciation.ipa ? `<span class="ipa-text">[${pronunciation.ipa}]</span>` : ''}
            ${this.options.showRomanization && pronunciation.romanization ? `<span class="romanization-text">${pronunciation.romanization}</span>` : ''}
        </span>`;
    }
    
    async playPronunciation(identifier, pronunciation) {
        const audioFile = pronunciation.audio_file || `${identifier.toLowerCase()}.wav`;
        const audioURL = `${this.options.audioURL}/${audioFile}`;
        
        try {
            // Check cache first
            if (this.audioCache.has(audioURL)) {
                const audio = this.audioCache.get(audioURL);
                audio.currentTime = 0;
                await audio.play();
                return;
            }
            
            // Load and play audio
            const audio = new Audio(audioURL);
            
            // Cache the audio
            this.audioCache.set(audioURL, audio);
            
            audio.addEventListener('loadeddata', () => {
                audio.play().catch(error => {
                    console.warn('⚠️ Audio playback failed:', error);
                    // Fallback: show pronunciation text
                    this.showPronunciationFallback(pronunciation);
                });
            });
            
            audio.addEventListener('error', () => {
                console.warn('⚠️ Audio file not found:', audioURL);
                this.showPronunciationFallback(pronunciation);
            });
            
        } catch (error) {
            console.warn('⚠️ Pronunciation playback error:', error);
            this.showPronunciationFallback(pronunciation);
        }
    }
    
    showPronunciationFallback(pronunciation) {
        // Show text-based pronunciation as fallback
        const text = pronunciation.ipa || pronunciation.romanization || 'Pronunciation unavailable';
        
        // Create temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'pronunciation-tooltip';
        tooltip.textContent = `[${text}]`;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: "Charis SIL", serif;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 2000);
    }
    
    getPronunciation(word, language) {
        if (!this.pronunciationData) return null;
        
        const languageData = this.pronunciationData[language];
        if (!languageData) return null;
        
        // Direct match
        if (languageData[word]) {
            return languageData[word];
        }
        
        // Try without diacritics/vowel points
        const cleanWord = this.cleanWord(word);
        for (const [key, value] of Object.entries(languageData)) {
            if (this.cleanWord(key) === cleanWord) {
                return value;
            }
        }
        
        return null;
    }
    
    getStrongsPronunciation(strongsRef) {
        // This would map Strong's numbers to pronunciation data
        // For now, return null - would need Strong's to word mapping
        return null;
    }
    
    cleanWord(word) {
        // Remove Hebrew vowel points and Greek diacritics
        return word
            .replace(/[\\u0591-\\u05C7]/g, '') // Hebrew accents and vowel points
            .replace(/[\\u0300-\\u036F]/g, '') // Greek diacritics
            .trim();
    }
    
    generateWordId(word, language) {
        const clean = this.cleanWord(word);
        return `${language}_${btoa(clean).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)}`;
    }
    
    // Public API methods
    playWord(wordId) {
        const element = document.querySelector(`[data-word-id="${wordId}"]`);
        if (element) {
            const word = element.textContent.trim();
            const language = element.classList.contains('hebrew') ? 'hebrew' : 'greek';
            const pronunciation = this.getPronunciation(word, language);
            
            if (pronunciation) {
                this.playPronunciation(wordId, pronunciation);
            }
        }
    }
    
    enhanceElement(element) {
        if (element.classList.contains('pronunciation-enhanced')) return;
        
        this.processLanguageText(/[\\u0590-\\u05FF]+/g, 'hebrew');
        this.processLanguageText(/[\\u0370-\\u03FF\\u1F00-\\u1FFF]+/g, 'greek');
        
        element.classList.add('pronunciation-enhanced');
    }
    
    getEmbeddedData() {
        // Fallback pronunciation data embedded in JavaScript
        return {
            "hebrew": {
                "שלום": { "ipa": "ʃaˈlom", "romanization": "shalom", "audio_file": "shalom_hebrew.wav" },
                "אלהים": { "ipa": "eloˈhim", "romanization": "elohim", "audio_file": "elohim_hebrew.wav" },
                "יהוה": { "ipa": "jahˈwe", "romanization": "yahweh", "audio_file": "yahweh_hebrew.wav" }
            },
            "greek": {
                "θεός": { "ipa": "tʰeˈos", "romanization": "theos", "audio_file": "theos_greek.wav" },
                "χριστός": { "ipa": "χrisˈtos", "romanization": "christos", "audio_file": "christos_greek.wav" },
                "ἀγάπη": { "ipa": "aˈgapeː", "romanization": "agape", "audio_file": "agape_greek.wav" }
            },
            "metadata": {
                "total_words": 6,
                "source": "embedded_fallback"
            }
        };
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.biblicalPronunciation = new BiblicalPronunciation();
    });
} else {
    window.biblicalPronunciation = new BiblicalPronunciation();
}

// Export
window.BiblicalPronunciation = BiblicalPronunciation;