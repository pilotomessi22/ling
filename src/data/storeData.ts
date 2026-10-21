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
  warehouse?: string;
  cjWarehouse?: string;
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
  supplierCost: number; // Cost from Zendrop
  cjCost?: number; // Optional legacy field
  cjShippingEstimate?: number; // Optional legacy field
  totalCjCost?: number; // Optional legacy field
  netProfit: number; // Store profit (price - supplierCost)
  profitMarginPercent: number; // Margem de lucro
  supplier: 'Zendrop' | 'CJ Dropshipping';
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
  stockCount: number; // Estoque em tempo real do armazém Zendrop
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
  isCampaignBundle?: boolean;
  campaignName?: string;
  bundleItems?: BundleIncludedItem[];
}

export interface BundleIncludedItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  badge?: string;
  features?: string[];
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

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  partnerName: string;
  active: boolean;
  usageCount: number;
  createdAt: string;
  maxUses?: number;
}

export const SUPPLIER_AGENTS: SupplierAgent[] = [
  {
    id: 'agent-michael',
    name: 'Michael Miller',
    role: 'Central Warehouse Logistics Lead',
    platform: 'LiveChat',
    contact: 'logistics@lingpetshop.com',
    whatsappLink: 'mailto:logistics@lingpetshop.com',
    skype: 'live:.cid.central_warehouse_support',
    email: 'logistics@lingpetshop.com',
    warehouse: 'Central Warehouse',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    status: 'Online (24/7 Priority Desk)',
    perks: [
      'Garantia de reposição imediata se houver atraso superior a 5 dias úteis',
      'Envio expresso a partir da Central Warehouse via USPS Ground Advantage',
      'Atendimento prioritário em tempo real',
      'Encarte personalizado para a Ling Petshop',
    ],
  },
];

