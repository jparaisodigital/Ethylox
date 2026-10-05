// Ethylox Main Script
(function () {
  "use strict";
  const config = window.ETHYLOX_CONFIG;
  if (!config) { console.error("config.js did not load."); return; }
  
  const page = document.body.dataset.page;
  const valueAt = (path) => path.split(".").reduce((item, key) => item?.[key], config);
  const display = (value) => String(value).replaceAll("{email}", config.brand.email);

  function safeUrl(value, type) {
    if (typeof value !== "string") return "";
    const url = value.trim();
    if (url.startsWith("https://")) return url;
    if (type === "href" && /^(mailto:|tel:)/i.test(url)) return url;
    if (/^(?:assets\/|index\.html(?:#[-\w]+)?$|contact\.html$)/.test(url)) return url;
    return "";
  }

  function bindFields() {
    document.querySelectorAll("[data-text]").forEach((element) => {
      const value = valueAt(element.dataset.text);
      if (value !== undefined && value !== null) element.textContent = display(value);
    });
    document.querySelectorAll("[data-image]").forEach((element) => {
      const src = safeUrl(valueAt(element.dataset.image), "image");
      if (src) element.src = src;
    });
    document.querySelectorAll("[data-email-link]").forEach((element) => {
      const subjectPath = element.dataset.emailSubject;
      const subject = subjectPath ? valueAt(subjectPath) : "";
      const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
      element.href = `mailto:${config.brand.email}${query}`;
    });
    const description = config[page]?.description;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.content = description;
  }

  function renderProducts() {
    const grid = document.querySelector("#product-grid");
    if (!grid) return;
    config.home.products.forEach((product) => {
      const card = document.createElement("a");
      card.className = "product-card";
      card.href = `inventory.html?category=${encodeURIComponent(product.name)}`;
      card.setAttribute("aria-label", `View ${product.name} inventory`);
      card.style.setProperty("--card-accent", product.accent);
      const art = document.createElement("img");
      const artSrc = safeUrl(product.image, "image");
      if (artSrc) {
        art.className = "product-card-art";
        art.src = artSrc;
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
      grid.append(card);
    });
  }

  function openImageModal(src, alt) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");

    if (!modal || !modalImg) return;

    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function renderStockPreview() {
    const grid = document.querySelector("#stock-preview-grid");
    if (!grid || !config.home.stockPreview?.items) return;

    config.home.stockPreview.items.forEach((item, index) => {
      const src = safeUrl(item.image, "image");
      if (!src) return;

      const button = document.createElement("button");
      button.className = index === 0 ? "stock-preview-item is-featured" : "stock-preview-item";
      button.type = "button";
      button.setAttribute("aria-label", "View stock preview image");

      const image = document.createElement("img");
      image.src = src;
      image.alt = item.alt || "Sample stock preview";
      image.loading = "lazy";

      const label = document.createElement("span");
      label.textContent = "Sample stock photo";

      button.append(image, label);
      button.addEventListener("click", () => openImageModal(image.src, image.alt));

      grid.append(button);
    });
  }

  function renderGallery() {
    const grid = document.querySelector("#showcase-grid");
    if (!grid) return;
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".modal-close");
    config.home.gallery.items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "showcase-item";
      const image = document.createElement("img");
      image.src = safeUrl(item.image, "image");
      image.alt = item.alt || item.name;
      image.loading = "lazy";
      image.style.cursor = "zoom-in";
      if (modal && modalImg) {
        image.addEventListener("click", () => {
          openImageModal(image.src, image.alt);
        });
      }
      const heading = document.createElement("h3");
      heading.textContent = item.name;
      const description = document.createElement("p");
      description.textContent = item.description;
      article.append(image, heading, description);
      grid.append(article);
    });
    if (modal && closeBtn) {
      const closeModal = () => {
        document.activeElement?.blur();
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };
      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("active")) closeModal(); });
    }
  }

  function renderCompany() {
    const paragraphsContainer = document.querySelector("#company-paragraphs");
    if (paragraphsContainer) {
      config.home.company.paragraphs.forEach((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        paragraphsContainer.append(paragraph);
      });
    }
    const valuesContainer = document.querySelector("#company-values");
    if (valuesContainer && config.home.company.values) {
      const icons = {
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
      };
      config.home.company.values.forEach((value) => {
        const card = document.createElement("div");
        card.className = "value-card-integrated";
        const svg = icons[value.icon] || icons.shield;
        card.innerHTML = `<div class="value-icon">${svg}</div><h3>${value.title}</h3><p>${value.description}</p>`;
        valuesContainer.append(card);
      });
    }
  }

  function renderOffices() {
    document.querySelectorAll("[data-office]").forEach((card) => {
      const office = config.contact.offices[card.dataset.office];
      if (!office) return;
      const details = card.querySelector(".office-details");
      if (!details) return;
      office.details.forEach((item) => {
        const row = document.createElement("div");
        row.className = "detail";
        const label = document.createElement("span");
        label.className = "detail-name";
        label.textContent = item.label;
        const value = document.createElement("span");
        value.className = "detail-value";
        const href = safeUrl(item.href, "href");
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = item.value;
          value.append(link);
        } else {
          value.textContent = item.value;
        }
        row.append(label, value);
        details.append(row);
      });
    });
  }

  function initScrollMotion() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const groups = [
      ".hero-content > .eyebrow, .hero-content > h1, .hero-content > .hero-copy, .hero-content .actions > .button, .hero-facts > .hero-fact",
      ".section-heading > *, .showcase-heading > *",
      ".product-grid > .product-card",
      ".quality-header > *, .quality-grid > .quality-item",
      ".showcase-grid > .showcase-item",
      ".stock-preview-heading > *, .stock-preview-grid > .stock-preview-item",
      ".overview-header > *, .overview-content > #company-paragraphs > p, .values-grid-integrated > .value-card-integrated",
      ".faq-list > .faq-item",
      ".inventory-ticker", 
      ".home-contact .inquiry-copy",
      ".contact-main > .container > .eyebrow, .contact-main > .container > h1, .contact-main > .container > .contact-intro",
      ".contact-grid > .contact-card",
      ".email-panel, .footer-buyback"
    ];
    const targets = [];
    groups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("reveal-item");
        element.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 70}ms`);
        targets.push(element);
      });
    });
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    targets.forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
  }

  if (!window.location.hash) window.scrollTo(0, 0);
  bindFields();
  
  if (page === "home") {
    renderProducts();
    renderGallery();
    renderStockPreview();
    renderCompany();
    document.title = config.brand.fullName;
  }
  if (page === "contact") {
    renderOffices();
    document.title = `Contact Us | ${config.brand.fullName}`;
  }
  initScrollMotion();

  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDropdown = document.querySelector('.mobile-nav-dropdown');
  if (menuToggle && mobileDropdown) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mobileDropdown.classList.toggle('active');
    });
    document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        mobileDropdown.classList.remove('active');
      });
    });
  }

  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    const handleNavigation = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      e.preventDefault();
      pageLoader.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
        if (href.includes('#')) {
          setTimeout(() => { pageLoader.classList.remove('active'); }, 250);
        }
      }, 350);
    };
    document.querySelectorAll('.product-card, .desktop-nav a[href], .mobile-nav a[href]').forEach(el => {
      el.addEventListener('click', handleNavigation);
    });
  }

  window.addEventListener('load', () => {
    if (pageLoader) pageLoader.classList.remove('active');
  });

    // Silent Prefetch & Inventory Ticker
    if (page === "home") {
      const endpoint = config.inventory?.endpoint;
      if (endpoint?.startsWith("https://script.google.com/macros/s/")) {
        const CACHE_KEY_DATA = "ethylox_inventory_all_data";
        const CACHE_KEY_TIME = "ethylox_inventory_all_timestamp";
        const CACHE_DURATION = 5 * 60 * 1000;
        const cachedDataStr = localStorage.getItem(CACHE_KEY_DATA);
        const cachedTimeStr = localStorage.getItem(CACHE_KEY_TIME);
        let needsFetch = true;
  
        const renderTicker = (data) => {
          const track = document.getElementById('ticker-track');
          if (!track || !data || !data.products) return;
  
          const items = [...data.products].sort(() => 0.5 - Math.random()).slice(0, 8);
          let html = '';
          
          items.forEach(item => {
            html += `
              <span class="ticker-item">
                <strong>${item.description || item.category}</strong> 
                Size: ${item.size || '—'} 
                <span class="price">${item.pricePHP || 'Ask Sales'}</span>
              </span>
              <span class="ticker-separator">•</span>
            `;
          });
  
          track.innerHTML = html + html;
        };
  
        if (cachedDataStr && cachedTimeStr) {
          const cachedTime = parseInt(cachedTimeStr, 10);
          if (Date.now() - cachedTime < CACHE_DURATION) {
            try {
              renderTicker(JSON.parse(cachedDataStr));
              needsFetch = false;
            } catch (e) { console.error(e); }
          }
        }
  
        if (needsFetch) {
          const callbackName = "ethyloxInventoryReceive";
          const script = document.createElement("script");
          window[callbackName] = (data) => {
            if (data && data.success) {
              localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(data));
              localStorage.setItem(CACHE_KEY_TIME, Date.now().toString());
              renderTicker(data);
            }
            script.remove();
            delete window[callbackName];
          };
          script.src = `${endpoint}?prefix=${callbackName}&_=${Date.now()}`;
          document.head.append(script);
        }
      }
    }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted && pageLoader) {
      pageLoader.classList.remove('active');
      initScrollMotion();
    }
  });
})();