/**
 * THE WOOD AND GOOD - PREMIUM PRICING ENGINE
 * Sourced from inventory spreadsheet
 */

const pricingMatrix = {
    round: {
        natural: { 600: { price: 36, thick: 20 }, 800: { price: 64, thick: 20 }, 1200: { price: 187, thick: 26 } },
        resin: { 600: { price: 58, thick: 20 }, 800: { price: 102, thick: 20 }, 1200: { price: 300, thick: 26 } }
    },
    pillow: {
        natural: { 600: { price: 36, thick: 20 }, 800: { price: 64, thick: 20 } },
        resin: { 600: { price: 58, thick: 20 }, 800: { price: 102, thick: 20 } }
    },
    live: {
        natural: { 800: { price: 83, thick: 26 }, 1500: { price: 156, thick: 26 }, 2000: { price: 208, thick: 26 }, 2400: { price: 422, thick: 40 } }
    },
    straight: {
        natural: { 800: { price: 83, thick: 26 }, 1500: { price: 156, thick: 26 }, 2000: { price: 208, thick: 26 }, 2400: { price: 422, thick: 40 } }
    }
};

let currentConfig = {
    category: 'round',
    isResin: false,
    dimensions: 600
};

/**
 * Switcher for the Top Gallery Tabs (Round, Pillow, etc.)
 */
window.setCategory = function(cat) {
    currentConfig.category = cat;

    // 1. UI: Update Top Tabs style
    document.querySelectorAll('.cat-tab').forEach(btn => {
        const btnText = btn.innerText.toLowerCase().replace(' edge', '');
        btn.classList.toggle('active', btnText === cat);
    });

    // 2. Logic: Reset to defaults for this category
    const availableSizes = Object.keys(pricingMatrix[cat].natural);
    currentConfig.dimensions = availableSizes[0];
    
    // 3. Logic: Check if Resin is supported for this shape
    const resinToggle = document.getElementById('material-toggle-container');
    if (!pricingMatrix[cat].resin) {
        currentConfig.isResin = false; // Force natural if resin doesn't exist
        if(resinToggle) resinToggle.style.display = 'none';
    } else {
        if(resinToggle) resinToggle.style.display = 'block';
    }

    // 4. UI: Rebuild Dimension Grid
    renderDimensionGrid(availableSizes);
    
    // 5. Finalize UI State
    updateUI();
};

/**
 * Generates the premium dimension pills
 */
function renderDimensionGrid(sizes) {
    const grid = document.getElementById('dimension-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    sizes.forEach(size => {
        const btn = document.createElement('div');
        btn.className = `dim-pill ${size == currentConfig.dimensions ? 'active' : ''}`;
        btn.innerText = `${size}×${size}`;
        btn.onclick = (e) => window.updateSelection(size, btn);
        grid.appendChild(btn);
    });
}

window.updateSelection = function(dim, buttonElement) {
    currentConfig.dimensions = dim;
    
    // Update active state in grid
    const siblings = buttonElement.parentElement.querySelectorAll('.dim-pill');
    siblings.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    updateUI();
};

window.toggleResin = function(status) {
    currentConfig.isResin = status;
    updateUI();
};

/**
 * Main UI Refresh: Handles theme swapping, prices, labels, and IMAGES
 */
function updateUI() {
    const { category, isResin, dimensions } = currentConfig;
    const mode = isResin ? 'resin' : 'natural';
    const data = pricingMatrix[category][mode][dimensions];

    // DOM Elements
    const card = document.getElementById('oak-configurator');
    const title = document.getElementById('card-title');
    const tag = document.getElementById('card-tag');
    const priceDisplay = document.getElementById('display-price');
    const heroImage = document.getElementById('product-hero-image');
    const imageBadge = document.getElementById('image-badge');
    
    // Product Info Mapping
    const info = {
        round: { name: "Round Accent", edge: "Radius R3" },
        pillow: { name: "Pillow Top", edge: "Radius R2" },
        live: { name: "Organic Live Edge", edge: "Live Edge" },
        straight: { name: "Industrial Straight", edge: "Straight Edge" }
    };

    // 1. IMAGE & BADGE UPDATE (Apple-style fade)
    if (heroImage) {
        heroImage.style.opacity = '0.3'; // Start fade out
        
        setTimeout(() => {
            // Path: images/products/round-natural.jpg, pillow-resin.jpg, etc.
            heroImage.src = `images/products/${category}-${mode}.jpg`;
            heroImage.style.opacity = '1'; // Fade in
        }, 150);
    }

    if (imageBadge) {
        imageBadge.innerText = isResin ? "Resin Infused" : "Latvian Oak";
    }

    // 2. Theme & Toggle Management
    if (isResin) {
        card.classList.remove('dark-mode-off'); 
        tag.innerText = "Exclusive";
        tag.className = "bg-blue-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block";
        
        document.getElementById('btn-resin')?.classList.add('active');
        document.getElementById('btn-natural')?.classList.remove('active');
    } else {
        card.classList.add('dark-mode-off'); 
        tag.innerText = "Natural";
        tag.className = "bg-emerald-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block";
        
        document.getElementById('btn-natural')?.classList.add('active');
        document.getElementById('btn-resin')?.classList.remove('active');
    }

    // 3. Text Content Updates
    title.innerText = (isResin ? "Resin " : "Classic Oak ") + info[category].name;
    
    const edgeLabel = document.getElementById('card-edge-text');
    const materialLabel = document.getElementById('card-material-text');
    
    if (edgeLabel) edgeLabel.innerText = info[category].edge;
    if (materialLabel) materialLabel.innerText = isResin ? "Black Resin" : "Natural Oak";
    
    // 4. Specs Update
    const specThick = document.getElementById('spec-thick');
    const specEdge = document.getElementById('spec-edge');
    
    if (specThick) specThick.innerText = `${data.thick}mm`;
    if (specEdge) specEdge.innerText = info[category].edge;

    // 5. Price Animation
    if (priceDisplay) {
        priceDisplay.style.opacity = '0';
        setTimeout(() => {
            priceDisplay.innerText = `€${data.price}`;
            priceDisplay.style.opacity = '1';
        }, 100);
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.setCategory('round');
});