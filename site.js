(function () {
  "use strict";

  const config = window.ETHYLOX_CONFIG;

  if (!config) {
    console.error("config.js did not load. Check that it is next to site.js.");
    return;
  }

  const page = document.body.dataset.page;

  const valueAt = (path) =>
    path.split(".").reduce((item, key) => item?.[key], config);

  const display = (value) =>
    String(value).replaceAll("{email}", config.brand.email);

  function safeUrl(value, type) {
    if (typeof value !== "string") return "";

    const url = value.trim();

    if (url.startsWith("https://")) return url;

    if (type === "href" && /^(mailto:|tel:)/i.test(url)) {
      return url;
    }

    if (
      /^(?:assets\/|index\.html(?:#[-\w]+)?$|contact\.html$)/.test(url)
    ) {
      return url;
    }

    return "";
  }

  function bindFields() {
    document.querySelectorAll("[data-text]").forEach((element) => {
      const value = valueAt(element.dataset.text);

      if (value !== undefined && value !== null) {
        element.textContent = display(value);
      }
    });

    document.querySelectorAll("[data-image]").forEach((element) => {
      const src = safeUrl(valueAt(element.dataset.image), "image");

      if (src) element.src = src;
    });

    document.querySelectorAll("[data-email-link]").forEach((element) => {
      const subjectPath = element.dataset.emailSubject;
      const subject = subjectPath ? valueAt(subjectPath) : "";
      const query = subject
        ? `?subject=${encodeURIComponent(subject)}`
        : "";

      element.href = `mailto:${config.brand.email}${query}`;
    });

    const description = config[page]?.description;
    const meta = document.querySelector('meta[name="description"]');

    if (meta && description) {
      meta.content = description;
    }
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

            // Category card art (top-right image)
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

  function renderGallery() {
    const grid = document.querySelector("#showcase-grid");
    if (!grid) return;

    config.home.gallery.items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "showcase-item";

      const image = document.createElement("img");
      image.src = safeUrl(item.image, "image");
      image.alt = item.alt || item.name;
      image.loading = "lazy";

      const heading = document.createElement("h3");
      heading.textContent = item.name;

      const description = document.createElement("p");
      description.textContent = item.description;

      article.append(image, heading, description);
      grid.append(article);
    });
  }

  function renderCompany() {
    const container = document.querySelector("#company-paragraphs");
    if (!container) return;

    config.home.company.paragraphs.forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      container.append(paragraph);
    });
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

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const groups = [
      ".hero-content > .eyebrow, .hero-content > h1, .hero-content > .hero-copy, .hero-content .actions > .button, .hero-facts > .hero-fact",
      ".section-heading > *, .showcase-heading > *",
      ".product-grid > .product-card",
      ".showcase-grid > .showcase-item",
      ".overview-grid > *",
      ".home-contact .inquiry-copy",
      ".contact-main > .container > .eyebrow, .contact-main > .container > h1, .contact-main > .container > .contact-intro",
      ".contact-grid > .contact-card",
      ".email-panel, .footer-buyback"
    ];

    const targets = [];

    groups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("reveal-item");

        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 4) * 70}ms`
        );

        targets.push(element);
      });
    });

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    targets.forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
  }

  bindFields();

  if (page === "home") {
    renderProducts();
    renderGallery();
    renderCompany();
    document.title = config.brand.fullName;
  }

  if (page === "contact") {
    renderOffices();
    document.title = `Contact Us | ${config.brand.fullName}`;
  }

  initScrollMotion();
})();