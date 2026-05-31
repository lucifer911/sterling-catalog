/**
 * GLOBAL SITE APP SCRIPT
 * Handles shared UI interactions, scroll logic, and layout injection.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inject Shared Header & Footer (Keeps template code DRY)
  injectGlobalLayout();

  // 2. Sticky Glass Header Scroll Effect
  setupScrollEffects();

  // 3. Mobile Hamburger Menu Toggle bindings
  setupMobileNav();
});

/**
 * Dynamically injects the premium header and footer layouts into page placeholder elements.
 */
function injectGlobalLayout() {
  const headerContainer = document.getElementById("global-header");
  const footerContainer = document.getElementById("global-footer");

  // Determine current active page for navigation highlight
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  if (headerContainer) {
    headerContainer.className = "header glass-panel";
    headerContainer.innerHTML = `
      <div class="logo-container">
        <a href="index.html" class="logo-container">
          <div class="silver-logo"></div>
          <span class="brand-name">STERLING TECHNOLOGY</span>
        </a>
      </div>
      <nav>
        <ul class="nav-menu" id="nav-menu-list">
          <li><a href="index.html" class="nav-link ${pageName === "index.html" ? "active" : ""}">Home</a></li>
          <li><a href="products.html" class="nav-link ${pageName === "products.html" || pageName === "product-detail.html" ? "active" : ""}">Products</a></li>
          <li><a href="instagram.html" class="nav-link ${pageName === "instagram.html" ? "active" : ""}">Instagram Showcase</a></li>
          <li><a href="company.html" class="nav-link ${pageName === "company.html" ? "active" : ""}">Company Portal</a></li>
        </ul>
      </nav>
      <div class="header-cta" style="display: flex; gap: 16px; align-items: center;">
        <a href="company.html#inquiry" class="btn-silver header-inquiry-btn">Inquiry Hub</a>
        <button class="hamburger-btn" id="mobile-nav-toggle" aria-label="Toggle Navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    `;
  }

  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col footer-about">
            <div class="logo-container" style="margin-bottom: 20px;">
              <div class="silver-logo"></div>
              <span class="brand-name">STERLING TECHNOLOGY</span>
            </div>
            <p>Premium wholesale supplier of brand new and professional-grade certified refurbished electronic appliances and hardware. Restored to original operational specifications.</p>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">EST. 2024 • Wholesale Network</div>
          </div>
          <div class="footer-col">
            <h3>Quick Links</h3>
            <ul class="footer-links">
              <li><a href="index.html">Home Dashboard</a></li>
              <li><a href="products.html">Browse Wholesale Catalog</a></li>
              <li><a href="instagram.html">Instagram Showroom</a></li>
              <li><a href="company.html">Company Profile</a></li>
              <li><a href="company.html#inquiry">Submit Wholesale intake</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Categories</h3>
            <ul class="footer-links">
              <li><a href="products.html?category=headsets">Pro ANC Headsets</a></li>
              <li><a href="products.html?category=hairdryers">Salon Hairdryers</a></li>
              <li><a href="products.html?category=toothbrushes">Sonic Toothbrushes</a></li>
              <li><a href="products.html?category=btc_miners">ASIC BTC Miners</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Wholesale Desk</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 12px;">Interested in commercial distribution? Get in touch directly with our supply logistics division.</p>
            <div style="margin-bottom: 8px;">
              <strong style="color: var(--text-main);">Email:</strong> <a href="mailto:wholesale@sterling-tech.com" style="color: var(--accent-blue);">wholesale@sterling-tech.com</a>
            </div>
            <div>
              <strong style="color: var(--text-main);">Hours:</strong> Mon - Fri, 9:00 AM - 5:00 PM EST
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© ${new Date().getFullYear()} Sterling Technology & Logistics. All Rights Reserved.</div>
          <div style="display: flex; gap: 24px;">
            <a href="#" style="hover: color: var(--text-main)">Refurbishment Standards</a>
            <a href="#" style="hover: color: var(--text-main)">Wholesale Warranty Terms</a>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Handle navigation scroll glass transparency shifting.
 */
function setupScrollEffects() {
  const header = document.getElementById("global-header");
  if (!header) return;

  const toggleHeaderState = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", toggleHeaderState);
  toggleHeaderState(); // Check immediately on load
}

/**
 * Utility: Setup standard Modal toggle hooks.
 */
function setupModalToggle(modalOverlayId, openBtnClass, closeBtnId) {
  const modal = document.getElementById(modalOverlayId);
  const openBtns = document.querySelectorAll(openBtnClass);
  const closeBtn = document.getElementById(closeBtnId);

  if (!modal) return;

  const openModal = () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore background scroll
  };

  openBtns.forEach(btn => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Close when clicking outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * Handle mobile hamburger drawer toggling
 */
function setupMobileNav() {
  const toggleBtn = document.getElementById("mobile-nav-toggle");
  const navMenu = document.getElementById("nav-menu-list");
  
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
    
    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        toggleBtn.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleBtn.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
}
