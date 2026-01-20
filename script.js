/****************************************************
 * 1) Constants + Simple Helpers
 ****************************************************/

const API_URL = "https://fakestoreapi.com/products"; // Use the real API URL here

const setBanner = (message = "") => {
  const banner = document.getElementById("data-source-banner");
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = message ? "block" : "none"; // show only if message exists
};

const fetchJson = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Fetch failed: ${url} (HTTP ${res.status})`);
  }

  return res.json();
};

const fetchProductsWithFallback = async (
  apiUrl,
  fallbackUrl = "/data/products.json",
) => {
  try {
    return await fetchJson(apiUrl);
  } catch (apiErr) {
    console.error("API fetch failed. Trying local fallback...", apiErr);
    return await fetchJson(fallbackUrl);
  }
};

const setLoading = (show) => {
  const loadingSection = document.getElementById("loading-products");
  if (!loadingSection) return;
  loadingSection.style.display = show ? "block" : "none";
};

const setError = (show) => {
  const errSection = document.getElementById("error-section");
  if (!errSection) return;
  errSection.style.display = show ? "block" : "none";
};

/****************************************************
 * 2) Sidebar Category Show/Hide Functions
 ****************************************************/

const hideAllCategories = () => {
  document.querySelectorAll(".categories-section").forEach((section) => {
    section.classList.add("hidden");
  });
};

const showCategory = (cleanCategory) => {
  hideAllCategories();

  // Show selected category section
  const section = document.getElementById(`${cleanCategory}-section`);
  if (section) section.classList.remove("hidden");

  // Update active button styling
  document.querySelectorAll("#category-menu button").forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `#category-menu button[data-category="${cleanCategory}"]`,
  );
  if (activeBtn) activeBtn.classList.add("active");
};

/****************************************************
 * 3) Render Functions
 ****************************************************/

function displayProducts(products) {
  // Guard: if products isn't a real array (or it's empty), don't try to render it
  if (!Array.isArray(products) || products.length === 0) {
    setBanner("No products available to display.");
    return;
  }

  const productsSection = document.getElementById("products");
  if (!productsSection) return;

  productsSection.innerHTML = ""; // clear previous render

  const menu = document.getElementById("category-menu");
  if (menu) menu.innerHTML = ""; // clear menu on rerender

  const uniqueCategories = [];
  let firstCategoryId = null;

  for (let ii = 0; ii < products.length; ii++) {
    const product = products[ii];

    // Fallback in case category is missing/null/undefined
    const category = product.category ?? "uncategorized";

    const cleanCategory = category
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/\s+/g, "-");

    // Change first character to uppercase before displaying
    const displayCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    // If this category doesn't exist yet, create a section + menu button
    if (!uniqueCategories.includes(displayCategory)) {
      uniqueCategories.push(displayCategory);

      if (!firstCategoryId) firstCategoryId = cleanCategory;

      // Create menu button
      if (menu) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerText = displayCategory;
        btn.dataset.category = cleanCategory;
        btn.addEventListener("click", () => showCategory(cleanCategory));
        menu.appendChild(btn);
      }

      // Create category section (start hidden)
      const myCategoryTitle = document.createElement("h1");
      myCategoryTitle.id = cleanCategory;
      myCategoryTitle.innerText = displayCategory;

      const categorySection = document.createElement("div");
      categorySection.id = `${cleanCategory}-section`;
      categorySection.className = "categories-section hidden";

      const cardContainer = document.createElement("div");
      cardContainer.id = `${cleanCategory}-container`;
      cardContainer.className = "categories";

      categorySection.append(myCategoryTitle, cardContainer);
      productsSection.appendChild(categorySection);
    }

    // Render the product card into the right category
    displayCategoryProducts(product, cleanCategory);
  }

  // Show the first category by default
  if (firstCategoryId) showCategory(firstCategoryId);
}

