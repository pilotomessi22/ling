import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Truck,
  Menu,
  X,
  Layers,
  Leaf,
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
  onOpenSupplierHub,
  onOpenAdmin,
  onSearch,
  searchQuery,
  searchResults,
  onSelectProduct,
  activeCategory = 'all',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const mainPages = [
    { label: 'Shop All', page: 'shop', category: 'all' },
    { label: '✨ Cleanup Kit Bundle', page: 'campaign' },
    { label: 'Walk & Travel', page: 'shop', category: 'Walk & Travel' },
    { label: 'Sleep & Beds', page: 'shop', category: 'Beds' },
    { label: 'Toys & Play', page: 'shop', category: 'Toys' },
    { label: 'Dining & Care', page: 'shop', category: 'Feeding' },
    { label: 'Our Story', page: 'about' },
    { label: 'Shipping & FAQ', page: 'shipping-faq' },
  ];

  const searchSuggestions = [
    'Calming Bed',
    'Quiet Fountain',
    'No-Pull Harness',
    'Organic Soft Chews',
    'Scratching Post',
    'Gentle Grooming',
  ];

  const handleCartClick = () => {
    onNavigate('cart');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs transition-all">
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          {/* Left: Mobile menu toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#475569] hover:text-[#0F2942] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Boutique Brand Logo in Royal Navy & Cobalt Blue */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0F2942] text-white flex items-center justify-center shadow-xs group-hover:bg-[#2563EB] transition-colors duration-300 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white" viewBox="0 0 24 24">
                  <circle cx="6.5" cy="8.5" r="2.2" />
                  <circle cx="11" cy="6.2" r="2.2" />
                  <circle cx="15.5" cy="6.2" r="2.2" />
                  <circle cx="20" cy="8.5" r="2.2" />
                  <path d="M13.25 10.5C9.5 10.5 7.5 13.5 7.5 16.5C7.5 19 9.5 21 13.25 21C17 21 19 19 19 16.5C19 13.5 17 10.5 13.25 10.5Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0F2942] font-serif">
                    LING
                  </span>
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-[#2563EB] font-serif">
                    PETSHOP
                  </span>
                </div>
                <span className="text-[10px] font-semibold tracking-widest text-[#64748B] uppercase mt-0.5 hidden sm:block">
                  Nationwide US · Modern Pet Essentials
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Multi-Page Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainPages.map((link) => {
              const isCurrent =
                (currentPage === link.page && (!link.category || activeCategory === link.category)) ||
                (currentPage === 'home' && link.label === 'Shop All' && false);
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.page, link.category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#0F2942] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0F2942] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden xl:flex flex-1 max-w-xs relative">
            <div className="flex w-full items-center bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-full border border-[#E2E8F0] px-3.5 py-1.5 transition-all focus-within:bg-white focus-within:border-[#2563EB]">
              <Search size={14} className="text-[#94A3B8] ml-1 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search pet essentials..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-transparent text-xs text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
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
                className="absolute left-0 right-0 top-12 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-4 z-50 text-[#0F172A]"
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
                          className="flex items-center gap-3 py-2 px-1 hover:bg-[#F8FAFC] rounded-xl cursor-pointer"
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
                          className="text-xs bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] px-2.5 py-1 rounded-full cursor-pointer"
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

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileMenuOpen(false);
              }}
              className="xl:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#475569] hover:text-[#0F2942] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
              aria-label="Search items"
            >
              <Search size={20} />
            </button>

            {/* Quick Track link (Desktop) */}
            <button
              onClick={onOpenTracking}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0F2942] transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-[#F1F5F9]"
            >
              <Truck size={14} className="text-[#2563EB]" />
              <span>Track Order</span>
            </button>


            {/* Shopping Bag Pill */}
            <button
              onClick={handleCartClick}
              className="relative bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-full flex items-center gap-2 shadow-sm transition-all transform active:scale-95 cursor-pointer group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag size={18} className="text-white group-hover:scale-105 transition-transform" />
              <span className="text-xs sm:text-sm font-bold hidden xs:inline">
                {cartCount > 0 ? formatCurrency(cartTotal) : 'Bag'}
              </span>
              {cartCount > 0 && (
                <span className="bg-[#2563EB] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="xl:hidden bg-white border-t border-[#E2E8F0] px-4 py-3 shadow-md animate-in slide-in-from-top">
          <div className="flex items-center bg-[#F1F5F9] rounded-2xl px-3.5 py-2 border border-[#CBD5E1]">
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
              <button
                onClick={() => onSearch('')}
                className="px-2 text-[#94A3B8] text-xs font-bold"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="ml-2 text-xs font-bold text-[#2563EB]"
            >
              Done
            </button>
          </div>

          {/* Quick search tags */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            {searchSuggestions.slice(0, 4).map((sug) => (
              <button
                key={sug}
                onClick={() => {
                  onSearch(sug);
                  setMobileSearchOpen(false);
                }}
                className="text-[11px] bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#334155] px-2.5 py-1 rounded-full border border-[#E2E8F0]"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] shadow-xl p-4 animate-in slide-in-from-top max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Navigation</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#64748B] hover:text-[#0F2942] p-1.5">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {mainPages.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigate(link.page, link.category);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-semibold p-3.5 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center ${
                  currentPage === link.page && (!link.category || activeCategory === link.category)
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F2942] border border-[#E2E8F0]'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Direct Cart link in mobile */}
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm font-bold p-3.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-between min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <span>Shopping Bag</span>
              </div>
              <span className="text-xs">{cartCount} items · {formatCurrency(cartTotal)}</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="text-left text-xs font-semibold text-[#475569] flex items-center gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] min-h-[44px]"
            >
              <Truck size={16} className="text-[#2563EB]" />
              <span>Track Order Status (USPS Live)</span>
            </button>

          </div>
        </div>
      )}
    </header>
  );
};
