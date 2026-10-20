import React, { useState } from 'react';
import { Star, CheckCircle, Heart, Sparkles, Instagram, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { REVIEWS } from '../data/storeData.ts';

export const VerifiedReviewsWall: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'dogs' | 'cats'>('all');

  const instagramPosts = [
    {
      id: 'ig-1',
      pet: 'Barnaby (Golden Retriever)',
      location: 'Austin, TX',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      caption: 'Barnaby has not left his Cloud9 bed since it arrived on Tuesday. Pure bliss! 🐾✨',
      handle: '@barnaby_austin_dog',
      product: 'Cloud9 Donut Bed',
    },
    {
      id: 'ig-2',
      pet: 'Mochi (Scottish Fold)',
      location: 'Denver, CO',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      caption: 'Finally a water fountain that is whisper-quiet and doesn’t scare our shy boy Mochi!',
      handle: '@mochi_the_fold',
      product: 'Ultra-Quiet Ceramic Fountain',
    },
    {
      id: 'ig-3',
      pet: 'Koa & Luna (Aussies)',
      location: 'Seattle, WA',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
      caption: 'Trail morning with the zero-pull tactical harnesses. Zero chafing and perfect control. 🌲',
      handle: '@koa_luna_aussies',
      product: 'Zero-Pull Ergo Harness',
    },
    {
      id: 'ig-4',
      pet: 'Cooper (French Bulldog)',
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
      caption: 'Thunderstorm prep with the natural hemp calming chews. He slept like an angel.',
      handle: '@cooper_frenchie_chi',
      product: 'Organic Calming Soft Chews',
    },
    {
      id: 'ig-5',
      pet: 'Oliver (Tabby Rescue)',
      location: 'Miami, FL',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
      caption: 'Obsessed with the laser teaser toy! Keeps him entertained during work zoom calls.',
      handle: '@oliver_rescuelove',
      product: 'Interactive Teaser Tower',
    },
    {
      id: 'ig-6',
      pet: 'Bella (Corgi)',
      location: 'San Diego, CA',
      image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
      caption: 'No more fur storms in the house! The quiet deshedding vacuum brush is magic. 🪄',
      handle: '@bella_corgi_adventures',
      product: 'Pet Grooming Vacuum Pro',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title (Wix Studio Style) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F9EDE8] border border-[#F2D7CD] text-[#C86446] text-xs font-semibold uppercase tracking-wider mb-3">
            <Instagram size={13} />
            <span>@LingPetshop Community</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[#E0A96D] mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-[#E0A96D] text-[#E0A96D]" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2C2724] tracking-tight">
            Loved by 85,000+ Pets Across the USA
          </h2>
          <p className="text-sm text-[#766E65] mt-2">
            Real stories and unedited customer photos from Austin, Denver, Seattle, Chicago, and all 50 states.
          </p>
        </div>

        {/* 1. Instagram Real Pets Gallery Carousel */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2C2724] uppercase tracking-wider">
                Real Customer Fur Babies
              </span>
              <span className="text-xs text-[#8E867C]">· Tag #LingPetshop to be featured</span>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C86446] hover:text-[#B55539] flex items-center gap-1"
            >
              <span>Follow @LingPetshop</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-[#EAE4DB] border border-[#E8E2D7] shadow-2xs hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={post.image}
                  alt={post.pet}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end text-white text-left">
                  <p className="text-[11px] font-bold leading-tight">{post.pet}</p>
                  <p className="text-[9px] text-[#D7D0C5]">{post.location}</p>
                  <p className="text-[10px] text-amber-200 mt-1 line-clamp-2">{post.product}</p>
                </div>
                <div className="absolute top-2 right-2 p-1 rounded-full bg-black/40 backdrop-blur-xs text-white group-hover:opacity-0 transition-opacity">
                  <Instagram size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#E8E2D7] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Verified badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#E0A96D]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#E0A96D] text-[#E0A96D]" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#4E664D] bg-[#EDF3EC] px-2.5 py-0.5 rounded-full border border-[#D5E4D4]">
                    <CheckCircle size={11} className="text-[#4E664D]" /> Verified
                  </span>
                </div>

                {/* Review Title */}
                <h4 className="text-sm font-bold text-[#2C2724] leading-snug mb-2 font-serif">
                  "{rev.title}"
                </h4>

                {/* Review Body */}
                <p className="text-xs text-[#686057] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 mt-5 border-t border-[#F0EBE3] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#2C2724]">
                    {rev.author}
                  </p>
                  <p className="text-[11px] text-[#8E867C]">
                    {rev.location} · {rev.petName} ({rev.petBreed})
                  </p>
                </div>
                <span className="text-[10px] text-[#A8A196] font-medium">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
