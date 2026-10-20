import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ShoppingBag,
  Check,
  Heart,
  RotateCcw,
  ShieldCheck,
  Truck,
  Leaf,
} from 'lucide-react';
import { Product, PRODUCTS } from '../data/storeData.ts';
import { formatCurrency, REPEAT_DELIVERY_DISCOUNT_PERCENT } from '../utils/storeLogic.ts';

interface ShopPageProps {
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product, isRepeat?: boolean) => void;
  initialCategory?: string;
  products?: Product[];
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onQuickAdd,
  initialCategory = 'all',
  products,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [petFilter, setPetFilter] = useState<'all' | 'Dog' | 'Cat'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'bestsellers' | 'price-asc' | 'price-desc'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [searchFilter, setSearchFilter] = useState('');

  const categories = [
    { label: 'All Essentials', value: 'all' },
    { label: 'Walk & Leashes', value: 'Walk & Travel' },
    { label: 'Sleep & Beds', value: 'Beds' },
    { label: 'Mind & Toys', value: 'Toys' },
    { label: 'Dining & Feeders', value: 'Feeding' },
    { label: 'Bath & Grooming', value: 'Grooming' },
    { label: 'Daily Wellness', value: 'Wellness' },
    { label: 'Curated Deals', value: 'Deals' },
  ];

  const sourceProducts = products !== undefined ? products : PRODUCTS;

  const filteredProducts = useMemo(() => {
    let list = [...sourceProducts];

    if (activeCategory === 'Deals') {
      list = list.filter((p) => p.compareAt - p.price >= 14 || p.isBestseller);
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory || p.department === activeCategory);
    }

    if (petFilter !== 'all') {
      list = list.filter((p) => p.petType === petFilter || p.petType === 'All Pets');
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'bestsellers':
        return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'featured':
      default:
        return list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [activeCategory, petFilter, sortBy, searchFilter]);

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(p, false);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Editorial Page Header in Royal Navy */}
      <div className="border-b border-[#E2E8F0] bg-white pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
                <Leaf size={13} />
                <span>Nationwide Catalog · US Warehouses</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2942] font-serif tracking-tight">
                All Pet Essentials
              </h1>
              <p className="text-sm sm:text-base text-[#64748B] mt-2 font-light max-w-2xl leading-relaxed">
                Elevated pet gear designed for modern American homes. Non-toxic materials, veterinarian-vetted ergonomics, and 30-day in-home risk-free trial.
              </p>
            </div>

            {/* Pet Type Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-full border border-[#E2E8F0] shadow-2xs self-start md:self-auto">
              <button
                onClick={() => setPetFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  petFilter === 'all'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F2942]'
                }`}
              >
                All Pets
              </button>
              <button
                onClick={() => setPetFilter('Dog')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  petFilter === 'Dog'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F2942]'
                }`}
              >
                🐶 Dogs
              </button>
              <button
                onClick={() => setPetFilter('Cat')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  petFilter === 'Cat'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F2942]'
                }`}
              >
                🐱 Cats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 sm:top-20 z-20 backdrop-blur-md bg-white/95 border-b border-[#E2E8F0] py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === c.value
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F2942] border border-[#CBD5E1]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Quick Search & Sort */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-full border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB] w-40 sm:w-48 text-[#0F2942]"
              />
            </div>

            <div className="relative inline-flex items-center bg-white border border-[#CBD5E1] rounded-full px-3 py-1.5">
              <ArrowUpDown size={12} className="text-[#94A3B8] mr-1.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[#0F2942] focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="bestsellers">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between text-xs text-[#64748B] mb-8">
          <span>Showing {filteredProducts.length} items</span>
          <span>Click any product for full specifications & dimensions</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-[#CBD5E1] max-w-2xl mx-auto shadow-2xs">
            {sourceProducts.length === 0 ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#0F2942] font-serif">New Seasonal Arrivals Coming Soon</h3>
                <p className="text-xs text-[#64748B] mt-2 max-w-md mx-auto leading-relaxed">
                  We are currently restocking our US fulfillment centers with new veterinarian-vetted pet essentials. Check back shortly for our new catalog releases!
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-[#0F2942] font-serif">No products found</p>
                <p className="text-xs text-[#64748B] mt-1.5">Try clearing your filters or selecting a different pet category.</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setPetFilter('all');
                    setSearchFilter('');
                  }}
                  className="mt-5 bg-[#0F2942] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-[#1E3A8A] transition-all"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((p) => {
              const savings = p.compareAt - p.price;
              const discountPct = Math.round((savings / p.compareAt) * 100);
              const repeatPrice = p.price * (1 - REPEAT_DELIVERY_DISCOUNT_PERCENT / 100);
              const isAdded = addedId === p.id;
              const isWished = Boolean(wishlist[p.id]);

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group flex flex-col cursor-pointer transition-all duration-300"
                >
                  {/* Clean Single Image (No dual image flip) */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F1F5F9] mb-3.5 shadow-2xs group-hover:shadow-xl transition-all duration-300 border border-[#E2E8F0]">
                    <img
                      src={p.heroImage}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Wishlist Heart */}
                    <button
                      onClick={(e) => toggleWishlist(p.id, e)}
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                        isWished
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white/80 text-[#0F2942] hover:bg-white opacity-80 group-hover:opacity-100'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart size={14} className={isWished ? 'fill-current' : ''} />
                    </button>

                    {/* Quick Add Button overlay */}
                    <button
                      onClick={(e) => handleAdd(p, e)}
                      className={`absolute bottom-3 right-3 z-10 p-2.5 rounded-full shadow-lg transition-all cursor-pointer active:scale-90 ${
                        isAdded
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-[#0F2942] hover:bg-[#2563EB] text-white'
                      }`}
                      title="Quick Add to Bag"
                    >
                      {isAdded ? <Check size={16} /> : <ShoppingBag size={15} />}
                    </button>
                  </div>

                  {/* Product Metadata */}
                  <div className="px-1 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Color dots preview */}
                      {p.colors && p.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                          {p.colors.map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          <span className="text-[10px] text-[#94A3B8] ml-1">
                            {p.colors.length} shades
                          </span>
                        </div>
                      )}

                      {/* Brand & Collection Tag + Clean Badges */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase">
                          {p.brand || 'Ling Petshop'} · {p.petType}
                        </span>
                        {p.badge && (
                          <span className="bg-[#F1F5F9] text-[#0F2942] border border-[#CBD5E1] font-semibold text-[9px] px-2 py-0.5 rounded-full">
                            {p.badge}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/70 font-bold text-[9px] px-1.5 py-0.5 rounded">
                            Save {discountPct}%
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#0F2942] group-hover:text-[#2563EB] transition-colors leading-snug font-serif">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-1 font-light">
                        {p.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#0F2942] tracking-tight">
                          {formatCurrency(p.price)}
                        </span>
                        {p.compareAt > p.price && (
                          <span className="text-xs text-[#94A3B8] line-through">
                            {formatCurrency(p.compareAt)}
                          </span>
                        )}
                      </div>

                      {p.repeatDeliveryEligible && (
                        <span className="text-[11px] font-bold text-[#16A34A]">
                          Subscribe {formatCurrency(repeatPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
