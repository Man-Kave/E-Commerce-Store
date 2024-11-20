let selectedColor = null;
let selectedSize = null;
let productData = null;

// Fetch product data
const urlParams = new URLSearchParams(window.location.search);
const handle = urlParams.get('handle');

fetch('updated_products.json')
    .then(response => response.json())
    .then(products => {
        productData = products.find(product => product.offers.some(o => o.handle === handle));

        if (!productData) {
            document.querySelector('.container2').innerHTML = '<p>Product not found.</p>';
            return;
        }

        initializeProductPage(productData);
    })
    .catch(error => console.error('Error fetching product data:', error));

function initializeProductPage(product) {
    // Set product title, description, and main image
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('mainImage').src = product.image[0];

    populateCarousel(product.image);
    populateColorOptions(product.offers);
    populateSizeOptions(product.offers);
    setDefaultSelections(product);

    updateSnipcartAttributes();
}

// Populate carousel images
function populateCarousel(images) {
    const carousel = document.getElementById('thumbnailCarousel');
    carousel.innerHTML = '';

    images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.className = 'thumbnail';
        thumbnail.onclick = () => updateMainImage(image);

        if (index === 0) thumbnail.classList.add('active');
        carousel.appendChild(thumbnail);
    });
}

// Populate color options
function populateColorOptions(offers) {
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = '';

    const uniqueColors = [...new Set(offers.map(o => o.color))];

    uniqueColors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        const thumbnail = offers.find(o => o.color === color)?.image[0];

        colorOption.innerHTML = `
            <img src="${thumbnail}" class="variant-thumbnail" alt="${color}">
            <p>${color}</p>
        `;
        colorOption.className = 'variant-option';
        colorOption.onclick = () => handleColorSelection(color, offers);

        if (index === 0) colorOption.classList.add('active');
        colorOptions.appendChild(colorOption);
    });

    selectedColor = uniqueColors[0];
}

// Populate size options
function populateSizeOptions(offers) {
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = '';

    const uniqueSizes = [...new Set(offers.map(o => o.sizes).flat())];

    uniqueSizes.forEach((size, index) => {
        const sizeButton = document.createElement('button');
        sizeButton.textContent = size;
        sizeButton.className = 'size-button';
        sizeButton.onclick = () => handleSizeSelection(size);

        if (index === 0) sizeButton.classList.add('active');
        sizeOptions.appendChild(sizeButton);
    });

    selectedSize = uniqueSizes[0];
}

// Handle color selection
function handleColorSelection(color, offers) {
    const selectedOffer = offers.find(o => o.color === color);

    if (!selectedOffer) return;

    selectedColor = color;
    updateMainImage(selectedOffer.image[0]);
    updatePrice(selectedOffer.price);
    updateSnipcartAttributes();
    updateCanonicalURL(selectedOffer.handle);

    document.querySelectorAll('.variant-option').forEach(opt => opt.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Handle size selection
function handleSizeSelection(size) {
    selectedSize = size;
    updateSnipcartAttributes();

    document.querySelectorAll('.size-button').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Set default selections
function setDefaultSelections(product) {
    const defaultOffer = product.offers[0];
    selectedColor = defaultOffer.color;
    selectedSize = defaultOffer.sizes[0];

    updateMainImage(defaultOffer.image[0]);
    updatePrice(defaultOffer.price);
    updateSnipcartAttributes();
}

// Update main image
function updateMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = imageSrc;
    mainImage.onerror = () => mainImage.src = 'product_images/fallback_image.webp';
}

// Update price
function updatePrice(price) {
    document.getElementById('productPrice').textContent = `$${price.toFixed(2)}`;
    document.getElementById('sidebarPrice').textContent = `$${price.toFixed(2)}`;
}

// Update Snipcart attributes
function updateSnipcartAttributes() {
    const addToCartButton = document.getElementById('addToCartButton');

    addToCartButton.setAttribute('data-item-id', handle);
    addToCartButton.setAttribute('data-item-name', `${productData.name} - ${selectedColor} - ${selectedSize}`);
    addToCartButton.setAttribute('data-item-price', document.getElementById('sidebarPrice').textContent.replace('$', ''));
    addToCartButton.setAttribute('data-item-url', window.location.href);
    addToCartButton.setAttribute('data-item-description', productData.description);
    addToCartButton.setAttribute('data-item-image', document.getElementById('mainImage').src);
}

// Update canonical URL
function updateCanonicalURL(handle) {
    const canonicalURL = `${window.location.origin}/product_page.html?handle=${handle}`;
    history.replaceState({}, '', canonicalURL);
}
