import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Sparkles,
  ShoppingBag,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../data/storeData.ts';
import { formatCurrency, REPEAT_DELIVERY_DISCOUNT_PERCENT } from '../utils/storeLogic.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
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
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

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

  // Sync active image if product changes
  useEffect(() => {
    setActiveImage(product.heroImage);
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].name);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
    setPurchaseType('one-time');
  }, [product]);

  const repeatPrice = product.price * (1 - REPEAT_DELIVERY_DISCOUNT_PERCENT / 100);
  const effectivePrice = purchaseType === 'repeat' ? repeatPrice : product.price;

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
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const rawImages = (
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.heroImage, product.secondaryImage]
  ).filter(Boolean) as string[];
  const images = Array.from(new Set(rawImages));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl z-10 max-h-[92vh] overflow-y-auto my-auto border border-[#E8E2D7]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#766E65] hover:text-[#2C2724] p-2 rounded-full hover:bg-white transition-all cursor-pointer shadow-2xs"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Images Gallery */}
          <div className="space-y-3">
            {/* Main Stage Image (4:5 Aspect Ratio) */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F3EDE2] shadow-sm border border-[#E8E2D7]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-[#C86446] ring-2 ring-[#C86446]/20 scale-102'
                        : 'border-[#DFD8CC] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                  </button>
                ))}
                <span className="text-xs text-[#8E867C] ml-2">Click photo to switch perspective</span>
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8E867C]">
                  {product.brand || 'Ling Petshop'} · {product.department}
                </span>
                {product.badge && (
                  <span className="bg-[#2C2724] text-[#FAF7F2] font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.isLingPick && (
                  <span className="bg-[#F9EDE8] border border-[#F2D7CD] text-[#C86446] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ★ Studio Pick
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C2724] leading-tight font-serif">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-[#E0A96D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#E0A96D] text-[#E0A96D]" />
                  ))}
                </div>
                <span className="text-xs text-[#2C2724] font-bold">
                  {product.rating} ({product.reviewsCount.toLocaleString()} verified customer reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D7]">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-[#2C2724] tracking-tight">
                  {formatCurrency(effectivePrice)}
                </span>
                {product.compareAt > effectivePrice && (
                  <span className="text-sm text-[#8E867C] line-through">
                    {formatCurrency(product.compareAt)}
                  </span>
                )}
                <span className="text-xs font-bold text-[#C86446]">
                  Save {formatCurrency(product.compareAt - effectivePrice)}
                </span>
              </div>
              <p className="text-xs text-[#766E65] mt-1.5 leading-relaxed">{product.tagline}</p>
            </div>

            {/* Promo Code LING20 Callout */}
            <div className="bg-[#EDF3EC] border border-[#D5E4D4] p-3.5 rounded-2xl flex items-center justify-between gap-2 text-xs text-[#4E664D]">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={16} className="text-[#C86446]" />
                <span>Use coupon <strong className="font-mono text-[#2C2724] bg-white px-2 py-0.5 rounded border border-[#DFD8CC]">LING20</strong> for 20% OFF!</span>
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#2C2724] block mb-1.5">
                  Select Size: <strong className="text-[#C86446]">{selectedSize}</strong>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedSize(s.name)}
                      className={`p-2.5 rounded-xl text-left text-xs border transition-all cursor-pointer ${
                        selectedSize === s.name
                          ? 'border-[#2C2724] bg-white text-[#2C2724] font-bold shadow-xs'
                          : 'border-[#DFD8CC] bg-white/60 text-[#686057] hover:bg-white'
                      }`}
                    >
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-[#8E867C]">{s.weightLabel}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#2C2724] block mb-1.5">
                  Select Color: <strong className="text-[#C86446]">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#2C2724] bg-white font-bold shadow-xs'
                          : 'border-[#DFD8CC] bg-white/60 hover:bg-white'
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

            {/* Austin 24h USPS Assurance */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E8E2D7] text-xs text-[#2C2724]">
              <Truck size={16} className="text-[#C86446] flex-shrink-0" />
              <span>
                <strong>Fast USPS Priority Shipping:</strong> Ships within 24h directly from our US fulfillment centers.
              </span>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98 ${
                added
                  ? 'bg-[#4E664D] text-white'
                  : 'bg-[#C86446] hover:bg-[#B35539] text-white'
              }`}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>Added to Shopping Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>
                    Add to Cart · {formatCurrency(effectivePrice * quantity)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
