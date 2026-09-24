// Edit site text, image paths, product links, and contact details here.
// Google Sheets can replace this local data source later.
window.ETHYLOX_CONFIG = {
    brand: {
      name: "ETHYLOX",
      fullName: "Ethylox Trading International Corporation",
      logo: "assets/ethylox-logo.png",
      email: "sales@ethylox.com"
    },

    forms: {
      web3formsAccessKey: ""
    },
  
    navigation: {
      home: "Home",
      products: "Products",
      company: "Our Company",
      contact: "Contact"
    },
  
    home: {
      description: "Ethylox Trading International Corporation — medical supplies and surgical sutures.",
  
      hero: {
        eyebrow: "Medical & Surgical Supplies",
        heading: "Surplus US Medical Supplies",
        description: "Surgical sutures and medical supplies for clinics, hospitals, and distributors.",
        artLabel: "Ethylox Trading",
        productButton: "Browse Products",
        contactButton: "Send an Inquiry",
        establishedValue: "1978",
        establishedLabel: "Established in the Philippines",
        officeValue: "California, USA",
        officeLabel: "Purchasing office"
      },
  
      productSection: {
        eyebrow: "Product Categories",
        heading: "Find what you need.",
        description: "Browse the product lines currently featured by Ethylox."
      },
  
      // Existing pages muna ang links hanggang magawa ang bagong product pages.
      // Empty href = card na hindi clickable.
      products: [
        {
          name: "Vicryl",
          category: "Surgical sutures",
          bg: "#eee6f7",
          accent: "#693a94",
          href: ""
        },
        {
          name: "Prolene",
          category: "Surgical sutures",
          bg: "#e9eafb",
          accent: "#5965ae",
          href: ""
        },
        {
          name: "Ethilon",
          category: "Surgical sutures",
          bg: "#eaf3df",
          accent: "#56803b",
          href: ""
        },
        {
          name: "Chromic",
          category: "Surgical sutures",
          bg: "#f3f1da",
          accent: "#807b20",
          href: ""
        },
        {
          name: "Plain",
          category: "Surgical sutures",
          bg: "#fff6d9",
          accent: "#96721e",
          href: ""
        },
        {
          name: "Covidien",
          category: "Medical products",
          bg: "#f3efeb",
          accent: "#8a4b43",
          href: ""
        }
      ],
  
      gallery: {
        eyebrow: "Product Gallery",
        heading: "A closer look at our range.",
        description: "Explore the medical and surgical categories featured by Ethylox.",
        note: "Sample imagery for layout preview. Product photos will be updated.",
        items: [
          {
            name: "X-ray Accessories",
            description: "Protective accessories and related supplies.",
            image: "assets/gallery1.png",
            alt: "Illustrative X-ray protective accessories"
          },
          {
            name: "Medical Supplies",
            description: "Medical essentials and instruments.",
            image: "assets/gallery2.png",
            alt: "Illustrative medical supplies and instruments"
          },
          {
            name: "Surgical Sutures",
            description: "Suture lines for different clinical needs.",
            image: "assets/gallery3.png",
            alt: "Illustrative surgical needle and suture"
          }
        ]
      },
  
      company: {
        eyebrow: "Our Company",
        heading: "About Ethylox",
        paragraphs: [
          "Ethylox Trading International Corporation was founded in 1978 and is based in the Philippines. The company supplies laboratory and medical products, including surgical sutures and X-ray accessories.",
          "This is draft copy based on the current website. We will replace it with the company's approved description before launch."
        ]
      },

      inquiryForm: {
        heading: "Send an inquiry",
        intro: "Share a few details and our team will respond by email.",
        submitButton: "Send inquiry",
        sending: "Sending your inquiry...",
        success: "Your inquiry has been sent. We'll respond by email.",
        error: "We couldn't send your inquiry. Please try again or email us directly.",
        unavailable: "Please use Email Sales while the online form is being set up."
      },
  
      contactCta: {
        eyebrow: "Get in touch",
        heading: "Ask about products and availability.",
        description: "For product inquiries, contact the Ethylox sales team.",
        button: "Email Sales"
      },
      buyback: {
        text: "We also Buy Sutures in boxes or loose packets and other Medical Products please contact us if you have those for sale or for distributorship.",
        linkText: "Email here",
        emailSubject: "Distributorship and Sutures for sale"
      }
    },
  
    contact: {
      description: "Contact Ethylox Trading International Corporation for orders and medical supply inquiries.",
      eyebrow: "Contact Ethylox",
      heading: "Let's discuss your product inquiry.",
      intro: "For orders and other related inquiries, contact our office in the Philippines or California by phone or email.",
  
      offices: {
        ph: {
          label: "Philippines",
          heading: "Sales Office",
          details: [
            {
              label: "Mobile",
              value: "+63 917 895 8209",
              href: "tel:+639178958209"
            },
            {
              label: "Phone / Fax",
              value: "372-23-56"
            },
            {
              label: "Address",
              value: "10 Ricardo St., Roosevelt Avenue,\nQuezon City, Philippines 1105"
            }
          ]
        },
  
        us: {
          label: "California, USA",
          heading: "Purchasing Office",
          details: [
            {
              label: "Telephone",
              value: "562-261-4266",
              href: "tel:+15622614266"
            },
            {
              label: "Address",
              value: "13927 Dittmar Dr,\nWhittier, CA 90605, USA"
            }
          ]
        }
      },
  
      emailPanel: {
        heading: "Prefer to email us?",
        description: "Send your order or product inquiry to {email}.",
        button: "Email Sales"
      }
    }
  };