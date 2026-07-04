import { ArrowRight, Wrench, Sparkles, Hammer, Snowflake, Shield, Lock, Sofa, Droplets, Sun } from 'lucide-react';
import { CATEGORIES, QUICK_SERVICES } from '../data';
import { Category } from '../types';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export default function Categories({ onSelectCategory, onOpenBooking }: CategoriesProps) {
  
  // Icon selector helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'wrench':
        return <Wrench className="w-5 h-5 text-[#102050]" />;
      case 'spray':
        return <Sparkles className="w-5 h-5 text-[#102050]" />;
      case 'hammer':
        return <Hammer className="w-5 h-5 text-[#102050]" />;
      default:
        return <Wrench className="w-5 h-5 text-[#102050]" />;
    }
  };

  const getQuickServiceIcon = (icon: string) => {
    switch (icon) {
      case 'snowflake':
        return <Snowflake className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
      case 'lock':
        return <Lock className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
      case 'sofa':
        return <Sofa className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
      case 'droplet':
        return <Droplets className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
      case 'sun':
        return <Sun className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
      default:
        return <Wrench className="w-6 h-6 text-[#102050] group-hover:text-[#f1b42f] transition-colors" />;
    }
  };

  const handleCardClick = (category: Category) => {
    onSelectCategory(category.name);
    const element = document.getElementById('pros-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-20 border-b border-gray-50" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12" id="categories-header-row">
          <div id="categories-title-group">
            <span className="text-[11px] font-bold text-[#102050] tracking-widest uppercase block mb-2 leading-none">
              BROWSE BY CATEGORY
            </span>
            <h2 className="font-display font-extrabold text-[#102050] text-3xl sm:text-4xl tracking-tight">
              Everything Your Home Needs
            </h2>
          </div>
          <button 
            onClick={() => onOpenBooking()}
            className="flex items-center gap-1.5 text-sm font-bold text-[#102050] hover:text-[#f1b42f] transition-colors cursor-pointer group"
            id="view-all-categories-btn"
          >
            View all 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3 Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="categories-grid">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleCardClick(cat)}
              className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
              id={`category-card-${cat.id}`}
            >
              {/* Card Image with Badges */}
              <div className="relative h-48 overflow-hidden bg-gray-50 shrink-0" id={`category-image-container-${cat.id}`}>
                <img 
                  src={cat.imageUrl} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  id={`category-image-${cat.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                {cat.label && (
                  <span 
                    className={`absolute top-4 left-4 px-3 py-1 rounded text-xs font-bold shadow-sm ${
                      cat.label === 'Most Booked' 
                        ? 'bg-[#f1b42f] text-[#102050]' 
                        : 'bg-emerald-500 text-white'
                    }`}
                    id={`category-label-${cat.id}`}
                  >
                    {cat.label}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between" id={`category-body-${cat.id}`}>
                <div id={`category-details-${cat.id}`}>
                  {/* Category Title with Icon */}
                  <div className="flex items-center gap-2.5 mb-3.5" id={`category-title-wrap-${cat.id}`}>
                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center" id={`category-icon-box-${cat.id}`}>
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <h3 className="font-display font-bold text-[#102050] text-lg" id={`category-title-text-${cat.id}`}>
                      {cat.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed font-normal mb-5" id={`category-desc-${cat.id}`}>
                    {cat.description}
                  </p>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6" id={`category-tags-${cat.id}`}>
                    {cat.popularTags.map((tag, idx) => (
                      <button 
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(tag);
                          const element = document.getElementById('pros-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-xs font-semibold text-gray-600 hover:text-[#102050] hover:bg-[#f1b42f]/10 bg-gray-50 px-2.5 py-1 rounded border border-gray-100 hover:border-[#f1b42f]/30 transition-colors cursor-pointer"
                        id={`category-tag-${cat.id}-${idx}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto" id={`category-footer-${cat.id}`}>
                  <span className="text-xs text-gray-400 font-medium" id={`category-pricing-${cat.id}`}>
                    Starts from <strong className="text-sm text-[#102050] font-extrabold ml-1">₹{cat.startingPrice}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500 group-hover:text-[#f1b42f] transition-colors" id={`category-explore-${cat.id}`}>
                    Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Horizontal Quick-Links Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" id="quick-services-grid">
          {QUICK_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectCategory(srv.name);
                const element = document.getElementById('pros-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
              id={`quick-service-${idx}`}
            >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 transition-colors group-hover:bg-[#f1b42f]/10" id={`quick-service-icon-box-${idx}`}>
                {getQuickServiceIcon(srv.icon)}
              </div>
              <span className="text-xs font-bold text-[#102050]" id={`quick-service-text-${idx}`}>
                {srv.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
