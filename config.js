// Edit site text, image paths, and contact details here.
// Inventory rows are managed in the Google Sheet.
window.ETHYLOX_CONFIG = {
  brand: {
    name: "ETHYLOX",
    fullName: "ETHYLOX EQUIPMENT CORPORATION",
    logo: "assets/ethylox-logo.png",
    email: "sales@ethylox.com"
  },

  inventory: {
    endpoint: "https://script.google.com/macros/s/AKfycbyr0tyzJEZJuL_wxCAGsyOcgvtnGKRFhXL8TKv7z98odCFosO3Dx3LQjnue6Ez1ajxw/exec"
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
      heading: "Product Categories",
      description: "Surgical sutures and specialized medical equipment."
    },

    products: [
      {
        name: "Vicryl",
        category: "Surgical sutures",
        accent: "#78509b",
        image: "assets/vicryl.jpg"         
      },
      {
        name: "Prolene",
        category: "Surgical sutures",
        accent: "#5e6cb3",
        image: "assets/prolene.jpg"        
      },
      {
        name: "Ethilon",
        category: "Surgical sutures",
        accent: "#64864f",
        image: "assets/ethilon.jpg"        
      },
      {
        name: "Chromic",
        category: "Surgical sutures",
        accent: "#888235",
        image: "assets/chromic.jpg"         
      },
      {
        name: "Silk and Plain",
        category: "Surgical sutures",
        accent: "#a4773b",
        image: "assets/silk-plain.jpg"     
      },
      {
        name: "Monocryl / PDS",
        category: "Surgical sutures",
        accent: "#3f8077",
        image: "assets/monocryl-pds.jpg"   
      },
      {
        name: "Endosurgery Products",
        category: "Harmonic Technology",
        accent: "#9b5660",
        image: "assets/endosurgery.jpg"    
      }
    ],

    gallery: {
      eyebrow: "Product Gallery",
      heading: "A closer look at our range.",
      description: "Explore the medical and surgical categories featured by Ethylox.",
      items: [
        {
          name: "Surgical Sutures",
          description: "Suture lines for different clinical needs.",
          image: "assets/gallery3.png",
          alt: "Surgical sutures and needles"
        },
        {
          name: "Medical Equipment",
          description: "Parts and accessories.",
          image: "assets/medical.jpg",
          alt: "Medical equipment and accessories"
        },
        {
          name: "Endosurgery Products",
          description: "Harmonic Technology.",
          image: "assets/endo.png",
          alt: "Endosurgery products and harmonic technology"
        }
      ]
    },

    company: {
      eyebrow: "Our Company",
      heading: "About Ethylox",
      paragraphs: [
        "Ethylox Trading International Corporation was founded in 1978 and is based in the Philippines. The company supplies laboratory and medical products, including surgical sutures and X-ray accessories.",
        "Since 2018, Ethylox has expanded its product range and established Ethylox Equipment Corporation to serve a broader range of medical and equipment needs."
      ]
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
            value: "+1 (562) 261-4266",
            href: "tel:+15622614266"
          },
          {
            label: "Address",
            value: "8537 Painter Ave.,\nWhittier, CA 90602, USA"
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