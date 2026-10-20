export interface SupplierAgent {
  id: string;
  name: string;
  role: string;
  platform: 'WhatsApp' | 'Skype' | 'LiveChat';
  contact: string;
  whatsappLink: string;
  skype: string;
  email: string;
  warehouse: string;
  avatar: string;
  status: string;
  perks: string[];
}

export interface ProductVolumePricing {
  qty: number;
  discountPercent: number;
  pricePerUnit: number;
  total: number;
  savings: number;
  netProfit: number;
  badge?: string;
}

export interface ProductSpecifications {
  material: string;
  dimensions: string;
  weight: string;
  inTheBox: string;
  care: string;
  warranty: string;
  cjWarehouse: string;
  shippingEstimate: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  tagline: string;
  petType: 'Dog' | 'Cat' | 'All Pets';
  category: 'Beds' | 'Feeding' | 'Walk & Travel' | 'Toys' | 'Grooming' | 'Wellness' | 'Treats';
  department: 'Dogs' | 'Cats' | 'Wellness' | 'Grooming' | 'Toys' | 'Deals';
  price: number;
  compareAt: number;
  supplierCost: number; // Cost from CJ Dropshipping / Zendrop
  cjCost: number; // Wholesale unit cost in CJ Dropshipping
  cjShippingEstimate: number; // Estimated CJ Packet / USPS line-haul shipping fee
  totalCjCost: number; // Wholesale unit cost + CJ shipping
  netProfit: number; // Unit store profit (price - totalCjCost)
  profitMarginPercent: number; // Profit margin percentage
  supplier: 'CJ Dropshipping' | 'Zendrop';
  supplierSku: string;
  supplierUrl: string;
  supplierWarehouse: string;
  supplierShippingTime: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  isBestseller?: boolean;
  isLingPick?: boolean;
  repeatDeliveryEligible: boolean;
  inStockAustin: boolean;
  heroImage: string;
  secondaryImage?: string;
  galleryImages: string[];
  description: string;
  keyFeatures: string[];
  specifications: ProductSpecifications;
  volumeTiers: ProductVolumePricing[];
  sizes?: { name: string; weightLabel: string }[];
  colors?: { name: string; hex: string; class: string }[];
  addOns?: { name: string; price: number; description: string }[];
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  petName: string;
  petBreed: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  productName: string;
  date: string;
}

export const SUPPLIER_AGENTS: SupplierAgent[] = [
  {
    id: 'cj-agent-lisa',
    name: 'Lisa Wang',
    role: 'CJ Dropshipping Pet Category Senior Key Account Manager',
    platform: 'WhatsApp',
    contact: '+1 (415) 890-4821',
    whatsappLink: 'https://wa.me/14158904821?text=Hello%20Lisa,%20I%20am%20the%20owner%20of%20Ling%20Petshop.%20I%20need%20to%20dispatch%20an%20order%20and%20request%20USPS%20tracking.',
    skype: 'live:.cid.lisa_cjdropship_pet',
    email: 'lisa.petcategory@cjdropshipping.com',
    warehouse: 'US East (New Jersey) & US West (California)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    status: 'Online Now (Avg. response < 5 min)',
    perks: [
      'Descontos negociáveis por volume acima de 10 pedidos/dia',
      'Inspeção por fotos reais do produto no armazém antes do despacho',
      'Embalagem 100% neutra sem inscrições asiáticas (Blind Dropshipping)',
      'Código de rastreio USPS prioritário em até 24 horas',
    ],
  },
  {
    id: 'zendrop-agent-michael',
    name: 'Michael Miller',
    role: 'Zendrop US Warehouse Express Lead',
    platform: 'WhatsApp',
    contact: '+1 (305) 714-2908',
    whatsappLink: 'https://wa.me/13057142908?text=Hi%20Michael,%20Ling%20Petshop%20store%20manager%20here.%20Checking%20USPS%20express%20dispatch.',
    skype: 'live:.cid.zendrop_michael_support',
    email: 'michael.vip@zendrop.com',
    warehouse: 'US Central (Texas) & Florida Express Hub',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    status: 'Online (24/7 VIP Priority Desk)',
    perks: [
      'Garantia de reposição imediata se houver atraso superior a 5 dias úteis',
      'Envio expresso a partir do armazém central dos EUA via USPS Ground Advantage',
      'Atendimento em inglês comercial e chat em tempo real com o suporte',
      'Possibilidade de encarte com cupom de desconto personalizado para a Ling Petshop',
    ],
  },
];

