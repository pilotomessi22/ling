import React from 'react';
import { Home, Compass, ShoppingBag, Truck } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string, category?: string) => void;
  cartCount: number;
  onOpenTracking: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenTracking,
}) => {
  const isHome = currentPage === 'home';
  const isShop = currentPage === 'shop';
  const isCart = currentPage === 'cart';

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-1">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
            isHome ? 'text-[#0F2942]' : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
        >
          <Home size={20} className={isHome ? 'stroke-[2.5px] text-[#2563EB]' : 'stroke-[1.8px]'} />
          <span className={`text-[10px] tracking-tight mt-1 ${isHome ? 'font-bold text-[#0F2942]' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* Shop */}
        <button
          onClick={() => onNavigate('shop', 'all')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
            isShop ? 'text-[#0F2942]' : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
        >
          <Compass size={20} className={isShop ? 'stroke-[2.5px] text-[#2563EB]' : 'stroke-[1.8px]'} />
          <span className={`text-[10px] tracking-tight mt-1 ${isShop ? 'font-bold text-[#0F2942]' : 'font-medium'}`}>
            Shop
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onNavigate('cart')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 relative transition-colors cursor-pointer ${
            isCart ? 'text-[#0F2942]' : 'text-[#64748B] hover:text-[#0F2942]'
          }`}
        >
          <div className="relative">
            <ShoppingBag size={20} className={isCart ? 'stroke-[2.5px] text-[#2563EB]' : 'stroke-[1.8px]'} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#2563EB] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isCart ? 'font-bold text-[#0F2942]' : 'font-medium'}`}>
            Bag
          </span>
        </button>

        {/* Tracking */}
        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-[#64748B] hover:text-[#0F2942] transition-colors cursor-pointer"
        >
          <Truck size={20} className="stroke-[1.8px]" />
          <span className="text-[10px] font-medium tracking-tight mt-1">
            Track
          </span>
        </button>
      </div>
    </nav>
  );
};
