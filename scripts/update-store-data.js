import fs from 'fs';

const scrapedData = JSON.parse(fs.readFileSync('zendrop_products_scraped.json', 'utf8'));
let storeDataContent = fs.readFileSync('src/data/storeData.ts', 'utf8');

let updatedCount = 0;

for (const [id, prod] of Object.entries(scrapedData)) {
  const cleanId = id; // e.g. 'zendrop-2000857'
  
  if (!prod.heroImage) continue;

  const heroUrl = prod.heroImage;
  const secondaryUrl = prod.secondaryImage || prod.heroImage;
  const galleryUrls = prod.galleryImages.slice(0, 10);

  // We look for product block matching id: 'zendrop-XXXXX'
  const productRegex = new RegExp(`(id:\\s*['"]${cleanId}['"][\\s\\S]*?heroImage:\\s*['"])([^'"]+)(['"][\\s\\S]*?secondaryImage:\\s*['"])([^'"]+)(['"][\\s\\S]*?galleryImages:\\s*\\[)([^\\]]+)(\\])`, 'g');

  if (productRegex.test(storeDataContent)) {
    const formattedGallery = galleryUrls.map(g => `\n      '${g}'`).join(',') + '\n    ';
    storeDataContent = storeDataContent.replace(productRegex, (match, p1, oldHero, p3, oldSec, p5, oldGal, p7) => {
      return `${p1}${heroUrl}${p3}${secondaryUrl}${p5}${formattedGallery}${p7}`;
    });
    updatedCount++;
  } else {
    console.warn(`Could not match product block for ${cleanId} via regex, trying alternative regex...`);
  }
}

fs.writeFileSync('src/data/storeData.ts', storeDataContent);
console.log(`Successfully updated ${updatedCount} products in src/data/storeData.ts with REAL Zendrop images!`);