// Complete 34 Aligned Zendrop Product Catalog with 60% Margin & Real-Time Stock Tracking
export const DEFAULT_REAL_PRODUCTS: Product[] = [
  {
    "id": "ultimate-pet-cleanup-kit",
    "sku": "KIT-CLEANUP-3IN1",
    "name": "The Ultimate Pet Cleanup Kit – Grooming Gloves, Pet Hair Remover & Paw Cleaner",
    "brand": "Ling Petshop Select",
    "campaignName": "The Ultimate Pet Cleanup Kit",
    "isCampaignBundle": true,
    "tagline": "Less Fur. Cleaner Paws. Happier Home.",
    "petType": "All Pets",
    "category": "Grooming",
    "department": "Grooming",
    "supplierCost": 27.97,
    "price": 79.99,
    "compareAt": 124.97,
    "netProfit": 52.02,
    "profitMarginPercent": 65,
    "supplier": "Zendrop",
    "supplierSku": "ZD-BUNDLE-CLEANUP-3IN1",
    "supplierUrl": "https://app.zendrop.com",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 246,
    "badge": "Special Campaign Bundle",
    "isBestseller": true,
    "isLingPick": true,
    "repeatDeliveryEligible": true,
    "inStockAustin": true,
    "stockCount": 132,
    "heroImage": "/assets/campaign/ultimate_cleanup_kit_cover.webp",
    "secondaryImage": "/assets/campaign/grooming_gloves.webp",
    "galleryImages": [
      "/assets/campaign/ultimate_cleanup_kit_cover.webp",
      "/assets/campaign/grooming_gloves.webp",
      "/assets/campaign/zepetz_hair_remover.webp",
      "/assets/campaign/paw_cleaner.webp"
    ],
    "description": "A Cleaner Home. A Happier Pet. A Better Everyday Routine.\n\nMeet the Ultimate Pet Cleanup Kit, a convenient bundle designed to make everyday pet care easier.\n\nKeep your pets fresh and your home cleaner with three practical essentials for grooming, removing loose fur, and cleaning muddy paws.\n\n### WHAT'S INCLUDED:\n\n1. Pet Grooming Gloves\nHelp remove loose fur while providing a gentle grooming experience for your dog or cat.\n\n2. Zepetz Pet Hair Remover\nRemove unwanted pet hair from sofas, upholstery, and other suitable fabric surfaces with a reusable cleaning tool.\n\n3. Pet Paw Cleaner\nHelp remove dirt and mud from your dog's paws after walks, outdoor adventures, and playtime.\n\n### WHY YOU'LL LOVE IT:\n- Help reduce loose pet hair around your home.\n- Make everyday pet grooming easier.\n- Help clean muddy paws after outdoor activities.\n- Enjoy three practical pet care essentials in one convenient bundle.\n\nLess Fur. Cleaner Paws. Happier Home.",
    "keyFeatures": [
      "Help reduce loose pet hair around your home.",
      "Make everyday pet grooming easier.",
      "Help clean muddy paws after outdoor activities.",
      "Enjoy three practical pet care essentials in one convenient bundle.",
      "Complete 3-in-1 Kit: 1x Grooming Gloves, 1x Zepetz Hair Remover & 1x Paw Cleaner Cup"
    ],
    "specifications": {
      "material": "Pet-Safe Non-Toxic Silicone Bristles, Durable ABS Body & Breathable 3D Mesh",
      "dimensions": "Universal Fit Grooming Gloves + 7.5\" Hair Remover + Portable Paw Washer Cup",
      "weight": "1.2 lbs (Total 3-Piece Kit)",
      "inTheBox": "1x Pet Grooming Gloves, 1x Zepetz Pet Hair Remover, 1x Pet Paw Cleaner Cup",
      "care": "Rinse paw cleaner with water; empty hair chamber with one click; wash gloves with soap and air dry",
      "warranty": "30-Day Risk-Free In-Home Trial Guarantee",
      "warehouse": "US Central Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "bundleItems": [
      {
        "id": "bundle-item-gloves",
        "name": "1. Pet Grooming Gloves",
        "shortDesc": "Gently Removes Loose Fur For a Cleaner, Healthier Pet",
        "fullDesc": "Help remove loose fur while providing a gentle grooming experience for your dog or cat.",
        "image": "/assets/campaign/grooming_gloves.webp",
        "badge": "Essential 1 of 3",
        "features": [
          "Removes loose fur efficiently",
          "Gentle and soothing on pet skin",
          "Promotes a healthier, cleaner coat",
          "Perfect for daily dry petting or warm bath time"
        ]
      },
      {
        "id": "bundle-item-remover",
        "name": "2. Zepetz Pet Hair Remover",
        "shortDesc": "Remove Pet Hair Quickly and Easily from Upholstery",
        "fullDesc": "Remove unwanted pet hair from sofas, upholstery, and other suitable fabric surfaces with a reusable cleaning tool.",
        "image": "/assets/campaign/zepetz_hair_remover.webp",
        "badge": "Essential 2 of 3",
        "features": [
          "Works on furniture, car seats, and carpets",
          "100% Reusable & eco-friendly",
          "No sticky rollers or tape refills needed",
          "Quick-empty catchment chamber"
        ]
      },
      {
        "id": "bundle-item-cleaner",
        "name": "3. Pet Paw Cleaner",
        "shortDesc": "Clean Paws in Seconds for a Cleaner Home",
        "fullDesc": "Help remove dirt and mud from your dog's paws after walks, outdoor adventures, and playtime.",
        "image": "/assets/campaign/paw_cleaner.webp",
        "badge": "Essential 3 of 3",
        "features": [
          "Quick and easy to use with water",
          "Removes dirt, mud, and sand in seconds",
          "Soft, safe silicone bristles protect sensitive pads",
          "Keeps outdoor dirt away from carpets and floors"
        ]
      }
    ],
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 79.99,
        "total": 79.99,
        "savings": 44.98,
        "netProfit": 52.02
      },
      {
        "qty": 2,
        "discountPercent": 15,
        "pricePerUnit": 67.99,
        "total": 135.98,
        "savings": 113.96,
        "netProfit": 80.04,
        "badge": "POPULAR"
      },
      {
        "qty": 3,
        "discountPercent": 25,
        "pricePerUnit": 59.99,
        "total": 179.98,
        "savings": 194.93,
        "netProfit": 96.07,
        "badge": "BEST DEAL"
      }
    ]
  },
  {
    "id": "zendrop-2000857",
    "sku": "ZD-2000857",
    "name": "Pet Feeder Station Lockers",
    "brand": "Fable Pets Select",
    "tagline": "specification\n\n Product Information\n\n Product Code:\n\n W2225P173797\n\n Product Type:\n\n General items\n\n Product N...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 174.46,
    "price": 314.03,
    "compareAt": 439.64,
    "netProfit": 139.57,
    "profitMarginPercent": 44,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2000857",
    "supplierUrl": "https://app.zendrop.com/product/2000857",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 120,
    "badge": "Bestseller",
    "isBestseller": true,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 88,
    "heroImage": "https://file.zendrop.com/products/06/ee/b16863484e24800cd1e5d9553f50.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/06/ee/b16863484e24800cd1e5d9553f50_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/06/ee/b16863484e24800cd1e5d9553f50.jpeg",
      "https://file.zendrop.com/products/06/ee/b16863484e24800cd1e5d9553f50_import.webp",
      "https://file.zendrop.com/products/59/d6/666729bf4c3b9f88c5917075d175.jpeg",
      "https://file.zendrop.com/products/13/7c/15a0dd1f4f0e98d3687d1be8b41f.jpeg",
      "https://file.zendrop.com/products/91/f7/39d05d7e41fc8454eaecc21563bd.jpeg",
      "https://file.zendrop.com/products/f3/8f/393d6e0249ae847e9253797ce551.jpeg",
      "https://file.zendrop.com/products/f6/ab/87c42217454d97abacdb11846532.jpeg",
      "https://file.zendrop.com/products/b1/f5/2aa17ee544918223225c6b4050c1.jpeg",
      "https://file.zendrop.com/products/47/46/6d1fb51a49fe96a45152a77dc205.jpeg",
      "https://cf.cjdropshipping.com/12fc24b8-d0df-4c09-b155-801da3bd376e.png",
      "https://cf.cjdropshipping.com/2e688d72-8cac-47d8-b62c-53bd4ea435ae.png",
      "https://cf.cjdropshipping.com/0c34d09d-310b-4d5f-9460-82d29b48f9a4.png",
      "https://cf.cjdropshipping.com/0f83c673-8c51-40c2-947b-1699a2a0a102.png",
      "https://cf.cjdropshipping.com/7a6215e9-edb1-4035-8d61-ef2220a0b247.png",
      "https://cf.cjdropshipping.com/53b0e124-dac1-4793-9744-9b6ed891046f.png",
      "https://cf.cjdropshipping.com/df903eae-660d-4d2b-9738-50046f825bad.png",
      "https://cf.cjdropshipping.com/aa0cf03f-db7a-4f39-9a1e-5408ba4cf134.png"
    ],
    "description": "specification\n\n Product Information\n\n Product Code:\n\n W2225P173797\n\n Product Type:\n\n General items\n\n Product Name:\n\n PawHut Pet Feeder Station Locker, Dog Food Storage Container with Dog Raised Bowl and Hook for Feeding and Watering Supplies, White\n\n Main Color:\n\n white\n\n Main materials:\n\n Medium density fiberboard\n\n Product dimensions\n\n Assembly Length (in.):\n\n 24.00\n\n Assembly Width (inches):\n\n 14.00\n\n Assembly Height (in.):\n\n 32.25\n\n Weight (lbs):\n\n 42.68\n\n Package size\n\n Length (in.):\n\n 36.7...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Feeder Station Lockers",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 314.03,
        "total": 314.03,
        "savings": 0,
        "netProfit": 139.57
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 282.63,
        "total": 565.25,
        "savings": 62.81,
        "netProfit": 216.33
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 266.93,
        "total": 800.78,
        "savings": 141.31,
        "netProfit": 277.4
      }
    ]
  },
  {
    "id": "zendrop-2041862",
    "sku": "ZD-2041862",
    "name": "Petmate 290206 Aspen Pet Oval Cuddler Pet Bed 20\" x 16\" Chocolate Brown",
    "brand": "Fable Pets Select",
    "tagline": "The Aspen Pet Oval Cuddler Pet Bed provides comfort tailored to extra-small and toy breed dogs as well as larg...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 24.47,
    "price": 44.99,
    "compareAt": 62.99,
    "netProfit": 20.52,
    "profitMarginPercent": 46,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2041862",
    "supplierUrl": "https://app.zendrop.com/product/2041862",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 137,
    "badge": "Bestseller",
    "isBestseller": true,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/27/ce/5258638a4b9197f9dad3d50bfeca.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/27/ce/5258638a4b9197f9dad3d50bfeca_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/27/ce/5258638a4b9197f9dad3d50bfeca.jpeg",
      "https://file.zendrop.com/products/27/ce/5258638a4b9197f9dad3d50bfeca_import.webp",
      "https://file.zendrop.com/products/9b/a3/318353fe49acbb1d40fdd2d18e4d.jpeg"
    ],
    "description": "The Aspen Pet Oval Cuddler Pet Bed provides comfort tailored to extra-small and toy breed dogs as well as larger cats. The soft raised walls are filled with recycled high-loft polyester for cushioned comfort and the nest-like design helps pets settle in for a cozy nights rest. For crate and kennel-trained pets the Oval Cuddler provides cushioned comfort as a cat and dog crate bed or kennel pad. This small pet bed is entirely machine-washable and measures 20 by 16 inches for convenient placement ...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Petmate 290206 Aspen Pet Oval Cuddler Pet Bed 20\" x 16\" Chocolate Brown",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 44.99,
        "total": 44.99,
        "savings": 0,
        "netProfit": 20.52
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 40.49,
        "total": 80.98,
        "savings": 9,
        "netProfit": 32.04
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 38.24,
        "total": 114.72,
        "savings": 20.25,
        "netProfit": 41.31
      }
    ]
  },
  {
    "id": "zendrop-1603576",
    "sku": "ZD-1603576",
    "name": "New Dog Paw Cleaner Cup Soft Silicone Combs Portable Outdoor Pet Foot Washer Paw Clean Brush Quickly Wash Foot Cleaning Bucket",
    "brand": "Fable Pets Select",
    "tagline": "New Dog Paw Cleaner Cup Soft Silicone Combs Portable Outdoor Pet Foot Washer Paw Clean Brush Quickly Wash Foot...",
    "petType": "Dog",
    "category": "Grooming",
    "department": "Grooming",
    "supplierCost": 3.99,
    "price": 24.99,
    "compareAt": 34.99,
    "netProfit": 21.00,
    "profitMarginPercent": 84,
    "supplier": "Zendrop",
    "supplierSku": "ZD-1603576",
    "supplierUrl": "https://app.zendrop.com/product/1603576",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 154,
    "badge": "Bestseller",
    "isBestseller": true,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 16060,
    "heroImage": "https://file.zendrop.com/products/40/b1/574e46614f7482afe1aaac7320ca.png",
    "secondaryImage": "https://file.zendrop.com/products/40/b1/574e46614f7482afe1aaac7320ca_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/40/b1/574e46614f7482afe1aaac7320ca.png",
      "https://file.zendrop.com/products/40/b1/574e46614f7482afe1aaac7320ca_import.webp",
      "https://file.zendrop.com/products/fb/93/6004fbfc462da19deca29a3fa286.png",
      "https://file.zendrop.com/products/c1/4a/d8b88f6042e7bbddb94f811bd204.png",
      "https://file.zendrop.com/products/78/a7/8cba440b4b269016db39aba9ae7f.png",
      "https://file.zendrop.com/products/d3/25/02e592b84088876dc9495312d0c6.png",
      "https://file.zendrop.com/products/66/2c/c7c3280c44bc83e592089cf39330.png"
    ],
    "description": "New Dog Paw Cleaner Cup Soft Silicone Combs Portable Outdoor Pet Foot Washer Paw Clean Brush Quickly Wash Foot Cleaning Bucket",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x New Dog Paw Cleaner Cup Soft Silicone Combs Portable Outdoor Pet Foot Washer Paw Clean Brush Quickly Wash Foot Cleaning Bucket",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 24.99,
        "total": 24.99,
        "savings": 0,
        "netProfit": 21.00
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 22.49,
        "total": 44.98,
        "savings": 5.00,
        "netProfit": 37.00
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 21.24,
        "total": 63.72,
        "savings": 11.25,
        "netProfit": 51.75
      }
    ]
  },
  {
    "id": "zendrop-2053714",
    "sku": "ZD-2053714",
    "name": "ZepetZ Pet Hair Remover New Ergonomic Handle for Superior Grip – Ideal for Cleaning Furniture Carpets Car Seats and Bedding – Reusable Lint Roller for Versatile Multi-Surface Fur Removal. (White)",
    "brand": "Fable Pets Select",
    "tagline": "[DIRECTIONS: Simply roll back and forth in short strokes to trap pet hair into the catchment chamber. Press th...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 14.99,
    "price": 39.99,
    "compareAt": 49.99,
    "netProfit": 25.00,
    "profitMarginPercent": 63,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2053714",
    "supplierUrl": "https://app.zendrop.com/product/2053714",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 171,
    "badge": "Bestseller",
    "isBestseller": true,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/87/e1/c63523784fc396c4f2c6bd4c1c24.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/87/e1/c63523784fc396c4f2c6bd4c1c24_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/87/e1/c63523784fc396c4f2c6bd4c1c24.jpeg",
      "https://file.zendrop.com/products/87/e1/c63523784fc396c4f2c6bd4c1c24_import.webp",
      "https://file.zendrop.com/products/6a/02/2831dac34aa78777055be36f17e2.jpeg"
    ],
    "description": "[DIRECTIONS: Simply roll back and forth in short strokes to trap pet hair into the catchment chamber. Press the handle catch to open remove the collected hair and enjoy a mess-free cleanup! HELPS TO REDUCE ALLERGIES: This innovative tool effectively captures pet fur from almost all surfaces helping to reduce allergens and improve air quality. Perfect for homes with furry friends it makes fur cleanup effortless while promoting a more comfortable living environment for everyone! NOISE-FREE PET HAI...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x ZepetZ Pet Hair Remover New Ergonomic Handle for Superior Grip – Ideal for Cleaning Furniture Carpets Car Seats and Bedding – Reusable Lint Roller for Versatile Multi-Surface Fur Removal. (White)",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 39.99,
        "total": 39.99,
        "savings": 0,
        "netProfit": 25.00
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 35.99,
        "total": 71.98,
        "savings": 8.00,
        "netProfit": 42.00
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 33.99,
        "total": 101.97,
        "savings": 18.00,
        "netProfit": 57.00
      }
    ]
  },
  {
    "id": "zendrop-2058716",
    "sku": "ZD-2058716",
    "name": "Pet Grooming Glove - Gentle Deshedding Brush Glove - Efficient Pet Hair Remover Mitt - Massage Tool Enhanced Five Finger Design - Perfect for Dogs & Cats with Long & Short Fur with Training Whistle",
    "brand": "Fable Pets Select",
    "tagline": "Pet Dog Cat Gentle Deshedding Brush Grooming Glove Massage Hair Fur Removal Tool SKIN-FRIENDLY & BREATHABLE MA...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 8.99,
    "price": 29.99,
    "compareAt": 39.99,
    "netProfit": 21.00,
    "profitMarginPercent": 70,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2058716",
    "supplierUrl": "https://app.zendrop.com/product/2058716",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 188,
    "badge": "Bestseller",
    "isBestseller": true,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/e2/67/13ee6178492cbb4714ad09e346c8.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/e2/67/13ee6178492cbb4714ad09e346c8_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/e2/67/13ee6178492cbb4714ad09e346c8.jpeg",
      "https://file.zendrop.com/products/e2/67/13ee6178492cbb4714ad09e346c8_import.webp",
      "https://file.zendrop.com/products/93/ce/c1b89b084e5e8ca937ae5090b8c5.jpeg"
    ],
    "description": "Pet Dog Cat Gentle Deshedding Brush Grooming Glove Massage Hair Fur Removal Tool SKIN-FRIENDLY & BREATHABLE MATERIAL: the CAT & DOG GROOMING GLOVES made of extremely durable stretchy 3D cloth back with 180?? silicone grooming tips on the palm breathable Efficient Pet Hair Remover Mitt can keep your hand fast dry last a long life of use FUNCTIONALITY & ERGONOMMICALLY FIVE FINGERS DESIGN: our 2-in-1 Pet Hair Remover Mitt gives your pet a relaxed deshedding experience or a massage shower; five fing...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Grooming Glove - Gentle Deshedding Brush Glove - Efficient Pet Hair Remover Mitt - Massage Tool Enhanced Five Finger Design - Perfect for Dogs & Cats with Long & Short Fur with Training Whistle",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 29.99,
        "total": 29.99,
        "savings": 0,
        "netProfit": 21.00
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 26.99,
        "total": 53.98,
        "savings": 6.00,
        "netProfit": 36.00
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 25.49,
        "total": 76.47,
        "savings": 13.50,
        "netProfit": 49.50
      }
    ]
  },
  {
    "id": "zendrop-2873973",
    "sku": "ZD-2873973",
    "name": "Large Semi-Enclosed Cat Litter Box with Shovel",
    "brand": "Fable Pets Select",
    "tagline": "Discover the ultimate solution for your feline friend with our Round Semi-enclosed Large Cat Litter Box. Desig...",
    "petType": "Cat",
    "category": "Beds",
    "department": "Cats",
    "supplierCost": 1.91,
    "price": 14.99,
    "compareAt": 20.99,
    "netProfit": 13.08,
    "profitMarginPercent": 87,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2873973",
    "supplierUrl": "https://app.zendrop.com/product/2873973",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 205,
    "isBestseller": true,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 300000,
    "heroImage": "https://file.zendrop.com/products/78/67/b3a2860443c0a48a043836b613ab.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/78/67/b3a2860443c0a48a043836b613ab_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/78/67/b3a2860443c0a48a043836b613ab.jpeg",
      "https://file.zendrop.com/products/78/67/b3a2860443c0a48a043836b613ab_import.webp",
      "https://file.zendrop.com/products/60/58/0b9b71e24216b1f72575a89cfb8a.jpeg",
      "https://file.zendrop.com/products/9b/43/b5cb5a154c35863fc329b2863d75.jpeg",
      "https://file.zendrop.com/products/52/8f/07db298245c5904039f12f27e6f4.jpeg",
      "https://file.zendrop.com/products/14/ad/a62be2b448dba3a325f604e3c484.jpeg",
      "https://file.zendrop.com/products/66/69/f7f803a743a8931c8c86e88e1a0f.jpeg",
      "https://file.zendrop.com/products/af/58/48d9f4a54e69b7f530a5f27299b8.png",
      "https://file.zendrop.com/products/88/65/49bfff08433e82acd658616f6fd2.jpeg",
      "https://file.zendrop.com/products/7d/00/b79b23474211af0664e58bf9f2d6.jpeg",
      "https://file.zendrop.com/products/5f/48/8dd16a2444caa0be52ed7281ef53.png",
      "https://file.zendrop.com/products/ab/ef/82fd41ff4eaca35a5c481dd41f1c.jpeg",
      "https://static.hzpdex.com/cce7ad01-325d-4aa7-884d-fd102c52c467.jpeg",
      "https://static.hzpdex.com/7b16cf8a-5878-4c1c-8adf-0ff0e6e9911d.jpeg",
      "https://static.hzpdex.com/7e425a0f-6a05-4509-8600-dda6acdfdaab.png",
      "https://static.hzpdex.com/0575f917-64f0-4457-8bd0-3f57771f78fa.png",
      "https://static.hzpdex.com/9f551dbe-6b5c-4203-921a-2bc689809102.png",
      "https://static.hzpdex.com/ffd941b1-0bb3-424e-a632-185e88f80bb5.png"
    ],
    "description": "Discover the ultimate solution for your feline friend with our Round Semi-enclosed Large Cat Litter Box. Designed with your cat's comfort and your convenience in mind, this litter box features a semi-enclosed design that provides privacy while ensuring easy access. The anti-splash feature keeps the surrounding area clean, making it an ideal choice for your home.\n\nAvailable in various sizes and colors, including Big Pink, Big Green, Small Pink, Small Green, Big White, and Small White, this litter...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Large Semi-Enclosed Cat Litter Box with Shovel",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 14.99,
        "total": 14.99,
        "savings": 0,
        "netProfit": 13.08
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 13.49,
        "total": 26.98,
        "savings": 3,
        "netProfit": 23.16
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 12.74,
        "total": 38.22,
        "savings": 6.75,
        "netProfit": 32.49
      }
    ]
  },
  {
    "id": "zendrop-2632492",
    "sku": "ZD-2632492",
    "name": "Non-slip Stainless Steel Dog Bowl for Medium & Large Dogs",
    "brand": "Fable Pets Select",
    "tagline": "Elevate your pet's dining experience with our premium Non-slip Stainless Steel Dog Bowl, designed specifically...",
    "petType": "Dog",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 5.5,
    "price": 22.99,
    "compareAt": 32.19,
    "netProfit": 17.49,
    "profitMarginPercent": 76,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2632492",
    "supplierUrl": "https://app.zendrop.com/product/2632492",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 222,
    "isBestseller": true,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 1000000,
    "heroImage": "https://file.zendrop.com/products/5e/15/ca184d4c4c7faf6be52319848d23.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/5e/15/ca184d4c4c7faf6be52319848d23_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/5e/15/ca184d4c4c7faf6be52319848d23.jpeg",
      "https://file.zendrop.com/products/5e/15/ca184d4c4c7faf6be52319848d23_import.webp",
      "https://file.zendrop.com/products/0b/47/c0f973ce4e64aa0ee66d8e6b98b8.jpeg",
      "https://file.zendrop.com/products/8f/30/9e0244b8426f8c4baa36add7419e.jpeg",
      "https://file.zendrop.com/products/27/06/a6af3ff84efc9e23ac2936039db5.jpeg",
      "https://file.zendrop.com/products/2a/14/edc7393144d9a8858180b606cc98.jpeg",
      "https://file.zendrop.com/products/49/51/a9847844456d9dc4544ea0b720ef.jpeg",
      "https://file.zendrop.com/products/46/af/51d353d24a14af7b6eb8ee78a672.jpeg",
      "https://file.zendrop.com/products/f5/06/03933c404bfe8e9f1a6681b36782.jpeg",
      "https://file.zendrop.com/products/d8/e5/18da1f98452e93e2a70e3f1e91e8.jpeg",
      "https://file.zendrop.com/products/1a/f9/66e44e9d48a5adc6e2f080ba2696.jpeg",
      "https://file.zendrop.com/products/4f/63/13fc8e01470dac35a442e3c50ea0.jpeg",
      "https://file.zendrop.com/products/39/4e/f392d71b4194ae22839479c01488.jpeg",
      "https://file.zendrop.com/products/66/84/c0f1c64242fc86dfcc6d7e92a356.jpeg",
      "https://file.zendrop.com/products/32/99/6ff0af8545b6bbe5d7feb54428e5.jpeg",
      "https://file.zendrop.com/products/b6/81/3b7e367b4d09b21de9f4ccd033ec.jpeg",
      "https://file.zendrop.com/products/91/15/3c234b18460b8577beff187ace66.jpeg",
      "https://file.zendrop.com/products/66/0e/375c34634ea1ac7faea8b2bfb471.jpeg",
      "https://file.zendrop.com/products/3b/4c/b47dac874501b46d6000fd33576a.jpeg",
      "https://file.zendrop.com/products/a4/02/0f812388437ca0aaf5e2ba56bb0f.jpeg",
      "https://file.zendrop.com/products/83/86/b45dae5c4d34b406eb0bb9d3c961.jpeg",
      "https://file.zendrop.com/products/97/d8/543af3974e40bfd0e12de3096a0e.jpeg",
      "https://res.race321.com/pronew/3474590000269767729/8395fa7d.jpg",
      "https://res.race321.com/pronew/3474590000269767729/844602c8.jpg",
      "https://res.race321.com/pronew/3474590000269767729/3107a9c3.jpg",
      "https://res.race321.com/pronew/3474590000269767729/aa00cbb3.jpg",
      "https://res.race321.com/pronew/3474590000269767729/4cc975d2.jpg",
      "https://res.race321.com/pronew/3474590000269767729/11ac2d1a.jpg",
      "https://res.race321.com/pronew/3474590000269767729/d5bb4087.jpg"
    ],
    "description": "Elevate your pet's dining experience with our premium Non-slip Stainless Steel Dog Bowl, designed specifically for medium and large dogs. Crafted from high-quality stainless steel, this bowl not only offers durability but also ensures that your furry friend enjoys every meal without the hassle of slipping or sliding. \r\n\n    The sleek design is perfect for any home, featuring a non-slip base that keeps the bowl firmly in place, preventing spills and messes. Whether your dog is a gentle sipper or ...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Non-slip Stainless Steel Dog Bowl for Medium & Large Dogs",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 22.99,
        "total": 22.99,
        "savings": 0,
        "netProfit": 17.49
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 20.69,
        "total": 41.38,
        "savings": 4.6,
        "netProfit": 30.38
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 19.54,
        "total": 58.62,
        "savings": 10.35,
        "netProfit": 42.12
      }
    ]
  },
  {
    "id": "zendrop-2658755",
    "sku": "ZD-2658755",
    "name": "Waterproof Windbreaker for Small Dogs - Chest & Back",
    "brand": "Fable Pets Select",
    "tagline": "Keep your furry friend protected from the elements with our Waterproof Windbreaker designed specifically for s...",
    "petType": "Dog",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 7.11,
    "price": 22.99,
    "compareAt": 32.19,
    "netProfit": 15.88,
    "profitMarginPercent": 69,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2658755",
    "supplierUrl": "https://app.zendrop.com/product/2658755",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 239,
    "isBestseller": true,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 750000,
    "heroImage": "https://file.zendrop.com/products/a7/dd/8286c1cb449ba415ed6424df9eb1.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/a7/dd/8286c1cb449ba415ed6424df9eb1_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/a7/dd/8286c1cb449ba415ed6424df9eb1.jpeg",
      "https://file.zendrop.com/products/a7/dd/8286c1cb449ba415ed6424df9eb1_import.webp",
      "https://file.zendrop.com/products/ca/09/eb29bd7141259c98a2a683a2b3cd.png",
      "https://file.zendrop.com/products/7b/2c/2a1d3d7d4eab895f8d3cd4a0dfab.png",
      "https://file.zendrop.com/products/41/1e/df61b2db4925baa75d9dffe3f33c.png",
      "https://file.zendrop.com/products/ee/b0/7b9d81754701be3db31050d938ca.jpeg",
      "https://file.zendrop.com/products/bc/6e/53a794da430ea1a983b09c53e0c4.jpeg",
      "https://file.zendrop.com/products/6b/03/be13f79e48e2ac34bf905af45e1f.jpeg",
      "https://file.zendrop.com/products/f8/2d/a742c3904c1c985abdb9f5c6541d.jpeg",
      "https://file.zendrop.com/products/5d/c8/b58a398f49549910ff4d528a63b1.jpeg",
      "https://file.zendrop.com/products/49/c5/90041c9c4c37a99539370673bbf0.jpeg",
      "https://file.zendrop.com/products/03/fd/7a11a6e1417095cd67c572f32505.jpeg",
      "https://file.zendrop.com/products/4d/98/eadea9654118b0c5d0bd20ae7935.jpeg",
      "https://file.zendrop.com/products/50/1b/73f8cc67437c9968f5c29be9759c.jpeg",
      "https://file.zendrop.com/products/c7/c3/b6aabed2449aa887c9f07f184e63.jpeg",
      "https://file.zendrop.com/products/c8/f8/e7b0dd3d47d691d89a2d8267b2c0.jpeg",
      "https://file.zendrop.com/products/ab/af/67a37ccd473cb3d56f1705422ea9.jpeg",
      "https://file.zendrop.com/products/92/89/22db639c4456aab4175346041564.jpeg",
      "https://file.zendrop.com/products/0d/37/7f680dac4d4aa8f259cfa4f23139.jpeg",
      "https://file.zendrop.com/products/f2/da/4fa8839342389208f81c74d7a8a0.jpeg",
      "https://static.hzpdex.com/aaef8dcf-d5bc-44ae-9b5a-16a837d8e026.jpeg",
      "https://res.race321.com/pronew/4048798961466684465/bfe3bc47.jpg",
      "https://res.race321.com/pronew/4048798961466684465/64f0b3f9.jpg",
      "https://res.race321.com/pronew/4048798961466684465/e202cd7d.jpg",
      "https://res.race321.com/pronew/4048798961466684465/1d194d6b.jpg",
      "https://res.race321.com/pronew/4048798961466684465/13caf7bc.jpg",
      "https://res.race321.com/pronew/4048798961466684465/deb3b59f.jpg"
    ],
    "description": "Keep your furry friend protected from the elements with our Waterproof Windbreaker designed specifically for small dogs. Made from high-quality cotton, this stylish and casual jacket ensures not just comfort but also durability for your adventurous pup.\n\n    Featuring a waterproof layer, this windbreaker shields your pet from rain and wind, making it perfect for outdoor activities. The reflective detailing enhances visibility during low-light conditions, keeping your dog safe during evening walk...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Waterproof Windbreaker for Small Dogs - Chest & Back",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 22.99,
        "total": 22.99,
        "savings": 0,
        "netProfit": 15.88
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 20.69,
        "total": 41.38,
        "savings": 4.6,
        "netProfit": 27.16
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 19.54,
        "total": 58.62,
        "savings": 10.35,
        "netProfit": 37.29
      }
    ]
  },
  {
    "id": "zendrop-2689252",
    "sku": "ZD-2689252",
    "name": "Titanium Stainless Steel Bull Dog Full Head Collar",
    "brand": "Fable Pets Select",
    "tagline": "Introducing the Stainless Steel Titanium Bully Dog Full Dog Head Collar!\n\n    This premium collar is designed ...",
    "petType": "Dog",
    "category": "Walk & Travel",
    "department": "Dogs",
    "supplierCost": 51.71,
    "price": 129.99,
    "compareAt": 181.99,
    "netProfit": 78.28,
    "profitMarginPercent": 60,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2689252",
    "supplierUrl": "https://app.zendrop.com/product/2689252",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 256,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 100000,
    "heroImage": "https://file.zendrop.com/products/a1/50/2214100e4ecc80ec74f6a3892caa.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/a1/50/2214100e4ecc80ec74f6a3892caa_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/a1/50/2214100e4ecc80ec74f6a3892caa.jpeg",
      "https://file.zendrop.com/products/a1/50/2214100e4ecc80ec74f6a3892caa_import.webp",
      "https://file.zendrop.com/products/0f/f4/9f879b59450db4267469107f8d2c.jpeg",
      "https://file.zendrop.com/products/59/c0/3df44ee44122b06a4d857ae7e6d6.jpeg",
      "https://static.hzpdex.com/b67e8822-1c89-4b93-a36a-8d6e59bce8fb.png",
      "https://res.race321.com/pronew/3904964153101005617/18198c7d.jpg",
      "https://res.race321.com/pronew/3904964153101005617/c2498b09.jpg",
      "https://res.race321.com/pronew/3904964153101005617/98186618.jpg",
      "https://res.race321.com/pronew/3904964153101005617/ca91cddd.jpg",
      "https://res.race321.com/pronew/3904964153101005617/35c359cf.jpg",
      "https://res.race321.com/pronew/3904964153101005617/33a57617.jpg"
    ],
    "description": "Introducing the Stainless Steel Titanium Bully Dog Full Dog Head Collar!\n\n    This premium collar is designed specifically for your beloved dog, combining style and durability in one exceptional product. \n\n    Available in two stunning colors: Gold and Silver, this collar not only provides a secure fit but also makes a bold fashion statement. \n\n    With a size of 12 inches (30 cm), it is perfect for medium-sized breeds, ensuring comfort while maintaining control during walks. \n\n    Crafted from ...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Titanium Stainless Steel Bull Dog Full Head Collar",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 129.99,
        "total": 129.99,
        "savings": 0,
        "netProfit": 78.28
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 116.99,
        "total": 233.98,
        "savings": 26,
        "netProfit": 130.56
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 110.49,
        "total": 331.47,
        "savings": 58.5,
        "netProfit": 176.34
      }
    ]
  },
  {
    "id": "zendrop-2640918",
    "sku": "ZD-2640918",
    "name": "Waterproof Thickened Dog Cushion for Car Rear",
    "brand": "Fable Pets Select",
    "tagline": "Give your furry friend the comfort they deserve during car rides with our Car Rear Dog Cushion. Designed with ...",
    "petType": "Dog",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 6.25,
    "price": 22.99,
    "compareAt": 32.19,
    "netProfit": 16.74,
    "profitMarginPercent": 73,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2640918",
    "supplierUrl": "https://app.zendrop.com/product/2640918",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 273,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/ce/8f/f74e02694cf780d8ef585870064e.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/ce/8f/f74e02694cf780d8ef585870064e_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/ce/8f/f74e02694cf780d8ef585870064e.jpeg",
      "https://file.zendrop.com/products/ce/8f/f74e02694cf780d8ef585870064e_import.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01RugcHK23A4B9wC45W_!!2836087214-0-cib.jpg",
      "https://img.alicdn.com/imgextra/i4/6000000007416/O1CN01hiw3My24eZoHvRBBE_!!6000000007416-0-tbvideo.jpg",
      "https://cbu01.alicdn.com/img/ibank/6408480910_1147337207.jpg",
      "https://cbu01.alicdn.com/img/ibank/6418892802_1147337207.jpg"
    ],
    "description": "Give your furry friend the comfort they deserve during car rides with our Car Rear Dog Cushion. Designed with your pet's needs in mind, this thickened cushion not only offers plush support but also protects your car's interior with its waterproof and anti-dirty properties. \n\n    Measuring at 130*145*40cm, this cushion is perfectly sized to fit most vehicles, providing ample space for your dog to relax and enjoy the journey. The stylish black with net design complements any car interior, ensuring...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Waterproof Thickened Dog Cushion for Car Rear",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 22.99,
        "total": 22.99,
        "savings": 0,
        "netProfit": 16.74
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 20.69,
        "total": 41.38,
        "savings": 4.6,
        "netProfit": 28.88
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 19.54,
        "total": 58.62,
        "savings": 10.35,
        "netProfit": 39.87
      }
    ]
  },
  {
    "id": "zendrop-2650189",
    "sku": "ZD-2650189",
    "name": "Portable One-Shoulder Folding Pet Carrier Bag",
    "brand": "Fable Pets Select",
    "tagline": "Explore our portable single-shoulder foldable pet carrier—the perfect solution for traveling with your pet. De...",
    "petType": "Cat",
    "category": "Beds",
    "department": "Cats",
    "supplierCost": 14.75,
    "price": 29.99,
    "compareAt": 41.99,
    "netProfit": 15.24,
    "profitMarginPercent": 51,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2650189",
    "supplierUrl": "https://app.zendrop.com/product/2650189",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 290,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 150000,
    "heroImage": "https://file.zendrop.com/products/8b/71/ea1b681b410991551a11f162b789.png",
    "secondaryImage": "https://file.zendrop.com/products/8b/71/ea1b681b410991551a11f162b789_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/8b/71/ea1b681b410991551a11f162b789.png",
      "https://file.zendrop.com/products/8b/71/ea1b681b410991551a11f162b789_import.webp",
      "https://file.zendrop.com/products/2a/f6/0b31bda643e39234cb97666fc59e.png",
      "https://file.zendrop.com/products/2f/e0/28c001204141bd8cab56c1ba0474.png",
      "https://file.zendrop.com/products/00/83/8297138c4009a1c1be2414ac9a9d.png",
      "https://file.zendrop.com/products/f3/4c/323d055a4b9ea3d03df6dfd982b5.png",
      "https://file.zendrop.com/products/a1/ee/280ad2704900a5403c35f3774630.png",
      "https://file.zendrop.com/products/67/fe/eeb5bf77480d918242305de58b38.png",
      "https://file.zendrop.com/products/92/ff/1d16f0044237959f01dff14ce2b3.png",
      "https://file.zendrop.com/products/0a/79/ce6be31f4f62bdf3de7808a09d17.png",
      "https://file.zendrop.com/products/91/ad/3571d00a4d2c9f305933e7fc9599.png",
      "https://file.zendrop.com/products/04/76/7440efaf4f6c938f517a7e6cfd4f.png",
      "https://file.zendrop.com/products/dd/17/37c5240c46ceb04f377c0402e090.png",
      "https://file.zendrop.com/products/2d/f9/9312530a489db104976e2b6e65ce.png",
      "https://file.zendrop.com/products/44/e2/291867fb4a19a71afb1f53b28d92.png"
    ],
    "description": "Explore our portable single-shoulder foldable pet carrier—the perfect solution for traveling with your pet. Designed for pet owners who value both style and practicality, this carrier is ideal for taking your furry companion on outings, whether it’s a trip to the vet or a short weekend getaway.\n\nMade from durable Oxford fabric, this pet carrier is lightweight yet highly wear-resistant, able to handle the demands of travel with ease. It comes in three stylish color options—gray with orange trim, ...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Portable One-Shoulder Folding Pet Carrier Bag",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 29.99,
        "total": 29.99,
        "savings": 0,
        "netProfit": 15.24
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 26.99,
        "total": 53.98,
        "savings": 6,
        "netProfit": 24.48
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 25.49,
        "total": 76.47,
        "savings": 13.5,
        "netProfit": 32.22
      }
    ]
  },
  {
    "id": "zendrop-2608657",
    "sku": "ZD-2608657",
    "name": "Dog Wheelchair for Pets with Disabilities (One Set)",
    "brand": "Fable Pets Select",
    "tagline": "Give your furry friend the freedom to explore the world again with our specially designed wheelchair for dogs ...",
    "petType": "All Pets",
    "category": "Grooming",
    "department": "Grooming",
    "supplierCost": 25.16,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 44.83,
    "profitMarginPercent": 64,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2608657",
    "supplierUrl": "https://app.zendrop.com/product/2608657",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 307,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 150000,
    "heroImage": "https://file.zendrop.com/products/69/a5/b0e36f26461f950d7ad2766974b9.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/69/a5/b0e36f26461f950d7ad2766974b9_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/69/a5/b0e36f26461f950d7ad2766974b9.jpeg",
      "https://file.zendrop.com/products/69/a5/b0e36f26461f950d7ad2766974b9_import.webp",
      "https://static.hzpdex.com/90ac91eb-d7ba-45ec-b77a-5c18764a7391.jpg",
      "https://static.hzpdex.com/d9339bd7-1929-42bb-83dc-c1dc4de39532.jpg",
      "https://static.hzpdex.com/18e5ca1e-a200-483c-b2cd-fa17250f313e.jpeg"
    ],
    "description": "Give your furry friend the freedom to explore the world again with our specially designed wheelchair for dogs with disabilities. This innovative pet support cart is tailored to provide mobility and comfort for dogs who need a little extra help in their daily adventures.\n\n    This adjustable and lightweight wheelchair is available in three vibrant colors: P (Pink), M (Medium), and G (Green). Each variant is designed to cater to various sizes, ensuring that your dog finds the perfect fit for their...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Dog Wheelchair for Pets with Disabilities (One Set)",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 44.83
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 75.66
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 102.99
      }
    ]
  },
  {
    "id": "zendrop-2631448",
    "sku": "ZD-2631448",
    "name": "Stainless Steel P Chain Dog Leash",
    "brand": "Fable Pets Select",
    "tagline": "Elevate your pet's style and safety with our Stainless Steel P Chain Dog Chain. Crafted from high-quality stai...",
    "petType": "Dog",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 33.84,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 36.15,
    "profitMarginPercent": 52,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2631448",
    "supplierUrl": "https://app.zendrop.com/product/2631448",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 324,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 600000,
    "heroImage": "https://file.zendrop.com/products/5f/96/2e8f112d4063b96501825858e3da.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/5f/96/2e8f112d4063b96501825858e3da_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/5f/96/2e8f112d4063b96501825858e3da.jpeg",
      "https://file.zendrop.com/products/5f/96/2e8f112d4063b96501825858e3da_import.webp",
      "https://file.zendrop.com/products/ad/1c/95465d874f5f83c0d19273d8b148.jpeg",
      "https://file.zendrop.com/products/cc/c3/b340a129491b8552199f154d6f27.jpeg",
      "https://file.zendrop.com/products/cd/f9/d47d37a24883a81154877dc3a306.jpeg",
      "https://file.zendrop.com/products/e9/0b/97ee19ac4683a3e36193b6516e7b.jpeg",
      "https://file.zendrop.com/products/84/43/25fbfe2f437099f0741181db3c83.jpeg",
      "https://file.zendrop.com/products/74/c8/3366dd9348bca1010fe9d479bb28.jpeg",
      "https://file.zendrop.com/products/b5/d9/00ff6d8a4440b1957fc6394425d6.jpeg",
      "https://file.zendrop.com/products/ce/c7/7d5b1a8147d6b594862583eac5da.jpeg",
      "https://file.zendrop.com/products/bd/35/14f45e7543bea11c9da47f6393c5.jpeg",
      "https://file.zendrop.com/products/0d/e0/5a138e1f4b72b887b003c0eaf37e.jpeg",
      "https://file.zendrop.com/products/d0/1b/beb6c1ef45cfacdc7ee90bc6009a.jpeg",
      "https://file.zendrop.com/products/5f/37/35fcd6154c658e46cd5526884669.jpeg",
      "https://res.race321.com/pronew/3761703349950363444/7d0fc147.jpg",
      "https://res.race321.com/pronew/3761703349950363444/9b96112e.jpg",
      "https://res.race321.com/pronew/3761703349950363444/3908707e.jpg",
      "https://res.race321.com/pronew/3761703349950363444/cce92016.jpg",
      "https://res.race321.com/pronew/3761703349950363444/9d103f7c.jpg",
      "https://res.race321.com/pronew/3761703349950363444/0de7fa2f.jpg",
      "https://res.race321.com/pronew/3761703349950363444/fb4bb8d7.jpg",
      "https://res.race321.com/pronew/3761703349950363444/31eb0ee3.jpg"
    ],
    "description": "Elevate your pet's style and safety with our Stainless Steel P Chain Dog Chain. Crafted from high-quality stainless steel, this durable chain is designed to withstand the test of time while keeping your furry friend secure during walks. Choose from a variety of sizes ranging from S (32MM*40CM) to XXXL (32MM*65CM), ensuring the perfect fit for dogs of all breeds and sizes. \n\n    The chain comes in two stunning colors: Silver and Gold, allowing you to select the one that best matches your dog’s pe...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Stainless Steel P Chain Dog Leash",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 36.15
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 58.3
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 76.95
      }
    ]
  },
  {
    "id": "zendrop-2040471",
    "sku": "ZD-2040471",
    "name": "Puppy Pads XL Pee Pads for Dogs 28\"x34\" Pack of 30 homepads Puppy Pee Pads for Dogs Disposable Potty Training Pads New Leak-Proof Quick-Dry Design Pads for Dogs Cats Pets",
    "brand": "Fable Pets Select",
    "tagline": "[SUPER ABSORBENT THICKEN XL PUPPY PAD: homepads puppy pee pads are extra large pee pads for dogs all canines a...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 23.69,
    "price": 44.99,
    "compareAt": 62.99,
    "netProfit": 21.3,
    "profitMarginPercent": 47,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2040471",
    "supplierUrl": "https://app.zendrop.com/product/2040471",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 341,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": false,
    "stockCount": 0,
    "heroImage": "https://file.zendrop.com/products/2c/a8/7ab107c2430db481c9248382069d.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/2c/a8/7ab107c2430db481c9248382069d_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/2c/a8/7ab107c2430db481c9248382069d.jpeg",
      "https://file.zendrop.com/products/2c/a8/7ab107c2430db481c9248382069d_import.webp",
      "https://file.zendrop.com/products/91/09/27c3c7ec417a88cb00ee8a88efdd.jpeg"
    ],
    "description": "[SUPER ABSORBENT THICKEN XL PUPPY PAD: homepads puppy pee pads are extra large pee pads for dogs all canines and other pets featuring a super absorbent core of large-sized thickened material that absorbs more urine and instantly converts it into a gel to lock it in place ensures instant dryness and eliminates odors effectively making it the perfect a special large potty pads for pets with incontinent issue \"6 LAYER LEAK PROOF DOG PADS: 6-layer leak proof design extra large puppy pads dog pee pad...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Puppy Pads XL Pee Pads for Dogs 28\"x34\" Pack of 30 homepads Puppy Pee Pads for Dogs Disposable Potty Training Pads New Leak-Proof Quick-Dry Design Pads for Dogs Cats Pets",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 44.99,
        "total": 44.99,
        "savings": 0,
        "netProfit": 21.3
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 40.49,
        "total": 80.98,
        "savings": 9,
        "netProfit": 33.6
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 38.24,
        "total": 114.72,
        "savings": 20.25,
        "netProfit": 43.65
      }
    ]
  },
  {
    "id": "zendrop-2699708",
    "sku": "ZD-2699708",
    "name": "Cat Scratch Board with Sisal Toy and Nail Care",
    "brand": "Fable Pets Select",
    "tagline": "Transform your cat's playtime with our innovative Cat Scratch Board Kitten Pad. Designed as a perfect blend of...",
    "petType": "Cat",
    "category": "Beds",
    "department": "Cats",
    "supplierCost": 62.24,
    "price": 129.99,
    "compareAt": 181.99,
    "netProfit": 67.75,
    "profitMarginPercent": 52,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2699708",
    "supplierUrl": "https://app.zendrop.com/product/2699708",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 358,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 250000,
    "heroImage": "https://file.zendrop.com/products/40/d4/946348e947e7ac7692df7d9cf200.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/40/d4/946348e947e7ac7692df7d9cf200_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/40/d4/946348e947e7ac7692df7d9cf200.jpeg",
      "https://file.zendrop.com/products/40/d4/946348e947e7ac7692df7d9cf200_import.webp",
      "https://file.zendrop.com/products/b9/d2/bb4efbec49468d56294a24f112bb.jpeg",
      "https://file.zendrop.com/products/ad/88/7c765e0b4b2a82b4e8b99a0d215b.jpeg",
      "https://file.zendrop.com/products/56/90/d7537571403288627743cf0e7407.jpeg",
      "https://file.zendrop.com/products/15/02/a9749b0f44d1959e419cceb2343d.jpeg",
      "https://file.zendrop.com/products/80/d2/5573ba9e46689e32496c9d8594fd.jpeg",
      "https://file.zendrop.com/products/4a/22/887c20f9406cb2a45976594c32c5.jpeg",
      "https://file.zendrop.com/products/bc/eb/d20c06924805a61b8db45dcc1330.jpeg",
      "https://file.zendrop.com/products/1d/84/4606e9f64fdb90c6cc66329500d3.jpeg",
      "https://file.zendrop.com/products/0f/67/66a2d7214c0c9cb260243ad30a02.jpeg",
      "https://file.zendrop.com/products/c0/40/569ef36c4055ad8c12ef1bf4d74f.jpeg",
      "https://ae01.alicdn.com/kf/H571c1ee4068d4299b62e69dc2a37d72aX.jpg",
      "https://ae01.alicdn.com/kf/He944dee711d94141ae50eabed9350d6eW.jpg",
      "https://ae01.alicdn.com/kf/H8ef60cf05ab047f6af092c46d3696524z.jpg",
      "https://ae01.alicdn.com/kf/H49fdc14299d240739f969facadc03355s.jpg",
      "https://ae01.alicdn.com/kf/H704d7b8a170a41008d238a6cf4ff28ea3.jpg",
      "https://ae01.alicdn.com/kf/H81891e339dbc4b92964c1da980edaa37d.jpg",
      "https://ae01.alicdn.com/kf/H9e51f5cbc5a84847bb1783029f37eaceG.jpg",
      "https://ae01.alicdn.com/kf/H9c8bfff582754a8c979c0d2bebd303b9U.jpg",
      "https://ae01.alicdn.com/kf/H4b7dea0ee03c47b2aff3828bd2238f81s.jpg"
    ],
    "description": "Transform your cat's playtime with our innovative Cat Scratch Board Kitten Pad. Designed as a perfect blend of fun and functionality, this scratcher is not only a toy but also a protective accessory for your furniture. Say goodbye to scratched sofas and hello to happy, playful cats!\n\n    Crafted from high-quality Polyester, this durable scratcher ensures long-lasting use while providing your feline friend with a reliable surface to sharpen their claws. The invisible nail feature is designed to k...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Cat Scratch Board with Sisal Toy and Nail Care",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 129.99,
        "total": 129.99,
        "savings": 0,
        "netProfit": 67.75
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 116.99,
        "total": 233.98,
        "savings": 26,
        "netProfit": 109.5
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 110.49,
        "total": 331.47,
        "savings": 58.5,
        "netProfit": 144.75
      }
    ]
  },
  {
    "id": "zendrop-2601227",
    "sku": "ZD-2601227",
    "name": "Pet Mat Single Piece",
    "brand": "Fable Pets Select",
    "tagline": "Give your furry friend the ultimate comfort with our premium pet bed. Designed to cater to small, medium, and ...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 26.55,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 43.44,
    "profitMarginPercent": 62,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2601227",
    "supplierUrl": "https://app.zendrop.com/product/2601227",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 375,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 100000,
    "heroImage": "https://file.zendrop.com/products/8e/5f/db72a8d342c0ab6979229ea3e391.png",
    "secondaryImage": "https://file.zendrop.com/products/8e/5f/db72a8d342c0ab6979229ea3e391_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/8e/5f/db72a8d342c0ab6979229ea3e391.png",
      "https://file.zendrop.com/products/8e/5f/db72a8d342c0ab6979229ea3e391_import.webp",
      "https://static.hzpdex.com/product/20241005/59a194d9-6598-4cfb-b87f-5a6cba317ae3.jpg",
      "https://static.hzpdex.com/product/20241005/90f99bf6-3fdb-4bdf-a250-211e7913f03f.jpg",
      "https://static.hzpdex.com/product/20241005/e8bcab62-c983-4d92-bbd7-4b9be0abf539.jpg",
      "https://static.hzpdex.com/product/20241005/b0e3ee51-545e-4e19-a160-02437e5ddd39.jpg",
      "https://static.hzpdex.com/product/20241005/75fa2af5-d5ff-45d0-ae21-fd28351ceffe.jpg",
      "https://static.hzpdex.com/product/20241005/181c0d60-6e9a-4b2e-a0d9-838cebf84038.jpg"
    ],
    "description": "Give your furry friend the ultimate comfort with our premium pet bed. Designed to cater to small, medium, and large dogs, this bed is the perfect retreat for your pet to relax and recharge.\n\n    With its plush filler, your pet will sink into a cozy embrace that provides the support they need. For optimal fluffiness, we recommend giving the filler a good shake upon arrival. This ensures it airs out fully, transforming the bed into a soft and inviting nest.\n\n    Available in two sizes, you can cho...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Mat Single Piece",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 43.44
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 72.88
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 98.82
      }
    ]
  },
  {
    "id": "zendrop-2626089",
    "sku": "ZD-2626089",
    "name": "Waterproof and Windproof Work Clothes Rush Suit",
    "brand": "Fable Pets Select",
    "tagline": "Stay comfortable and protected in any weather with our Waterproof and Windproof Rush Suit. Crafted from high-q...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 55.39,
    "price": 129.99,
    "compareAt": 181.99,
    "netProfit": 74.6,
    "profitMarginPercent": 57,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2626089",
    "supplierUrl": "https://app.zendrop.com/product/2626089",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 392,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 700000,
    "heroImage": "https://file.zendrop.com/products/bd/ec/fe182b5c48dca204ae6f8892d978.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/bd/ec/fe182b5c48dca204ae6f8892d978_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/bd/ec/fe182b5c48dca204ae6f8892d978.jpeg",
      "https://file.zendrop.com/products/bd/ec/fe182b5c48dca204ae6f8892d978_import.webp",
      "https://file.zendrop.com/products/52/1e/eb980e1347938cbcb3d63cb91796.jpeg",
      "https://file.zendrop.com/products/37/0f/cc9b681f4f63adbd323b2de5f65d.jpeg",
      "https://file.zendrop.com/products/d5/27/fb1837e74f6992bf122dc013eb27.jpeg",
      "https://file.zendrop.com/products/eb/54/e81fe1a04d9cabd769ca6f8787e1.jpeg",
      "https://file.zendrop.com/products/26/5c/7482b95c4b59a2c50cef1ab2af7c.jpeg",
      "https://file.zendrop.com/products/16/ac/10b82177431a8dbe89cfc04fad13.jpeg",
      "https://file.zendrop.com/products/ed/4b/920fa4d7467c9602f6db314484d6.jpeg",
      "https://file.zendrop.com/products/a7/f1/0adf0c5c42de9bd9de8dc2f79039.jpeg",
      "https://file.zendrop.com/products/fd/fb/e27eb54640c8ada13450d0c9340f.jpeg",
      "https://file.zendrop.com/products/85/6b/8603e32349fcb54ffa35f80ceacc.jpeg",
      "https://file.zendrop.com/products/37/dc/44f04f5a4795bbae71f556d43787.jpeg",
      "https://file.zendrop.com/products/db/a2/427a950b498bbf2ebdeba4480dc9.jpeg",
      "https://file.zendrop.com/products/19/20/debe1d76409488abf375c343db09.jpeg",
      "https://file.zendrop.com/products/85/28/3959b35b40c5a02bd19e18d97f51.jpeg",
      "https://res.race321.com/pronew/3618985572467619377/0d6facc3.png",
      "https://res.race321.com/pronew/3618985572467619377/90d8b7c7.png",
      "https://res.race321.com/pronew/3618985572467619377/ac54ed03.jpg",
      "https://res.race321.com/pronew/3618985572467619377/3e660cc1.jpg",
      "https://res.race321.com/pronew/3618985572467619377/adf7dc23.jpg",
      "https://res.race321.com/pronew/3618985572467619377/e2f2add0.jpg",
      "https://res.race321.com/pronew/3618985572467619377/a527d5e7.jpg"
    ],
    "description": "Stay comfortable and protected in any weather with our Waterproof and Windproof Rush Suit. Crafted from high-quality polyester, this leisure-style suit is designed to withstand the elements while providing ultimate comfort. Whether you're working outdoors or enjoying a weekend adventure, this suit has got you covered.\n\n    With a variety of colors including Mossy Green and Offwhite, you can choose the perfect look for your personal style. Available in multiple pet sizes, this versatile suit ensu...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Waterproof and Windproof Work Clothes Rush Suit",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 129.99,
        "total": 129.99,
        "savings": 0,
        "netProfit": 74.6
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 116.99,
        "total": 233.98,
        "savings": 26,
        "netProfit": 123.2
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 110.49,
        "total": 331.47,
        "savings": 58.5,
        "netProfit": 165.3
      }
    ]
  },
  {
    "id": "zendrop-2000777",
    "sku": "ZD-2000777",
    "name": "Pet Dog Bed",
    "brand": "Fable Pets Select",
    "tagline": "Product Name: Corduroy Pet Sofa\n\n  Material: high-quality corduroy + non-slip cloth padding: high-density spon...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 17.68,
    "price": 44.99,
    "compareAt": 62.99,
    "netProfit": 27.31,
    "profitMarginPercent": 61,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2000777",
    "supplierUrl": "https://app.zendrop.com/product/2000777",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 409,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 13,
    "heroImage": "https://file.zendrop.com/products/84/d4/b3216d7e42088dc6cb3d98d5b8f0.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/84/d4/b3216d7e42088dc6cb3d98d5b8f0_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/84/d4/b3216d7e42088dc6cb3d98d5b8f0.jpeg",
      "https://file.zendrop.com/products/84/d4/b3216d7e42088dc6cb3d98d5b8f0_import.webp",
      "https://file.zendrop.com/products/97/0e/c4d561d64771ae7d5d96c9153698.jpeg",
      "https://file.zendrop.com/products/92/77/518b06ae4acd9ad8fd303d322ff6.jpeg",
      "https://file.zendrop.com/products/a4/c2/3f31694f480a859ed8813ca6c6aa.jpeg",
      "https://file.zendrop.com/products/43/59/b31d02ae4bf8a87f84eb1e997e43.jpeg",
      "https://file.zendrop.com/products/27/09/456fc80e420fb615a1dcfebf08cc.jpeg",
      "https://file.zendrop.com/products/ee/c6/fc412d0e419dbef0667891624005.jpeg",
      "https://file.zendrop.com/products/80/fc/0501493f4bbabc7c53b7a27ef912.jpeg",
      "https://file.zendrop.com/products/ed/c9/d5e3794040399a198bc57f975a84.jpeg",
      "https://file.zendrop.com/products/79/41/ffd7232f4d27af436ab177fbc01c.jpeg",
      "https://file.zendrop.com/products/f0/ba/00b65996426e8a53c837eb8609a9.jpeg",
      "https://file.zendrop.com/products/d6/65/fa3d82174bf591de68ba0b8fdb7d.jpeg",
      "https://file.zendrop.com/products/06/21/fc06158b46c89b5536763a5109b6.jpeg",
      "https://file.zendrop.com/products/3a/f1/06defa8748388ffc44fecabf11b8.jpeg",
      "https://file.zendrop.com/products/b6/54/cbd83341495d840a0620dad3720d.jpeg",
      "https://file.zendrop.com/products/16/1b/44337fcc434fbe6cde5897358109.jpeg",
      "https://file.zendrop.com/products/87/1b/3bae01d64275ae8d09b217c93f9b.jpeg",
      "https://file.zendrop.com/products/8d/2c/e188fa0c4047a988de65463639c8.jpeg",
      "https://file.zendrop.com/products/3c/a9/dd9a49d14e16ace84bb8ed6d9a8a.jpeg",
      "https://file.zendrop.com/products/0a/c2/733c70d54b8b9de18a77b7d7953e.jpeg",
      "https://file.zendrop.com/products/cd/fe/12f308bb4533ab5d9da29e571418.jpeg",
      "https://cf.cjdropshipping.com/16778016/1631562771747442688.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562772305285120.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562772716326912.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562773127368704.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562773563576320.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562774003978240.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562775698477056.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562776075964416.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562776809967616.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562777258758144.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562777749491712.jpg",
      "https://cf.cjdropshipping.com/16778016/1631562778202476544.jpg"
    ],
    "description": "Product Name: Corduroy Pet Sofa\n\n  Material: high-quality corduroy + non-slip cloth padding: high-density sponge\n\n  Specifications:\n\n  S ---- 55 * 45 * 13cm Recommended for pets under 8 kg\n\n  M --- 70 * 55 * 15cm Recommended for pets under 25 kg\n\n L---90 * 75 * 17cm, Recommended for pets under 60 kg\n\n XL-110 * 95 * 20cm Recommended for pets under 90 kg",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Dog Bed",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 44.99,
        "total": 44.99,
        "savings": 0,
        "netProfit": 27.31
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 40.49,
        "total": 80.98,
        "savings": 9,
        "netProfit": 45.62
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 38.24,
        "total": 114.72,
        "savings": 20.25,
        "netProfit": 61.68
      }
    ]
  },
  {
    "id": "zendrop-2042070",
    "sku": "ZD-2042070",
    "name": "Merry Pet MPS002 Wood Room with a View Pet House",
    "brand": "Fable Pets Select",
    "tagline": "Wood Room with a View Pet House...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 113.7,
    "price": 204.66,
    "compareAt": 286.52,
    "netProfit": 90.96,
    "profitMarginPercent": 44,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2042070",
    "supplierUrl": "https://app.zendrop.com/product/2042070",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 126,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/71/35/d62fab834d1794542641bd4a79b1.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/71/35/d62fab834d1794542641bd4a79b1_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/71/35/d62fab834d1794542641bd4a79b1.jpeg",
      "https://file.zendrop.com/products/71/35/d62fab834d1794542641bd4a79b1_import.webp",
      "https://file.zendrop.com/products/7b/d3/8cbee82c48ed80091b0fbcd6527e.jpeg"
    ],
    "description": "Wood Room with a View Pet House",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Merry Pet MPS002 Wood Room with a View Pet House",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 204.66,
        "total": 204.66,
        "savings": 0,
        "netProfit": 90.96
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 184.19,
        "total": 368.39,
        "savings": 40.93,
        "netProfit": 140.99
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 173.96,
        "total": 521.88,
        "savings": 92.1,
        "netProfit": 180.78
      }
    ]
  },
  {
    "id": "zendrop-2047664",
    "sku": "ZD-2047664",
    "name": "Plato Pet Treats Natural Pet Treats Chicken 22 oz",
    "brand": "Fable Pets Select",
    "tagline": "Plato Pet Treats Chicken Thinkers are FREE from added sugars artificial preservatives by-products artificial c...",
    "petType": "Dog",
    "category": "Wellness",
    "department": "Dogs",
    "supplierCost": 28.13,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 41.86,
    "profitMarginPercent": 60,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2047664",
    "supplierUrl": "https://app.zendrop.com/product/2047664",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 143,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/83/c8/2fc7eb1d4a1d8335fa1152252a70.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/83/c8/2fc7eb1d4a1d8335fa1152252a70_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/83/c8/2fc7eb1d4a1d8335fa1152252a70.jpeg",
      "https://file.zendrop.com/products/83/c8/2fc7eb1d4a1d8335fa1152252a70_import.webp",
      "https://file.zendrop.com/products/d4/b4/2003d7944e848ee582537ea43bf3.jpeg"
    ],
    "description": "Plato Pet Treats Chicken Thinkers are FREE from added sugars artificial preservatives by-products artificial colors protein-meals soy wheat corn fillers and freeze-drying. Slow roasted in our own US Facility these treats can be snapped into pieces for training dogs of all sizes or to share. Plato Thinker Sticks are grain-reduced with gluten free brown rice being the only grain ingredient. Brain-nourishing natural DHA and EPA helps support brain function in your dog.",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Plato Pet Treats Natural Pet Treats Chicken 22 oz",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 41.86
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 69.72
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 94.08
      }
    ]
  },
  {
    "id": "zendrop-2051156",
    "sku": "ZD-2051156",
    "name": "MYLUCKYTAG Service Dog Tag QR Code Stainless Steel Pet ID Tag Dog Tag Online Pet Profile Pet Location Alert Email Digital Pet Tag Durable Pet ID Dog Collar Tag Engraved Pet Tag",
    "brand": "Fable Pets Select",
    "tagline": "[\"🐾 Material & Size: The Personalized dog tags are made from high Quality Stainless steel Professional Engrav...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 10.95,
    "price": 29.99,
    "compareAt": 41.99,
    "netProfit": 19.04,
    "profitMarginPercent": 63,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2051156",
    "supplierUrl": "https://app.zendrop.com/product/2051156",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 160,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/ee/2f/1a39c64d40549ad9cc8c389e7894.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/ee/2f/1a39c64d40549ad9cc8c389e7894_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/ee/2f/1a39c64d40549ad9cc8c389e7894.jpeg",
      "https://file.zendrop.com/products/ee/2f/1a39c64d40549ad9cc8c389e7894_import.webp",
      "https://file.zendrop.com/products/a4/b1/a1d6e5044d75b4fce4b1c6cebf7d.jpeg"
    ],
    "description": "[\"🐾 Material & Size: The Personalized dog tags are made from high Quality Stainless steel Professional Engraving has strong colour does not fade ideal for long-term tagging it will not discolor on your pets fur. Size: 1.18 inch in Diameter Weighs only 0.25 oz lightweight and durable.\" 🐾 Setup and use: Scan the tag QR code to activate the tag Links to free pet profile page Can enter multiple emergency contact/ upload multiple pet photos/ Home Address/ Medical Info etc of your pet. One account c...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x MYLUCKYTAG Service Dog Tag QR Code Stainless Steel Pet ID Tag Dog Tag Online Pet Profile Pet Location Alert Email Digital Pet Tag Durable Pet ID Dog Collar Tag Engraved Pet Tag",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 29.99,
        "total": 29.99,
        "savings": 0,
        "netProfit": 19.04
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 26.99,
        "total": 53.98,
        "savings": 6,
        "netProfit": 32.08
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 25.49,
        "total": 76.47,
        "savings": 13.5,
        "netProfit": 43.62
      }
    ]
  },
  {
    "id": "zendrop-2063694",
    "sku": "ZD-2063694",
    "name": "Disposable Pet Bath Towel10 PCS Portable Pet Grooming Towels19.6 x 21.6 inch Convenient Pet Cleaning Towel Pet Drying TowelsAbsorbent Bath Towel for Medium Dog",
    "brand": "Fable Pets Select",
    "tagline": "[【Suitable Size】Package include 10 PCS pet grooming towels.And the size of the towel for dogs or other pets is...",
    "petType": "Dog",
    "category": "Grooming",
    "department": "Grooming",
    "supplierCost": 14.99,
    "price": 29.99,
    "compareAt": 41.99,
    "netProfit": 15,
    "profitMarginPercent": 50,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2063694",
    "supplierUrl": "https://app.zendrop.com/product/2063694",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 177,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/3f/e8/d48325cc45be8e7df72b6740b076.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/3f/e8/d48325cc45be8e7df72b6740b076_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/3f/e8/d48325cc45be8e7df72b6740b076.jpeg",
      "https://file.zendrop.com/products/3f/e8/d48325cc45be8e7df72b6740b076_import.webp",
      "https://file.zendrop.com/products/6d/16/a00a03c1440db58a231d42c87678.jpeg"
    ],
    "description": "[【Suitable Size】Package include 10 PCS pet grooming towels.And the size of the towel for dogs or other pets is about 19.6 x 21.6 inches/ 50 x 55 cm which is perfect for medium dogsuch as Corgi Shiba Inu.It is very convenient and practical and is a heart warming gift choice for people who have pets at home. \"【Easy to Use】Our disposable pet bath towels are more durable than a regular paper towel. When using ityou can effectively avoid the common repeat use and be more hygienic.After usingyou do no...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Disposable Pet Bath Towel10 PCS Portable Pet Grooming Towels19.6 x 21.6 inch Convenient Pet Cleaning Towel Pet Drying TowelsAbsorbent Bath Towel for Medium Dog",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 29.99,
        "total": 29.99,
        "savings": 0,
        "netProfit": 15
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 26.99,
        "total": 53.98,
        "savings": 6,
        "netProfit": 24
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 25.49,
        "total": 76.47,
        "savings": 13.5,
        "netProfit": 31.5
      }
    ]
  },
  {
    "id": "zendrop-3090659",
    "sku": "ZD-3090659",
    "name": "Pet Intelligent Timing Quantitative Remote Automatic Pet Feeder",
    "brand": "Fable Pets Select",
    "tagline": "Product information: Color: No adapter, American Standard, Chinese standard, European standard, British Standa...",
    "petType": "Cat",
    "category": "Beds",
    "department": "Cats",
    "supplierCost": 36.29,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 33.7,
    "profitMarginPercent": 48,
    "supplier": "Zendrop",
    "supplierSku": "ZD-3090659",
    "supplierUrl": "https://app.zendrop.com/product/3090659",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 194,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 406359,
    "heroImage": "https://file.zendrop.com/products/e3/1f/2e8bc4644e90bf052eecfd43704e.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/e3/1f/2e8bc4644e90bf052eecfd43704e_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/e3/1f/2e8bc4644e90bf052eecfd43704e.jpeg",
      "https://file.zendrop.com/products/e3/1f/2e8bc4644e90bf052eecfd43704e_import.webp",
      "https://file.zendrop.com/products/5f/e6/5158e78a4bad82e0397e8ddab5a1.jpeg",
      "https://file.zendrop.com/products/60/17/4320656e4f3abf6b478e80e85476.jpeg",
      "https://file.zendrop.com/products/93/d6/b450ce674d80b7c6e4eef6626622.jpeg",
      "https://file.zendrop.com/products/69/98/ebefb17d44928022436c1325055d.jpeg",
      "https://file.zendrop.com/products/31/9e/ea7bf7114813bce4e70d11c21534.jpeg",
      "https://file.zendrop.com/products/5f/b8/afbb285847c0afbfd87be8813b20.jpeg",
      "https://file.zendrop.com/products/43/65/1bb45247450e91f04760b8240354.jpeg",
      "https://file.zendrop.com/products/15/62/97f2d6e8446a9029b43768c1f57c.jpeg",
      "https://file.zendrop.com/products/7f/49/678d436f4443a1a2c4de0f3dc793.jpeg",
      "https://file.zendrop.com/products/46/6f/f53baf0e43aa8fca45f2c583f67f.jpeg",
      "https://file.zendrop.com/products/57/72/aa91c6dd4308b6f3575d6bbeac73.jpeg",
      "https://file.zendrop.com/products/59/9c/6a2f6b864014989de34032970d43.jpeg",
      "https://file.zendrop.com/products/6f/0f/0b78e8554252b1f917822e242823.jpeg",
      "https://file.zendrop.com/products/8f/f7/9a441c8e4f7c9700379b9a914bea.jpeg",
      "https://file.zendrop.com/products/74/2d/e32747ec49d5a96d0093fc6e6d5e.jpeg",
      "https://file.zendrop.com/products/e6/52/8e2397374a9b835c8ecd924fb0f8.jpeg",
      "https://file.zendrop.com/products/3e/b3/092c5d354d4a8956c42369252cfd.jpeg",
      "https://file.zendrop.com/products/5a/3b/0802083b4519bda3b224a4fa49a0.jpeg",
      "https://file.zendrop.com/products/4e/9b/3cfb08af4c33b80dd57dd2e35967.jpeg",
      "https://file.zendrop.com/products/b3/fc/db4e8f894971921f0badd239394b.jpeg",
      "https://file.zendrop.com/products/8f/1c/6f8d8df24e3fa8deac1c2d263c55.jpeg",
      "https://file.zendrop.com/products/a7/c2/a1a6475e43e384a6d694601beefc.jpeg",
      "https://file.zendrop.com/products/1c/4a/8e7b16ef4253abf2ea41e0a21925.jpeg",
      "https://file.zendrop.com/products/14/c0/5e2cf97249c8a3657b9a208e735f.jpeg",
      "https://file.zendrop.com/products/06/bf/11f7653943adbeff25d1574b5c9c.jpeg",
      "https://file.zendrop.com/products/22/49/0456f98f45a6abdd0b61d6153a1d.jpeg",
      "https://file.zendrop.com/products/4e/1a/8c8c434244e1812b647ea7c711cd.jpeg",
      "https://file.zendrop.com/products/3d/9d/02cccb8842078311571fd21ddef6.jpeg",
      "https://file.zendrop.com/products/c4/45/7202afb348f2be2d714951c7a5bd.jpeg",
      "https://file.zendrop.com/products/65/6d/331a8e38413486610c5ee75beeca.jpeg",
      "https://file.zendrop.com/products/be/99/d3532d0349bbab5d6e0cb7bf0794.jpeg",
      "https://file.zendrop.com/products/27/0a/e8f728aa444794ef94321a093916.jpeg",
      "https://file.zendrop.com/products/25/62/db4fa7784e8da175d33d921d1548.jpeg",
      "https://file.zendrop.com/products/a5/1c/d5d72b914c19901635f17578279b.jpeg",
      "https://file.zendrop.com/products/55/d5/68a07ffe4e30aa2c69f03788d901.jpeg",
      "https://file.zendrop.com/products/4f/bb/5e13e5b846d99971dbb062ce2b3f.jpeg",
      "https://file.zendrop.com/products/8d/63/ee3e446b4dd3b845113ad161f150.jpeg",
      "https://file.zendrop.com/products/70/1f/51d434ce457fbe4c4883cc6d8878.jpeg"
    ],
    "description": "Product information: Color: No adapter, American Standard, Chinese standard, European standard, British Standard, Australian standard, South Korea standard, Japanese standard Material: complete set of automatic feeding tableware Applicable object: Cat Specifications: White button, black button, white WiFi, black WiFi Category: Pet tableware Packing list: Feeder×1 piece&nbsp;\n\nPower Source Details\n\nThis automatic pet feeder supports a dual power mode and can operate using batteries or a USB conne...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Intelligent Timing Quantitative Remote Automatic Pet Feeder",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 33.7
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 53.4
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 69.6
      }
    ]
  },
  {
    "id": "zendrop-2001114",
    "sku": "ZD-2001114",
    "name": "Pet Water Dispenser",
    "brand": "Fable Pets Select",
    "tagline": "High-quality pet product sourced directly for comfort and durability....",
    "petType": "All Pets",
    "category": "Feeding",
    "department": "Dogs",
    "supplierCost": 37.61,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 32.38,
    "profitMarginPercent": 46,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2001114",
    "supplierUrl": "https://app.zendrop.com/product/2001114",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 211,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 81,
    "heroImage": "https://file.zendrop.com/products/a8/49/d2c8c981411586b81645852daf7a.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/a8/49/d2c8c981411586b81645852daf7a_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/a8/49/d2c8c981411586b81645852daf7a.jpeg",
      "https://file.zendrop.com/products/a8/49/d2c8c981411586b81645852daf7a_import.webp",
      "https://file.zendrop.com/products/1a/29/f6813f9540e9a8c57a73a942fcb7.jpeg",
      "https://file.zendrop.com/products/5f/cd/e19ca9f0422d97921195611cd9ac.jpeg",
      "https://file.zendrop.com/products/a2/57/b658becf4cd28eb7bd77f4c0fdbb.jpeg",
      "https://file.zendrop.com/products/82/dc/d36951e644fc9f6ce9f76370ffe2.jpeg",
      "https://file.zendrop.com/products/19/c8/2299ba9a4ef681f96b15adeb9900.jpeg",
      "https://file.zendrop.com/products/63/57/f287ecc14f77bf9ccafa87056d5f.jpeg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/d80e4565-a556-42b8-8936-8743bb0ed44d.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/78bd7282-87cc-441b-9012-69780818a527.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/af8d0d8f-4581-4e19-b0e9-744fb06ceea0.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/0cddeabc-3e1c-4462-9fc6-91b0e061d0a7.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/7d6acfa2-1462-4b46-af5e-6ac76d857b98.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/9c65c1df-7cbc-4dd5-a335-fe563d552ea0.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/cf58723f-2dae-41dc-9b64-4081212867b1.jpg",
      "https://oss-cf.cjdropshipping.com/product/2024/08/12/08/97a72698-2591-4a48-a310-06e71c4f22c1.jpg"
    ],
    "description": "High-quality pet product sourced directly for comfort and durability.",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Water Dispenser",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 32.38
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 50.76
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 65.64
      }
    ]
  },
  {
    "id": "zendrop-2070193",
    "sku": "ZD-2070193",
    "name": "Pet Parents® Pet WiPees™ Dog All Purpose + Skin & Coat Pet Wipes Pet Wipes for Dogs Dog Wipes & Puppy Wipes Paw Wipes for Dogs (100 Count (Pack of 1) Calming)",
    "brand": "Fable Pets Select",
    "tagline": "[TARGETED BIO-BASED INGREDIENTS: Skin issues are the most common ailments our pups face. More than just soap a...",
    "petType": "All Pets",
    "category": "Feeding",
    "department": "Dogs",
    "supplierCost": 13.99,
    "price": 29.99,
    "compareAt": 41.99,
    "netProfit": 16,
    "profitMarginPercent": 53,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2070193",
    "supplierUrl": "https://app.zendrop.com/product/2070193",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 228,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/75/f3/fe6ad2864bf1a0e5acd71059796c.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/75/f3/fe6ad2864bf1a0e5acd71059796c_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/75/f3/fe6ad2864bf1a0e5acd71059796c.jpeg",
      "https://file.zendrop.com/products/75/f3/fe6ad2864bf1a0e5acd71059796c_import.webp",
      "https://file.zendrop.com/products/82/d4/b864addc48f091ff617100db04a6.jpeg"
    ],
    "description": "[TARGETED BIO-BASED INGREDIENTS: Skin issues are the most common ailments our pups face. More than just soap and water Pet Wipees Dog All Purpose + Skin & Coat are dog wipes formulated with target ingredients that can help prevent against irritants while moisturizing the skin and smoothing the coat. Ingredients like salmon oil for dogs vitamin B complex and keratin work together to promote healthy skin cell growth repair the coat and help to reduce dander. \"SUPPLEMENTS FOR THEIR SKIN: Just like ...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Parents® Pet WiPees™ Dog All Purpose + Skin & Coat Pet Wipes Pet Wipes for Dogs Dog Wipes & Puppy Wipes Paw Wipes for Dogs (100 Count (Pack of 1) Calming)",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 29.99,
        "total": 29.99,
        "savings": 0,
        "netProfit": 16
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 26.99,
        "total": 53.98,
        "savings": 6,
        "netProfit": 26
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 25.49,
        "total": 76.47,
        "savings": 13.5,
        "netProfit": 34.5
      }
    ]
  },
  {
    "id": "zendrop-2069888",
    "sku": "ZD-2069888",
    "name": "CURMIO Pet Grooming Tote Bag Pet Grooming Supplies Organizer for Cat Dog grooming kit Pet Supplies Storage Bag for Dog Cat Clippers Brush Scissors or Other Pet Care Supplies Black (BAG ONLY)",
    "brand": "Fable Pets Select",
    "tagline": "[SPACIOUS COMPARTMENT: The main compartment built in detachable divider for storing pet supplies like dog cat ...",
    "petType": "All Pets",
    "category": "Feeding",
    "department": "Dogs",
    "supplierCost": 30.99,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 39,
    "profitMarginPercent": 56,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2069888",
    "supplierUrl": "https://app.zendrop.com/product/2069888",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 245,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/ae/f8/c09a4ad04bd7a500aea2711e0c60.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/ae/f8/c09a4ad04bd7a500aea2711e0c60_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/ae/f8/c09a4ad04bd7a500aea2711e0c60.jpeg",
      "https://file.zendrop.com/products/ae/f8/c09a4ad04bd7a500aea2711e0c60_import.webp",
      "https://file.zendrop.com/products/2d/e7/a89c675c4d5bae401aef2cdd4655.jpeg"
    ],
    "description": "[SPACIOUS COMPARTMENT: The main compartment built in detachable divider for storing pet supplies like dog cat grooming clippers hair remover shampoo pet hair dryer chew toys water bottle etc.. Top transparent pocket make it easy for pet supplies to be found at a glance. ( NOT includes accessories.) KEEP ORGANIZED: Front compartment with 5 elastic slots hold your pet grooming kit like scissor set clippers comb nail trimmer and more. 2 side pockets for carrying pet toys pet foods or other personal...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x CURMIO Pet Grooming Tote Bag Pet Grooming Supplies Organizer for Cat Dog grooming kit Pet Supplies Storage Bag for Dog Cat Clippers Brush Scissors or Other Pet Care Supplies Black (BAG ONLY)",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 39
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 64
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 85.5
      }
    ]
  },
  {
    "id": "zendrop-2044170",
    "sku": "ZD-2044170",
    "name": "homeika pro Dog Grooming Kit&Vacuum 3L Pet Grooming Vacuum 99% Pet Hair Suction 5 Pet Grooming Tools 5 Combs Quiet Pet Vacuum Groomer with Hair Roller Massage Nozzle for Shedding Dogs White",
    "brand": "Fable Pets Select",
    "tagline": "[[3L Upgraded Max Dust Cup& Storage Bag]Homeika Pro dog hair grooming vacuum is equipped with a 3L dust cup. T...",
    "petType": "Dog",
    "category": "Grooming",
    "department": "Grooming",
    "supplierCost": 98,
    "price": 176.4,
    "compareAt": 246.96,
    "netProfit": 78.4,
    "profitMarginPercent": 44,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2044170",
    "supplierUrl": "https://app.zendrop.com/product/2044170",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 262,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/a8/78/092ad92341c9a9584c9fb7049867.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/a8/78/092ad92341c9a9584c9fb7049867_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/a8/78/092ad92341c9a9584c9fb7049867.jpeg",
      "https://file.zendrop.com/products/a8/78/092ad92341c9a9584c9fb7049867_import.webp",
      "https://file.zendrop.com/products/0d/60/67ebeecb4218ac2847081b1a477b.jpeg"
    ],
    "description": "[[3L Upgraded Max Dust Cup& Storage Bag]Homeika Pro dog hair grooming vacuum is equipped with a 3L dust cup. The 50% larger capacity lets you clean the dust cup less often while trimming for greater efficiency. Empty the dust cup without hand touch. Storage bag is included for easy storage. Simple operation makes every trimming more enjoyable. [Vacuum Suction 99% Pet Hair]Homeika Pro pet grooming kit vacuum can collects 99% of pet fur while trimming grooming and deshedding. Keep your home and fu...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x homeika pro Dog Grooming Kit&Vacuum 3L Pet Grooming Vacuum 99% Pet Hair Suction 5 Pet Grooming Tools 5 Combs Quiet Pet Vacuum Groomer with Hair Roller Massage Nozzle for Shedding Dogs White",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 176.4,
        "total": 176.4,
        "savings": 0,
        "netProfit": 78.4
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 158.76,
        "total": 317.52,
        "savings": 35.28,
        "netProfit": 121.52
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 149.94,
        "total": 449.82,
        "savings": 79.38,
        "netProfit": 155.82
      }
    ]
  },
  {
    "id": "zendrop-2066498",
    "sku": "ZD-2066498",
    "name": "Sharper Image Elevated Pet Bowls with Storage and 3 in 1 Pet Scooper Clip",
    "brand": "Fable Pets Select",
    "tagline": "This two piece Sharper Image set is perfect for any dog owner. The Sharper Image Eleated Pet Bowls with Storag...",
    "petType": "Dog",
    "category": "Feeding",
    "department": "Dogs",
    "supplierCost": 24.99,
    "price": 44.99,
    "compareAt": 62.99,
    "netProfit": 20,
    "profitMarginPercent": 44,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2066498",
    "supplierUrl": "https://app.zendrop.com/product/2066498",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 279,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/f8/39/b51faf674ccab56176bf966595e6.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/f8/39/b51faf674ccab56176bf966595e6_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/f8/39/b51faf674ccab56176bf966595e6.jpeg",
      "https://file.zendrop.com/products/f8/39/b51faf674ccab56176bf966595e6_import.webp",
      "https://file.zendrop.com/products/c4/e3/93f3eef744eeb6dfe66afa5144ad.jpeg"
    ],
    "description": "This two piece Sharper Image set is perfect for any dog owner. The Sharper Image Eleated Pet Bowls with Storage and 3-in-1 Pet Scooper/Clip is a great way to keep your feeding supplies together. The Elevated dog bowls with storage is made of sturdy plastic and comes with two removable stainless steel bowls that are or easy cleaning. It is the perfect height for the dog to improve your pets digestion. The storage holds up to 13 lbs of dry dog food. The Sharper Image 3 in 1 pet scooper/clip is mad...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Sharper Image Elevated Pet Bowls with Storage and 3 in 1 Pet Scooper Clip",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 44.99,
        "total": 44.99,
        "savings": 0,
        "netProfit": 20
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 40.49,
        "total": 80.98,
        "savings": 9,
        "netProfit": 31
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 38.24,
        "total": 114.72,
        "savings": 20.25,
        "netProfit": 39.75
      }
    ]
  },
  {
    "id": "zendrop-2073024",
    "sku": "ZD-2073024",
    "name": "Begleys Pet Stain and Odor Remover - Pet Odor Eliminator for Home - Pet Urine Enzyme Cleaner - Pet Carpet Cleaner for Pets - Enzymatic Cleaner for Dog Urine Cat Pee Feces - 24 Ounce 2 Pack",
    "brand": "Fable Pets Select",
    "tagline": "The cat urine enzyme cleaner destroyer and carpet odor eliminator helps to effectively restore the harmony of ...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 19.99,
    "price": 44.99,
    "compareAt": 62.99,
    "netProfit": 25,
    "profitMarginPercent": 56,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2073024",
    "supplierUrl": "https://app.zendrop.com/product/2073024",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 296,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/1e/6c/cec604364493a87abc3b64af7bc0.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/1e/6c/cec604364493a87abc3b64af7bc0_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/1e/6c/cec604364493a87abc3b64af7bc0.jpeg",
      "https://file.zendrop.com/products/1e/6c/cec604364493a87abc3b64af7bc0_import.webp",
      "https://file.zendrop.com/products/c7/47/ef577bd243c4a7b76344510fa7ba.jpeg"
    ],
    "description": "The cat urine enzyme cleaner destroyer and carpet odor eliminator helps to effectively restore the harmony of your happy home!Love your pet and love your home! This cat enzyme urine cleaner urine remover my pet peed - pet stain and odor remover solution uses powerful enzymes to break down organic proteins that cause odor and encourage pets to repeat their actions. The dog odor eliminators for home eliminates evidence of household \"accidents\" and helps reduce their recurrences. The dog smell elim...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Begleys Pet Stain and Odor Remover - Pet Odor Eliminator for Home - Pet Urine Enzyme Cleaner - Pet Carpet Cleaner for Pets - Enzymatic Cleaner for Dog Urine Cat Pee Feces - 24 Ounce 2 Pack",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 44.99,
        "total": 44.99,
        "savings": 0,
        "netProfit": 25
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 40.49,
        "total": 80.98,
        "savings": 9,
        "netProfit": 41
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 38.24,
        "total": 114.72,
        "savings": 20.25,
        "netProfit": 54.75
      }
    ]
  },
  {
    "id": "zendrop-2040754",
    "sku": "ZD-2040754",
    "name": "Super-Absorbent Waterproof Dog and Puppy Pet Training Pad Housebreaking Pet PadBlue (28\"X30\"(100PCS))",
    "brand": "Fable Pets Select",
    "tagline": "[[5-LAYER CONSTRUCTION] Our training pads are made with 5 layers: non-woven cloth as the first layer to allow ...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 34.79,
    "price": 69.99,
    "compareAt": 97.99,
    "netProfit": 35.2,
    "profitMarginPercent": 50,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2040754",
    "supplierUrl": "https://app.zendrop.com/product/2040754",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 313,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/d1/1b/457d8d2343b7abbdf49bb73440f3.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/d1/1b/457d8d2343b7abbdf49bb73440f3_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/d1/1b/457d8d2343b7abbdf49bb73440f3.jpeg",
      "https://file.zendrop.com/products/d1/1b/457d8d2343b7abbdf49bb73440f3_import.webp",
      "https://file.zendrop.com/products/17/6d/627ef4f349fdbdc509033831a875.jpeg"
    ],
    "description": "[[5-LAYER CONSTRUCTION] Our training pads are made with 5 layers: non-woven cloth as the first layer to allow urine to flow through; the second and the fourth layers are made from paper tissue to add absorbency; the third layer is also the core layer is made from Super Absorbent polymer and the back layer is a water-proof plastic protecting layer. [QUICK ABSORBENT & LEAK PROOF] With a Super Absorbent core that can lock in moisture by instantly absorbing and turning liquid into gel each training ...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Super-Absorbent Waterproof Dog and Puppy Pet Training Pad Housebreaking Pet PadBlue (28\"X30\"(100PCS))",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 69.99,
        "total": 69.99,
        "savings": 0,
        "netProfit": 35.2
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 62.99,
        "total": 125.98,
        "savings": 14,
        "netProfit": 56.4
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 59.49,
        "total": 178.47,
        "savings": 31.5,
        "netProfit": 74.1
      }
    ]
  },
  {
    "id": "zendrop-2072717",
    "sku": "ZD-2072717",
    "name": "BWOGUE Pet Bat Wings Costume for Cat & Dog Pet Apparel Clothes for Halloween Party Small",
    "brand": "Fable Pets Select",
    "tagline": "[Size Small: Chest 28-33cm(11-13in);Neck 15.2-21.6cm(6-8.5in);Back 12.7cm(5in);recommended weight 2-5lbs.the s...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 9.49,
    "price": 22.99,
    "compareAt": 32.19,
    "netProfit": 13.5,
    "profitMarginPercent": 59,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2072717",
    "supplierUrl": "https://app.zendrop.com/product/2072717",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 330,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/9b/5c/7e49020f44faaf316ac083163c62.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/9b/5c/7e49020f44faaf316ac083163c62_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/9b/5c/7e49020f44faaf316ac083163c62.jpeg",
      "https://file.zendrop.com/products/9b/5c/7e49020f44faaf316ac083163c62_import.webp",
      "https://file.zendrop.com/products/2e/0b/2c8afa0d4592bf1d4b709eb0d27a.jpeg",
      "https://file.zendrop.com/products/81/12/4d3f870c4ccaac5aeb42cb7245bf.jpeg"
    ],
    "description": "[Size Small: Chest 28-33cm(11-13in);Neck 15.2-21.6cm(6-8.5in);Back 12.7cm(5in);recommended weight 2-5lbs.the size is adjustable and convenient. The entire product is black with smooth lines complete interpretation of the mysterious and cool bats. The material is black felt cloth light and had no sense of restraint for the cats & dogs. User-friendly design makes your pet more cutestylish and different. Full of Christmas And Halloween atmosphere. Great for photo shoots fun party days or for Hallow...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x BWOGUE Pet Bat Wings Costume for Cat & Dog Pet Apparel Clothes for Halloween Party Small",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 22.99,
        "total": 22.99,
        "savings": 0,
        "netProfit": 13.5
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 20.69,
        "total": 41.38,
        "savings": 4.6,
        "netProfit": 22.4
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 19.54,
        "total": 58.62,
        "savings": 10.35,
        "netProfit": 30.15
      }
    ]
  },
  {
    "id": "zendrop-2066233",
    "sku": "ZD-2066233",
    "name": "Pet Lodge® Water Tower Deluxe | Automatic Pet Waterer | Automatic Animal Water Dispenser | 16 Quart",
    "brand": "Fable Pets Select",
    "tagline": "[AUTOMATICALLY REFILLS WATER - This pet water dispenser automatically dispenses a continuous supply of water b...",
    "petType": "All Pets",
    "category": "Beds",
    "department": "Dogs",
    "supplierCost": 45.33,
    "price": 129.99,
    "compareAt": 181.99,
    "netProfit": 84.66,
    "profitMarginPercent": 65,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2066233",
    "supplierUrl": "https://app.zendrop.com/product/2066233",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.8,
    "reviewsCount": 347,
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/eb/db/64de34084ce7ad95adfeae5fd9c9.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/eb/db/64de34084ce7ad95adfeae5fd9c9_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/eb/db/64de34084ce7ad95adfeae5fd9c9.jpeg",
      "https://file.zendrop.com/products/eb/db/64de34084ce7ad95adfeae5fd9c9_import.webp",
      "https://file.zendrop.com/products/27/78/c3458d854dd38f17084a7ac9f93f.jpeg"
    ],
    "description": "[AUTOMATICALLY REFILLS WATER - This pet water dispenser automatically dispenses a continuous supply of water based on the bowls water level supplying your animal with fresh water throughout the day. \"DURABLE DESIGN - This automatic pet waterers base is built from a single piece of plastic to increase durability and decrease the chance for breakage.\" WATER LEVEL VISIBILITY - The automatic animal waterer has a translucent plastic tower that lets you see the water level in the tank so that you know...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Lodge® Water Tower Deluxe | Automatic Pet Waterer | Automatic Animal Water Dispenser | 16 Quart",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 129.99,
        "total": 129.99,
        "savings": 0,
        "netProfit": 84.66
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 116.99,
        "total": 233.98,
        "savings": 26,
        "netProfit": 143.32
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 110.49,
        "total": 331.47,
        "savings": 58.5,
        "netProfit": 195.48
      }
    ]
  },
  {
    "id": "zendrop-2001034",
    "sku": "ZD-2001034",
    "name": "Pet shoes wear dog shoes",
    "brand": "Fable Pets Select",
    "tagline": "Features:\n\n 1. Waterproof PVC sole helps keep your feet dry, so dogs can wear them on light snow or muddy and ...",
    "petType": "Dog",
    "category": "Feeding",
    "department": "Dogs",
    "supplierCost": 5.82,
    "price": 22.99,
    "compareAt": 32.19,
    "netProfit": 17.17,
    "profitMarginPercent": 75,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2001034",
    "supplierUrl": "https://app.zendrop.com/product/2001034",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.9,
    "reviewsCount": 364,
    "badge": "US Warehouse",
    "isBestseller": false,
    "isLingPick": false,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 49,
    "heroImage": "https://file.zendrop.com/products/75/97/e69bf8834ed4baf63627ac731e10.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/75/97/e69bf8834ed4baf63627ac731e10_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/75/97/e69bf8834ed4baf63627ac731e10.jpeg",
      "https://file.zendrop.com/products/75/97/e69bf8834ed4baf63627ac731e10_import.webp",
      "https://file.zendrop.com/products/fb/21/fc6884084635b28ff3100e9c348d.jpeg",
      "https://file.zendrop.com/products/78/12/5c9f64b147118a5533bdf6ce5123.jpeg",
      "https://file.zendrop.com/products/ec/70/245f90a64591a130c7d65e9bc2bc.jpeg",
      "https://file.zendrop.com/products/08/c8/187b8e3845128e738eefc02d65db.jpeg",
      "https://file.zendrop.com/products/24/99/c14acaac403092db097eaf7e7af8.jpeg",
      "https://file.zendrop.com/products/8c/75/43897831462d8e523354f4ec04ac.jpeg",
      "https://file.zendrop.com/products/fb/a1/6c95aefb4bc6b61eb4efcaa34328.jpeg",
      "https://file.zendrop.com/products/61/38/6bf6327e40a88c1ff80147eb74cc.jpeg",
      "https://file.zendrop.com/products/a7/cf/fa1f398b4c37ac6e41de402b5974.jpeg",
      "https://file.zendrop.com/products/85/a4/873251e34daeafc50f8a82ed077f.jpeg",
      "https://file.zendrop.com/products/b8/66/33bf00c34824be56466169fb94f6.jpeg",
      "https://file.zendrop.com/products/65/6f/091e2de448b9a7a0ac04fcf2f926.jpeg",
      "https://file.zendrop.com/products/d5/70/55742eff479292f08f7e5a0ab5c8.jpeg",
      "https://file.zendrop.com/products/76/34/a4112b8140e8aef6297375c010c2.jpeg",
      "https://file.zendrop.com/products/42/bd/284ab57244f68fc4011d9379111a.jpeg",
      "https://file.zendrop.com/products/e3/24/2be07cfe47f0b6c453ba423ef5e5.jpeg",
      "https://file.zendrop.com/products/d4/68/d3cd2a7e44b48131cffa4c8c1112.jpeg",
      "https://file.zendrop.com/products/58/27/e7009f9d4b919b6755c2745b0b96.jpeg",
      "https://file.zendrop.com/products/a1/d1/5a434f1147d8894fef74bef2afc5.jpeg",
      "https://file.zendrop.com/products/e2/ad/2a6cec964206b03bacc796499141.jpeg",
      "https://file.zendrop.com/products/a8/0c/3b680e714642b3310db988cc80a1.jpeg",
      "https://file.zendrop.com/products/cb/af/b40577b44ec29676f087d1602e07.jpeg",
      "https://file.zendrop.com/products/bb/29/a3efdedc471881b2b78fcd96ff4d.jpeg",
      "https://cf.cjdropshipping.com/17121024/2404031001070327000.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001070327700.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001070328400.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001070329000.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001070329800.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001080320400.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001080321100.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001080321700.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001080322200.jpg",
      "https://cf.cjdropshipping.com/17121024/2404031001080322700.jpg"
    ],
    "description": "Features:\n\n 1. Waterproof PVC sole helps keep your feet dry, so dogs can wear them on light snow or muddy and wet streets.\n\n 2. The non-slip sturdy sole provides a protective layer to withstand hot and cold surfaces such as ice and snow.\n\n 3. Adjustable fuzzy belt, easy to put on and take off",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet shoes wear dog shoes",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 22.99,
        "total": 22.99,
        "savings": 0,
        "netProfit": 17.17
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 20.69,
        "total": 41.38,
        "savings": 4.6,
        "netProfit": 29.74
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 19.54,
        "total": 58.62,
        "savings": 10.35,
        "netProfit": 41.16
      }
    ]
  },
  {
    "id": "zendrop-2038976",
    "sku": "ZD-2038976",
    "name": "Pet Dog Grooming Arm Accessories - Pet Dog Grooming Belly Straps with Connector Pet Dog Grooming Belly Support Band Dog Grooming Table Arm Supplies Pet Dog Grooming Loops Dog Loop Heart Pattern",
    "brand": "Fable Pets Select",
    "tagline": "Description:Enhance your grooming routine with our Essential Dog Grooming belly straps Set designed to provide...",
    "petType": "Dog",
    "category": "Grooming",
    "department": "Grooming",
    "supplierCost": 14.99,
    "price": 29.99,
    "compareAt": 41.99,
    "netProfit": 15,
    "profitMarginPercent": 50,
    "supplier": "Zendrop",
    "supplierSku": "ZD-2038976",
    "supplierUrl": "https://app.zendrop.com/product/2038976",
    "supplierWarehouse": "US Central Express (Zendrop)",
    "supplierShippingTime": "2-4 business days",
    "rating": 4.7,
    "reviewsCount": 381,
    "isBestseller": false,
    "isLingPick": true,
    "repeatDeliveryEligible": false,
    "inStockAustin": true,
    "stockCount": 50000,
    "heroImage": "https://file.zendrop.com/products/87/9c/ec669b3a4f67a8ecb5a6be7b267d.jpeg",
    "secondaryImage": "https://file.zendrop.com/products/87/9c/ec669b3a4f67a8ecb5a6be7b267d_import.webp",
    "galleryImages": [
      "https://file.zendrop.com/products/87/9c/ec669b3a4f67a8ecb5a6be7b267d.jpeg",
      "https://file.zendrop.com/products/87/9c/ec669b3a4f67a8ecb5a6be7b267d_import.webp",
      "https://file.zendrop.com/products/4e/80/238229d348018dedf04b7f3ef324.jpeg"
    ],
    "description": "Description:Enhance your grooming routine with our Essential Dog Grooming belly straps Set designed to provide comfort and reliability for your furry friend.Meanwhile our grooming belly straps sets designed for quick and easy attachment our grooming straps set streamlines the grooming process saving you time and effort.Equipped with heavy-duty 360 clamps for secure and stable attachment to grooming tables or stands ensuring safety and reliability.Whether youre a professional groomer or a pet own...",
    "keyFeatures": [
      "Official supplier item fulfilled directly via Zendrop US Express Hub",
      "Fast 2-4 business day tracked shipping via USPS Ground Advantage",
      "High quality pet-safe non-toxic materials built for everyday use",
      "30-Day Money-Back Guarantee & 100% Satisfaction Warranty"
    ],
    "specifications": {
      "material": "Pet-Safe High Grade Premium Materials",
      "dimensions": "Standard Pet Specification Size",
      "weight": "Fitted Weight",
      "inTheBox": "1x Pet Dog Grooming Arm Accessories - Pet Dog Grooming Belly Straps with Connector Pet Dog Grooming Belly Support Band Dog Grooming Table Arm Supplies Pet Dog Grooming Loops Dog Loop Heart Pattern",
      "care": "Wipe clean or wash according to pet care guidelines.",
      "warranty": "12-Month Quality Guarantee",
      "warehouse": "US Express Hub",
      "shippingEstimate": "2-4 business days"
    },
    "volumeTiers": [
      {
        "qty": 1,
        "discountPercent": 0,
        "pricePerUnit": 29.99,
        "total": 29.99,
        "savings": 0,
        "netProfit": 15
      },
      {
        "qty": 2,
        "discountPercent": 10,
        "pricePerUnit": 26.99,
        "total": 53.98,
        "savings": 6,
        "netProfit": 24
      },
      {
        "qty": 3,
        "discountPercent": 15,
        "pricePerUnit": 25.49,
        "total": 76.47,
        "savings": 13.5,
        "netProfit": 31.5
      }
    ]
  }
];

