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

  if (!config || !title || !status || !results || !sizeFilter || !tableBody || !mobileList || !tableWrap) return;

  const requestedCategory = new URLSearchParams(window.location.search).get("category")?.trim();
  const category = config.home.products.find((product) => product.name.toLowerCase() === requestedCategory?.toLowerCase());

  if (!category) {
    title.textContent = "Category not found";
    status.textContent = "Choose a category from our product range.";
    return;
  }

  title.textContent = category.name;
  document.title = `${category.name} Inventory | ${config.brand.name}`;
  tableWrap.style.setProperty("--inventory-accent", category.accent);
  mobileList.style.setProperty("--inventory-accent", category.accent);
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `Browse available ${category.name} products from Ethylox.`;

  let categoryProducts = [];

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
    appendCell(row, product.needle || "—");
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
    needle.textContent = ` · ${product.needle || "Needle: ask sales"}`;
    itemTitle.append(size, needle);
    const meta = document.createElement("span");
    meta.className = "inventory-item-meta";
    const code = document.createElement("span");
    code.textContent = product.code ? `Code ${product.code}` : "Code on inquiry";
    const price = document.createElement("span");
    price.className = "inventory-item-price";
    price.textContent = `${formatMoney(product.pricePHP, "PHP")} / dozen`;
    meta.append(code, price);
    summary.append(itemTitle, meta);
    const content = document.createElement("div");
    content.className = "inventory-item-details";
    const detailList = document.createElement("dl");
    addMobileDetail(detailList, "Description", product.description || category.name);
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
  const CACHE_KEY_DATA = "ethylox_inventory_data";
  const CACHE_KEY_TIME = "ethylox_inventory_timestamp";
  const CACHE_DURATION = 5 * 60 * 1000;

  const cachedDataStr = localStorage.getItem(CACHE_KEY_DATA);
  const cachedTimeStr = localStorage.getItem(CACHE_KEY_TIME);
  let hasValidCache = false;

  if (cachedDataStr && cachedTimeStr) {
    const cachedTime = parseInt(cachedTimeStr, 10);
    if (Date.now() - cachedTime < CACHE_DURATION) {
      try {
        const cachedData = JSON.parse(cachedDataStr);
        showInventory(cachedData);
        hasValidCache = true;
      } catch (e) {
        console.error("Cache parse error", e);
        localStorage.removeItem(CACHE_KEY_DATA);
        localStorage.removeItem(CACHE_KEY_TIME);
      }
    }
  }

  const script = document.createElement("script");
  let finished = false;

  const timeout = window.setTimeout(() => {
    if (finished) return;
    finished = true;
    script.remove();
    delete window[callbackName];
    if (!hasValidCache) {
      status.textContent = "Inventory is taking too long to load. Please refresh or contact sales.";
    }
  }, 20000);

  window[callbackName] = (data) => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timeout);
    script.remove();
    delete window[callbackName];
    if (data && data.success) {
      localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(CACHE_KEY_TIME, Date.now().toString());
    }
    showInventory(data);
  };

  script.onerror = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timeout);
    script.remove();
    delete window[callbackName];
    if (!hasValidCache) {
      status.textContent = "Unable to load inventory. Please refresh or contact sales.";
    }
  };

  script.src = `${endpoint}?prefix=${callbackName}&category=${encodeURIComponent(category.name)}&_=${Date.now()}`;
  document.head.append(script);
})();