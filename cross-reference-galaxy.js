/**
 * Cross-Reference Galaxy
 * Interactive visualization showing how Scripture is connected
 * For The Unveiled Word website
 */

class CrossReferenceGalaxy {
    constructor(containerId, data) {
        this.container = d3.select(containerId);
        this.data = data;
        this.width = 800;
        this.height = 600;
        this.nodeRadius = 8;
        
        // Connection types with colors
        this.connectionTypes = {
            'same-word': { color: '#3498db', name: 'Same Greek/Hebrew Word' },
            'parallel': { color: '#2ecc71', name: 'Parallel Passage' },
            'thematic': { color: '#f1c40f', name: 'Thematic Connection' },
            'prophetic': { color: '#e74c3c', name: 'Prophetic Fulfillment' },
            'quote': { color: '#9b59b6', name: 'NT Quotes OT' },
            'word-family': { color: '#1abc9c', name: 'Word Family' },
            'context': { color: '#95a5a6', name: 'Historical Context' }
        };
        
        this.setupSVG();
        this.setupSimulation();
        this.createLegend();
    }
    
    setupSVG() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('border', '1px solid #ddd')
            .style('border-radius', '8px');
            
        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
            
        this.svg.call(zoom);
        
        // Main group for all elements
        this.g = this.svg.append('g');
        
