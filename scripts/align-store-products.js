import fs from 'fs';
import path from 'path';

const scrapedDataPath = path.resolve('zendrop_products_scraped.json');
const storeDataPath = path.resolve('src/data/storeData.ts');

if (!fs.existsSync(scrapedDataPath)) {
  console.error('scraped JSON not found');
  process.exit(1);
}

const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));

// Clean up titles for display
function cleanTitle(rawName) {
  if (!rawName) return 'Premium Pet Product';
  let name = rawName.trim();
  // Decode HTML entities
  name = name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  return name;
}

// Clean up description HTML into readable formatted text/paragraphs
function cleanDescription(rawDesc) {
  if (!rawDesc) return 'High-quality pet product sourced directly for comfort and durability.';
  let text = rawDesc
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();

  if (text.length > 600) {
    text = text.substring(0, 600) + '...';
  }
  return text || 'High-quality pet product sourced directly for comfort and durability.';
}

function determinePetType(name, desc) {
  const combined = (name + ' ' + desc).toLowerCase();
  if (combined.includes('cat') && !combined.includes('dog')) return 'Cat';
  if (combined.includes('dog') && !combined.includes('cat')) return 'Dog';
  return 'All Pets';
}

function determineCategory(name, desc) {
  const combined = (name + ' ' + desc).toLowerCase();
  if (combined.includes('bed') || combined.includes('cuddler') || combined.includes('mat') || combined.includes('house') || combined.includes('crate') || combined.includes('couch')) return 'Beds';
  if (combined.includes('feeder') || combined.includes('bowl') || combined.includes('fountain') || combined.includes('water') || combined.includes('food') || combined.includes('dispenser') || combined.includes('feeder station')) return 'Feeding';
  if (combined.includes('leash') || combined.includes('harness') || combined.includes('collar') || combined.includes('carrier') || combined.includes('backpack') || combined.includes('seat') || combined.includes('stroller')) return 'Walk & Travel';
  if (combined.includes('hair') || combined.includes('grooming') || combined.includes('brush') || combined.includes('remover') || combined.includes('cleaner') || combined.includes('paw') || combined.includes('clipper') || combined.includes('comb') || combined.includes('roller')) return 'Grooming';
  if (combined.includes('toy') || combined.includes('ball') || combined.includes('chew') || combined.includes('scratcher') || combined.includes('interactive') || combined.includes('tunnel')) return 'Toys';
  return 'Wellness';
}

function determineDepartment(category, petType) {
  if (category === 'Grooming') return 'Grooming';
  if (category === 'Toys') return 'Toys';
  if (petType === 'Cat') return 'Cats';
  return 'Dogs';
}

const entries = Object.entries(scrapedData);
console.log(`Found ${entries.length} scraped products`);

const alignedProducts = entries.map(([key, data], index) => {
  const rawCost = parseFloat(data.supplierCost) || 12.0;
  // Calculate retail price with ~60% margin (Markup factor approx 2.2x to 2.8x)
  let retailPrice = Math.round((rawCost * 2.4) * 100) / 100;
  if (retailPrice < 14.99) retailPrice = 14.99;
  const compareAt = Math.round((retailPrice * 1.45) * 100) / 100;
  const netProfit = Math.round((retailPrice - rawCost) * 100) / 100;
  const marginPct = Math.round((netProfit / retailPrice) * 100);

  const cleanName = cleanTitle(data.name);
  const cleanDesc = cleanDescription(data.description);
  const petType = determinePetType(data.name, data.description);
  const category = determineCategory(data.name, data.description);
  const department = determineDepartment(category, petType);

  const zdId = data.id || key.replace('zendrop-', '');

  const heroImage = data.heroImage || (data.images && data.images[0]) || '';
  const secondaryImage = data.secondaryImage || (data.images && data.images[1]) || heroImage;
  const galleryImages = Array.isArray(data.galleryImages) && data.galleryImages.length > 0 
    ? data.galleryImages 
    : (data.images || [heroImage]);

  return {
    id: `zendrop-${zdId}`,
    sku: `ZD-${zdId}`,
    name: cleanName,
    brand: 'Fable Pets Select',
    tagline: cleanDesc.slice(0, 110) + '...',
    petType: petType,
    category: category,
    department: department,
    supplierCost: rawCost,
    price: retailPrice,
    compareAt: compareAt,
    netProfit: netProfit,
    profitMarginPercent: marginPct,
    supplier: 'Zendrop',
    supplierSku: `ZD-${zdId}`,
    supplierUrl: `https://app.zendrop.com/product/${zdId}`,
    supplierWarehouse: 'US Central Express (Zendrop)',
    supplierShippingTime: '2-4 business days',
    rating: Number((4.7 + (index % 3) * 0.1).toFixed(1)),
    reviewsCount: 120 + (index * 17) % 300,
    badge: index < 5 ? 'Bestseller' : (index % 4 === 0 ? 'US Warehouse' : undefined),
    isBestseller: index < 8,
    isLingPick: index % 3 === 0,
    repeatDeliveryEligible: false,
    inStockAustin: true,
    stockCount: 150 + (index * 23) % 400,
    heroImage: heroImage,
    secondaryImage: secondaryImage,
    galleryImages: galleryImages,
    description: cleanDesc,
    keyFeatures: [
      'Official supplier stock fulfilled directly via Zendrop US Hub',
      'Fast 2-4 business day tracked shipping via USPS Ground Express',
      'Premium durable pet-safe materials built for long-lasting daily use',
      '30-Day Money-Back Guarantee & 100% Satisfaction Warranty'
    ],
    specifications: {
      material: 'Pet-Safe High Grade Premium Materials',
      dimensions: 'Standard Pet Specification Size',
      weight: 'Fitted Weight',
      inTheBox: `1x ${cleanName}`,
      care: 'Wipe clean or wash according to pet care guidelines.',
      warranty: '12-Month Quality Guarantee',
      warehouse: 'US Express Hub',
      shippingEstimate: '2-4 business days'
    },
    volumeTiers: [
      { qty: 1, discountPercent: 0, pricePerUnit: retailPrice, total: retailPrice, savings: 0, netProfit: netProfit },
      { qty: 2, discountPercent: 10, pricePerUnit: Math.round(retailPrice * 0.9 * 100)/100, total: Math.round(retailPrice * 0.9 * 2 * 100)/100, savings: Math.round(retailPrice * 0.2 * 100)/100, netProfit: Math.round((retailPrice * 0.9 - rawCost) * 2 * 100)/100 },
      { qty: 3, discountPercent: 15, pricePerUnit: Math.round(retailPrice * 0.85 * 100)/100, total: Math.round(retailPrice * 0.85 * 3 * 100)/100, savings: Math.round(retailPrice * 0.45 * 100)/100, netProfit: Math.round((retailPrice * 0.85 - rawCost) * 3 * 100)/100 }
    ]
  };
});

console.log('Sample generated product 0:', alignedProducts[0]);
console.log('Sample generated product 1:', alignedProducts[1]);
