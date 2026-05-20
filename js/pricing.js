/**
 * THE WOOD AND GOOD - PREMIUM PRICING & INTERFACE ENGINE
 */

const pricingMatrix = {
    round: {
        natural: {
            600: { price: 36, thick: 20 },
            800: { price: 64, thick: 20 },
            1200: { price: 187, thick: 26 }
        },
        resin: {
            600: { price: 58, thick: 20 },
            800: { price: 102, thick: 20 },
            1200: { price: 300, thick: 26 }
        }
    },

    pillow: {
        natural: {
            600: { price: 36, thick: 20 },
            800: { price: 64, thick: 20 }
        },
        resin: {
            600: { price: 58, thick: 20 },
            800: { price: 102, thick: 20 }
        }
    },

    live: {
        natural: {
            800: { price: 83, thick: 26 },
            1500: { price: 156, thick: 26 },
            2000: { price: 208, thick: 26 },
            2400: { price: 422, thick: 40 }
        }
    },

    straight: {
        natural: {
            800: { price: 83, thick: 26 },
            1500: { price: 156, thick: 26 },
            2000: { price: 208, thick: 26 },
            2400: { price: 422, thick: 40 }
        }
    }
};

let currentConfig = {
    category: 'round',
    isResin: false,
    dimensions: 600
};

/**
 * CATEGORY SWITCH
 */
window.setCategory = function(cat) {

    currentConfig.category = cat;

    // Update active top tabs
    document.querySelectorAll('.cat-tab').forEach(btn => {
        const btnText = btn.innerText.toLowerCase().replace(' edge', '');
        btn.classList.toggle('active', btnText === cat);
    });

    const hasResin = !!pricingMatrix[cat].resin;

    // If category has no resin -> force natural
    if (!hasResin) {
        currentConfig.isResin = false;
    }

    const mode = currentConfig.isResin ? 'resin' : 'natural';

    // Get available sizes safely
    const availableSizes = Object.keys(pricingMatrix[cat][mode]);

    // Set default dimension
    currentConfig.dimensions = availableSizes[0];

    // Show/hide resin toggle
    const resinToggle = document.getElementById('material-toggle-container');

    if (resinToggle) {
        resinToggle.style.display = hasResin ? 'block' : 'none';
    }

    renderDimensionGrid(availableSizes);

    updateUI();
};

/**
 * DIMENSION GRID
 */
function renderDimensionGrid(sizes) {

    const grid = document.getElementById('dimension-grid');

    if (!grid) return;

    grid.innerHTML = '';

    sizes.forEach(size => {

        const btn = document.createElement('div');

        btn.className =
            `dim-pill ${size == currentConfig.dimensions ? 'active' : ''}`;

        btn.innerText = `${size}×${size}`;

        btn.onclick = () => {
            window.updateSelection(size, btn);
        };

        grid.appendChild(btn);
    });
}

/**
 * UPDATE DIMENSION
 */
window.updateSelection = function(dim, buttonElement) {

    currentConfig.dimensions = dim;

    const siblings =
        buttonElement.parentElement.querySelectorAll('.dim-pill');

    siblings.forEach(btn => btn.classList.remove('active'));

    buttonElement.classList.add('active');

    updateUI();
};

/**
 * TOGGLE RESIN
 */
window.toggleResin = function(status) {

    const category = currentConfig.category;

    // Prevent enabling resin if category doesn't support it
    if (status && !pricingMatrix[category].resin) {
        return;
    }

    currentConfig.isResin = status;

    const mode = status ? 'resin' : 'natural';

    // Update dimensions for current mode
    const availableSizes =
        Object.keys(pricingMatrix[category][mode]);

    // If current dimension doesn't exist -> reset
    if (!pricingMatrix[category][mode][currentConfig.dimensions]) {
        currentConfig.dimensions = availableSizes[0];
    }

    renderDimensionGrid(availableSizes);

    updateUI();
};

/**
 * MAIN UI UPDATE
 */