export const DEFAULT_REAL_PRODUCTS: Product[] = [
  {
    id: "zendrop-2000857",
    sku: "ZD-FEED-LOCKER-WHT",
    name: "PawHut Elevated Pet Feeder Station & Food Storage Locker Cabinet with Raised Bowls",
    brand: "PawHut",
    tagline: "All-in-one pet feeding furniture station with pull-out dual stainless steel raised bowls, 30 lbs airtight food storage locker, and leash hooks.",
    petType: "Dog",
    category: "Feeding",
    department: "Dogs",
    price: 498.95,
    compareAt: 729.00,
    supplierCost: 174.46,
    cjCost: 174.46,
    cjShippingEstimate: 0.00,
    totalCjCost: 174.46,
    netProfit: 324.49,
    profitMarginPercent: 65,
    supplier: "Zendrop",
    supplierSku: "CJFT219102201AZ",
    supplierUrl: "https://app.zendrop.com/product/2000857",
    supplierWarehouse: "Zendrop US Domestic Warehouse (Dispatches in 24h)",
    supplierShippingTime: "3-5 business days via FedEx / USPS",
    rating: 4.95,
    reviewsCount: 118,
    badge: "⭐ High-Ticket Bestseller · Zendrop US",
    isBestseller: true,
    isLingPick: true,
    repeatDeliveryEligible: false,
    inStockAustin: true,
    heroImage: "https://file.zendrop.com/products/06/ee/b16863484e24800cd1e5d9553f50.jpeg",
    secondaryImage: "https://file.zendrop.com/products/59/d6/666729bf4c3b9f88c5917075d175.jpeg",
    galleryImages: [
      "https://file.zendrop.com/products/06/ee/b16863484e24800cd1e5d9553f50.jpeg",
      "https://file.zendrop.com/products/59/d6/666729bf4c3b9f88c5917075d175.jpeg",
      "https://file.zendrop.com/products/13/7c/15a0dd1f4f0e98d3687d1be8b41f.jpeg",
      "https://file.zendrop.com/products/91/f7/39d05d7e41fc8454eaecc21563bd.jpeg",
      "https://file.zendrop.com/products/f3/8f/393d6e0249ae847e9253797ce551.jpeg",
      "https://file.zendrop.com/products/f6/ab/87c42217454d97abacdb11846532.jpeg",
      "https://file.zendrop.com/products/b1/f5/2aa17ee544918223225c6b4050c1.jpeg"
    ],
    description: "Upgrade your pet feeding area with the PawHut Pet Feeder Station Locker. Designed as premium home furniture, this all-in-one organizer features a slide-out bottom drawer holding two elevated stainless steel bowls (10.2 inch feeding height) that relieve joint and neck tension during meals. The top cabinet provides airtight sealed storage for up to 30 lbs of dry kibble, and the side hooks hold leashes, collars, and toys within easy reach. Crafted from solid high-density MDF with a water-resistant white finish.",
    keyFeatures: [
      "Ergonomic Elevated Dining: 10.2 inch raised bowl height reduces cervical neck strain and promotes healthy digestion",
      "Pull-Out Space-Saving Drawer: Smooth rolling drawer tucks bowls away seamlessly when mealtime ends",
      "30 lbs Airtight Kibble Locker: Top cabinet keeps dry food crisp, aromatic, and 100% pet-proof",
      "Dual Food-Grade Stainless Steel Bowls: Removable, dishwasher-safe, rust-proof, and hygienic",
      "Side Organizer Hooks: 3 heavy-duty metal hooks for walking leashes, harnesses, and grooming tools",
      "Dispatched from Zendrop US Domestic Warehouse with tracking in 24 hours"
    ],
    specifications: {
      material: "High-Density Engineered MDF with Water-Resistant Pure White Finish & Food-Grade Stainless Steel",
      dimensions: "23.6\" L x 11.8\" W x 32.3\" H (60cm x 30cm x 82cm) · Bowl Diameter: 7.9\" · Feeder Height: 10.2\"",
      weight: "37.4 lbs (17 kg)",
      inTheBox: "1x Main Feeder Station Cabinet, 2x Stainless Steel Bowls, 3x Side Metal Hooks, Complete Hardware Kit, Assembly Manual",
      care: "Wipe cabinet with damp cloth; bowls are dishwasher safe",
      warranty: "30-Day Risk-Free In-Home Guarantee & 1-Year Structural Warranty",
      cjWarehouse: "Zendrop US Domestic Warehouse",
      shippingEstimate: "Dispatches within 24h via FedEx / USPS · 3-5 Business Days"
    },
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: 498.95, total: 498.95, savings: 0, netProfit: 324.49, badge: "1 Station Locker (Padrão)" },
      { qty: 2, discountPercent: 15, pricePerUnit: 424.11, total: 848.22, savings: 149.68, netProfit: 499.30, badge: "🔥 Leve 2 para Casa e Varanda (15% OFF)" },
      { qty: 3, discountPercent: 25, pricePerUnit: 374.21, total: 1122.63, savings: 374.22, netProfit: 599.25, badge: "⚡ Mansão Completa (25% OFF)" }
    ],
    colors: [
      { name: "Crisp Modern White", hex: "#FFFFFF", class: "bg-white border-2 border-gray-300" }
    ],
    addOns: [
      { name: "Waterproof Silicone Drawer Splash Mat", price: 19.95, description: "Custom-fit silicone protector to catch water drips under the bowls" },
      { name: "Heavy-Duty Airtight Kibble Portion Scoop", price: 12.95, description: "Calibrated 1-cup dry food measuring scoop" }
    ]
  },
  {
    id: "zendrop-2041862",
    sku: "ZD-BED-ASPEN-OVAL",
    name: "Petmate 290206 Aspen Pet Oval Cuddler Pet Bed 20\" x 16\" Chocolate Brown",
    brand: "Petmate",
    tagline: "Plush orthopedic bolster cuddler bed designed for toy breeds and cats seeking nest-like security and joint warmth.",
    petType: "All Pets",
    category: "Beds",
    department: "Dogs",
    price: 69.95,
    compareAt: 104.99,
    supplierCost: 24.47,
    cjCost: 24.47,
    cjShippingEstimate: 0.00,
    totalCjCost: 24.47,
    netProfit: 45.48,
    profitMarginPercent: 65,
    supplier: "Zendrop",
    supplierSku: "B0093Z7L78",
    supplierUrl: "https://app.zendrop.com/product/2041862",
    supplierWarehouse: "Zendrop US Domestic Warehouse (Dispatches in 24h)",
    supplierShippingTime: "2-4 business days via USPS Priority",
    rating: 4.88,
    reviewsCount: 234,
    badge: "✓ Zendrop US Official",
    isBestseller: true,
    isLingPick: true,
    repeatDeliveryEligible: false,
    inStockAustin: true,
    heroImage: "https://file.zendrop.com/products/27/ce/5258638a4b9197f9dad3d50bfeca.jpeg",
    secondaryImage: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85",
    galleryImages: [
      "https://file.zendrop.com/products/27/ce/5258638a4b9197f9dad3d50bfeca.jpeg",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "The Aspen Pet Oval Cuddler Pet Bed provides cozy comfort tailored to extra-small and toy breed dogs as well as cats. The soft raised bolster walls are generously filled with recycled high-loft polyester for cushioned joint comfort, while the nest-like circular design creates a soothing cocoon that eases separation anxiety. Ideal as a standalone bed in living rooms or as a plush liner for 20-inch crates and travel carriers.",
    keyFeatures: [
      "360° Raised Bolster Walls: Cradles head and neck to provide orthotic relief and reassuring nest security",
      "High-Loft Recycled Eco-Fill: High-density polyfill bounces back daily and resists flattening",
      "Ultra-Plush Warm Fleece Lining: Keeps pets warm and comfortable in air-conditioned homes or cooler weather",
      "Compact 20\" x 16\" Footprint: Fits perfectly in corners, next to your bed, or inside travel crates",
      "Machine Washable Convenience: Wash entirely on gentle cold cycle to keep sleep areas fresh and allergen-free",
      "Dispatched from Zendrop US Domestic Warehouse with tracking in 24 hours"
    ],
    specifications: {
      material: "High-Loft Recycled Polyfiber Fill with Micro-Suede Exterior & Soft Berber Fleece Sleep Surface",
      dimensions: "20.0\" L x 16.0\" W x 5.5\" H (50.8cm x 40.6cm x 14cm)",
      weight: "1.85 lbs (0.84 kg)",
      inTheBox: "1x Petmate Aspen Pet Oval Cuddler Comfort Bed (Chocolate Brown)",
      care: "Machine wash cold on gentle cycle; tumble dry low or air fluff",
      warranty: "30-Day Risk-Free Snuggle Guarantee",
      cjWarehouse: "Zendrop US Domestic Warehouse",
      shippingEstimate: "Dispatches within 24h via USPS Priority · 2-4 Business Days"
    },
    sizes: [
      { name: "Small / Toy (20\" x 16\")", weightLabel: "Perfect for dogs & cats up to 18 lbs" }
    ],
    colors: [
      { name: "Chocolate Brown", hex: "#4A2E18", class: "bg-amber-950 text-white" }
    ],
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: 69.95, total: 69.95, savings: 0, netProfit: 45.48, badge: "1 Cuddler Bed" },
      { qty: 2, discountPercent: 15, pricePerUnit: 59.46, total: 118.92, savings: 20.98, netProfit: 69.98, badge: "🔥 Leve 2 (15% OFF - Quarto + Sala)" },
      { qty: 3, discountPercent: 25, pricePerUnit: 52.46, total: 157.38, savings: 52.47, netProfit: 83.97, badge: "⚡ Trio Completo (25% OFF)" }
    ],
    addOns: [
      { name: "Matching Sherpa Fleece Burrow Blanket", price: 14.95, description: "Ultra-soft 30\" x 40\" pet blanket for nesting" }
    ]
  },
  {
    id: "zendrop-1603576",
    sku: "ZD-PAW-CLEAN-CUP",
    name: "Quick-Clean 360° Silicone Dog Paw Cleaner Cup & Foot Washer Bucket",
    brand: "Ling CleanPaws™",
    tagline: "Gentle 360° soft silicone bristle foot washer that washes away mud, sidewalk grit, and ice salt in 10 seconds before pets enter the house.",
    petType: "Dog",
    category: "Grooming",
    department: "Grooming",
    price: 19.95,
    compareAt: 34.95,
    supplierCost: 6.99,
    cjCost: 6.99,
    cjShippingEstimate: 0.00,
    totalCjCost: 6.99,
    netProfit: 12.96,
    profitMarginPercent: 65,
    supplier: "Zendrop",
    supplierSku: "1603576_OF0JCIH",
    supplierUrl: "https://app.zendrop.com/product/1603576",
    supplierWarehouse: "Zendrop US Domestic Warehouse (Dispatches in 24h)",
    supplierShippingTime: "2-4 business days via USPS",
    rating: 4.92,
    reviewsCount: 340,
    badge: "🔥 Viral TikTok Favorite · Zendrop US",
    isBestseller: true,
    isLingPick: true,
    repeatDeliveryEligible: true,
    inStockAustin: true,
    heroImage: "https://file.zendrop.com/products/40/b1/574e46614f7482afe1aaac7320ca.png",
    secondaryImage: "https://file.zendrop.com/products/fb/93/6004fbfc462da19deca29a3fa286.png",
    galleryImages: [
      "https://file.zendrop.com/products/40/b1/574e46614f7482afe1aaac7320ca.png",
      "https://file.zendrop.com/products/fb/93/6004fbfc462da19deca29a3fa286.png",
      "https://file.zendrop.com/products/c1/4a/d8b88f6042e7bbddb94f811bd204.png",
      "https://file.zendrop.com/products/78/a7/8cba440b4b269016db39aba9ae7f.png",
      "https://file.zendrop.com/products/d3/25/02e592b84088876dc9495312d0c6.png",
      "https://file.zendrop.com/products/66/2c/c7c3280c44bc83e592089cf39330.png"
    ],
    description: "Keep dirty, muddy paw prints off your pristine floors, furniture, and car seats. The Ling CleanPaws™ 360° silicone cleaner cup washes dirty paws in seconds. Simply add a little water, insert your pup muddy foot, give the cup a twist, and the flexible silicone bristles gently lift away dried mud, dirt, sand, and winter road chemicals without hurting sensitive claws. The silicone bristle insert removes in one second for a quick rinse.",
    keyFeatures: [
      "360° Gentle Silicone Bristles: Thick, flexible silicone fingers remove dried dirt, mud, and sand from between paw pads",
      "Painless & Relaxing: Pets enjoy the soothing foot massage much more than rough wet towel rubbing",
      "Portable & Lightweight: Keep one at your front entrance and one in the car after walks and dog park play",
      "BPA-Free Food-Grade Silicone: Safe, non-toxic, and prevents bacterial buildup",
      "Instant 5-Second Disassembly: Simply unthread top collar, unroll silicone mat, and rinse under warm water",
      "Dispatched from Zendrop US Domestic Warehouse with USPS tracking in 24 hours"
    ],
    specifications: {
      material: "100% BPA-Free Food-Grade Silicone Bristle Mat with Impact-Resistant Polypropylene Outer Cylinder",
      dimensions: "Small: 3.5\" Dia x 4.3\" H (Paws up to 2.5\") · Large: 3.9\" Dia x 5.9\" H (Paws up to 3.2\")",
      weight: "0.55 lbs (250g)",
      inTheBox: "1x Outer Paw Cup Shell, 1x Removable Silicone Bristle Mat, 1x Anti-Splash Top Collar Ring",
      care: "Disassemble and rinse with warm water and mild soap; dishwasher safe top rack",
      warranty: "30-Day Clean Floors Guarantee",
      cjWarehouse: "Zendrop US Domestic Warehouse",
      shippingEstimate: "Dispatches within 24h via USPS First Class · 2-4 Business Days"
    },
    sizes: [
      { name: "Small / Medium", weightLabel: "Dogs under 35 lbs (Pugs, Beagles, Corgis, Frenchies)" },
      { name: "Large", weightLabel: "Dogs 35-90 lbs (Golden Retrievers, Labs, Shepherds, Boxers)" }
    ],
    colors: [
      { name: "Ocean Blue", hex: "#2563EB", class: "bg-blue-600" },
      { name: "Fresh Green", hex: "#16A34A", class: "bg-emerald-600" },
      { name: "Sunset Orange", hex: "#EA580C", class: "bg-orange-600" }
    ],
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: 19.95, total: 19.95, savings: 0, netProfit: 12.96, badge: "1 Paw Washer" },
      { qty: 2, discountPercent: 15, pricePerUnit: 16.96, total: 33.92, savings: 5.98, netProfit: 19.94, badge: "🔥 Leve 2 (1 Casa + 1 Carro · 15% OFF)" },
      { qty: 3, discountPercent: 25, pricePerUnit: 14.96, total: 44.88, savings: 14.97, netProfit: 23.91, badge: "⚡ Kit Família (25% OFF)" }
    ],
    addOns: [
      { name: "Microfiber Quick-Dry Paw Drying Glove Towel", price: 6.95, description: "Absorbent microfiber mitt to dry clean paws instantly" },
      { name: "Organic Paw & Nose Soothing Balm Stick", price: 9.95, description: "Natural beeswax balm to hydrate and protect dog pads" }
    ]
  },
  {
    id: "zendrop-2053714",
    sku: "ZD-ZEPETZ-HAIR-REMOVER",
    name: "ZepetZ Reusable Multi-Surface Pet Hair Remover & Fur Lint Roller with Ergonomic Handle",
    brand: "ZepetZ",
    tagline: "Eco-friendly reusable pet hair scraper roller with ergonomic anti-slip grip and one-touch self-cleaning waste chamber for furniture, rugs, and car interiors.",
    petType: "All Pets",
    category: "Grooming",
    department: "Grooming",
    price: 42.95,
    compareAt: 64.99,
    supplierCost: 14.99,
    cjCost: 14.99,
    cjShippingEstimate: 0.00,
    totalCjCost: 14.99,
    netProfit: 27.96,
    profitMarginPercent: 65,
    supplier: "Zendrop",
    supplierSku: "B0DCC65HZT",
    supplierUrl: "https://app.zendrop.com/product/2053714",
    supplierWarehouse: "Zendrop US Domestic Warehouse (Dispatches in 24h)",
    supplierShippingTime: "2-4 business days via USPS",
    rating: 4.96,
    reviewsCount: 412,
    badge: "⚡ #1 Pet Hair Tool · Zendrop US",
    isBestseller: true,
    isLingPick: true,
    repeatDeliveryEligible: false,
    inStockAustin: true,
    heroImage: "https://file.zendrop.com/products/87/e1/c63523784fc396c4f2c6bd4c1c24.jpeg",
    secondaryImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
    galleryImages: [
      "https://file.zendrop.com/products/87/e1/c63523784fc396c4f2c6bd4c1c24.jpeg",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "The ultimate pet hair cleaning tool for pet parents tired of endless shedding. The ZepetZ utilizes an advanced electrostatic micro-bristle roller that grips and removes embedded dog and cat hair from couches, carpets, bedspreads, blankets, car seats, and clothing. No sticky tape refills, no batteries, and no mess. Simply roll back and forth, click the chamber button to pop open the lid, and empty the trapped hair clump directly into the trash.",
    keyFeatures: [
      "100% Reusable & Zero Waste: Never buy sticky adhesive tape rollers again; works indefinitely",
      "Electrostatic Micro-Fiber Roller: Effortlessly lifts deep-set stubborn hair and fine undercoat fluff",
      "One-Touch Push-Button Release: Hair collects in rear compartment; click button to empty hands-free",
      "Upgraded Ergonomic Non-Slip Grip: Smooth handle prevents wrist strain during large sofa and rug sweeps",
      "Protects Fabrics: Safe on velvet, microfiber, cotton upholstery, carpets, and automotive interiors",
      "Dispatched from Zendrop US Domestic Warehouse with USPS tracking in 24 hours"
    ],
    specifications: {
      material: "Heavy-Duty Reinforced ABS Body with Electrostatic Micro-Fiber Nylon Roller Mechanism",
      dimensions: "7.8\" L x 7.5\" W x 2.2\" H (19.8cm x 19cm x 5.6cm)",
      weight: "0.42 lbs (190g)",
      inTheBox: "1x ZepetZ Ergonomic Pet Hair Remover with Integrated Waste Chamber & User Guide",
      care: "Wipe roller with damp cloth after emptying; do not immerse in water",
      warranty: "Lifetime Durability Guarantee",
      cjWarehouse: "Zendrop US Domestic Warehouse",
      shippingEstimate: "Dispatches within 24h via USPS Ground Advantage · 2-4 Business Days"
    },
    colors: [
      { name: "Arctic White", hex: "#FFFFFF", class: "bg-white border-2 border-gray-300" }
    ],
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: 42.95, total: 42.95, savings: 0, netProfit: 27.96, badge: "1 Hair Remover" },
      { qty: 2, discountPercent: 15, pricePerUnit: 36.51, total: 73.02, savings: 12.88, netProfit: 43.04, badge: "🔥 Leve 2 (1 Casa + 1 Carro · 15% OFF)" },
      { qty: 3, discountPercent: 25, pricePerUnit: 32.21, total: 96.63, savings: 32.22, netProfit: 51.66, badge: "⚡ Casa Inteira Livre de Pelos (25% OFF)" }
    ],
    addOns: [
      { name: "Travel-Size Mini Pocket Fur Scraper", price: 9.95, description: "Compact version for car glovebox and clothes" }
    ]
  },
  {
    id: "zendrop-2058716",
    sku: "ZD-GROOM-GLOVE-SET",
    name: "Gentle 5-Finger Pet Grooming Glove & Deshedding Massage Mitt with Training Whistle",
    brand: "Ling GroomPro™",
    tagline: "Enhanced 180+ soft silicone tips mimic loving strokes while lifting shedding undercoat; includes bonus high-frequency dog training whistle.",
    petType: "All Pets",
    category: "Grooming",
    department: "Grooming",
    price: 25.95,
    compareAt: 39.95,
    supplierCost: 8.99,
    cjCost: 8.99,
    cjShippingEstimate: 0.00,
    totalCjCost: 8.99,
    netProfit: 16.96,
    profitMarginPercent: 65,
    supplier: "Zendrop",
    supplierSku: "B0D186JJRY",
    supplierUrl: "https://app.zendrop.com/product/2058716",
    supplierWarehouse: "Zendrop US Domestic Warehouse (Dispatches in 24h)",
    supplierShippingTime: "2-4 business days via USPS",
    rating: 4.91,
    reviewsCount: 289,
    badge: "✨ Best Value 2-in-1 Bundle · Zendrop US",
    isBestseller: true,
    isLingPick: true,
    repeatDeliveryEligible: true,
    inStockAustin: true,
    heroImage: "https://file.zendrop.com/products/e2/67/13ee6178492cbb4714ad09e346c8.jpeg",
    secondaryImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
    galleryImages: [
      "https://file.zendrop.com/products/e2/67/13ee6178492cbb4714ad09e346c8.jpeg",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Turn grooming into an intimate bonding massage that pets purr and wag for. Designed with 180+ gentle silicone massage nubs, this five-finger deshedding glove contours around hard-to-reach contours including tails, chests, bellies, and faces where scary metal combs cannot go. Loose hair clings to the silicone and peels off cleanly in one large continuous sheet. Includes an adjustable high-frequency ultrasonic dog whistle for recall training.",
    keyFeatures: [
      "Natural Petting Sensation: Dogs and cats relax and melt into the massage instead of running from brushes",
      "180+ Flexible Silicone Nubs: Reaches down into thick double coats to remove dead shedding undercoat hairs",
      "Clean One-Sheet Fur Peeling: Hair clumps into a solid sheet on the glove palm and pulls off in 2 seconds",
      "Breathable 3D Mesh & Adjustable Cuff: Fits all hand sizes securely with adjustable velcro wrist fastener",
      "Bonus Training Whistle Included: Precision stainless steel whistle with lanyard for recall and obedience training",
      "Dispatched from Zendrop US Domestic Warehouse with USPS tracking in 24 hours"
    ],
    specifications: {
      material: "Non-Toxic Flexible Medical Silicone Palm with Breathable 3D Mesh Fabric & Stainless Steel Whistle",
      dimensions: "9.2\" L x 6.7\" W (23.4cm x 17cm) · Universal Adjustable Wrist Strap",
      weight: "0.28 lbs (127g)",
      inTheBox: "1x Five-Finger Right-Hand Pet Deshedding Glove, 1x Ultrasonic High-Pitch Dog Training Whistle with Neck Lanyard",
      care: "Peel off collected hair, wash with warm soapy water, hang to dry",
      warranty: "30-Day Shed-Free Guarantee",
      cjWarehouse: "Zendrop US Domestic Warehouse",
      shippingEstimate: "Dispatches within 24h via USPS First Class · 2-4 Business Days"
    },
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: 25.95, total: 25.95, savings: 0, netProfit: 16.96, badge: "1 Deshedding Glove + Whistle" },
      { qty: 2, discountPercent: 15, pricePerUnit: 22.06, total: 44.12, savings: 7.78, netProfit: 26.14, badge: "🔥 Leve 2 (15% OFF - Par Mãos Duplas)" },
      { qty: 3, discountPercent: 25, pricePerUnit: 19.46, total: 58.38, savings: 19.47, netProfit: 31.41, badge: "⚡ Kit Completo Spa (25% OFF)" }
    ],
    addOns: [
      { name: "Left-Hand Matching Grooming Glove", price: 9.95, description: "Groom with both hands at twice the speed" }
    ]
  },
  {
    id: "cj-gate-2034090401252950017",
    sku: "LP-GATE-WHITE-01",
    name: "29.5-45.3\" Wide Baby & Dog Safety Gate for Stairs & Doorways (No Drilling Pressure Mounted)",
    brand: "Ling Safety™",
    tagline: "Pressure-mounted pet & baby safety gate with auto-close walk-through door. Fits 29.5\" to 45.3\" openings without drilling.",
    petType: "Dog",
    category: "Walk & Travel",
    department: "Dogs",
    price: 89.95,
    compareAt: 129.99,
    supplierCost: 42.32,
    cjCost: 42.32,
    cjShippingEstimate: 12.50,
    totalCjCost: 54.82,
    netProfit: 35.13,
    profitMarginPercent: 39,
    supplier: "CJ Dropshipping",
    supplierSku: "CJFU27913390001",
    supplierUrl: "https://www.cjdropshipping.com/product/-p-2034090401252950017.html",
    supplierWarehouse: "US Warehouse / CJ Express (Dispatches in 24h)",
    supplierShippingTime: "3-5 business days via USPS Ground Advantage",
    rating: 4.9,
    reviewsCount: 142,
    badge: "✓ Produto Oficial CJ Dropshipping",
    isBestseller: true,
    isLingPick: true,
    repeatDeliveryEligible: false,
    inStockAustin: true,
    heroImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
    secondaryImage: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Keep your pets and toddlers safe with this heavy-duty, no-drill pressure-mounted safety gate. Engineered with a one-handed dual-lock walk-through door and auto-close mechanism. Includes modular expansion panels to easily fit openings between 29.5\" and 45.3\" (75 to 115 cm). Sourced directly from CJ Dropshipping US warehouse for rapid 3-5 day delivery.",
    keyFeatures: [
      "No-Drilling Pressure Mount: Installs securely in doorways and stairwells in minutes without wall damage",
      "Dual-Lock One-Handed Walk-Through Door: Easy for adults to open with one hand, secure against pets and children",
      "Auto-Close & Stay-Open Dual Mode: Swings shut automatically under 90°; stays wide open when pushed past 90°",
      "Adjustable 29.5\" to 45.3\" Width: Includes modular extension kits to fit doors, hallways, and stairs",
      "Heavy-Duty Reinforced Carbon Steel: High-impact resistance with non-toxic white powder finish",
      "Dispatched via CJ Dropshipping US Warehouse with tracking in 24 hours"
    ],
    specifications: {
      material: "Heavy-Duty Carbon Steel with Non-Toxic Anti-Rust White Powder Coat & BPA-Free ABS Fittings",
      dimensions: "Fits openings 29.5\" – 45.3\" (75cm – 115cm) · Height: 30\" (76.2cm) · Bar Spacing: 2.16\"",
      weight: "12.8 lbs (5.8 kg)",
      inTheBox: "1x Main Safety Gate Frame, 2x Extension Panels (7cm & 14cm), 4x Pressure Tension Spindles, 4x Wall Saver Cups, 1x Wrench, 1x Instruction Manual",
      care: "Wipe clean with a damp microfiber cloth and mild soap",
      warranty: "30-Day Risk-Free In-Home Pet Trial Guarantee (100% Refundable)",
      cjWarehouse: "US Warehouse / CJ Express (New Jersey & California)",
      shippingEstimate: "Dispatches within 24h via USPS Ground Advantage · 3-5 Business Days"
    },
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: 89.95, total: 89.95, savings: 0, netProfit: 35.13, badge: "1 Portão (Padrão)" },
      { qty: 2, discountPercent: 15, pricePerUnit: 76.45, total: 152.90, savings: 27.00, netProfit: 68.26, badge: "🔥 Leve 2 para Escadas (15% OFF)" },
      { qty: 3, discountPercent: 25, pricePerUnit: 67.46, total: 202.38, savings: 67.47, netProfit: 95.87, badge: "⚡ Casa Completa Protegida (25% OFF)" }
    ],
    sizes: [
      { name: "Standard (29.5\" – 37.8\")", weightLabel: "Includes 7cm Extension" },
      { name: "Wide (29.5\" – 45.3\")", weightLabel: "Includes 7cm & 14cm Extensions" }
    ],
    colors: [
      { name: "Pure White (Branco)", hex: "#FFFFFF", class: "bg-white border-2 border-gray-300" },
      { name: "Matte Black (Preto Fosco)", hex: "#222222", class: "bg-zinc-800" }
    ],
    addOns: [
      { name: "Extra Wall-Protection Rubber Cups (Set of 4)", price: 9.95, description: "Zero-skid silicone pads to protect painted drywall and baseboards" },
      { name: "Bottom Ramp Threshold Protector", price: 14.95, description: "Smooth slope ramp to prevent tripping over the bottom bar" }
    ]
  }
];

