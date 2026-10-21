import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Truck,
  X,
  MoreVertical,
  Sparkles,
  ChevronRight,
  Package,
  ShoppingBasket,
  HelpCircle,
  Info,
} from 'lucide-react';
import { Product } from '../data/storeData.ts';
import { formatCurrency } from '../utils/storeLogic.ts';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, category?: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSupplierHub: () => void;
  onOpenAdmin?: () => void;
  onSearch: (q: string) => void;
  searchQuery: string;
  searchResults: Product[];
  onSelectProduct: (p: Product) => void;
  onFilterCategory?: (cat: string) => void;
  activeCategory?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracking,
  onSearch,
  searchQuery,
  searchResults,
  onSelectProduct,
  activeCategory = 'all',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainPages = [
    { label: 'Shop All Products', page: 'shop', category: 'all', icon: ShoppingBasket },
    { label: 'Ultimate Pet Cleanup Kit', page: 'campaign', isSpecial: true, icon: Sparkles },
    { label: 'Walk & Travel', page: 'shop', category: 'Walk & Travel', icon: Package },
    { label: 'Sleep & Beds', page: 'shop', category: 'Beds', icon: Package },
    { label: 'Toys & Play', page: 'shop', category: 'Toys', icon: Package },
    { label: 'Dining & Care', page: 'shop', category: 'Feeding', icon: Package },
    { label: 'Our Story', page: 'about', icon: Info },
    { label: 'Shipping & FAQ', page: 'shipping-faq', icon: HelpCircle },
  ];

  const searchSuggestions = [
    'Cleanup Kit',
    'Calming Bed',
    'Quiet Fountain',
    'Grooming Gloves',
    'Paw Cleaner',
    'Zepetz Hair Remover',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs transition-all w-full">
      {/* Main Container - Desktop Clean Centered Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4 sm:gap-8">
          
          {/* 1. Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0F2942] text-white flex items-center justify-center shadow-xs group-hover:bg-[#2563EB] transition-colors duration-300 flex-shrink-0">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <circle cx="6.5" cy="8.5" r="2.2" />
                <circle cx="11" cy="6.2" r="2.2" />
                <circle cx="15.5" cy="6.2" r="2.2" />
                <circle cx="20" cy="8.5" r="2.2" />
                <path d="M13.25 10.5C9.5 10.5 7.5 13.5 7.5 16.5C7.5 19 9.5 21 13.25 21C17 21 19 19 19 16.5C19 13.5 17 10.5 13.25 10.5Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F2942] font-serif">
                  LING
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#2563EB] font-serif">
                  PETSHOP
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-[#64748B] uppercase mt-0.5 hidden sm:block">
                Modern Pet Essentials
              </span>
            </div>
          </button>

          {/* 2. Desktop Search Input (Clean & Centered) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="flex w-full items-center bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-full border border-[#E2E8F0] px-4 py-2 transition-all focus-within:bg-white focus-within:border-[#2563EB] focus-within:shadow-xs">
              <Search size={16} className="text-[#94A3B8] mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search pet essentials, grooming tools, beds..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-transparent text-xs text-[#0F172A] placeholder:text-[#94A3B8] outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="px-1 text-[#94A3B8] hover:text-[#0F172A] text-xs font-semibold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {searchFocused && (
              <div
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 right-0 top-12 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 z-50 text-[#0F172A]"
              >
                {searchQuery.trim().length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9]">
                      <span>Results ({searchResults.length})</span>
                      <button onClick={() => setSearchFocused(false)} className="hover:text-[#0F172A] cursor-pointer">
                        ✕
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9] mt-2">
                      {searchResults.slice(0, 5).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            onSelectProduct(prod);
                            setSearchFocused(false);
                          }}
                          className="flex items-center gap-3 py-2 px-2 hover:bg-[#F8FAFC] rounded-xl cursor-pointer"
                        >
                          <img
                            src={prod.heroImage}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-xl border border-[#E2E8F0]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#0F2942] truncate">
                              {prod.name}
                            </p>
                            <span className="text-xs text-[#2563EB] font-bold">
                              {formatCurrency(prod.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {searchSuggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => {
                            onSearch(sug);
                            setSearchFocused(false);
                          }}
                          className="text-xs bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] px-3 py-1 rounded-full cursor-pointer transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Right Action Controls: Mobile Search + Cart + 3-Dots Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0" ref={menuRef}>
            
            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setMenuOpen(false);
              }}
              className="md:hidden p-2.5 text-[#475569] hover:text-[#0F2942] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-xs transition-all transform active:scale-95 cursor-pointer group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag size={18} className="text-white group-hover:scale-105 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">
                {cartCount > 0 ? formatCurrency(cartTotal) : 'Bag'}
              </span>
              {cartCount > 0 && (
                <span className="bg-[#2563EB] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3-Dots Menu Button (...) */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setMobileSearchOpen(false);
                }}
                className={`p-2.5 rounded-full transition-all cursor-pointer border ${
                  menuOpen
                    ? 'bg-[#0F2942] text-white border-[#0F2942]'
                    : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F2942] border-[#CBD5E1]'
                }`}
                aria-label="Open menu"
                title="Open menu options"
              >
                <MoreVertical size={20} />
              </button>

              {/* 3-Dots Menu Dropdown Popover */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#F1F5F9] px-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Navigation Menu
                    </span>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F2942] hover:bg-[#F1F5F9] cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {mainPages.map((link) => {
                      const IconComp = link.icon;
                      const isCurrent =
                        currentPage === link.page && (!link.category || activeCategory === link.category);
                      return (
                        <button
                          key={link.label}
                          onClick={() => {
                            onNavigate(link.page, link.category);
                            setMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center justify-between ${
                            link.isSpecial
                              ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE]'
                              : isCurrent
                              ? 'bg-[#0F2942] text-white shadow-2xs'
                              : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F2942]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComp size={16} className={link.isSpecial ? 'text-[#2563EB]' : 'text-[#64748B]'} />
                            <span>{link.label}</span>
                          </div>
                          <ChevronRight size={14} className="opacity-60" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Order Tracking Button inside 3 Dots Menu */}
                  <div className="pt-2.5 mt-2.5 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => {
                        onOpenTracking();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F2942] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck size={16} className="text-[#2563EB]" />
                        <span>Track Order Status</span>
                      </div>
                      <span className="text-[10px] text-[#2563EB] font-bold">USPS Live</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Search Input Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0] px-4 py-3 shadow-md animate-in slide-in-from-top">
          <div className="flex items-center bg-[#F1F5F9] rounded-full px-3.5 py-2 border border-[#CBD5E1]">
            <Search size={16} className="text-[#94A3B8] mr-2 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search dog & cat essentials..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
            />
            {searchQuery && (
              <button onClick={() => onSearch('')} className="px-2 text-[#94A3B8] text-xs font-bold">
                ✕
              </button>
            )}
            <button onClick={() => setMobileSearchOpen(false)} className="ml-2 text-xs font-bold text-[#2563EB]">
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