function updateUI() {

    const { category, isResin, dimensions } = currentConfig;

    const mode = isResin ? 'resin' : 'natural';

    // SAFETY CHECK
    if (
        !pricingMatrix[category] ||
        !pricingMatrix[category][mode] ||
        !pricingMatrix[category][mode][dimensions]
    ) {
        return;
    }

    const data = pricingMatrix[category][mode][dimensions];

    // Elements
    const card = document.getElementById('oak-configurator');
    const title = document.getElementById('card-title');
    const tag = document.getElementById('card-tag');
    const priceDisplay = document.getElementById('display-price');
    const heroImage = document.getElementById('product-hero-image');
    const imageBadge = document.getElementById('image-badge');

    // Product Info
    const info = {
        round: {
            name: "Round Accent",
            edge: "Radius R3"
        },

        pillow: {
            name: "Pillow Top",
            edge: "Radius R2"
        },

        live: {
            name: "Organic Live Edge",
            edge: "Live Edge"
        },

        straight: {
            name: "Industrial Straight",
            edge: "Straight Edge"
        }
    };

    /**
     * IMAGE UPDATE
     */
    if (heroImage) {

        heroImage.style.opacity = '0.3';

        setTimeout(() => {

            heroImage.src =
                `images/products/${category}-${mode}.jpg`;

            heroImage.style.opacity = '1';

        }, 150);
    }

    if (imageBadge) {
        imageBadge.innerText =
            isResin ? "Resin Infused" : "Latvian Oak";
    }

    /**
     * THEME UPDATE
     */
    if (isResin) {

        card.classList.remove('dark-mode-off');

        tag.innerText = "Exclusive";

        tag.className =
            "bg-blue-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block";

        document.getElementById('btn-resin')
            ?.classList.add('active');

        document.getElementById('btn-natural')
            ?.classList.remove('active');

    } else {

        card.classList.add('dark-mode-off');

        tag.innerText = "Natural";

        tag.className =
            "bg-emerald-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block";

        document.getElementById('btn-natural')
            ?.classList.add('active');

        document.getElementById('btn-resin')
            ?.classList.remove('active');
    }

    /**
     * TEXT CONTENT
     */
    title.innerText =
        (isResin ? "Resin " : "Classic Oak ")
        + info[category].name;

    const edgeLabel =
        document.getElementById('card-edge-text');

    const materialLabel =
        document.getElementById('card-material-text');

    if (edgeLabel) {
        edgeLabel.innerText = info[category].edge;
    }

    if (materialLabel) {
        materialLabel.innerText =
            isResin ? "Black Resin" : "Natural Oak";
    }

    /**
     * SPECS
     */
    const specThick =
        document.getElementById('spec-thick');

    if (specThick) {
        specThick.innerText = `${data.thick}mm`;
    }

    /**
     * PRICE
     */
    if (priceDisplay) {

        priceDisplay.style.opacity = '0';

        setTimeout(() => {

            priceDisplay.innerText = `€${data.price}`;

            priceDisplay.style.opacity = '1';

        }, 100);
    }
}

/**
 * =========================================================================
 * GLOBAL INTERFACE NAVIGATION & MODAL CONTROLLERS
 * =========================================================================
 */

// Mobile Hamburger Menu Navigation Toggle Action
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('hamburger-icon');
    
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        icon.className = "fa-solid fa-bars";
    } else {
        menu.classList.add('open');
        icon.className = "fa-solid fa-xmark";
    }
};

// Premium Modal Sheet Layout Controls
window.openPriceModal = function(targetTabId = 'tables-tab') {
    const modal = document.getElementById('price-modal');
    const sheet = document.getElementById('price-sheet');
    document.body.classList.add('overflow-hidden'); // Lock scroll context behind overlay
    
    modal.classList.remove('pointer-events-none');
    modal.classList.add('opacity-100');
    sheet.classList.remove('translate-y-full', 'md:translate-y-4');
    sheet.classList.add('translate-y-0');

    // Route view straight to targeted view parameter
    window.switchModalTab(targetTabId);
};

window.closePriceModal = function() {
    const modal = document.getElementById('price-modal');
    const sheet = document.getElementById('price-sheet');
    document.body.classList.remove('overflow-hidden');
    
    modal.classList.add('pointer-events-none');
    modal.classList.remove('opacity-100');
    sheet.classList.remove('translate-y-0');
    sheet.classList.add('translate-y-full', 'md:translate-y-4');
};

// Internal Modal Tab Segment Switching Matrix
window.switchModalTab = function(tabId) {
    const tablesBtn = document.getElementById('tables-tab');
    const panelsBtn = document.getElementById('panels-tab');
    const tablesData = document.getElementById('modal-tables-data');
    const panelsData = document.getElementById('modal-panels-data');

    if (!tablesBtn || !panelsBtn || !tablesData || !panelsData) return;

    if (tabId === 'panels-tab') {
        // Render Panel Data View Active
        panelsBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-center transition-all duration-150 bg-white text-gray-900 shadow-sm";
        tablesBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-center transition-all duration-150 text-gray-400 hover:text-gray-700";
        tablesData.classList.add('hidden');
        panelsData.classList.remove('hidden');
    } else {
        // Render Table Tops Data View Active
        tablesBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-center transition-all duration-150 bg-white text-gray-900 shadow-sm";
        panelsBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-center transition-all duration-150 text-gray-400 hover:text-gray-700";
        panelsData.classList.add('hidden');
        tablesData.classList.remove('hidden');
    }
};

// Global Hotkey Escape Configuration Hook
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closePriceModal();
});

/**
 * INITIAL LOAD
 */
document.addEventListener('DOMContentLoaded', () => {

    window.setCategory('round');

});