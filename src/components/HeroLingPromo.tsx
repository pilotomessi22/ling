import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck, ArrowRight, Heart, Star, Leaf } from 'lucide-react';

interface HeroLingPromoProps {
  onSelectCategory: (category: string) => void;
  onOpenPromoCode?: (code: string) => void;
}

export const HeroLingPromo: React.FC<HeroLingPromoProps> = ({
  onSelectCategory,
  onOpenPromoCode,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'organic-wellness',
      badge: 'Austin Natural Pet Living',
      badgeType: 'sage',
      headline: 'Holistic Comfort,',
      headlineAccent: 'Crafted For Deep Pet Joy.',
      subhead:
        'Veterinarian-approved orthopedic calming beds, whisker-friendly ceramic fountains, and ergonomic non-toxic walking gear. Thoughtfully designed in Austin, Texas for pet wellness and everyday calm.',
      primaryBtn: 'Explore Calming Beds',
      primaryCat: 'Beds',
      secondaryBtn: 'View Natural Collection',
      secondaryCat: 'all',
      tag: 'Dispatched within 24h via USPS Ground Advantage',
      image:
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Golden Retriever resting happily in orthopedic calming bed with warm natural light',
      floatingReview: '“The Cloud9 bed eliminated my rescue dog’s nightly anxiety. Organic comfort at its finest!”',
      reviewerName: 'Sarah M. · Austin, TX',
      petTag: 'Verified Pet Parent · Golden Retriever',
    },
    {
      id: 'repeat-wellness',
      badge: 'Special Coupon · Code LING20',
      badgeType: 'terracotta',
      headline: '20% OFF Everything,',
      headlineAccent: 'Pure Pet Wellness.',
      subhead:
        'Organic calming soft chews, fresh water fountain filters, and natural dental care for your pets. Apply promo code LING20 at checkout for an instant 20% discount on your order.',
      primaryBtn: 'Discover Wellness Chews',
      primaryCat: 'Wellness',
      secondaryBtn: 'View All 25+ Products',
      secondaryCat: 'all',
      tag: 'Use coupon LING20 at checkout for instant 20% savings',
      image:
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Happy healthy dog with natural calming chew treats in sunny park',
      floatingReview: '“Remarkable difference in coat shine and joint agility in just three weeks.”',
      reviewerName: 'David K. · Dallas, TX',
      petTag: 'Verified Pet Parent · Labrador Mix',
    },
    {
      id: 'austin-heritage',
      badge: 'Fast US Fulfillment',
      badgeType: 'earth',
      headline: 'USPS Tracked Delivery &',
      headlineAccent: '30-Day Risk-Free Trial.',
      subhead:
        'Each item is inspected by hand and shipped directly from our American fulfillment hubs. If your dog or cat isn’t completely in love within 30 days, receive an instant, full refund.',
      primaryBtn: 'Shop Flagship Bestsellers',
      primaryCat: 'all',
      secondaryBtn: 'Explore Cat Comfort',
      secondaryCat: 'Cats',
      tag: 'Proudly serving 85,000+ American families with premium care',
      image:
        'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Active dog walking comfortably in ergonomic outdoor harness on green trail',
      floatingReview: '“Arrived in 3 days. Beautiful packaging and undeniably superior craftsmanship.”',
      reviewerName: 'Emily R. · Denver, CO',
      petTag: 'Verified Pet Parent · Australian Shepherd',
    },
  ];

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F6F1EA] to-[#FAF7F2] text-[#2C2724] border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Content Column (Wix Studio Editorial Style) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 text-left">
            {/* Pill Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs font-semibold uppercase px-3.5 py-1 rounded-full tracking-wide flex items-center gap-1.5 border shadow-2xs ${
                  slide.badgeType === 'sage'
                    ? 'bg-[#EDF3EC] text-[#4E664D] border-[#D5E4D4]'
                    : slide.badgeType === 'terracotta'
                    ? 'bg-[#F9EDE8] text-[#C86446] border-[#F2D7CD]'
                    : 'bg-[#F3EFEA] text-[#554D45] border-[#E0D8CC]'
                }`}
              >
                <Leaf size={13} />
                {slide.badge}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#766E65] bg-white/80 px-2.5 py-1 rounded-full border border-[#E8E2D7]">
                <Star size={12} className="text-[#E0A96D] fill-[#E0A96D]" />
                4.9/5.0 from 1,240+ verified US reviews
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2C2724] leading-[1.12] mb-5 font-sans">
              {slide.headline}{' '}
              <span className="text-[#C86446] block sm:inline font-serif italic font-normal">
                {slide.headlineAccent}
              </span>
            </h1>

            {/* Subhead with Warm Tone */}
            <p className="text-base sm:text-lg text-[#686057] mb-8 leading-relaxed max-w-2xl">
              {slide.subhead}
            </p>

            {/* Action CTA Buttons in Wix Pill Design */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={() => onSelectCategory(slide.primaryCat)}
                className="w-full sm:w-auto bg-[#C86446] hover:bg-[#B55539] text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>{slide.primaryBtn}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectCategory(slide.secondaryCat)}
                className="w-full sm:w-auto bg-white hover:bg-[#F3EFEA] text-[#2C2724] font-semibold text-sm px-6 py-3.5 rounded-full border border-[#D5CDC0] shadow-2xs transition-all cursor-pointer text-center"
              >
                {slide.secondaryBtn}
              </button>
            </div>

            {/* Reassurance Micro-banner */}
            <div className="flex items-center gap-4 text-xs text-[#766E65] pt-4 border-t border-[#E8E2D7]/80 w-full">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck size={14} className="text-[#C86446]" />
                <span>{slide.tag}</span>
              </div>
              <span className="text-[#C2BAAE]">•</span>
              <div className="hidden md:flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-[#4E664D]" />
                <span>30-Day Pet Happiness Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Immersive Visual Frame (Wix Studio Organic Card) */}
          <div className="lg:col-span-5 relative w-full">
            {/* Visual Photo Card */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] group bg-[#EAE4DB]">
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim for subtle contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              {/* Floating Review Card (Wix Glassmorphism Style) */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/80 shadow-lg text-[#2C2724]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-[#E0A96D]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#E0A96D]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-[#4E664D] bg-[#EDF3EC] px-2 py-0.5 rounded-full border border-[#D5E4D4]">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4A443E] italic leading-snug mb-2 font-serif">
                  {slide.floatingReview}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#F0EBE3]">
                  <span className="font-semibold text-[#2C2724]">{slide.reviewerName}</span>
                  <span className="text-[#8E867C]">{slide.petTag}</span>
                </div>
              </div>
            </div>

            {/* Subtle Slide Controls */}
            <div className="flex items-center justify-between mt-5 px-2">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-[#C86446]' : 'w-2 bg-[#D5CDC0] hover:bg-[#A8A196]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                  }
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F3EFEA] border border-[#DFD8CC] text-[#4A443E] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % slides.length)
                  }
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F3EFEA] border border-[#DFD8CC] text-[#4A443E] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