export const PRODUCT_SUPPLIER_CATALOG: Record<string, any> = {};

export const PRODUCTS: Product[] = DEFAULT_REAL_PRODUCTS;

export function getSavedProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_REAL_PRODUCTS;
  try {
    const saved = localStorage.getItem('ling_admin_products');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Return only user-added products (excluding the old 25 mock items)
        const customProducts = parsed.filter(
          (p: any) =>
            p &&
            p.id &&
            !p.id.startsWith('cloud9') &&
            !p.id.startsWith('airglide') &&
            !p.id.startsWith('aquapure') &&
            !p.id.startsWith('groompro') &&
            !p.id.startsWith('zenpup') &&
            !p.id.startsWith('chomroller') &&
            !p.id.startsWith('wildbites') &&
            !p.id.startsWith('slowfeast') &&
            !p.id.startsWith('snuffle') &&
            !p.id.startsWith('ortho') &&
            !p.id.startsWith('cozy') &&
            !p.id.startsWith('ultrasonic') &&
            !p.id.startsWith('stainless') &&
            !p.id.startsWith('waterproof') &&
            !p.id.startsWith('anti-anxiety') &&
            !p.id.startsWith('self-cleaning') &&
            !p.id.startsWith('natural-dental') &&
            !p.id.startsWith('retractable') &&
            !p.id.startsWith('cat-laser') &&
            !p.id.startsWith('organic-paw') &&
            !p.id.startsWith('cat-tree') &&
            !p.id.startsWith('enzymatic') &&
            !p.id.startsWith('indestructible') &&
            !p.id.startsWith('odor-lock') &&
            !p.id.startsWith('calming-ferret') &&
            !p.id.match(/^p-\d+$/)
        );

        if (customProducts.length > 0) {
          // Ensure all DEFAULT_REAL_PRODUCTS (including all 5 Zendrop items) are present and refreshed
          const missingDefaults = DEFAULT_REAL_PRODUCTS.filter(
            (def) => !customProducts.some((p: any) => p.id === def.id || p.sku === def.sku)
          );
          if (missingDefaults.length > 0) {
            const combined = [...missingDefaults, ...customProducts];
            localStorage.setItem('ling_admin_products', JSON.stringify(combined));
            return combined;
          }
          return customProducts;
        }
      }
    }
  } catch (e) {
    console.error('Error loading saved products:', e);
  }
  localStorage.setItem('ling_admin_products', JSON.stringify(DEFAULT_REAL_PRODUCTS));
  return DEFAULT_REAL_PRODUCTS;
}

