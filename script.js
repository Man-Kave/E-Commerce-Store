console.log("script.js has loaded successfully.");

// Search form handling
document.querySelector('.search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const category = document.querySelector('.category-dropdown').value;
    const query = document.querySelector('.search-input').value;
    console.log(`Searching for "${query}" in category "${category}"`);
});

// Sidebar toggle with safeguard
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.toggle("active");
    } else {
        console.warn("Sidebar element is not available on the page.");
    }
}

(function initializeSlideshow() {
    let currentIndex = 0;
    const images = document.querySelectorAll(".slideshow img");

    if (images.length > 0) {
        images[currentIndex].classList.add("visible");

        function showNextImage() {
            images[currentIndex].classList.remove("visible");
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add("visible");
        }

        setInterval(showNextImage, 3000); // Adjust timing if needed
    } else {
        console.warn("No slideshow images found on the page.");
    }
})();

// Breadcrumb generation
document.addEventListener("DOMContentLoaded", () => {
    const breadcrumbMap = {
        "/index.html": { name: "Home", parent: null },
        "/catalog.html": { name: "All Products", parent: "/index.html" },
        "/collection_pages/tech_gadgets.html": { name: "Tech Gadgets", parent: "/catalog.html" },
        "/collection_pages/furniture.html": { name: "Furniture", parent: "/catalog.html" },
        // Add more pages here
    };

    const currentPath = window.location.pathname.replace(/\/$/, "");
    let breadcrumbTrail = [];
    let current = breadcrumbMap[currentPath];

    while (current) {
        breadcrumbTrail.unshift(current);
        current = breadcrumbMap[current.parent];
    }

    const breadcrumbContainer = document.querySelector(".breadcrumb");
    if (breadcrumbContainer && breadcrumbTrail.length > 0) {
        breadcrumbContainer.innerHTML = breadcrumbTrail
            .map((crumb, index) => {
                if (index === breadcrumbTrail.length - 1) {
                    return `<li class="breadcrumb-item active" aria-current="page">${crumb.name}</li>`;
                } else {
                    return `<li class="breadcrumb-item"><a href="${crumb.parent || '/'}">${crumb.name}</a></li>`;
                }
            })
            .join("");
    }
});
