/**
 * Biblical Geography Interactive Feature
 * Makes biblical place names clickable with GPS-accurate maps
 * Uses OpenStreetMap (free) + Biblical Geography Database
 */

class BiblicalGeography {
    constructor() {
        this.places = {};
        this.currentPopup = null;
        this.baseURL = 'https://your-cloudflare-pages.pages.dev'; // Update this
        this.loadPlacesData();
        this.initializeFeature();
    }

    async loadPlacesData() {
        try {
            // Load from Cloudflare Pages (will set this up next)
            const response = await fetch(`${this.baseURL}/data/biblical_places.json`);
            this.places = await response.json();
            console.log(`✅ Loaded ${Object.keys(this.places).length} biblical places`);
            this.enhanceExistingContent();
        } catch (error) {
            console.error('❌ Failed to load biblical places:', error);
            // Fallback to local data during development
            try {
                const response = await fetch('/biblical_places.json');
                this.places = await response.json();
                console.log(`✅ Loaded ${Object.keys(this.places).length} biblical places (local fallback)`);
                this.enhanceExistingContent();
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
            }
        }
    }

    initializeFeature() {
        // Add CSS styles
        this.injectStyles();
        
        // Listen for dynamic content changes
        this.observeContentChanges();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Biblical Geography Styles */
            .biblical-place {
                color: var(--ultramarine, #2c5282);
                cursor: pointer;
                border-bottom: 1px dotted var(--gold, #c59612);
                position: relative;
                transition: all 0.2s ease;
            }
            
            .biblical-place:hover {
                background: rgba(197,150,12,0.1);
                border-bottom: 2px solid var(--gold, #c59612);
            }
            
            .biblical-place-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--vellum-light, #faf5e8);
                border: 2px solid var(--gold, #c59612);
                border-radius: 12px;
                padding: 0;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                font-family: var(--font-reading);
            }
            
            .popup-header {
                background: linear-gradient(135deg, var(--gold, #c59612), #d4a717);
                color: var(--vellum-light, #faf5e8);
                padding: 15px 20px;
                margin: 0;
                font-family: var(--font-heading);
                font-size: 1.3rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .popup-close {
                background: none;
                border: none;
                color: var(--vellum-light, #faf5e8);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            
            .popup-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .popup-content {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .place-map {
                width: 100%;
                height: 250px;
                border: 1px solid var(--parchment, #e8dcc0);
                border-radius: 8px;
                margin-bottom: 15px;
            }
            
            .place-info {
                display: grid;
                gap: 10px;
            }
            
            .place-confidence {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 600;
            }
            
            .confidence-high { background: #d4edda; color: #155724; }
            .confidence-medium { background: #fff3cd; color: #856404; }
            .confidence-low { background: #f8d7da; color: #721c24; }
            
            .place-image {
                width: 100%;
                max-height: 200px;
                object-fit: cover;
                border-radius: 8px;
                margin: 10px 0;
            }
            
            .place-verses {
                background: var(--parchment, #e8dcc0);
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }
            
            .place-verses h4 {
                margin: 0 0 10px 0;
                color: var(--ink, #3c2f2f);
                font-family: var(--font-heading);
            }
            
            .verse-ref {
                display: inline-block;
                background: var(--vellum-light, #faf5e8);
                border: 1px solid var(--gold, #c59612);
                padding: 2px 6px;
                margin: 2px;
                border-radius: 4px;
                font-size: 0.85rem;
                text-decoration: none;
                color: var(--ultramarine, #2c5282);
                transition: all 0.2s;
            }
            
            .verse-ref:hover {
                background: var(--gold, #c59612);
                color: var(--vellum-light, #faf5e8);
            }
            
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            }
            
            .place-modern-name {
                color: var(--leather-dark, #6b5b73);
                font-style: italic;
                font-size: 0.9rem;
            }
            
            .place-types {
                display: flex;
                gap: 5px;
                margin: 5px 0;
            }
            
            .place-type {
                background: var(--ultramarine, #2c5282);
                color: var(--vellum-light, #faf5e8);
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .biblical-place-popup {
                    width: 95vw;
                    max-height: 90vh;
                }
                
                .place-map {
                    height: 200px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    enhanceExistingContent() {
        // Find all text content and make biblical places clickable
        this.processTextNodes(document.body);
    }

    processTextNodes(element) {
        if (!this.places || Object.keys(this.places).length === 0) return;

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script, style, and already processed nodes
                    const parent = node.parentElement;
                    if (!parent || 
                        parent.tagName === 'SCRIPT' || 
                        parent.tagName === 'STYLE' ||
                        parent.classList.contains('biblical-place') ||
                        parent.closest('.biblical-place-popup')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            let text = textNode.textContent;
            let hasReplacement = false;
            
            // Check for biblical place names (case insensitive)
            Object.keys(this.places).forEach(placeName => {
                const regex = new RegExp(`\\b${this.escapeRegex(placeName)}\\b`, 'gi');
                if (regex.test(text)) {
                    text = text.replace(regex, `<span class="biblical-place" data-place="${placeName}">$&</span>`);
                    hasReplacement = true;
                }
            });

            if (hasReplacement) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = text;
                
                // Replace the text node with the enhanced content
                const parent = textNode.parentNode;
                while (wrapper.firstChild) {
                    parent.insertBefore(wrapper.firstChild, textNode);
                }
                parent.removeChild(textNode);
            }
        });

        // Add click handlers to new biblical place spans
        document.querySelectorAll('.biblical-place:not([data-handler-added])').forEach(span => {
            span.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const placeName = span.getAttribute('data-place');
                this.showPlacePopup(placeName);
            });
            span.setAttribute('data-handler-added', 'true');
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showPlacePopup(placeName) {
        const place = this.places[placeName];
        if (!place) {
            console.warn(`Place not found: ${placeName}`);
            return;
        }

        // Close existing popup
        this.closePopup();

        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.addEventListener('click', () => this.closePopup());

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'biblical-place-popup';
        
        const confidenceLevel = place.confidence >= 75 ? 'high' : 
                               place.confidence >= 40 ? 'medium' : 'low';
        
        const modernName = place.modern_name.replace(/^m[a-f0-9]+/, '').trim();
        
        popup.innerHTML = `
            <div class="popup-header">
                <span>${place.name}</span>
                <button class="popup-close" onclick="this.closest('.popup-overlay').remove()">&times;</button>
            </div>
            <div class="popup-content">
                <div class="place-info">
                    ${modernName ? `<p class="place-modern-name">Modern location: ${modernName}</p>` : ''}
                    
                    <div class="place-types">
                        ${place.types.map(type => `<span class="place-type">${type}</span>`).join('')}
                    </div>
                    
                    <div class="place-confidence confidence-${confidenceLevel}">
                        🎯 ${place.confidence}% location confidence
                    </div>
                    
                    <iframe class="place-map" 
                        src="https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude-0.02},${place.latitude-0.02},${place.longitude+0.02},${place.latitude+0.02}&marker=${place.latitude},${place.longitude}"
                        frameborder="0">
                    </iframe>
                    
                    ${place.image_url ? `
                        <img src="${place.image_url}" 
                             alt="${place.description}" 
                             class="place-image"
                             onerror="this.style.display='none'">
                        <p style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                            ${place.description} 
                            ${place.image_credit ? `(📸 ${place.image_credit})` : ''}
                        </p>
                    ` : ''}
                    
                    ${place.verses.length > 0 ? `
                        <div class="place-verses">
                            <h4>📖 Biblical References</h4>
                            ${place.verses.map(verse => 
                                `<a href="#" class="verse-ref" onclick="return false;">${verse.reference}</a>`
                            ).join(' ')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        this.currentPopup = overlay;
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        console.log(`📍 Showing ${place.name} at ${place.latitude}, ${place.longitude}`);
    }

    closePopup() {
        if (this.currentPopup) {
            this.currentPopup.remove();
            this.currentPopup = null;
            document.body.style.overflow = '';
        }
    }

    observeContentChanges() {
        // Watch for dynamically added content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.processTextNodes(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public API methods
    showPlace(placeName) {
        this.showPlacePopup(placeName);
    }

    getPlaceData(placeName) {
        return this.places[placeName];
    }

    getAllPlaces() {
        return Object.keys(this.places).sort();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.biblicalGeography = new BiblicalGeography();
    });
} else {
    window.biblicalGeography = new BiblicalGeography();
}

// Make it available globally
window.BiblicalGeography = BiblicalGeography;