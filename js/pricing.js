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
 * Switcher for the Top Gallery Tabs
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
    
    // 3. Logic: Check if Resin is supported
    const resinToggle = document.getElementById('material-toggle-container');
    if (!pricingMatrix[cat].resin) {
        currentConfig.isResin = false; // Force natural if resin doesn't exist
        if(resinToggle) resinToggle.style.display = 'none';
    } else {
        if(resinToggle) resinToggle.style.display = 'flex';
    }

    // 4. UI: Rebuild Dimension Grid (The "Clean" way)
    renderDimensionGrid(availableSizes);
    
    // 5. Finalize
    updateUI();
};

/**
 * Generates the clean dimension buttons
 */
function renderDimensionGrid(sizes) {
    const grid = document.getElementById('dimension-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = `dim-pill py-4 rounded-2xl text-sm transition-all duration-300 ${size == currentConfig.dimensions ? 'active' : ''}`;
        btn.innerText = `${size}×${size}`;
        btn.onclick = (e) => window.updateSelection(size, e.target);
        grid.appendChild(btn);
    });
}

window.updateSelection = function(dim, button) {
    currentConfig.dimensions = dim;
    
    // Update button states in the grid
    button.parentElement.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    updateUI();
};

window.toggleResin = function(status) {
    currentConfig.isResin = status;
    updateUI();
};

/**
 * Main UI Refresh: Handles themes, prices, and labels
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
    
    // Product Info Mapping
    const info = {
        round: { name: "Round Accent", edge: "Radius R3" },
        pillow: { name: "Pillow Top", edge: "Radius R2" },
        live: { name: "Organic Live Edge", edge: "Live Edge" },
        straight: { name: "Industrial Straight", edge: "Straight Edge" }
    };

    // 1. Theme Management
    if (isResin) {
        card.classList.remove('dark-mode-off');
        tag.innerText = "Exclusive";
        tag.className = "bg-blue-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white";
        document.getElementById('btn-resin')?.classList.add('active');
        document.getElementById('btn-natural')?.classList.remove('active');
    } else {
        card.classList.add('dark-mode-off');
        tag.innerText = "Natural";
        tag.className = "bg-emerald-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white";
        document.getElementById('btn-natural')?.classList.add('active');
        document.getElementById('btn-resin')?.classList.remove('active');
    }

    // 2. Text Content Updates
    title.innerText = (isResin ? "Resin " : "Classic Oak ") + info[category].name;
    document.getElementById('card-edge-text').innerText = info[category].edge;
    document.getElementById('card-material-text').innerText = isResin ? "Black Resin" : "Natural Oak";
    
    // 3. Specs Update
    document.getElementById('spec-thick').innerText = `${data.thick}mm`;
    document.getElementById('spec-edge').innerText = info[category].edge;

    // 4. Price Animation
    priceDisplay.style.opacity = '0';
    setTimeout(() => {
        priceDisplay.innerText = `€${data.price}`;
        priceDisplay.style.opacity = '1';
    }, 100);
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.setCategory('round');
});