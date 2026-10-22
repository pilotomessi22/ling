import React, { useState, useEffect } from 'react';
import { TopAnnouncementBar } from './components/TopAnnouncementBar.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { DropshipSupplierModal } from './components/DropshipSupplierModal.tsx';
import { TrackingModal } from './components/TrackingModal.tsx';
import { PolicyModal } from './components/PolicyModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';

// Dedicated Ling Petshop Multi-Page Views
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ShippingFaqPage } from './pages/ShippingFaqPage.tsx';

import { PRODUCTS, Product, getSavedProducts } from './data/storeData.ts';
import { CartItem, filterProducts, calculateOrderTotals } from './utils/storeLogic.ts';
import { initSiteSecurity } from './utils/security.ts';
import { initAutomatedInventorySync } from './utils/inventorySync.ts';

export default function App() {
  // Live dynamic product catalog (including manually added CJ/supplier products)
  const [products, setProducts] = useState<Product[]>(() => getSavedProducts());

  // Automated 60-second background inventory sync with Zendrop Supplier API
  useEffect(() => {
    return initAutomatedInventorySync();
  }, []);

  useEffect(() => {
    const handleProductsUpdated = () => {
      const updated = getSavedProducts();
      setProducts(updated);
      setSelectedProduct((prev) => {
        if (!prev) return updated[0] || null;
        const matching = updated.find((p) => p.id === prev.id);
        return matching || updated[0] || null;
      });
      // Synchronize cart items with live supplier stock levels
      setCartItems((prevCart) =>
        prevCart.map((item) => {
          const fresh = updated.find((p) => p.sku === item.sku || p.name === item.name || p.id === item.productId);
          return fresh
            ? {
                ...item,
                stockCount: fresh.stockCount,
                inStock: fresh.stockCount > 0 && fresh.inStockAustin !== false,
                productId: fresh.id,
              }
            : item;
        })
      );
    };
    window.addEventListener('ling_products_updated', handleProductsUpdated);
    return () => window.removeEventListener('ling_products_updated', handleProductsUpdated);
  }, []);

  // Navigation Route State: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'about' | 'shipping-faq'
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace('#', '');
      const target = hash || path;
      if (['campaign', 'cleanup-kit', 'bundle'].includes(target)) {
        return 'product';
      }
      if (['shop', 'cart', 'checkout', 'about', 'shipping-faq', 'faq', 'story'].includes(target)) {
        if (target === 'faq') return 'shipping-faq';
        if (target === 'story') return 'about';
        return target;
      }
    }
    return 'home';
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const list = getSavedProducts();
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace('#', '');
      const target = hash || path;
      if (['campaign', 'cleanup-kit', 'bundle'].includes(target)) {
        const bundle = list.find((p) => p.isCampaignBundle || p.id === 'ultimate-pet-cleanup-kit');
        if (bundle) return bundle;
      }
    }
    return list[0] || PRODUCTS[0] || null;
  });

  // Cart items state - start with fresh empty cart for real shoppers
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [appliedPromo, setAppliedPromo] = useState('LING20');

  // Admin and Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hash === '#admin' || window.location.pathname === '/admin')
    );
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSupplierHubOpen, setIsSupplierHubOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

  // Search state using live dynamic products list
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = filterProducts(products, searchQuery);

  // Initialize Site Security & Shielding ("Blindagem 100%")
  useEffect(() => {
    return initSiteSecurity();
  }, []);

  // Synchronize route & history state
  useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace('#', '');
      const target = hash || path;
      if (target === 'admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      } else if (['campaign', 'cleanup-kit', 'bundle'].includes(target)) {
        const bundle = products.find((p) => p.isCampaignBundle || p.id === 'ultimate-pet-cleanup-kit');
        if (bundle) {
          setSelectedProduct(bundle);
          setCurrentPage('product');
        }
      } else if (['shop', 'cart', 'checkout', 'about', 'shipping-faq', 'faq', 'story'].includes(target)) {
        if (target === 'faq') setCurrentPage('shipping-faq');
        else if (target === 'story') setCurrentPage('about');
        else setCurrentPage(target);
      } else if (!target || target === '' || path === '') {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [products]);

  // Multi-Page Navigation Handler
  const handleNavigate = (page: string, category?: string) => {
    if (page === 'campaign') {
      const bundle = products.find((p) => p.isCampaignBundle || p.id === 'ultimate-pet-cleanup-kit');
      if (bundle) {
        handleSelectProduct(bundle);
        window.history.pushState(null, '', '/product');
        return;
      }
    }
    setCurrentPage(page);
    if (category) {
      setActiveCategory(category);
    }
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newPath = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', newPath);
  };

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setCurrentPage('product');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (newItem: {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    isRepeatDelivery?: boolean;
    image: string;
    supplierCost: number;
    stockCount?: number;
    inStock?: boolean;
    productId?: string;
  }) => {
    if (newItem.stockCount === 0 || newItem.inStock === false) {
      alert(`O produto "${newItem.name}" está esgotado no armazém central e indisponível para compra.`);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.sku === newItem.sku &&
          i.size === newItem.size &&
          i.color === newItem.color &&
          Boolean(i.isRepeatDelivery) === Boolean(newItem.isRepeatDelivery)
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [
        ...prev,
        {
          ...newItem,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const { total: cartTotal } = calculateOrderTotals(cartItems, appliedPromo);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#2563EB] selection:text-white w-full max-w-full overflow-x-hidden relative">
      {/* Main Floating Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        cartTotal={cartTotal}
        onOpenCart={() => handleNavigate('cart')}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSupplierHub={() => setIsSupplierHubOpen(true)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = '#admin';
        }}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSelectProduct={handleSelectProduct}
        activeCategory={activeCategory}
      />

      {/* Main Multi-Page Body Content */}
      <main className="flex-grow pb-18 lg:pb-0">
        {/* If user is searching via search bar */}
        {searchQuery.trim().length > 0 ? (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2942] tracking-tight">
                  Search Results for: "{searchQuery}"
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-light">
                  Found {searchResults.length} pet product(s) matching your inquiry
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl mt-6 border border-[#E2E8F0] shadow-2xs">
                <p className="text-base font-bold text-[#0F2942] font-serif">
                  No matching pet products found.
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  Try checking your spelling or browse our categorized collections.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleNavigate('shop', 'all');
                  }}
                  className="mt-5 bg-[#0F2942] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-[#1E3A8A] transition-all"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-8">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="group flex flex-col cursor-pointer transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F1F5F9] mb-3 shadow-2xs group-hover:shadow-xl transition-all duration-300 border border-[#E2E8F0]">
                      <img
                        src={p.heroImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                      {p.brand && !p.brand.includes('Fable') ? p.brand : 'Ling Petshop'} · {p.category}
                    </span>
                    <h3 className="text-base font-bold text-[#0F2942] group-hover:text-[#2563EB] mt-1 transition-colors leading-snug line-clamp-2 font-serif">
                      {p.name}
                    </h3>
                    <div className="pt-2 mt-2 border-t border-[#E2E8F0] flex items-baseline justify-between">
                      <span className="text-lg font-black text-[#0F2942]">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-[#2563EB]">
                        View Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : currentPage === 'cart' ? (
          /* PAGE: DEDICATED SHOPPING CART PAGE */
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            appliedPromo={appliedPromo}
            onApplyPromo={(code) => setAppliedPromo(code)}
            onProceedToCheckout={() => handleNavigate('checkout')}
            onContinueShopping={() => handleNavigate('shop', 'all')}
          />
        ) : currentPage === 'checkout' ? (
          /* PAGE: DEDICATED CHECKOUT & STRIPE PAYMENT PAGE */
          <CheckoutPage
            items={cartItems}
            appliedPromo={appliedPromo}
            onClearCart={handleClearCart}
            onReturnToCart={() => handleNavigate('cart')}
            onReturnToHome={() => handleNavigate('home')}
          />
        ) : currentPage === 'shop' ? (
          /* PAGE: DEDICATED SHOP / CATALOG PAGE */
          <ShopPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={(p) => {
              if (p.stockCount === 0 || p.inStockAustin === false) {
                alert(`O produto "${p.name}" está temporariamente esgotado no fornecedor Zendrop e indisponível para compra.`);
                return;
              }
              handleAddToCart({
                sku: p.sku,
                name: p.name,
                price: p.price,
                quantity: 1,
                size: p.sizes ? p.sizes[0].name : 'Standard',
                color: p.colors ? p.colors[0].name : 'Default',
                isRepeatDelivery: false,
                image: p.heroImage,
                supplierCost: p.supplierCost,
                stockCount: p.stockCount,
                inStock: p.stockCount > 0,
                productId: p.id,
              });
            }}
            initialCategory={activeCategory}
          />
        ) : currentPage === 'product' && selectedProduct ? (
          /* PAGE: FULL DEDICATED PRODUCT DETAIL PAGE (PDP) */
          <ProductDetailPage
            product={selectedProduct}
            onBackToShop={() => handleNavigate('shop', activeCategory)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigateToCart={() => handleNavigate('cart')}
          />
        ) : currentPage === 'about' ? (
          /* PAGE: OUR STORY / ABOUT PAGE */
          <AboutPage onNavigateToShop={() => handleNavigate('shop', 'all')} />
        ) : currentPage === 'shipping-faq' ? (
          /* PAGE: NATIONWIDE US SHIPPING & FAQ */
          <ShippingFaqPage
            onOpenTracking={() => setIsTrackingOpen(true)}
            onNavigateToShop={() => handleNavigate('shop', 'all')}
          />
        ) : (
          /* PAGE: CLEAN & MINIMALIST HOME PAGE */
          <HomePage
            onNavigateToShop={(cat) => handleNavigate('shop', cat || 'all')}
            onOpenPromo={(code) => {
              setAppliedPromo(code);
              handleNavigate('cart');
            }}
            onOpenCampaign={() => {
              const bundle = products.find((p) => p.isCampaignBundle || p.id === 'ultimate-pet-cleanup-kit');
              if (bundle) {
                handleSelectProduct(bundle);
                window.location.hash = 'campaign';
              }
            }}
          />
        )}
      </main>

      {/* 3. Clean US Nationwide Footer in Royal Navy */}
      <Footer
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSupplierHub={() => setIsSupplierHubOpen(true)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = '#admin';
        }}
        onOpenPolicyModal={(title, content) =>
          setPolicyModal({ isOpen: true, title, content })
        }
        onNavigate={handleNavigate}
      />

      {/* Quick Cart Drawer (also accessible if toggled) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        appliedPromo={appliedPromo}
        onApplyPromo={(code) => setAppliedPromo(code)}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          handleNavigate('checkout');
        }}
      />

      {/* Quick Checkout Modal (fallback modal for fast checkouts) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedPromo={appliedPromo}
        onClearCart={handleClearCart}
      />

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Dropship Supplier Hub for Store Owner */}
      <DropshipSupplierModal
        isOpen={isSupplierHubOpen}
        onClose={() => setIsSupplierHubOpen(false)}
      />

      {/* Legal & Policy Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        title={policyModal.title}
        content={policyModal.content}
        onClose={() =>
          setPolicyModal({ isOpen: false, title: '', content: '' })
        }
      />


      {/* Dedicated Store Owner Admin Panel */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.location.hash = '';
            }
          }}
        />
      )}

      {/* Mobile Floating Bottom Navigation (Thumb Zone) */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />
    </div>
  );
}
