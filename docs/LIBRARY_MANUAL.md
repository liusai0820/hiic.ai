# 📚 HIIC AI Library - Operations Manual

This document explains how to operate the new "Smart Librarian" system using Cloudflare R2 and Workers.

## Architecture Overview

*   **Storage (R2)**: All PDF files, covers, and metadata live in a Cloudflare R2 bucket named `hiic-library`.
*   **API (Worker)**: A Cloudflare Worker sits in front of R2 to index the content and serve it to the frontend.
*   **Frontend**: The React app fetches the "catalog" from the Worker API.

---

## 🚀 Deployment Guide

### 1. Prerequisites
*   Cloudflare Account
*   Node.js installed
*   `wrangler` CLI installed (`npm install -g wrangler`)

### 2. Setup Cloudflare Resources
Run these commands in your terminal:

```bash
# Login to Cloudflare
wrangler login

# Create the R2 bucket
wrangler r2 bucket create hiic-library
```

### 3. Deploy the Worker API
Navigate to the worker directory and deploy:

```bash
cd workers/library-api
npm install
npm run deploy
```

This will output a URL (e.g., `https://library-api.your-name.workers.dev`).

### 4. Connect Frontend
Update your `.env` file (or Vercel environment variables) with the Worker URL:

```bash
VITE_LIBRARY_API_URL=https://library-api.your-name.workers.dev/api/library
```

---

## 📖 Publishing New Issues

You don't need to change any code to publish new issues. Just upload files to R2!

### Structure
The "Digital Bookshelf" structure in R2 must be:
`library/<source_id>/<year>/<issue_date>/`

Example:
`library/economist/2026/2026-01-20/`

### Step-by-Step Publishing

#### 1. Prepare Local Files
We've provided a helper script to create the folder structure:

```bash
# Usage: node scripts/create-issue-template.js <source_id> <year> <date>
node scripts/create-issue-template.js economist 2026 2026-01-20
```

This creates a folder in `library-content/` with a `meta.json` template.

#### 2. Add Content
1.  Place your PDF file as `document.pdf` in that folder.
2.  Place your cover image as `cover.jpg` in that folder.
3.  Edit `meta.json` with the title, summary, and key takeaways.

#### 3. Upload to R2
You can upload using the Cloudflare Dashboard (drag & drop) or CLI.

**Option A: Cloudflare Dashboard (Easiest)**
1.  Go to R2 > `hiic-library`.
2.  Navigate/Create folders: `library` > `economist` > `2026` > `2026-01-20`.
3.  Drag and drop `meta.json`, `cover.jpg`, and `document.pdf`.

**Option B: Wrangler CLI (Faster)**
```bash
# From project root
wrangler r2 object put hiic-library/library/economist/2026/2026-01-20/meta.json --file=library-content/economist/2026/2026-01-20/meta.json
wrangler r2 object put hiic-library/library/economist/2026/2026-01-20/cover.jpg --file=library-content/economist/2026/2026-01-20/cover.jpg
wrangler r2 object put hiic-library/library/economist/2026/2026-01-20/document.pdf --file=library-content/economist/2026/2026-01-20/document.pdf
```

---

## 🛠 Troubleshooting

### "File Not Found" in Frontend
*   Check if the folder path in R2 matches exactly (case-sensitive).
*   Ensure files are named exactly `meta.json`, `cover.jpg`, `document.pdf`.

### "API Error"
*   Check the Worker logs in Cloudflare Dashboard > Workers > library-api > Logs.
*   Ensure the `HIIC_LIBRARY` bucket binding is correct in `wrangler.toml`.
