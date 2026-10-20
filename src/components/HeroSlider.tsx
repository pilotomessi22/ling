import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

interface HeroSliderProps {
  onApplyCoupon?: (code: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onApplyCoupon }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const slides = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1800&q=85',
      mobileImage:
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=85',
      alt: 'Ling Petshop US - Orthopedic Calming Essentials - 20% OFF with code LING20',
      coupon: 'LING20',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1800&q=85',
      mobileImage:
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=85',
      alt: 'Nationwide US Delivery - Fast 2-4 Days via USPS Ground Advantage',
      coupon: 'FREEUSPS',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCopyCoupon = (e: React.MouseEvent, coupon: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon);
    setCopied(true);
    if (onApplyCoupon) onApplyCoupon(coupon);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black group select-none">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative bg-black flex items-center justify-center">
            <picture className="w-full">
              <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-auto object-cover max-h-[520px]"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>

            {/* Quick coupon copy bubble overlay when on slide 1 */}
            {slide.coupon && (
              <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 sm:left-14 sm:translate-x-0 z-20">
                <button
                  onClick={(e) => handleCopyCoupon(e, slide.coupon!)}
                  className="flex items-center gap-2 bg-[#00d864] hover:bg-[#00c055] text-black font-extrabold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg border-2 border-black transition-transform hover:scale-105 active:scale-95"
                >
                  <span>CUPOM: {slide.coupon}</span>
                  {copied ? (
                    <span className="flex items-center gap-1 text-black font-black bg-white px-2 py-0.5 rounded-full text-[10px]">
                      <Check size={12} /> COPIADO!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-black bg-white/80 px-2 py-0.5 rounded-full text-[10px]">
                      <Copy size={11} /> COPIAR
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === idx
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