export const PRODUCT_SUPPLIER_CATALOG: Record<string, any> = {};

export const PRODUCTS: Product[] = DEFAULT_REAL_PRODUCTS;

export function getSavedProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_REAL_PRODUCTS;
  try {
    // Reset to load official catalog including The Ultimate Pet Cleanup Kit campaign bundle
    if (!localStorage.getItem('ling_catalog_zendrop_aligned_v37_kit7999')) {
      localStorage.setItem('ling_admin_products', JSON.stringify(DEFAULT_REAL_PRODUCTS));
      localStorage.setItem('ling_catalog_zendrop_aligned_v37_kit7999', 'true');
      return DEFAULT_REAL_PRODUCTS;
    }
    const saved = localStorage.getItem('ling_admin_products');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          const fresh = DEFAULT_REAL_PRODUCTS.find((def) => def.id === p.id);
          if (
            fresh &&
            (p.isCampaignBundle ||
              p.id === 'ultimate-pet-cleanup-kit' ||
              p.id === 'zendrop-1603576' ||
              p.id === 'zendrop-2053714' ||
              p.id === 'zendrop-2058716')
          ) {
            return {
              ...p,
              price: fresh.price,
              compareAt: fresh.compareAt,
              netProfit: fresh.netProfit,
              profitMarginPercent: fresh.profitMarginPercent,
              volumeTiers: fresh.volumeTiers,
              bundleItems: fresh.bundleItems || p.bundleItems,
            };
          }
          return p;
        });
      }
    }
  } catch (e) {
    console.error('Error loading saved products:', e);
  }
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

