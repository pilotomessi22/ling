import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product, PRODUCTS } from '../data/storeData.ts';
import { formatCurrency, REPEAT_DELIVERY_DISCOUNT_PERCENT } from '../utils/storeLogic.ts';

interface ProductDetailPageProps {
  product: Product;
  onBackToShop: () => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (item: {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    isRepeatDelivery?: boolean;
    image: string;
    supplierCost: number;
  }) => void;
  onNavigateToCart?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
  onNavigateToCart,
}) => {
  const [activeImage, setActiveImage] = useState<string>(product.heroImage);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[0].name : 'Standard'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors ? product.colors[0].name : 'Original'
  );
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'repeat'>('one-time');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('specs');

  // Sync state on product change
  useEffect(() => {
    setActiveImage(product.heroImage);
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].name);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
    setPurchaseType('one-time');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const images =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : ([product.heroImage, product.secondaryImage].filter(Boolean) as string[]);

  // Calculate volume discount based on quantity
  let discountMultiplier = 1;
  if (quantity === 2) discountMultiplier = 0.85;
  if (quantity >= 3) discountMultiplier = 0.75;

  const repeatPrice = product.price * (1 - REPEAT_DELIVERY_DISCOUNT_PERCENT / 100);
  const baseUnitPrice = purchaseType === 'repeat' ? repeatPrice : product.price * discountMultiplier;
  const effectivePrice = Number(baseUnitPrice.toFixed(2));

  const handleAdd = () => {
    onAddToCart({
      sku: `${product.sku}-${selectedSize.slice(0, 3).replace(/\s/g, '')}`,
      name: product.name,
      price: effectivePrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
      isRepeatDelivery: purchaseType === 'repeat',
      image: activeImage,
      supplierCost: product.supplierCost,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  // Related products in same category
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Breadcrumb & Navigation Bar in Royal Navy accent */}
      <div className="border-b border-[#E2E8F0] bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#0F2942] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Essentials</span>
          </button>
          <div className="text-xs text-[#64748B] hidden sm:block">
            <span>Shop</span> / <span className="text-[#334155]">{product.category}</span> /{' '}
            <span className="font-bold text-[#0F2942]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Stage Image (Real dog/cat in modern interior) */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#F1F5F9] shadow-sm border border-[#E2E8F0]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#0F2942]/90 backdrop-blur-xs text-white font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 pt-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/25 scale-102 shadow-xs'
                        : 'border-[#E2E8F0] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Angle view" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Order Panel & Specifications (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
                  {product.brand || 'Ling Petshop'} · {product.department}
                </span>
                {product.isLingPick && (
                  <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ★ Premium Standard
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] font-serif leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-[#475569] mt-2 font-light leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#0F2942] tracking-tight">
                  {formatCurrency(effectivePrice)}
                </span>
                {product.compareAt > effectivePrice && (
                  <span className="text-sm text-[#94A3B8] line-through">
                    {formatCurrency(product.compareAt)}
                  </span>
                )}
                <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
                  Save {formatCurrency(product.compareAt - effectivePrice)}
                </span>
              </div>
            </div>

            {/* LING20 Promo Banner */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#1E40AF]">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={16} className="text-[#2563EB]" />
                <span>Use Promo Code <strong className="font-mono text-[#0F2942] bg-white px-2 py-0.5 rounded border border-[#BFDBFE]">LING20</strong> at checkout for 20% OFF!</span>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#0F2942] block mb-2">
                  Select Size: <strong className="text-[#2563EB]">{selectedSize}</strong>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedSize(s.name)}
                      className={`p-3 rounded-2xl text-left text-xs border transition-all cursor-pointer ${
                        selectedSize === s.name
                          ? 'border-[#0F2942] bg-white text-[#0F2942] font-bold shadow-xs'
                          : 'border-[#CBD5E1] bg-white/60 text-[#475569] hover:bg-white'
                      }`}
                    >
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">{s.weightLabel}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#0F2942] block mb-2">
                  Select Color: <strong className="text-[#2563EB]">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#0F2942] bg-white font-bold shadow-xs'
                          : 'border-[#CBD5E1] bg-white/60 hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Volume Bundle Deals (Compre por Quantidade & Economize) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0F2942] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#2563EB]" />
                  <span>Volume Bundle Offers (Multi-Pack Deals)</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Combined Shipping Saver
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {product.volumeTiers?.map((tier) => {
                  const isSelected = quantity === tier.qty;
                  return (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => setQuantity(tier.qty)}
                      className={`relative p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs ring-1 ring-[#2563EB]/30'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                      }`}
                    >
                      {tier.qty === 2 && (
                        <span className="absolute -top-2.5 right-1.5 bg-[#2563EB] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          POPULAR
                        </span>
                      )}
                      {tier.qty === 3 && (
                        <span className="absolute -top-2.5 right-1.5 bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          BEST DEAL
                        </span>
                      )}
                      <div>
                        <div className="font-bold text-xs text-[#0F2942]">
                          {tier.qty} {tier.qty > 1 ? 'Units' : 'Unit'}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          {formatCurrency(tier.pricePerUnit)} / ea
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-black/5 flex items-baseline justify-between">
                        <span className="font-extrabold text-xs text-[#0F2942]">
                          {formatCurrency(tier.total)}
                        </span>
                        {tier.discountPercent > 0 && (
                          <span className="text-[9px] font-black text-[#2563EB] bg-blue-100/70 px-1 py-0.2 rounded">
                            -{tier.discountPercent}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Add to Bag CTA */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center border border-[#CBD5E1] rounded-full bg-white px-3 py-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 font-bold text-[#475569] hover:text-[#0F2942] cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#0F2942]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 font-bold text-[#475569] hover:text-[#0F2942] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-4 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98 ${
                  added
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>
                      Add to Bag · {formatCurrency(effectivePrice * quantity)}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* If Added: Direct One-Click Navigation to Cart or Checkout */}
            {added && onNavigateToCart && (
              <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between animate-in fade-in">
                <span className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#2563EB]" /> Item in bag!
                </span>
                <button
                  onClick={onNavigateToCart}
                  className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to Bag & Checkout</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {/* Nationwide US Trust Pillars (Real Guarantee, No Fake Reviews) */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#0F2942]">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#2563EB] flex-shrink-0" />
                <span>
                  <strong>30-Day In-Home Trial:</strong> 100% money-back guarantee if your pet doesn't love it.
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center gap-2.5">
                <Truck size={18} className="text-[#2563EB] flex-shrink-0" />
                <span>
                  <strong>Fast US Dispatch:</strong> Ships in 24h from US hubs. Arrives in 2–4 business days via USPS.
                </span>
              </div>
            </div>

            {/* Product Deep Information Accordions */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              {/* Accordion 1: Description & Key Features */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'desc' ? '' : 'desc')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F2942] cursor-pointer"
                >
                  <span>Product Overview & Features</span>
                  {openAccordion === 'desc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="p-4 pt-0 text-xs text-[#475569] space-y-2 leading-relaxed border-t border-[#F1F5F9]">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2 text-[#0F2942]">
                      {product.keyFeatures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Detailed Technical Specifications */}
              {product.specifications && (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F2942] cursor-pointer"
                  >
                    <span>Detailed Technical Specifications & Sizing</span>
                    {openAccordion === 'specs' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openAccordion === 'specs' && (
                    <div className="p-4 pt-0 text-xs text-[#475569] space-y-2.5 leading-relaxed border-t border-[#F1F5F9]">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                          <span className="font-bold text-[#0F2942] block">Materials:</span>
                          <span className="text-[#64748B]">{product.specifications.material}</span>
                        </div>
                        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                          <span className="font-bold text-[#0F2942] block">Dimensions:</span>
                          <span className="text-[#64748B]">{product.specifications.dimensions}</span>
                        </div>
                        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                          <span className="font-bold text-[#0F2942] block">Unit Weight:</span>
                          <span className="text-[#64748B]">{product.specifications.weight}</span>
                        </div>
                        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                          <span className="font-bold text-[#0F2942] block">In The Box:</span>
                          <span className="text-[#64748B]">{product.specifications.inTheBox}</span>
                        </div>
                      </div>
                      <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px]">
                        <span className="font-bold text-[#0F2942] block">Care & Cleaning:</span>
                        <span className="text-[#64748B]">{product.specifications.care}</span>
                      </div>
                      <div className="p-2 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE] text-[11px]">
                        <span className="font-bold text-[#1E3A8A] block">CJ Fulfillment & Dispatch:</span>
                        <span className="text-[#1E40AF]">
                          Warehouse: {product.specifications.cjWarehouse} · {product.specifications.shippingEstimate}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 3: Materials & Safety */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'materials' ? '' : 'materials')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F2942] cursor-pointer"
                >
                  <span>Pet-Safe Materials & Standards</span>
                  {openAccordion === 'materials' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'materials' && (
                  <div className="p-4 pt-0 text-xs text-[#475569] space-y-1.5 leading-relaxed border-t border-[#F1F5F9]">
                    <p>• 100% Non-toxic, BPA-free, lead-free and phthalate-free certified.</p>
                    <p>• Medical-grade and food-contact safe components where applicable.</p>
                    <p>• Engineered for bite resistance, claw endurance, and heavy daily use.</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Nationwide Shipping & Returns */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F2942] cursor-pointer"
                >
                  <span>Nationwide US Delivery & Free Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 pt-0 text-xs text-[#475569] space-y-1.5 leading-relaxed border-t border-[#F1F5F9]">
                    <p>• Orders are fulfilled across Zendrop & CJ US coast-to-coast fulfillment centers.</p>
                    <p>• Standard delivery is 2–4 business days via USPS Priority or FedEx.</p>
                    <p>• Free exchanges or full refund within 30 days of receiving your item.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Essentials Section */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#E2E8F0]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Complete the Set</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] font-serif mt-1">
                  Pairs Well Together
                </h3>
              </div>
              <button
                onClick={onBackToShop}
                className="text-xs font-bold text-[#0F2942] hover:text-[#2563EB] underline cursor-pointer"
              >
                View Catalog →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => onSelectProduct(rp)}
                  className="group flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F1F5F9] mb-3 shadow-2xs group-hover:shadow-md transition-all">
                    <img
                      src={rp.heroImage}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                    {rp.brand}
                  </span>
                  <h4 className="text-sm font-bold text-[#0F2942] group-hover:text-[#2563EB] transition-colors line-clamp-1 font-serif mt-0.5">
                    {rp.name}
                  </h4>
                  <div className="mt-1 text-sm font-black text-[#0F2942]">
                    {formatCurrency(rp.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
