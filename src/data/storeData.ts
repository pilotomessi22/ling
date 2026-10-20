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

export const DEFAULT_REAL_PRODUCTS: Product[] = [];

export const PRODUCT_SUPPLIER_CATALOG: Record<string, any> = {};

export const PRODUCTS: Product[] = DEFAULT_REAL_PRODUCTS;

export function getSavedProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    if (!localStorage.getItem('ling_catalog_v9_empty')) {
      localStorage.removeItem('ling_admin_products');
      localStorage.setItem('ling_catalog_v9_empty', 'true');
    }
    const saved = localStorage.getItem('ling_admin_products');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading saved products:', e);
  }
  localStorage.setItem('ling_admin_products', JSON.stringify([]));
  return [];
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
