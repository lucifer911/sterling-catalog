# Sterling Technology - GitHub Sync Guide

This directory houses the product catalog file (`products.json`) configured for your GitHub repository sync. By setting up a GitHub repository, you can manage, edit, and expand your catalog in one place, and your website will dynamically update for all visitors worldwide—completely serverless!

---

## 🚀 3-Step Setup Guide

### 1️⃣ Create Your GitHub Repository
1. Log in to [GitHub](https://github.com/) (or sign up if you don't have an account).
2. Click the **`+`** icon in the top right and select **New repository**.
3. Name your repository (e.g., `sterling-catalog` or `sterling-assets`).
4. Set the repository visibility to **Public** (required so the site can fetch the raw file).
5. Do *not* initialize with a README (keep it empty for easy setup) and click **Create repository**.

### 2️⃣ Upload the Catalog & Images
Move the files in this project into your GitHub repository using Git or the GitHub Web interface.

Your repository structure should match this:
```
sterling-catalog/
├── git_info/
│   └── products.json
└── web/
    ├── data/
    │   └── products.json
    └── images/
        ├── 1/
        │   ├── main.png
        │   ├── model_1.png
        │   └── model_2.png
        ├── 2/
        │   ├── main.png
        │   ├── model_1.png
        │   └── model_2.png
        ├── ... (folders 3 to 15)
        └── logo.png
```

Or you can simply copy the contents of `products.json` and upload it to a path like `web/data/products.json` in your repository.

### 3️⃣ Connect the Website to GitHub Pages Raw Data
To let the Sterling website sync directly with your repository, update the configuration inside the `web/js/products-api.js` file:

1. Open `web/js/products-api.js`.
2. Locate the `GITHUB_CONFIG` block at the top of the file:
   ```javascript
   const GITHUB_CONFIG = {
     enabled: true, // 👈 Change this from false to true!
     username: "your-github-username", // 👈 Enter your actual GitHub username
     repo: "your-repo-name", // 👈 Enter your repository name
     branch: "main", // 👈 Keep as "main" or set your default branch
     path: "web/data/products.json" // 👈 Keep this path or change it if you placed products.json somewhere else
   };
   ```
3. Save the file.

---

## 🔄 How the Sync Works
- When a user visits your website, it tries to fetch the catalog directly from `https://raw.githubusercontent.com/your-github-username/your-repo-name/main/web/data/products.json`.
- If you make pricing edits, update stock quantities, or add new products to the `products.json` file inside your GitHub repo, the changes immediately go live on your website for all customers!
- If a user is offline or the GitHub API is unavailable, the website automatically falls back to your local `./data/products.json` seamlessly without showing errors or interrupting the browsing experience.