        // Gradient definitions for connections
        const defs = this.svg.append('defs');
        Object.keys(this.connectionTypes).forEach(type => {
            const gradient = defs.append('linearGradient')
                .attr('id', `gradient-${type}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '100%').attr('y2', '0%');
                
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', this.connectionTypes[type].color)
                .attr('stop-opacity', 0.8);
                
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', this.connectionTypes[type].color)
                .attr('stop-opacity', 0.3);
        });
    }
    
    setupSimulation() {
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(120).strength(0.1))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(this.nodeRadius + 5));
    }
    
    createLegend() {
        const legend = this.container.append('div')
            .attr('class', 'galaxy-legend')
            .style('margin-top', '20px')
            .style('display', 'flex')
            .style('flex-wrap', 'wrap')
            .style('gap', '15px');
            
        Object.entries(this.connectionTypes).forEach(([type, config]) => {
            const item = legend.append('div')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('gap', '5px')
                .style('font-size', '12px');
                
            item.append('div')
                .style('width', '12px')
                .style('height', '3px')
                .style('background', config.color)
                .style('border-radius', '2px');
                
            item.append('span')
                .text(config.name)
                .style('color', '#666');
        });
    }
    
    loadData(studyData) {
        this.nodes = studyData.verses.map(verse => ({
            id: verse.reference,
            reference: verse.reference,
            text: verse.text,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            isMain: verse.isMain || false,
            greekWords: verse.greekWords || [],
            hebrewWords: verse.hebrewWords || []
        }));
        
        this.links = studyData.connections.map(connection => ({
            source: connection.from,
            target: connection.to,
            type: connection.type,
            reason: connection.reason,
            strength: connection.strength || 1
        }));
        
        this.render();
    }
    
    render() {
        // Clear previous render
        this.g.selectAll('*').remove();
        
        // Create links
        this.linkElements = this.g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', d => this.connectionTypes[d.type].color)
            .attr('stroke-width', d => Math.max(1, d.strength * 3))
            .attr('stroke-opacity', 0.6)
            .style('cursor', 'pointer')
            .on('mouseover', this.showConnectionInfo.bind(this))
            .on('mouseout', this.hideConnectionInfo.bind(this));
        
        // Create nodes
        this.nodeElements = this.g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', this.dragStarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragEnded.bind(this)));
        
        // Node circles
        this.nodeElements.append('circle')
            .attr('r', d => d.isMain ? this.nodeRadius * 1.5 : this.nodeRadius)
            .attr('fill', d => d.isMain ? '#e74c3c' : '#3498db')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .on('click', this.selectVerse.bind(this))
            .on('mouseover', this.showVerseInfo.bind(this))
            .on('mouseout', this.hideVerseInfo.bind(this));
        
        // Node labels
        this.nodeElements.append('text')
            .text(d => this.formatReference(d.reference))
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.isMain ? 25 : 20)
            .attr('font-size', d => d.isMain ? '12px' : '10px')
            .attr('font-weight', d => d.isMain ? 'bold' : 'normal')
            .attr('fill', '#333');
        
        // Update simulation
        this.simulation
            .nodes(this.nodes)
            .on('tick', this.ticked.bind(this));
            
        this.simulation.force('link')
            .links(this.links);
            
        this.simulation.restart();
        
        // Create tooltip
        this.tooltip = this.container.append('div')
            .attr('class', 'galaxy-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('font-size', '12px')
            .style('max-width', '300px')
            .style('pointer-events', 'none')
            .style('z-index', 1000);
    }
    
    ticked() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
            
        this.nodeElements
            .attr('transform', d => `translate(${d.x},${d.y})`);
    }
    
    formatReference(ref) {
        // Convert "Matthew 6:25" to "Mt 6:25"
        const bookAbbrev = {
            'Matthew': 'Mt', 'Mark': 'Mk', 'Luke': 'Lk', 'John': 'Jn',
            'Acts': 'Ac', 'Romans': 'Ro', 'Corinthians': 'Co',
            'Galatians': 'Ga', 'Ephesians': 'Ep', 'Philippians': 'Ph',
            'Colossians': 'Col', 'Thessalonians': 'Th', 'Timothy': 'Ti',
            'Titus': 'Tit', 'Philemon': 'Phm', 'Hebrews': 'Heb',
            'James': 'Jas', 'Peter': 'Pe', 'Revelation': 'Re',
            'Genesis': 'Ge', 'Exodus': 'Ex', 'Leviticus': 'Le',
            'Numbers': 'Nu', 'Deuteronomy': 'Dt', 'Joshua': 'Jos',
            'Judges': 'Jdg', 'Ruth': 'Ru', 'Samuel': 'Sa',
            'Kings': 'Ki', 'Chronicles': 'Ch', 'Ezra': 'Ezr',
            'Nehemiah': 'Ne', 'Esther': 'Est', 'Job': 'Job',
            'Psalms': 'Ps', 'Proverbs': 'Pr', 'Ecclesiastes': 'Ec',
            'Isaiah': 'Isa', 'Jeremiah': 'Jer', 'Ezekiel': 'Eze',
            'Daniel': 'Da', 'Hosea': 'Hos', 'Joel': 'Joe',
            'Amos': 'Am', 'Obadiah': 'Ob', 'Jonah': 'Jon',
            'Micah': 'Mic', 'Nahum': 'Na', 'Habakkuk': 'Hab',
            'Zephaniah': 'Zep', 'Haggai': 'Hag', 'Zechariah': 'Zec',
            'Malachi': 'Mal'
        };
        
        let formatted = ref;
        Object.entries(bookAbbrev).forEach(([full, abbrev]) => {
            if (ref.includes(full)) {
                formatted = ref.replace(full, abbrev);
            }
        });
        
        return formatted;
    }
    
    selectVerse(event, d) {
        // Highlight connections from this verse
        this.highlightConnections(d.id);
        
        // Show verse details
        this.showVerseDetails(d);
        
        // Emit custom event
        this.container.node().dispatchEvent(new CustomEvent('verseSelected', {
            detail: { verse: d }
        }));
    }
    
    highlightConnections(verseId) {
        // Reset all elements
        this.linkElements
            .attr('stroke-opacity', 0.1)
            .attr('stroke-width', 1);
            
        this.nodeElements.select('circle')
            .attr('fill-opacity', 0.3);
            
        // Highlight connected elements
        this.linkElements
            .filter(d => d.source.id === verseId || d.target.id === verseId)
            .attr('stroke-opacity', 0.8)
            .attr('stroke-width', d => Math.max(2, d.strength * 4));
            
        // Highlight connected nodes
        const connectedNodes = new Set([verseId]);
        this.links
            .filter(d => d.source.id === verseId || d.target.id === verseId)
            .forEach(d => {
                connectedNodes.add(d.source.id);
                connectedNodes.add(d.target.id);
            });
            
        this.nodeElements
            .filter(d => connectedNodes.has(d.id))
            .select('circle')
            .attr('fill-opacity', 1);
    }
    
    showVerseInfo(event, d) {
        const tooltip = this.tooltip;
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        
        tooltip.html(`
            <strong>${d.reference}</strong><br/>
            <em>"${d.text.substring(0, 100)}${d.text.length > 100 ? '...' : ''}"</em><br/>
            ${d.greekWords.length > 0 ? `<br/><strong>Greek:</strong> ${d.greekWords.join(', ')}` : ''}
            ${d.hebrewWords.length > 0 ? `<br/><strong>Hebrew:</strong> ${d.hebrewWords.join(', ')}` : ''}
        `)
        .style('left', `${mouseX + 10}px`)
        .style('top', `${mouseY - 10}px`)
        .transition()
        .duration(200)
        .style('opacity', 1);
    }
    
    hideVerseInfo() {
        this.tooltip.transition()
            .duration(200)
            .style('opacity', 0);
    }
    
    showConnectionInfo(event, d) {
        const tooltip = this.tooltip;
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        
        tooltip.html(`
            <strong>${this.connectionTypes[d.type].name}</strong><br/>
            <em>${d.reason}</em><br/>
            <small>${d.source.reference} ↔ ${d.target.reference}</small>
        `)
        .style('left', `${mouseX + 10}px`)
        .style('top', `${mouseY - 10}px`)
        .transition()
        .duration(200)
        .style('opacity', 1);
    }
    
    hideConnectionInfo() {
        this.tooltip.transition()
            .duration(200)
            .style('opacity', 0);
    }
    
    showVerseDetails(verse) {
        // Create or update verse details panel
        let detailsPanel = this.container.select('.verse-details');
        if (detailsPanel.empty()) {
            detailsPanel = this.container.append('div')
                .attr('class', 'verse-details')
                .style('margin-top', '20px')
                .style('padding', '15px')
                .style('border', '1px solid #ddd')
                .style('border-radius', '8px')
                .style('background', '#f9f9f9');
        }
        
        detailsPanel.html(`
            <h4>${verse.reference}</h4>
            <p><em>"${verse.text}"</em></p>
            ${verse.greekWords.length > 0 ? 
                `<p><strong>Greek words:</strong> ${verse.greekWords.map(w => `<span class="original-word">${w}</span>`).join(', ')}</p>` 
                : ''}
            ${verse.hebrewWords.length > 0 ? 
                `<p><strong>Hebrew words:</strong> ${verse.hebrewWords.map(w => `<span class="original-word">${w}</span>`).join(', ')}</p>` 
                : ''}
            <button onclick="window.open('../interlinear/${verse.book.toLowerCase()}-${verse.chapter}.html', '_blank')" 
                    style="margin-top: 10px; padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                View Interlinear
            </button>
        `);
    }
    
    dragStarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragEnded(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Reset view
    resetView() {
        this.linkElements
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.max(1, d.strength * 3));
            
        this.nodeElements.select('circle')
            .attr('fill-opacity', 1);
            
        this.hideVerseInfo();
    }
    
    // Filter by connection type
    filterByType(types) {
        const typeSet = new Set(types);
        
        this.linkElements
            .style('display', d => typeSet.has(d.type) ? 'block' : 'none');
            
        // Update node visibility based on remaining connections
        const visibleNodes = new Set();
        this.links
            .filter(d => typeSet.has(d.type))
            .forEach(d => {
                visibleNodes.add(d.source.id);
                visibleNodes.add(d.target.id);
            });
            
        this.nodeElements
            .style('opacity', d => visibleNodes.has(d.id) ? 1 : 0.3);
    }
    
    // Show all connections
    showAll() {
        this.linkElements.style('display', 'block');
        this.nodeElements.style('opacity', 1);
    }
}

// Initialize galaxy when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if galaxy container exists
    const container = document.getElementById('cross-reference-galaxy');
    if (container) {
        window.galaxyInstance = new CrossReferenceGalaxy('#cross-reference-galaxy');
        
        // Load data if available
        if (window.crossReferenceData) {
            window.galaxyInstance.loadData(window.crossReferenceData);
        }
    }
});