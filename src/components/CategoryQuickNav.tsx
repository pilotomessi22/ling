import React from 'react';

interface CategoryQuickNavProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryQuickNav: React.FC<CategoryQuickNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const circles = [
    {
      id: 'Dogs',
      title: 'Dog Essentials',
      sub: 'Beds, Gear & Toys',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
      badge: 'Bestseller',
      badgeClass: 'bg-[#C86446]',
    },
    {
      id: 'Cats',
      title: 'Cat Comfort',
      sub: 'Scratchers & Tech',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      badge: 'Popular',
      badgeClass: 'bg-[#4E664D]',
    },
    {
      id: 'Beds',
      title: 'Calming Beds',
      sub: 'Orthopedic Donut',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=300&q=80',
      badge: '-35% OFF',
      badgeClass: 'bg-[#C86446]',
    },
    {
      id: 'Walk & Travel',
      title: 'Zero-Pull Gear',
      sub: 'Harnesses & Leashes',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'Toys',
      title: 'Enrichment Toys',
      sub: 'Interactive Chews',
      image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'Grooming',
      title: 'Grooming & Spa',
      sub: 'Gentle Care',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'Wellness',
      title: 'Daily Wellness',
      sub: 'Vet Reviewed',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80',
      badge: 'Holistic',
      badgeClass: 'bg-[#4E664D]',
    },
    {
      id: 'Deals',
      title: 'Curated Deals',
      sub: 'Save up to 40%',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=300&q=80',
      badge: 'Limited',
      badgeClass: 'bg-[#C86446]',
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C86446]">
              Browse Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2724] tracking-tight mt-0.5">
              Explore by Natural Need
            </h2>
            <p className="text-xs sm:text-sm text-[#766E65] mt-1">
              Curated veterinarian-approved pet essentials backed by fast USPS US delivery
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-[#C86446] hover:text-[#B55539] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All Curated Essentials</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-5 text-center">
          {circles.map((item) => {
            const isSelected = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectCategory(item.id);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 focus:outline-none"
              >
                <div
                  className={`relative w-16 h-16 sm:w-22 sm:h-22 rounded-full overflow-hidden p-1 transition-all ${
                    isSelected
                      ? 'ring-3 ring-[#C86446] ring-offset-2 shadow-md bg-white'
                      : 'border-2 border-[#E0D8CC] group-hover:border-[#C86446] shadow-2xs bg-white'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-500"
                  />
                  {item.badge && (
                    <span
                      className={`absolute bottom-0 inset-x-0 text-white text-[8px] sm:text-[9px] font-bold uppercase py-0.5 tracking-tighter ${
                        item.badgeClass || 'bg-[#C86446]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`mt-2.5 text-xs font-bold tracking-tight leading-tight line-clamp-1 ${
                    isSelected ? 'text-[#C86446]' : 'text-[#2C2724] group-hover:text-[#C86446]'
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-[10px] text-[#8E867C] hidden sm:block mt-0.5">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