function displayCategoryProducts(product, categoryToFind) {
  const myCategory = document.getElementById(`${categoryToFind}-container`);
  if (!myCategory) return;

  const productCard = document.createElement("div");
  productCard.className = "product-card";

  const { title, price, image, description } = product;

  // Store product info in dataset for modal use
  productCard.dataset.title = title;
  productCard.dataset.price = price;
  productCard.dataset.image = image;
  productCard.dataset.description = description;

  productCard.addEventListener("click", handleProductClick);

  const productTitle = document.createElement("h5");
  productTitle.innerText = title;

  const productImage = document.createElement("img");
  productImage.className = "product-img";
  productImage.src = image;
  productImage.alt = title;
  productImage.loading = "lazy";

  const productPrice = document.createElement("p");
  productPrice.className = "product-price";
  productPrice.innerText = `$${price}`;

  const productInfo = document.createElement("div");
  productInfo.className = "product-info";
  productInfo.append(productTitle, productPrice);

  productCard.append(productImage, productInfo);
  myCategory.appendChild(productCard);
}

/****************************************************
 * 4) Modal Functions
 ****************************************************/

function handleProductClick(event) {
  const overlay = document.getElementById("modal-overlay-wrapper");
  const modalContent = document.getElementById("modal-content");

  if (!overlay || !modalContent) return;

  overlay.style.display = "block";
  modalContent.innerHTML = ""; // clear previous modal content

  const { title, image, price, description } = event.currentTarget.dataset;

  const myProductHeader = document.createElement("div");
  myProductHeader.className = "product-modal-header";

  const myProductBody = document.createElement("div");
  myProductBody.className = "product-modal-body";

  const myProductFooter = document.createElement("div");
  myProductFooter.className = "product-modal-footer";

  const myProductTitle = document.createElement("h1");
  myProductTitle.innerText = title;
  myProductHeader.appendChild(myProductTitle);

  const myProductImage = document.createElement("img");
  myProductImage.src = image;
  myProductImage.alt = title;
  myProductImage.loading = "lazy";

  const myProductPrice = document.createElement("p");
  myProductPrice.innerText = `$${price}`;
  myProductPrice.className = "modal-product-price";

  const myProductDesc = document.createElement("p");
  myProductDesc.innerText = description;
  myProductDesc.className = "modal-product-desc-price";

  myProductBody.append(myProductImage, myProductPrice, myProductDesc);

  const myAddToCartBtn = document.createElement("button");
  myAddToCartBtn.className = "add-to-cart";
  myAddToCartBtn.innerText = "Add To Cart";

  const myCancelBtn = document.createElement("button");
  myCancelBtn.className = "cancel-btn";
  myCancelBtn.innerText = "Cancel";
  myCancelBtn.addEventListener("click", handleModalCancelBtn);

  myProductFooter.append(myAddToCartBtn, myCancelBtn);
  modalContent.append(myProductHeader, myProductBody, myProductFooter);
}

function handleModalCancelBtn() {
  const modalContent = document.getElementById("modal-content");
  const overlay = document.getElementById("modal-overlay-wrapper");

  if (!modalContent || !overlay) return;

  modalContent.innerHTML = "";
  overlay.style.display = "none";
}

/****************************************************
 * 5) Events
 ****************************************************/

// Closes the modal if you click anywhere outside the modal content
document
  .getElementById("modal-overlay-wrapper")
  ?.addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay-wrapper") handleModalCancelBtn();
  });

// Optional: close modal with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") handleModalCancelBtn();
});

/****************************************************
 * 6) App Startup
 ****************************************************/

const init = () => {
  fetchHandler(API_URL);
};

const fetchHandler = async (url) => {
  try {
    setLoading(true);
    setError(false);

    const data = await fetchProductsWithFallback(url);

    setBanner(""); // clear old banner errors
    displayProducts(data);
  } catch (err) {
    console.error(err);
    setError(true);
    setBanner("Could not load data from API or local backup.");
  } finally {
    setLoading(false);
  }
};

init();
