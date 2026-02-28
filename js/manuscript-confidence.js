/**
 * Biblical Manuscript Confidence System  
 * Shows textual criticism confidence levels for verses
 * Displays manuscript evidence and scholarly consensus
 */

class ManuscriptConfidence {
    constructor(options = {}) {
        this.options = {
            dataURL: options.dataURL || 'https://your-site.pages.dev/data',
            autoEnhance: options.autoEnhance !== false,
            showOnHover: options.showOnHover !== false,
            detailedPopups: options.detailedPopups !== false,
            confidenceThreshold: options.confidenceThreshold || 50,
            ...options
        };
        
        this.manuscriptData = null;
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadManuscriptData();
            
            if (this.options.autoEnhance) {
                this.enhanceExistingContent();
            }
            
            this.initialized = true;
            console.log('📜 Manuscript Confidence System initialized');
            
            // Fire ready event
            document.dispatchEvent(new CustomEvent('manuscripts:ready'));
            
        } catch (error) {
            console.error('❌ Failed to initialize manuscript system:', error);
        }
    }
    
    async loadManuscriptData() {
        try {
            const response = await fetch(`${this.options.dataURL}/manuscript_confidence.json`);
            this.manuscriptData = await response.json();
            console.log('📚 Loaded manuscript data:', 
                this.manuscriptData.metadata.total_entries, 'entries');
        } catch (error) {
            console.error('❌ Failed to load manuscript data:', error);
            // Fallback to embedded data
            this.manuscriptData = this.getEmbeddedData();
        }
    }
    
    enhanceExistingContent() {
        // Find verse references and add confidence indicators
        this.enhanceVerseReferences();
        
        // Enhance study content
        this.enhanceStudyContent();
        
        // Watch for dynamic content
        this.observeContentChanges();
    }
    
    enhanceVerseReferences() {
        // Common patterns for biblical references
        const referencePatterns = [
            /\\b(1|2|3)?\s*(John|Corinthians|Timothy|Peter|Thessalonians|Kings|Chronicles|Samuel)\\s*\\d{1,2}:\\d{1,2}(-\\d{1,2})?\\b/gi,
            /\\b(Matthew|Mark|Luke|Acts|Romans|Galatians|Ephesians|Philippians|Colossians|Hebrews|James|Revelation)\\s*\\d{1,2}:\\d{1,2}(-\\d{1,2})?\\b/gi,
            /\\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Psalms?|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)\\s*\\d{1,2}:\\d{1,2}(-\\d{1,2})?\\b/gi
        ];
        
        // Find elements that might contain verse references
        const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li, td, th');
        
        textElements.forEach(element => {
            if (element.classList.contains('manuscript-enhanced')) return;
            
            let text = element.innerHTML;
            let hasChanges = false;
            
            referencePatterns.forEach(pattern => {
                text = text.replace(pattern, (match) => {
                    const confidence = this.getConfidenceForReference(match);
                    if (confidence) {
                        hasChanges = true;
                        return this.wrapReferenceWithConfidence(match, confidence);
                    }
                    return match;
                });
            });
            
            if (hasChanges) {
                element.innerHTML = text;
                element.classList.add('manuscript-enhanced');
            }
        });
    }
    
    enhanceStudyContent() {
        // Look for specific verse discussions in study content
        document.querySelectorAll('.study-content, .verse-analysis, [class*="study"]').forEach(element => {
            this.enhanceElement(element);
        });
    }
    
    getConfidenceForReference(referenceText) {
        const normalizedRef = this.normalizeReference(referenceText);
        
        if (this.manuscriptData && this.manuscriptData.textual_data) {
            return this.manuscriptData.textual_data[normalizedRef];
        }
        
        return null;
    }
    
    normalizeReference(reference) {
        // Convert reference text to our database key format
        const clean = reference.toLowerCase()
            .replace(/\\s+/g, '_')
            .replace(/[^a-z0-9_:.-]/g, '')
            .replace(/^(\\d+)_/, '$1')  // Handle numbered books
            .replace(/psalms?/, 'psalm')
            .replace(/corinthians/, 'cor')
            .replace(/timothy/, 'tim')
            .replace(/thessalonians/, 'thess')
            .replace(/kings/, 'kgs')
            .replace(/chronicles/, 'chr')
            .replace(/samuel/, 'sam');
        
        // Map common references to our keys
        const referenceMap = {
            'john_3:16': 'john_3_16',
            '1_john_5:7': '1john_5_7',
            'mark_16:9-20': 'mark_16_9-20',
            'matthew_17:21': 'matt_17_21',
            'matthew_18:11': 'matt_18_11',
            'luke_23:34': 'luke_23_34',
            '1_cor_15:3-4': '1cor_15_3-4',
            'acts_8:37': 'acts_8_37'
        };
        
        return referenceMap[clean] || clean;
    }
    
    wrapReferenceWithConfidence(referenceText, confidenceData) {
        const level = confidenceData.level;
        const confidence = confidenceData.confidence;
        const indicator = this.getConfidenceIndicator(level, confidence);
        
        return `<span class="verse-reference-with-confidence">
            ${referenceText}
            <span class="confidence-indicator confidence-${level}" 
                  title="${confidenceData.reason}" 
                  data-reference="${referenceText}"
                  onclick="window.manuscriptConfidence.showDetails('${referenceText}')">
                ${indicator}
            </span>
        </span>`;
    }
    
    getConfidenceIndicator(level, confidence) {
        const icons = {
            'certain': '✅',
            'probable': '📜', 
            'disputed': '⚠️',
            'doubtful': '❓'
        };
        
        const icon = icons[level] || '📜';
        return `${icon} ${confidence.toFixed(0)}%`;
    }
    
    showDetails(referenceText) {
        const confidenceData = this.getConfidenceForReference(referenceText);
        
        if (!confidenceData) {
            console.warn('No confidence data found for:', referenceText);
            return;
        }
        
        this.showConfidencePopup(confidenceData);
    }
    
    showConfidencePopup(confidenceData) {
        // Close any existing popup
        this.closePopup();
        
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay manuscript-popup-overlay';
        overlay.addEventListener('click', () => this.closePopup());
        
        // Create popup
        const popup = document.createElement('div');
        popup.className = 'biblical-popup manuscript-popup';
        
        const levelColors = {
            'certain': '#28a745',
            'probable': '#ffc107', 
            'disputed': '#fd7e14',
            'doubtful': '#dc3545'
        };
        
        const levelColor = levelColors[confidenceData.level] || '#6c757d';
        
        popup.innerHTML = `
            <div class="popup-header" style="background: linear-gradient(135deg, ${levelColor}, ${this.adjustColor(levelColor, -20)})">
                <span>📜 Manuscript Evidence: ${confidenceData.reference}</span>
                <button class="popup-close" onclick="window.manuscriptConfidence.closePopup()">&times;</button>
            </div>
            <div class="popup-content">
                <div class="confidence-summary">
                    <div class="confidence-score">
                        <span class="score-value">${confidenceData.confidence.toFixed(1)}%</span>
                        <span class="score-level ${confidenceData.level}">${confidenceData.level.toUpperCase()}</span>
                    </div>
                    <p class="confidence-reason">${confidenceData.reason}</p>
                </div>
                
                <div class="manuscript-evidence">
                    <h4>📚 Manuscript Support</h4>
                    <div class="manuscript-list">
                        ${confidenceData.manuscripts.map(ms => `
                            <div class="manuscript-item">
                                <strong>${ms}</strong>
                                ${this.getManuscriptInfo(ms)}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${confidenceData.variants.length > 0 ? `
                    <div class="textual-variants">
                        <h4>📝 Textual Variants</h4>
                        <ul>
                            ${confidenceData.variants.map(variant => `<li>${variant}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="scholarly-notes">
                    <h4>🎓 Scholarly Consensus</h4>
                    <p>${confidenceData.notes}</p>
                </div>
                
                <div class="confidence-explanation">
                    <h4>❓ What This Means</h4>
                    ${this.getConfidenceExplanation(confidenceData.level, confidenceData.confidence)}
                </div>
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        this.currentPopup = overlay;
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        console.log('📜 Showing manuscript details for:', confidenceData.reference);
    }
    
    getManuscriptInfo(manuscriptName) {
        if (!this.manuscriptData?.manuscript_info) return '';
        
        const info = this.manuscriptData.manuscript_info[manuscriptName];
        if (!info) return '';
        
        return `<br><span class="manuscript-details">
            ${info.date} - ${info.significance}
        </span>`;
    }
    
    getConfidenceExplanation(level, confidence) {
        const explanations = {
            'certain': `
                <p><strong>Certain (90%+):</strong> This text is found in virtually all major manuscripts with little to no variation. You can be highly confident this represents the original text.</p>
                <p class="confidence-note">✅ <strong>Reliability:</strong> Excellent - This reading is as secure as we can reasonably expect.</p>
            `,
            'probable': `
                <p><strong>Probable (70-89%):</strong> This text has strong manuscript support but some variation exists. The reading is likely original but scholars acknowledge some uncertainty.</p>
                <p class="confidence-note">📜 <strong>Reliability:</strong> Very Good - Minor variations exist but don't affect the overall meaning.</p>
            `,
            'disputed': `
                <p><strong>Disputed (50-69%):</strong> Significant manuscript disagreement exists. Scholars debate which reading is original. Multiple viable options exist.</p>
                <p class="confidence-note">⚠️ <strong>Reliability:</strong> Moderate - Exercise caution when building theology on disputed passages.</p>
            `,
            'doubtful': `
                <p><strong>Doubtful (<50%):</strong> Little early manuscript support. Likely a later addition or scribal error. Most scholars question authenticity.</p>
                <p class="confidence-note">❓ <strong>Reliability:</strong> Low - This text probably wasn't in the original and should be used cautiously.</p>
            `
        };
        
        return explanations[level] || '<p>Manuscript evidence is being evaluated.</p>';
    }
    
    adjustColor(color, amount) {
        // Simple color adjustment function
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
    
    closePopup() {
        if (this.currentPopup) {
            this.currentPopup.remove();
            this.currentPopup = null;
            document.body.style.overflow = '';
        }
    }
    
    observeContentChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.enhanceElement(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    enhanceElement(element) {
        if (element.classList && element.classList.contains('manuscript-enhanced')) return;
        
        // Add confidence indicators to any verse references in this element
        const textElements = element.querySelectorAll ? 
            element.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li, td, th') : 
            [element];
            
        textElements.forEach(el => this.addConfidenceToElement(el));
        
        if (element.classList) {
            element.classList.add('manuscript-enhanced');
        }
    }
    
    addConfidenceToElement(element) {
        if (element.classList && element.classList.contains('confidence-processed')) return;
        
        // Process text content for verse references
        // (Implementation similar to enhanceVerseReferences but for single element)
        
        if (element.classList) {
            element.classList.add('confidence-processed');
        }
    }
    
    getEmbeddedData() {
        // Fallback manuscript data
        return {
            "textual_data": {
                "john_3_16": {
                    "reference": "John 3:16",
                    "confidence": 99.8,
                    "level": "certain",
                    "reason": "Found in all major manuscripts",
                    "manuscripts": ["P66", "P75", "Codex Sinaiticus", "Codex Vaticanus"],
                    "variants": [],
                    "notes": "Universal attestation across all manuscript traditions"
                },
                "1john_5_7": {
                    "reference": "1 John 5:7",
                    "confidence": 15.2,
                    "level": "doubtful", 
                    "reason": "Not found in any Greek manuscript before 1500 CE",
                    "manuscripts": ["Late Latin manuscripts only"],
                    "variants": ["Trinitarian formula completely absent from Greek tradition"],
                    "notes": "Almost certainly a late Latin addition (Comma Johanneum)"
                }
            },
            "manuscript_info": {
                "P66": {
                    "name": "Papyrus 66",
                    "date": "~200 CE",
                    "significance": "Earliest substantial John manuscript"
                }
            },
            "metadata": {
                "total_entries": 2,
                "source": "embedded_fallback"
            }
        };
    }
    
    // Public API methods
    showInfo(reference) {
        const confidenceData = this.getConfidenceForReference(reference);
        if (confidenceData) {
            this.showConfidencePopup(confidenceData);
        }
    }
    
    getConfidence(reference) {
        const data = this.getConfidenceForReference(reference);
        return data ? data.confidence : null;
    }
    
    isInitialized() {
        return this.initialized;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.manuscriptConfidence = new ManuscriptConfidence();
    });
} else {
    window.manuscriptConfidence = new ManuscriptConfidence();
}

// Export
window.ManuscriptConfidence = ManuscriptConfidence;