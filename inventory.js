// Ethylox Inventory Logic
(function () {
  "use strict";
  const config = window.ETHYLOX_CONFIG;
  const title = document.querySelector("#inventory-title");
  const status = document.querySelector("#inventory-status");
  const results = document.querySelector("#inventory-results");
  const sizeFilter = document.querySelector("#inventory-size-filter");
  const tableBody = document.querySelector("#inventory-table-body");
  const mobileList = document.querySelector("#inventory-mobile-list");
  const tableWrap = document.querySelector(".inventory-table-wrap");
  const picker = document.querySelector("#category-picker");
  const inventoryImage = document.querySelector("#inventory-image");
  const inventoryImageSrc = document.querySelector("#inventory-image-src");

  if (!config || !title || !status || !results || !sizeFilter || !tableBody || !mobileList || !tableWrap) return;

  const requestedCategory = new URLSearchParams(window.location.search).get("category")?.trim();
  const category = config.home.products.find((product) => product.name.toLowerCase() === requestedCategory?.toLowerCase());

  function renderCategoryPicker() {
    if (!picker) return;
    const fragment = document.createDocumentFragment();
    config.home.products.forEach((product) => {
      const card = document.createElement("a");
      card.className = "product-card";
      card.href = `inventory.html?category=${encodeURIComponent(product.name)}`;
      card.setAttribute("aria-label", `View ${product.name} inventory`);
      card.style.setProperty("--card-accent", product.accent);

      if (typeof product.image === "string" && product.image.startsWith("assets/")) {
        const art = document.createElement("img");
        art.className = "product-card-art";
        art.src = product.image;
        art.alt = "";
        art.setAttribute("aria-hidden", "true");
        art.loading = "lazy";
        card.append(art);
      }

      const heading = document.createElement("h3");
      heading.textContent = product.name;
      const label = document.createElement("small");
      label.textContent = product.category;
      card.append(heading, label);
      fragment.append(card);
    });
    picker.replaceChildren(fragment);
    picker.hidden = false;
  }

  if (!category) {
    const isInvalid = Boolean(requestedCategory);
    title.textContent = isInvalid ? "Category not found" : "Full Inventory";
    status.textContent = isInvalid
      ? "We couldn't find that category. Choose one from our product range."
      : "Choose a category to view available items.";
    document.title = isInvalid
      ? `Category not found | ${config.brand.name}`
      : `Full Inventory | ${config.brand.name}`;
    renderCategoryPicker();
    return;
  }

  title.textContent = category.name;
document.title = `${category.name} Inventory | ${config.brand.name}`;
tableWrap.style.setProperty("--inventory-accent", category.accent);
mobileList.style.setProperty("--inventory-accent", category.accent);

if (
  inventoryImage &&
  inventoryImageSrc &&
  typeof category.image === "string" &&
  category.image.startsWith("assets/")
) {
  inventoryImageSrc.src = category.image;
  inventoryImageSrc.alt = `${category.name} product reference`;
  inventoryImage.hidden = false;
}
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `Browse available ${category.name} products from Ethylox.`;

  let categoryProducts = [];

  const isEndosurgery = category.name === "Endosurgery Products";
const isEquipment = category.name === "Medical Equipment";
const variantKey = isEndosurgery ? "color" : isEquipment ? "specification" : "needle";
const variantLabel = isEndosurgery ? "Color" : isEquipment ? "Specification" : "Needle";
const priceUnitLabel = isEquipment ? "unit" : "dozen";

const variantHeader = document.querySelectorAll(".inventory-table thead th")[2];
if (variantHeader) variantHeader.textContent = variantLabel;

const priceHeader = document.querySelector("#inventory-price-header");
if (priceHeader) priceHeader.textContent = isEquipment ? "Price / unit" : "Price / dozen";

  function formatMoney(value, currency) {
    const raw = String(value ?? "").trim();
    if (!raw) return "Ask sales";
    const amount = Number(raw.replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(amount)) return "Ask sales";
    return new Intl.NumberFormat("en-PH", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  }

  function inquiryHref(product) {
    const subject = `${category.name} inquiry` + (product.code ? ` — code ${product.code}` : "");
    return `mailto:${config.brand.email}?subject=${encodeURIComponent(subject)}`;
  }

  function appendCell(row, value, className = "") {
    const cell = document.createElement("td");
    cell.textContent = value;
    if (className) cell.className = className;
    row.append(cell);
    return cell;
  }

  function renderTableItem(product) {
    const row = document.createElement("tr");
    appendCell(row, product.description || category.name, "cell-description");
    appendCell(row, product.size || "—", "cell-size");
    appendCell(row, product[variantKey] || "—");
    appendCell(row, product.code || "—", "cell-code");
    appendCell(row, formatMoney(product.pricePHP, "PHP"), "cell-price");
    appendCell(row, product.expiryDate || "Ask sales", "cell-expiry");
    const actionCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = inquiryHref(product);
    link.textContent = "Ask about this item →";
    actionCell.append(link);
    row.append(actionCell);
    return row;
  }

  function addMobileDetail(list, labelText, valueText) {
    const wrapper = document.createElement("div");
    const label = document.createElement("dt");
    const value = document.createElement("dd");
    label.textContent = labelText;
    value.textContent = valueText || "—";
    wrapper.append(label, value);
    list.append(wrapper);
  }

  function renderMobileItem(product) {
    const item = document.createElement("details");
    item.className = "inventory-item";
    const summary = document.createElement("summary");
    const itemTitle = document.createElement("span");
    itemTitle.className = "inventory-item-title";
    const size = document.createElement("strong");
    size.textContent = `Size ${product.size || "—"}`;
    const needle = document.createElement("span");
    needle.textContent = ` · ${product[variantKey] || `${variantLabel}: ask sales`}`;
    itemTitle.append(size, needle);
    const meta = document.createElement("span");
    meta.className = "inventory-item-meta";
    const code = document.createElement("span");
    code.textContent = product.code ? `Code ${product.code}` : "Code on inquiry";
    const price = document.createElement("span");
    price.className = "inventory-item-price";
    const unitText = isEquipment && product.unit ? product.unit : priceUnitLabel;
price.textContent = `${formatMoney(product.pricePHP, "PHP")} / ${unitText}`;
    meta.append(code, price);
    summary.append(itemTitle, meta);
    const content = document.createElement("div");
    content.className = "inventory-item-details";
    const detailList = document.createElement("dl");
    addMobileDetail(detailList, "Description", product.description || category.name);
addMobileDetail(detailList, variantLabel, product[variantKey] || "Ask sales");

if (isEquipment) {
  addMobileDetail(detailList, "Unit", product.unit || "Ask sales");
}

addMobileDetail(detailList, "Approx. USD", product.approxUSD ? `~${formatMoney(product.approxUSD, "USD")}` : "Ask sales");
    addMobileDetail(detailList, "Expiry date", product.expiryDate || "Ask sales");
    addMobileDetail(detailList, "Availability", product.availability || "Ask sales");
    const link = document.createElement("a");
    link.href = inquiryHref(product);
    link.textContent = "Ask about this item →";
    content.append(detailList, link);
    item.append(summary, content);
    return item;
  }

  function renderFilteredItems() {
    const selectedSize = sizeFilter.value;
    const visibleProducts = categoryProducts.filter((product) => !selectedSize || product.size === selectedSize);
    const tableFragment = document.createDocumentFragment();
    const mobileFragment = document.createDocumentFragment();
    visibleProducts.forEach((product) => {
      tableFragment.append(renderTableItem(product));
      mobileFragment.append(renderMobileItem(product));
    });
    tableBody.replaceChildren(tableFragment);
    mobileList.replaceChildren(mobileFragment);
    if (!visibleProducts.length) {
      status.textContent = "No items match that size. Choose another size to see the inventory.";
      return;
    }
    const count = visibleProducts.length;
    status.textContent = `${count} ${count === 1 ? "item" : "items"} listed · Please confirm current pricing and availability with sales.`;
  }

  function showInventory(data) {
    if (!data || data.success !== true || !Array.isArray(data.products)) {
      status.textContent = "Inventory is temporarily unavailable. Please contact our sales team.";
      return;
    }
    categoryProducts = data.products.filter((product) =>
      typeof product.category === "string" &&
      product.category.trim().toLowerCase() === category.name.toLowerCase() &&
      String(product.availability ?? "").trim().toLowerCase() === "available"
    );
    if (!categoryProducts.length) {
      status.textContent = `No approved ${category.name} items are listed yet. Please contact our sales team for availability.`;
      return;
    }
    const sizes = [...new Set(categoryProducts.map((product) => product.size).filter(Boolean))];
    sizes.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    sizeFilter.innerHTML = '<option value="">All sizes</option>';
    sizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = `Size ${size}`;
      sizeFilter.append(option);
    });
    results.hidden = false;
    renderFilteredItems();
  }

  sizeFilter.addEventListener("change", renderFilteredItems);
  const endpoint = config.inventory?.endpoint;
  if (!endpoint?.startsWith("https://script.google.com/macros/s/")) {
    status.textContent = "Inventory endpoint is not configured.";
    return;
  }

  const callbackName = "ethyloxInventoryReceive";
  const ALL_CACHE_KEY_DATA = "ethylox_inventory_all_data";
  const ALL_CACHE_KEY_TIME = "ethylox_inventory_all_timestamp";
  const CATEGORY_CACHE_KEY_DATA = `ethylox_inventory_category_${category.name.toLowerCase()}`;
  const CATEGORY_CACHE_KEY_TIME = `ethylox_inventory_category_${category.name.toLowerCase()}_timestamp`;
  const CACHE_DURATION = 5 * 60 * 1000;

  function getFreshCache(dataKey, timeKey) {
    const cachedDataStr = localStorage.getItem(dataKey);
    const cachedTimeStr = localStorage.getItem(timeKey);

    if (!cachedDataStr || !cachedTimeStr) return null;

    const cachedTime = parseInt(cachedTimeStr, 10);
    if (Date.now() - cachedTime >= CACHE_DURATION) return null;

    try {
      return JSON.parse(cachedDataStr);
    } catch (e) {
      localStorage.removeItem(dataKey);
      localStorage.removeItem(timeKey);
      return null;
    }
  }

  const allCachedData = getFreshCache(ALL_CACHE_KEY_DATA, ALL_CACHE_KEY_TIME);
  if (allCachedData) {
    showInventory(allCachedData);
    return;
  }

  const categoryCachedData = getFreshCache(CATEGORY_CACHE_KEY_DATA, CATEGORY_CACHE_KEY_TIME);
  if (categoryCachedData) {
    showInventory(categoryCachedData);
    return;
  }

  const script = document.createElement("script");
  let finished = false;

  const timeout = window.setTimeout(() => {
    if (finished) return;
    finished = true;
    script.remove();
    delete window[callbackName];
    status.textContent = "Inventory is taking too long to load. Please refresh or contact sales.";
  }, 20000);

  window[callbackName] = (data) => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timeout);
    script.remove();
    delete window[callbackName];

    if (data && data.success) {
      localStorage.setItem(CATEGORY_CACHE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(CATEGORY_CACHE_KEY_TIME, Date.now().toString());
    }

    showInventory(data);
  };

  script.onerror = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timeout);
    script.remove();
    delete window[callbackName];
    status.textContent = "Unable to load inventory. Please refresh or contact sales.";
  };

  script.src = `${endpoint}?prefix=${callbackName}&category=${encodeURIComponent(category.name)}&_=${Date.now()}`;
  document.head.append(script);
})();