export function saveProductsToStorage(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ling_admin_products', JSON.stringify(products));
    window.dispatchEvent(new Event('ling_products_updated'));
  } catch (e) {
    console.error('Error saving products:', e);
  }
}

export const REVIEWS: CustomerReview[] = [
  {
    id: "rev-zd-1",
    author: "Jessica T.",
    location: "Dallas, TX",
    petName: "Cooper",
    petBreed: "Golden Retriever (4 yrs)",
    rating: 5,
    title: "Looks like luxury West Elm furniture and cured Cooper digestive strain!",
    comment:
      "This PawHut station is worth every single dollar. It fits 30 lbs of dry dog food completely out of sight, and the slide-out elevated stainless steel bowls are at the exact right height for Cooper so he no longer coughs after eating. Arrived in 3 days from the US warehouse!",
    verifiedPurchase: true,
    productName: "PawHut Elevated Pet Feeder Station & Food Storage Locker Cabinet with Raised Bowls",
    date: "Yesterday",
  },
  {
    id: "rev-zd-2",
    author: "Ryan P.",
    location: "Portland, OR",
    petName: "Rusty & Bear",
    petBreed: "Labradoodles",
    rating: 5,
    title: "No more muddy paw prints on our living room rug!",
    comment:
      "Living in Oregon means muddy rainy days almost all year. This 360° silicone cup cleans their muddy paws in 15 seconds before they ever step inside. The dogs actually enjoy the gentle silicone massage!",
    verifiedPurchase: true,
    productName: "Quick-Clean 360° Silicone Dog Paw Cleaner Cup & Foot Washer Bucket",
    date: "2 days ago",
  },
  {
    id: "rev-zd-3",
    author: "Amanda C.",
    location: "Austin, TX",
    petName: "Milo & Cleo",
    petBreed: "Maine Coon & Tabby Cats",
    rating: 5,
    title: "Throws away sticky adhesive lint rollers forever",
    comment:
      "The ZepetZ hair remover is unbelievable. I rolled it over our velvet sofa and rug—it trapped every stray cat hair into the internal chamber. Click the button, empty straight into the trash, and you are done. Zero waste!",
    verifiedPurchase: true,
    productName: "ZepetZ Reusable Multi-Surface Pet Hair Remover & Fur Lint Roller with Ergonomic Handle",
    date: "4 days ago",
  },
  {
    id: "rev-zd-4",
    author: "Kevin S.",
    location: "Charlotte, NC",
    petName: "Bella",
    petBreed: "Toy Poodle (2 yrs)",
    rating: 5,
    title: "Bella’s absolute favorite cozy sleeping spot",
    comment:
      "The Petmate Aspen Oval Cuddler has deep, plush bolster walls that make Bella feel so secure and curled up. Very high quality chocolate brown fabric that washes easily in the laundry.",
    verifiedPurchase: true,
    productName: "Petmate 290206 Aspen Pet Oval Cuddler Pet Bed 20\" x 16\" Chocolate Brown",
    date: "5 days ago",
  },
  {
    id: "rev-zd-5",
    author: "Maria L.",
    location: "Phoenix, AZ",
    petName: "Oliver",
    petBreed: "Domestic Longhair Cat",
    rating: 5,
    title: "My cat usually hates brushes, but purrs constantly with this glove!",
    comment:
      "Oliver runs away from wire combs, but with this 5-finger silicone glove he thinks he is just getting loved and petted. The fur pulls off the silicone palm in one clean sheet. The bonus training whistle was a nice touch!",
    verifiedPurchase: true,
    productName: "Gentle 5-Finger Pet Grooming Glove & Deshedding Massage Mitt with Training Whistle",
    date: "1 week ago",
  },
  {
    id: 'rev-1',
    author: 'Sarah M.',
    location: 'Miami, FL',
    petName: 'Cooper',
    petBreed: 'Golden Retriever (3 yrs)',
    rating: 5,
    title: 'The only bed that cured his thunderstorm tremors!',
    comment:
      'We live in South Florida where severe afternoon thunderstorms always sent Cooper panting into the closet. The first night in his Cloud9 bed, he curled right into the bolster and slept straight through a heavy thunderstorm. The Sage Green color is gorgeous in our living room too!',
    verifiedPurchase: true,
    productName: 'The Cloud9™ Orthopedic Calming Pet Bed',
    date: '3 days ago',
  },
  {
    id: 'rev-2',
    author: 'Michael B.',
    location: 'Denver, CO',
    petName: 'Beau',
    petBreed: 'Chocolate Lab (6 yrs)',
    rating: 5,
    title: 'Walks are finally enjoyable again. Zero pulling!',
    comment:
      'Beau weighs 72 lbs and used to pull so hard my shoulder would ache for days. The AirGlide front clip turned him into a completely different walker on our very first lap around the park. Total game changer.',
    verifiedPurchase: true,
    productName: 'AirGlide™ Zero-Pull Ergonomic Dog Harness',
    date: '1 week ago',
  },
  {
    id: 'rev-3',
    author: 'Emily & Liam R.',
    location: 'Seattle, WA',
    petName: 'Mochi',
    petBreed: 'Scottish Fold Cat',
    rating: 5,
    title: 'My cat drank almost no water until AquaPure arrived',
    comment:
      'Our vet warned us that Mochi was borderline dehydrated. Traditional bowls were a no-go. With AquaPure’s silent trickle, she now drinks 3-4 times every single day. Extremely easy to clean and whisper quiet in our apartment.',
    verifiedPurchase: true,
    productName: 'AquaPure™ Ultra-Quiet Wireless Pet Fountain',
    date: '2 weeks ago',
  },
  {
    id: 'rev-4',
    author: 'David K.',
    location: 'Chicago, IL',
    petName: 'Winston',
    petBreed: 'French Bulldog (2 yrs)',
    rating: 5,
    title: 'Saved me hundreds in grooming salon fees already',
    comment:
      'Frenchies shed short stiff hairs that get stuck in every rug. The GroomPro vacuum suction is incredible—it sucks the hair straight out of the brush before it can float into the air. Winston actually enjoys the massage feeling!',
    verifiedPurchase: true,
    productName: 'GroomPro™ 5-in-1 Low-Noise Pet Vacuum & Groomer',
    date: '3 weeks ago',
  },
  {
    id: 'rev-5',
    author: 'Amanda P.',
    location: 'Los Angeles, CA',
    petName: 'Luna & Milo',
    petBreed: 'Ragdoll Kittens',
    rating: 5,
    title: 'Repeat delivery is so convenient and saves me 35%',
    comment:
      'I have the AquaPure carbon filters and freeze-dried salmon treats on Repeat Delivery every 4 weeks. They arrive right on schedule, 100% fresh, and I never have to panic about running out. Great customer service from the US support team!',
    verifiedPurchase: true,
    productName: 'WildBites™ 100% Alaskan Wild Salmon Freeze-Dried Treats',
    date: '4 days ago',
  },
];

export const RECENT_US_PURCHASES = [
  {
    name: 'Jessica M.',
    city: 'Miami, FL',
    item: 'The Cloud9™ Calming Bed (Large)',
    timeAgo: '2 minutes ago',
  },
  {
    name: 'Brandon K.',
    city: 'Los Angeles, CA',
    item: 'AirGlide™ Zero-Pull Harness (Medium)',
    timeAgo: '5 minutes ago',
  },
  {
    name: 'Chloe W.',
    city: 'New York, NY',
    item: 'AquaPure™ Wireless Pet Fountain',
    timeAgo: '9 minutes ago',
  },
  {
    name: 'David S.',
    city: 'Chicago, IL',
    item: 'GroomPro™ 5-in-1 Pet Vacuum Kit',
    timeAgo: '14 minutes ago',
  },
  {
    name: 'Rachel H.',
    city: 'Seattle, WA',
    item: 'ZenPup™ Calming Soft Chews (90ct)',
    timeAgo: '18 minutes ago',
  },
  {
    name: 'Travis L.',
    city: 'Dallas, TX',
    item: 'ChomRoller™ Reusable Pet Hair Roller',
    timeAgo: '22 minutes ago',
  },
];

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];
