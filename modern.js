// DOM elements
const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navMenu = document.querySelector(".nav-menu");

// Iframe handling functions
function resizeIframe(iframe) {
    try {
        // Try to get the height from the iframe content
        setTimeout(() => {
            if (iframe.contentWindow.document.body) {
                // For same-origin iframes
                const height = iframe.contentWindow.document.body.scrollHeight;
                const minHeight = 400; // Minimum height in pixels

                // Only apply if the content height is reasonable
                if (height > minHeight) {
                    const container = iframe.closest(
                        ".iframe-container, .iframe-fullwidth"
                    );
                    if (container) {
                        if (container.classList.contains("iframe-container")) {
                            container.style.height = `${height + 40}px`; // Add padding
                            container.style.paddingBottom = "0";
                            console.log(
                                `Resized iframe container to ${
                                    height + 40
                                }px for ${iframe.src}`
                            );
                        } else {
                            container.style.height = `${height + 40}px`;
                            console.log(
                                `Resized iframe-fullwidth to ${
                                    height + 40
                                }px for ${iframe.src}`
                            );
                        }
                    }
                }
            }
        }, 500); // Delay to ensure content is loaded
    } catch (e) {
        // Cross-origin iframe - can't access content height
        console.log(
            `Cross-origin iframe detected for ${iframe.src}, using default sizing`
        );
    }
}

// Handle all iframes on the page
function initializeIframes() {
    const iframeContainers = document.querySelectorAll(
        '[data-iframe-resize="true"]'
    );
    console.log(
        `Found ${iframeContainers.length} iframe containers to initialize`
    );

    iframeContainers.forEach((container) => {
        const iframe = container.querySelector("iframe");
        if (iframe) {
            // Set a minimum height for the container initially
            const defaultHeight = container.classList.contains(
                "iframe-fullwidth"
            )
                ? "600px"
                : "400px";
            container.style.minHeight = defaultHeight;
            console.log(
                `Setting minimum height ${defaultHeight} for iframe: ${iframe.src}`
            );

            // Set specific heights for known cross-origin iframe content
            if (iframe.src.includes("harry_potter_vis")) {
                container.style.height = "600px";
                container.style.paddingBottom = "0";
                console.log(
                    `Applied custom height for Harry Potter visualisation`
                );
            }

            if (iframe.src.includes("network_to_dynamic_graph_embedding")) {
                container.style.height = "700px";
                container.style.paddingBottom = "0";
                console.log(
                    `Applied custom height for dynamic graph embedding visualisation`
                );
            }

            if (iframe.src.includes("example_pyemb_quick_plot")) {
                container.style.height = "650px";
                console.log(`Applied custom height for pyemb visualisation`);
            }

            // Add resize event listener to handle window resizing
            window.addEventListener("resize", () => {
                // Reset any explicit heights and let CSS take over on mobile
                if (window.innerWidth < 768) {
                    if (container.classList.contains("iframe-container")) {
                        container.style.height = "";
                        container.style.paddingBottom =
                            container.classList.contains("dynamic")
                                ? "0"
                                : "56.25%";
                    }
                } else {
                    // Try to resize again on desktop
                    if (iframe.contentDocument) {
                        resizeIframe(iframe);
                    }
                }
            });
        }
    });
}

// Intersection Observer for sections
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
};

// Observer for animating sections when they come into view
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");

            // Animate child elements
            const animElements = entry.target.querySelectorAll(
                ".anim-fade-in, .anim-fade-up, .anim-fade-right"
            );
            animElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add("animated");
                }, 100 * index);
            });
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach((section) => {
    sectionObserver.observe(section);
    section.classList.add("section-hidden");
});

// Observer for active section detection (for navigation)
const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute("id");

                // Update navigation links
                navLinks.forEach((link) => {
                    const href = link.getAttribute("href").substring(1);
                    if (href === activeId) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    },
    { rootMargin: "-30% 0px -70% 0px" }
);

// Observe sections for navigation
sections.forEach((section) => {
    if (section.id) {
        navObserver.observe(section);
    }
});

// Header scroll effect
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
});

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        mobileMenuToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            mobileMenuToggle.classList.remove("active");
        });
    });
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
    if (
        navMenu &&
        !navMenu.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
    ) {
        navMenu.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behaviour: "smooth",
            });
        }
    });
});

// Typed.js integration for hero subtitle
if (typeof Typed !== "undefined" && document.querySelector(".typed-text")) {
    new Typed(".typed-text", {
        strings: [
            "Graph Embedding Researcher",
            "PyTorch Developer",
            "Network Analysis Expert",
            "PhD in Computational Statistics",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
    });
}

// Add animation classes to elements
document.addEventListener("DOMContentLoaded", () => {
    // Initialize iframe handling
    initializeIframes();

    // Add animation classes to paper cards
    document.querySelectorAll(".paper-card").forEach((card, index) => {
        card.classList.add("anim-fade-up");
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Add animation classes to project cards
    document.querySelectorAll(".project-card").forEach((card, index) => {
        card.classList.add("anim-fade-up");
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Code animation
    document.querySelectorAll("pre code").forEach((block) => {
        block.classList.add("anim-fade-in");
    });

    // Image animation
    document.querySelectorAll(".images").forEach((img) => {
        img.classList.add("anim-fade-in");
    });
});

// Dark mode toggle
const createDarkModeToggle = () => {
    const toggle = document.createElement("button");
    toggle.classList.add("dark-mode-toggle");
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(toggle);

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem("darkMode", "enabled");
        } else {
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // Check for saved user preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
};

// Initialize dark mode toggle
createDarkModeToggle();

// Initialize iframes
initializeIframes();