export function getSavedCoupons(): Coupon[] {
  const DEFAULT_COUPONS: Coupon[] = [
    {
      id: 'cp-1',
      code: 'LING20',
      discountPercent: 20,
      description: 'Cupom Oficial de Boas-Vindas Ling Petshop',
      partnerName: 'Ling Petshop Oficial',
      active: true,
      usageCount: 142,
      createdAt: '2026-01-01',
    },
    {
      id: 'cp-2',
      code: 'PETCO20',
      discountPercent: 20,
      description: 'Cupom Parceria Especial Comunidade Pet',
      partnerName: 'Comunidade Pet VIP',
      active: true,
      usageCount: 89,
      createdAt: '2026-02-15',
    },
    {
      id: 'cp-3',
      code: 'PARCERIA15',
      discountPercent: 15,
      description: 'Desconto Parceria Influenciadores VIP',
      partnerName: 'Parcerias VIP Instagram/TikTok',
      active: true,
      usageCount: 64,
      createdAt: '2026-03-10',
    },
  ];

  if (typeof window === 'undefined') return DEFAULT_COUPONS;
  try {
    const saved = localStorage.getItem('ling_admin_coupons');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading coupons:', e);
  }
  localStorage.setItem('ling_admin_coupons', JSON.stringify(DEFAULT_COUPONS));
  return DEFAULT_COUPONS;
}

