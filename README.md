# Product Gallery (ES6+)

A simple **ES6+ JavaScript** product gallery that loads products from the **FakeStore API** and falls back to a **local JSON file** if the API fails.

- Vanilla JS (no frameworks)
- Async/Await + Fetch
- Local JSON fallback (`/data/products.json`)
- Category sidebar navigation (click to show/hide categories)
- Modal product details
- Lazy-loaded images

---

## Project Structure

```
Product-Gallery/
├─ index.html
├─ script.js
├─ package.json
├─ package-lock.json
├─ .gitignore
├─ data/
│  └─ products.json
└─ css/
   ├─ styles.css
   ├─ modal.css
   └─ sidebar.css
```

## Run Locally

### Install dependencies
npm install

### Start in development mode (auto refresh)
npm run dev

### Or start normally
npm run start

Then open the local URL shown in the terminal (usually http://localhost:3000) in your browser.

## Data Source + Fallback

**Primary API**
https://fakestoreapi.com/products

**Fallback file**
/data/products.json

If the API request fails, the app automatically loads the local backup data.

## Features

- Loads products and groups them by category
- Sidebar menu shows categories and displays the selected category only
- Modal shows product details on click
- Click outside the modal (overlay) to close it
- Images use native lazy-loading for better performance

## Tech Used

- HTML
- CSS
- JavaScript (ES6+)
- Fetch API + Async/Await
- browser-sync (development auto refresh)
- serve (simple static server)

## Notes

This is a front-end only project built for practice and portfolio use.
