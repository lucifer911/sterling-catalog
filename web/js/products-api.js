/**
 * PRODUCTS DATA SERVICE
 * Handles loading catalog items dynamically from GitHub raw hosting
 * or fallback to local storage during offline/development.
 */

// Configure this to match your actual GitHub repository when deploying:
const GITHUB_CONFIG = {
  enabled: false, // Set to true once repo is created and URL is populated
  username: "your-github-username",
  repo: "your-repo-name",
  branch: "main",
  path: "web/data/products.json"
};

let cachedProducts = null;

/**
 * Gets the target URL for loading products.json
 */
function getProductsDataUrl() {
  if (GITHUB_CONFIG.enabled && GITHUB_CONFIG.username && GITHUB_CONFIG.repo) {
    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.path}`;
  }
  // Local fallback
  return "./data/products.json";
}

/**
 * Fetch all products, first attempting the GitHub endpoint (if enabled)
 * then falling back to the local relative JSON catalog.
 */
async function fetchProducts() {
  if (cachedProducts) {
    return cachedProducts;
  }

  const primaryUrl = getProductsDataUrl();
  console.log(`[Products API] Attempting to load catalog from: ${primaryUrl}`);

  try {
    const response = await fetch(primaryUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }
    const data = await response.json();
    
    // Auto-resolve relative image paths to remote GitHub raw URLs if sync is active
    if (GITHUB_CONFIG.enabled && GITHUB_CONFIG.username && GITHUB_CONFIG.repo) {
      data.forEach(product => {
        if (product.images) {
          product.images = product.images.map(img => {
            if (img.startsWith("./images/") || img.startsWith("images/")) {
              const cleanPath = img.startsWith("./") ? img.substring(2) : img;
              return `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/web/${cleanPath}`;
            }
            return img;
          });
        }
      });
    }

    console.log(`[Products API] Loaded ${data.length} products from primary source.`);
    cachedProducts = data;
    return cachedProducts;
  } catch (error) {
    console.warn(`[Products API] Primary source failed: "${error.message}". Attempting local fallback...`);
    
    // Always fallback to local products.json if primary fails
    try {
      const fallbackResponse = await fetch("./data/products.json");
      if (!fallbackResponse.ok) {
        throw new Error(`Fallback HTTP Status: ${fallbackResponse.status}`);
      }
      const fallbackData = await fallbackResponse.json();
      console.log(`[Products API] Fallback successful. Loaded ${fallbackData.length} items.`);
      cachedProducts = fallbackData;
      return cachedProducts;
    } catch (fallbackError) {
      console.error("[Products API] Complete loading failure: both remote and local failed.", fallbackError);
      return [];
    }
  }
}

/**
 * Get all product items
 */
async function getAllProducts() {
  return await fetchProducts();
}

/**
 * Find a specific product by its unique ID
 */
async function getProductById(id) {
  const products = await fetchProducts();
  return products.find(p => p.id === id) || null;
}

/**
 * Get items flagged as "featured" for the home page showcase
 */
async function getFeaturedProducts() {
  const products = await fetchProducts();
  return products.filter(p => p.featured === true);
}

/**
 * Get items flagged as "new_arrival"
 */
async function getNewArrivals() {
  const products = await fetchProducts();
  return products.filter(p => p.new_arrival === true);
}

/**
 * Filter products by category
 */
async function getProductsByCategory(category) {
  const products = await fetchProducts();
  if (!category || category === "all") return products;
  return products.filter(p => p.category === category);
}

/**
 * Enable/Disable GitHub sync dynamically via developer controls
 */
function configureGitHubSync(username, repo, branch = "main") {
  GITHUB_CONFIG.username = username;
  GITHUB_CONFIG.repo = repo;
  GITHUB_CONFIG.branch = branch;
  GITHUB_CONFIG.enabled = true;
  cachedProducts = null; // Flush cache to force reload
  console.log(`[Products API] GitHub configuration updated to: ${username}/${repo}`);
}