export function saveCouponsToStorage(coupons: Coupon[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ling_admin_coupons', JSON.stringify(coupons));
    window.dispatchEvent(new Event('ling_coupons_updated'));
  } catch (e) {
    console.error('Error saving coupons:', e);
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
    title: "Comida organizada e alívio imediato de ansiedade!",
    comment:
      "A caminha ortopédica e a garrafa de água chegaram super rápido do armazém dos EUA. Qualidade impecável dos produtos Zendrop!",
    verifiedPurchase: true,
    productName: "Caminha Ortopédica Calming Plush Bed Ultra-Soft",
    date: "Ontem",
  },
  {
    id: "rev-zd-2",
    author: "Ryan P.",
    location: "Portland, OR",
    petName: "Rusty & Bear",
    petBreed: "Labradoodles",
    rating: 5,
    title: "Nunca mais patinhas sujas de lama dentro de casa!",
    comment:
      "Moro no Oregon e dias de chuva são comuns. O copo lava-patas limpa tudo em 15 segundos antes deles entrarem na sala.",
    verifiedPurchase: true,
    productName: "Lava-Patas de Silicone 360° Quick-Clean com Cerdas Macias",
    date: "2 dias atrás",
  },
  {
    id: "rev-zd-3",
    author: "Amanda C.",
    location: "Austin, TX",
    petName: "Milo & Cleo",
    petBreed: "Maine Coon & Tabby Cats",
    rating: 5,
    title: "Adeus aos rolos de fita adesiva colantes!",
    comment:
      "O rolo ChomRoller é incrível. Passei no sofá de veludo e recolheu cada fio de pelo de gato. Cliquei no botão e joguei fora sem sujeira!",
    verifiedPurchase: true,
    productName: "Rolo Tira-Pelos Reutilizável de Alta Eficiência ChomRoller™",
    date: "4 dias atrás",
  },
  {
    id: "rev-zd-4",
    author: "Kevin S.",
    location: "Charlotte, NC",
    petName: "Bella",
    petBreed: "Toy Poodle (2 yrs)",
    rating: 5,
    title: "A fonte de água AquaPure fez meu gato beber 3x mais água!",
    comment:
      "O veterinário avisou sobre desidratação. Com a fonte silenciosa AquaPure ele bebe água o dia todo com o filtro limpo.",
    verifiedPurchase: true,
    productName: "Fonte de Água Silenciosa Sem Fio AquaPure™ 2.5L",
    date: "5 dias atrás",
  },
];

export const RECENT_US_PURCHASES = [
  {
    name: 'Jessica M.',
    city: 'Miami, FL',
    item: 'Caminha Ortopédica Calming Plush Bed',
    timeAgo: '2 minutes ago',
  },
  {
    name: 'Brandon K.',
    city: 'Los Angeles, CA',
    item: 'Peitoral Ergonômico Anti-Puxão AirGlide™',
    timeAgo: '5 minutes ago',
  },
  {
    name: 'Chloe W.',
    city: 'New York, NY',
    item: 'Fonte de Água Silenciosa AquaPure™ 2.5L',
    timeAgo: '9 minutes ago',
  },
  {
    name: 'David S.',
    city: 'Chicago, IL',
    item: 'Escova Aspiradora Tosa GroomPro™ 5em1',
    timeAgo: '14 minutes ago',
  },
  {
    name: 'Rachel H.',
    city: 'Seattle, WA',
    item: 'Snack Pet Freeze-Dried 100% Salmão',
    timeAgo: '18 minutes ago',
  },
  {
    name: 'Travis L.',
    city: 'Dallas, TX',
    item: 'Rolo Tira-Pelos ChomRoller™',
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
