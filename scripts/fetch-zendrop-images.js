import fs from 'fs';

const productIds = [
  '2000857', '2041862', '1603576', '2053714', '2058716', '2873973', '2632492', '2658755',
  '2689252', '2640918', '2650189', '2608657', '2631448', '2040471', '2699708', '2601227',
  '2626089', '2000777', '2042070', '2047664', '2051156', '2063694', '3090659', '2001114',
  '2070193', '2069888', '2044170', '2066498', '2073024', '2040754', '2072717', '2066233',
  '2001034', '2038976'
];

async function fetchProduct(id) {
  try {
    const res = await fetch('https://app.zendrop.com/api/get-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ product_id: id, id: parseInt(id) })
    });
    
    const json = await res.json();
    if (!json.data || !json.data.product) {
      console.error(`[ERR] Product ${id} failed:`, json);
      return null;
    }
    const p = json.data.product;
    
    // Extract images
    const images = [];
    const addImg = (url) => {
      if (!url) return;
      let fullUrl = url;
      if (!fullUrl.startsWith('http')) {
        fullUrl = 'https://file.zendrop.com/' + fullUrl.replace(/^\//, '');
      }
      if (!images.includes(fullUrl)) {
        images.push(fullUrl);
      }
    };

    if (p.featuredProductImage) {
      if (p.featuredProductImage.urls?.original) addImg(p.featuredProductImage.urls.original);
      if (p.featuredProductImage.full_image) addImg(p.featuredProductImage.full_image);
      if (p.featuredProductImage.medium_image) addImg(p.featuredProductImage.medium_image);
    }
    
    if (Array.isArray(p.product_image)) {
      for (const imgObj of p.product_image) {
        if (imgObj.urls?.original) addImg(imgObj.urls.original);
        else if (imgObj.full_image) addImg(imgObj.full_image);
        else if (imgObj.big) addImg(imgObj.big);
      }
    }

    if (Array.isArray(p.product_variant)) {
      for (const v of p.product_variant) {
        if (v.variant_image_info?.urls?.original) addImg(v.variant_image_info.urls.original);
        else if (v.variant_image_info?.variant_image_url) addImg(v.variant_image_info.variant_image_url);
        else if (v.variant_image) addImg(v.variant_image);
      }
    }

    if (p.description) {
      const imgMatches = p.description.match(/src=["'](https?:\/\/[^"']+)["']/gi);
      if (imgMatches) {
        for (const m of imgMatches) {
          const u = m.replace(/^src=["']/, '').replace(/["']$/, '');
          addImg(u);
        }
      }
    }

    return {
      id,
      name: p.name,
      description: p.description,
      supplierCost: p.base_cost_price || p.display_price,
      images,
      heroImage: images[0] || null,
      secondaryImage: images[1] || images[0] || null,
      galleryImages: images
    };
  } catch (err) {
    console.error(`[EXC] Exception for ${id}:`, err);
    return null;
  }
}

async function main() {
  const results = {};
  for (const id of productIds) {
    const data = await fetchProduct(id);
    if (data) {
      results[`zendrop-${id}`] = data;
    }
  }

  fs.writeFileSync('zendrop_products_scraped.json', JSON.stringify(results, null, 2));
  console.log('Saved all real photos!');
}

main();
