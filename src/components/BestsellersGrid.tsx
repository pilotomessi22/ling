import React, { useState, useMemo } from 'react';
import {
  Star,
  Plus,
  Eye,
  RotateCcw,
  Check,
  MapPin,
  ArrowUpDown,
  Tag,
  Sparkles,
  Heart,
  Leaf,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Product, PRODUCTS } from '../data/storeData.ts';
import { formatCurrency, REPEAT_DELIVERY_DISCOUNT_PERCENT } from '../utils/storeLogic.ts';

interface BestsellersGridProps {
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product, isRepeat?: boolean) => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const BestsellersGrid: React.FC<BestsellersGridProps> = ({
  onSelectProduct,
  onQuickAdd,
  activeCategory,
  onCategoryChange,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'bestsellers' | 'rating' | 'price-asc' | 'price-desc' | 'savings'>('featured');
  const [austinInStockOnly, setAustinInStockOnly] = useState(false);
  const [repeatOnly, setRepeatOnly] = useState(false);
  const [petFilter, setPetFilter] = useState<'all' | 'Dog' | 'Cat'>('all');
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const categories = [
    { label: 'All Essentials', value: 'all' },
    { label: '🐶 Dogs', value: 'Dogs' },
    { label: '🐱 Cats', value: 'Cats' },
    { label: '🛏️ Slumber & Beds', value: 'Beds' },
    { label: '🦮 Walk & Travel Gear', value: 'Walk & Travel' },
    { label: '🎾 Interactive Toys', value: 'Toys' },
    { label: '🚿 Bath & Grooming', value: 'Grooming' },
    { label: '🌿 Natural Wellness', value: 'Wellness' },
    { label: '🔥 Curated Deals', value: 'Deals' },
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Department / Category filter
    if (activeCategory === 'Deals') {
      result = result.filter((p) => p.compareAt - p.price >= 15 || p.isBestseller);
    } else if (activeCategory === 'Repeat') {
      result = result.filter((p) => p.repeatDeliveryEligible);
    } else if (activeCategory === 'Dogs') {
      result = result.filter((p) => p.department === 'Dogs' || p.petType === 'Dog');
    } else if (activeCategory === 'Cats') {
      result = result.filter((p) => p.department === 'Cats' || p.petType === 'Cat');
    } else if (activeCategory !== 'all') {
      result = result.filter(
        (p) => p.category === activeCategory || p.department === activeCategory
      );
    }

    // Secondary Pet Filter
    if (petFilter !== 'all') {
      result = result.filter((p) => p.petType === petFilter || p.petType === 'All Pets');
    }

    // Austin In Stock toggle
    if (austinInStockOnly) {
      result = result.filter((p) => p.inStockAustin);
    }

    // Repeat Delivery toggle
    if (repeatOnly) {
      result = result.filter((p) => p.repeatDeliveryEligible);
    }

    // Sorting
    switch (sortBy) {
      case 'bestsellers':
        return result.sort((a, b) => b.reviewsCount - a.reviewsCount);
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'savings':
        return result.sort((a, b) => (b.compareAt - b.price) - (a.compareAt - a.price));
      case 'featured':
      default:
        return result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [activeCategory, petFilter, austinInStockOnly, repeatOnly, sortBy]);

  const handleAdd = (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onQuickAdd(prod, false);
    setAddedItemAnim(prod.id);
    setTimeout(() => setAddedItemAnim(null), 2000);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wix Studio Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDE2] border border-[#E4DC CE] text-[#C86446] text-xs font-semibold uppercase tracking-wider mb-3">
              <Leaf size={13} />
              <span>Wix Studio Curated Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2C2724] tracking-tight font-serif">
              Living Room Essentials
            </h2>
            <p className="text-sm sm:text-base text-[#766E65] mt-2 font-light leading-relaxed">
              Designed for modern homes and pets who deserve the finest. Photography in real homes, veterinarian-vetted materials, and priority USPS dispatch.
            </p>
          </div>

          {/* Quick Pet Toggle Selector */}
          <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-md rounded-full border border-[#DFD8CC] shadow-xs self-start md:self-auto">
            <button
              onClick={() => setPetFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                petFilter === 'all'
                  ? 'bg-[#2C2724] text-[#FAF7F2] shadow-xs'
                  : 'text-[#686057] hover:text-[#2C2724]'
              }`}
            >
              All Companions
            </button>
            <button
              onClick={() => setPetFilter('Dog')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                petFilter === 'Dog'
                  ? 'bg-[#2C2724] text-[#FAF7F2] shadow-xs'
                  : 'text-[#686057] hover:text-[#2C2724]'
              }`}
            >
              🐶 Dogs
            </button>
            <button
              onClick={() => setPetFilter('Cat')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                petFilter === 'Cat'
                  ? 'bg-[#2C2724] text-[#FAF7F2] shadow-xs'
                  : 'text-[#686057] hover:text-[#2C2724]'
              }`}
            >
              🐱 Cats
            </button>
          </div>
        </div>

        {/* Sticky Filter & Category Bar */}
        <div className="sticky top-18 z-20 backdrop-blur-md bg-[#FAF7F2]/95 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-[#E8E2D7] mb-10 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Horizontal Scroll Categories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onCategoryChange(c.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === c.value
                      ? 'bg-[#2C2724] text-[#FAF7F2] shadow-xs'
                      : 'bg-white/90 text-[#4A443E] hover:bg-white hover:text-[#2C2724] border border-[#DFD8CC]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Quick Refinements & Sort */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 self-start lg:self-auto">
              {/* Austin stock toggle */}
              <button
                onClick={() => setAustinInStockOnly(!austinInStockOnly)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  austinInStockOnly
                    ? 'bg-[#4E664D] text-white'
                    : 'bg-white/80 text-[#686057] border border-[#DFD8CC] hover:bg-white'
                }`}
              >
                <MapPin size={12} />
                <span>Austin Ready (24h)</span>
              </button>



              {/* Sort Selector */}
              <div className="relative inline-flex items-center bg-white/80 border border-[#DFD8CC] rounded-full px-3 py-1.5">
                <ArrowUpDown size={12} className="text-[#8E867C] mr-1.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-[#2C2724] focus:outline-hidden cursor-pointer pr-1"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="bestsellers">Most Loved by Pets</option>
                  <option value="rating">Highest Rated (5.0)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="savings">Biggest Savings</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Count Indicator */}
        <div className="flex items-center justify-between text-xs text-[#8E867C] mb-6">
          <span>Displaying {filteredProducts.length} curated boutique items</span>
          <span className="hidden sm:inline font-medium text-[#766E65]">Hover on photos to view real pets in home settings</span>
        </div>

        {/* Clean Borderless Gallery Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white/60 rounded-3xl border border-dashed border-[#DFD8CC]">
            <p className="text-lg font-bold text-[#2C2724] font-serif">No products match your active filters</p>
            <p className="text-xs text-[#766E65] mt-1.5">Try resetting your pet or category selections to browse our full catalog.</p>
            <button
              onClick={() => {
                onCategoryChange('all');
                setPetFilter('all');
                setAustinInStockOnly(false);
                setRepeatOnly(false);
              }}
              className="mt-5 bg-[#2C2724] text-[#FAF7F2] text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-black transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((p) => {
              const savings = p.compareAt - p.price;
              const discountPct = Math.round((savings / p.compareAt) * 100);
              const repeatPrice = p.price * (1 - REPEAT_DELIVERY_DISCOUNT_PERCENT / 100);
              const isAdded = addedItemAnim === p.id;
              const isWished = Boolean(wishlist[p.id]);

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group flex flex-col cursor-pointer transition-all duration-300"
                >
                  {/* Clean Borderless Edge-to-Edge Image Container (4:5 Aspect Ratio) */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F3EDE2] mb-3.5 shadow-2xs group-hover:shadow-xl transition-all duration-500">
                    {/* Primary Hero Image */}
                    <img
                      src={p.heroImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback && p.secondaryImage) {
                          target.dataset.triedFallback = 'true';
                          target.src = p.secondaryImage;
                        }
                      }}
                    />

                    {/* Secondary Lifestyle Image on Hover */}
                    <img
                      src={p.secondaryImage || p.heroImage}
                      alt={`${p.name} in home lifestyle`}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Out of Stock Overlay Badge */}
                    {p.stockCount === 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-black/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                        Sold Out
                      </div>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => toggleWishlist(p.id, e)}
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                        isWished
                          ? 'bg-[#C86446] text-white'
                          : 'bg-white/80 text-[#2C2724] hover:bg-white opacity-80 group-hover:opacity-100'
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart size={14} className={isWished ? 'fill-current' : ''} />
                    </button>

                    {/* Floating Hover Glass Action Bar */}
                    <div className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(p);
                        }}
                        className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-white text-[#2C2724] font-semibold text-xs rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                      >
                        <Eye size={14} className="text-[#8E867C]" />
                        <span>Quick View</span>
                      </button>

                      {p.stockCount === 0 ? (
                        <button
                          disabled
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-stone-300 text-stone-600 cursor-not-allowed shadow-none"
                          title="Currently Out of Stock"
                        >
                          <X size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleAdd(p, e)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95 ${
                            isAdded
                              ? 'bg-[#4E664D] text-white'
                              : 'bg-[#C86446] hover:bg-[#B35539] text-white'
                          }`}
                          title="Add directly to cart"
                        >
                          {isAdded ? <Check size={16} /> : <ShoppingBag size={15} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Product Details Section (Borderless Elegance) */}
                  <div className="px-1 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Color Swatch Dots if Available */}
                      {p.colors && p.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                          {p.colors.map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3 h-3 rounded-full border border-black/15 shadow-2xs transition-transform hover:scale-125"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          <span className="text-[10px] text-[#8E867C] ml-1">
                            {p.colors.length} shades
                          </span>
                        </div>
                      )}

                      {/* Brand & Collection Tag */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-semibold tracking-widest text-[#8E867C] uppercase">
                          {p.brand && !p.brand.includes('Fable') ? p.brand : 'Ling Petshop'} · {p.petType}
                        </span>
                        {p.stockCount === 0 && (
                          <span className="bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[9px] px-2 py-0.5 rounded-full">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3
                        className="text-base font-bold text-[#2C2724] group-hover:text-[#C86446] transition-colors leading-snug font-serif"
                        title={p.name}
                      >
                        {p.name}
                      </h3>

                      {/* Rating Stars & Reviews */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-[#E0A96D]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className="fill-[#E0A96D] text-[#E0A96D]" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#2C2724]">{p.rating}</span>
                        <span className="text-[11px] text-[#8E867C]">
                          ({p.reviewsCount.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-3 pt-2.5 border-t border-[#E8E2D7]/70 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#2C2724] tracking-tight">
                          {formatCurrency(p.price)}
                        </span>
                        {p.compareAt > p.price && (
                          <span className="text-xs text-[#8E867C] line-through">
                            {formatCurrency(p.compareAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Editorial Boutique Highlight Strip */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#F4EFE6] border border-[#E5DDD0] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C86446]">Austin Sanctuary Standard</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C2724] font-serif mt-1">
              Pet goods thoughtfully designed for your home’s decor.
            </h3>
            <p className="text-sm text-[#766E65] mt-2 font-light leading-relaxed">
              Every item is tested for durability, pet comfort, and clean interior aesthetics. No garish neon plastic or flimsy stitching — only honest craftsmanship guaranteed to look right in your living room.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onCategoryChange('Beds');
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-[#2C2724] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase hover:bg-black transition-all cursor-pointer shadow-md"
            >
              Explore Slumber Edit
            </button>
            <button
              onClick={() => {
                onCategoryChange('Walk & Travel');
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-white text-[#2C2724] border border-[#DFD8CC] font-semibold text-xs tracking-wider uppercase hover:bg-[#FAF7F2] transition-all cursor-pointer"
            >
              View City Walk Gear
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
