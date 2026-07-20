import { useState, useEffect } from 'react';
import { ArrowRight, Star, CheckCircle, Phone, ChevronDown, ClipboardList } from 'lucide-react';
import { Pro } from '../types';
import { VERIFIED_PROS } from '../data';

interface VerifiedProsProps {
  searchQuery: string;
  selectedNeighborhood: string;
  onOpenBooking: (serviceName?: string, selectedPro?: Pro) => void;
  onClearSearch?: () => void;
  onClearNeighborhood?: () => void;
}

function getQuotations(category: string, startingPrice: number): { item: string; price: number }[] {
  const norm = category.toLowerCase();
  if (norm.includes('electrician')) {
    return [
      { item: 'Ceiling Fan Installation & Demo', price: startingPrice },
      { item: 'MCB Tripping Switch Repair', price: Math.round(startingPrice * 0.8) },
      { item: 'Complete Home Safety Wiring Audit', price: Math.round(startingPrice * 1.5) },
      { item: 'Inverter Installation & Battery Water', price: Math.round(startingPrice * 1.8) },
      { item: 'Wall Socket / Switchboard Replacement', price: Math.round(startingPrice * 0.5) }
    ];
  } else if (norm.includes('cleaner') || norm.includes('cleaning')) {
    return [
      { item: 'Standard Bathroom Sanitization (Per Bath)', price: startingPrice },
      { item: 'Kitchen Slab & Exhaust Deep Clean', price: Math.round(startingPrice * 1.3) },
      { item: '1 BHK Full Home Deep Cleaning Service', price: Math.round(startingPrice * 2.2) },
      { item: 'Sofa Dry Cleaning & Dust Vacuuming', price: Math.round(startingPrice * 0.9) },
      { item: 'Balcony Jet Wash & Floor Scrubbing', price: Math.round(startingPrice * 0.6) }
    ];
  } else if (norm.includes('plumber')) {
    return [
      { item: 'Tap Leakage & Washer Replacement', price: startingPrice },
      { item: 'Flush Tank Mechanism Repair / Replace', price: Math.round(startingPrice * 1.2) },
      { item: 'Kitchen Sink Clog Removal & Drain Clean', price: Math.round(startingPrice * 0.8) },
      { item: 'Water Heater / Geyser Installation', price: Math.round(startingPrice * 1.5) },
      { item: 'Overhead Water Tank Float Valve Setup', price: Math.round(startingPrice * 1.8) }
    ];
  } else if (norm.includes('ac specialist')) {
    return [
      { item: 'Split / Window AC Foam-Jet Service', price: startingPrice },
      { item: 'Gas Charging & Leakage Detection', price: Math.round(startingPrice * 3.5) },
      { item: 'AC Installation / Dismantling Charge', price: Math.round(startingPrice * 1.5) },
      { item: 'AC Condenser / Compressor Repair', price: Math.round(startingPrice * 2.5) }
    ];
  } else if (norm.includes('pest')) {
    return [
      { item: 'Standard Cockroach & Ant Eradication', price: startingPrice },
      { item: 'Bed Bugs Full Room Special Treatment', price: Math.round(startingPrice * 1.5) },
      { item: 'Termite Barrier Injection (Per Room)', price: Math.round(startingPrice * 2.0) },
      { item: 'General Insect & Spider Spraying', price: Math.round(startingPrice * 0.8) }
    ];
  } else if (norm.includes('painter')) {
    return [
      { item: 'Interior Royal Emulsion (Per Sq Ft Rate)', price: Math.round(startingPrice / 50) || 15 },
      { item: 'Exterior Wall Weatherproofing (Per Sq Ft)', price: Math.round(startingPrice / 60) || 12 },
      { item: 'Single Room Accent Wall Painting', price: startingPrice },
      { item: 'Metal Gate / Grill Gloss Enamel Polish', price: Math.round(startingPrice * 1.2) }
    ];
  } else if (norm.includes('carpenter')) {
    return [
      { item: 'Main Door Lock / Handle Installation', price: startingPrice },
      { item: 'Wooden Wardrobe Hinge & Slider Repair', price: Math.round(startingPrice * 0.7) },
      { item: 'Custom Bookshelf / Modular Unit Assembly', price: Math.round(startingPrice * 2.0) },
      { item: 'Wooden Chair / Table Joint Reinforcement', price: Math.round(startingPrice * 0.5) }
    ];
  } else if (norm.includes('water')) {
    return [
      { item: '1000 Litres Utility & Groundwater Tank', price: startingPrice },
      { item: '2000 Litres Pure Groundwater Tank Supply', price: Math.round(startingPrice * 1.8) },
      { item: '5000 Litres Massive Tanker Delivery', price: Math.round(startingPrice * 4.0) },
      { item: 'Express Fast-Track Delivery Fee (Add-on)', price: Math.round(startingPrice * 0.3) }
    ];
  } else {
    return [
      { item: 'General Service Call & Consultation', price: startingPrice },
      { item: 'Standard Repair Service (up to 1 Hour)', price: Math.round(startingPrice * 1.5) },
      { item: 'Premium Task Resolution & Guarantee', price: Math.round(startingPrice * 2.2) }
    ];
  }
}

export default function VerifiedPros({
  searchQuery,
  selectedNeighborhood,
  onOpenBooking,
  onClearSearch,
  onClearNeighborhood
 }: VerifiedProsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [allPros, setAllPros] = useState<Pro[]>(VERIFIED_PROS);
  const [expandedProId, setExpandedProId] = useState<string | null>(null);

  // Trigger a loading skeleton effect when search or neighborhood filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedNeighborhood]);

  // Load pros from localStorage and merge with static
  useEffect(() => {
    try {
      const localProsStr = localStorage.getItem('jc_pros');
      if (localProsStr) {
        const localPros: Pro[] = JSON.parse(localProsStr).map((p: any) => ({
          ...p,
          avatarUrl: p.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
          reviewsCount: p.reviewsCount !== undefined ? p.reviewsCount : (p.reviews !== undefined ? p.reviews : 0),
          bio: p.bio || `Local certified professional in ${p.category} services across ${p.neighborhood || 'Jamshedpur'}.`,
          startingPrice: p.startingPrice || 299,
          phone: p.phone || '+91 99999 99999'
        }));
        
        const combined = [...localPros, ...VERIFIED_PROS];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setAllPros(unique);
      } else {
        setAllPros(VERIFIED_PROS);
      }
    } catch (e) {
      console.error('Error loading local pros:', e);
      setAllPros(VERIFIED_PROS);
    }
  }, [searchQuery, selectedNeighborhood]);
  
  // Filter pros based on search query and location
  const filteredPros = allPros.filter((pro) => {
    let matchesCategoryGroup = false;
    const query = searchQuery.toLowerCase();
    
    // Group categories mapping
    if (query === 'maintenance') {
      matchesCategoryGroup = ['plumber', 'electrician', 'carpenter', 'ac specialist', 'ac specialist'].some(c => pro.category.toLowerCase().includes(c));
    } else if (query === 'cleaning') {
      matchesCategoryGroup = ['cleaning', 'cleaner', 'deep cleaning'].some(c => pro.category.toLowerCase().includes(c));
    } else if (query === 'home improvement') {
      matchesCategoryGroup = ['painter', 'carpenter', 'technician'].some(c => pro.category.toLowerCase().includes(c));
    }

    const matchesSearch = searchQuery
      ? matchesCategoryGroup ||
        pro.name.toLowerCase().includes(query) ||
        pro.category.toLowerCase().includes(query) ||
        pro.bio.toLowerCase().includes(query)
      : true;

    const matchesNeighborhood = selectedNeighborhood
      ? pro.neighborhood.toLowerCase() === selectedNeighborhood.toLowerCase()
      : true;

    return matchesSearch && matchesNeighborhood;
  });

  return (
    <section className="bg-slate-50 py-20 border-b border-gray-100" id="pros-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12" id="pros-header-row">
          <div id="pros-title-group">
            <span className="text-[11px] font-bold text-[#102050] tracking-widest uppercase block mb-2 leading-none">
              TOP RATED LOCALS
            </span>
            <h2 className="font-display font-extrabold text-[#102050] text-3xl sm:text-4xl tracking-tight">
              Verified Pros Near You
            </h2>
          </div>
          <button 
            onClick={() => onOpenBooking()}
            className="flex items-center gap-1.5 text-sm font-bold text-[#102050] hover:text-[#f1b42f] transition-colors cursor-pointer group"
            id="view-all-pros-btn"
          >
            Browse all 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Active Filters Row */}
        {(searchQuery || selectedNeighborhood) && (
          <div className="flex flex-wrap items-center gap-2 mb-8" id="pros-active-filters">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102050] bg-[#f1b42f]/15 border border-[#f1b42f]/30 px-3 py-1.5 rounded-full shadow-sm">
                Service: "{searchQuery}"
                {(onClearSearch || onClearNeighborhood) && (
                  <button 
                    onClick={onClearSearch}
                    className="hover:bg-[#f1b42f]/30 rounded-full p-0.5 text-[#102050] transition-colors cursor-pointer"
                    aria-label="Clear service filter"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </span>
            )}
            {selectedNeighborhood && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                Area: {selectedNeighborhood}
                {(onClearSearch || onClearNeighborhood) && (
                  <button 
                    onClick={onClearNeighborhood}
                    className="hover:bg-emerald-100 rounded-full p-0.5 text-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                    aria-label="Clear area filter"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </span>
            )}
            {(onClearSearch || onClearNeighborhood) && (
              <button 
                onClick={() => {
                  if (onClearSearch) onClearSearch();
                  if (onClearNeighborhood) onClearNeighborhood();
                }}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 underline ml-2 cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Dynamic empty state or Loading Skeletons */}
        {isLoading ? (
          /* Professionals Skeleton Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="pros-grid-skeleton">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col justify-between animate-pulse"
                id={`pro-skeleton-card-${idx}`}
              >
                <div>
                  {/* Avatar & Header Skeleton */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>

                  {/* Rating Stars Skeleton */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
                      ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8 ml-1" />
                  </div>

                  {/* Badges Skeleton */}
                  <div className="flex gap-1.5 mb-4">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-14" />
                    <div className="h-5 bg-gray-200 rounded w-12" />
                  </div>

                  {/* Bio Skeleton */}
                  <div className="space-y-2 mb-5">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>

                  {/* Contact Block Skeleton */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-5 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-2.5 bg-gray-200 rounded w-16" />
                      <div className="h-2.5 bg-gray-200 rounded w-12" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-12" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-9 bg-gray-200 rounded-lg w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPros.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto shadow-sm" id="pros-empty-state">
            <p className="text-gray-500 text-sm mb-4 font-medium">
              No matching professionals found in "{selectedNeighborhood || 'Jamshedpur'}" for "{searchQuery}".
            </p>
            <button
              onClick={() => {
                if (onClearSearch) onClearSearch();
                if (onClearNeighborhood) onClearNeighborhood();
              }}
              className="px-4 py-2 bg-[#102050] hover:bg-[#1b356e] text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Professionals Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="pros-grid">
            {filteredPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => {
                  setExpandedProId(expandedProId === pro.id ? null : pro.id);
                }}
                className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer select-none relative ${expandedProId === pro.id ? 'ring-2 ring-[#f1b42f]/40 border-[#f1b42f]/30' : ''}`}
                id={`pro-card-${pro.id}`}
              >
                <div id={`pro-card-content-${pro.id}`}>
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-3 mb-4" id={`pro-header-${pro.id}`}>
                    <div className="relative shrink-0" id={`pro-avatar-box-${pro.id}`}>
                      <img
                        src={pro.avatarUrl}
                        alt={pro.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      {pro.verified && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm" id={`pro-verify-dot-${pro.id}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[#102050] text-sm leading-tight" id={`pro-name-${pro.id}`}>
                        {pro.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5" id={`pro-category-${pro.id}`}>
                        {pro.category}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars displaying exact review stats */}
                  <div className="flex items-center gap-1 mb-3.5" id={`pro-rating-stars-${pro.id}`}>
                    <div className="flex text-amber-400" id={`pro-star-icons-${pro.id}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(pro.rating) ? 'fill-amber-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-700 ml-1" id={`pro-rating-number-${pro.id}`}>
                      {pro.rating}
                    </span>
                    <span className="text-xs text-gray-400" id={`pro-reviews-count-${pro.id}`}>
                      ({pro.reviewsCount} reviews)
                    </span>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-1.5 mb-4" id={`pro-badges-${pro.id}`}>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded" id={`pro-verified-badge-${pro.id}`}>
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded" id={`pro-neighborhood-badge-${pro.id}`}>
                      {pro.neighborhood}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded" id={`pro-experience-badge-${pro.id}`}>
                      {pro.experience} yrs exp
                    </span>
                  </div>

                  {/* Bio statement */}
                  <p className="text-xs text-gray-500 leading-relaxed font-normal mb-5 line-clamp-3" id={`pro-bio-${pro.id}`}>
                    {pro.bio}
                  </p>

                  {/* Direct Contact Block */}
                  <div className="bg-[#f1b42f]/5 hover:bg-[#f1b42f]/10 border border-[#f1b42f]/20 rounded-xl p-3 mb-5 transition-all" id={`pro-contact-box-${pro.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#102050] uppercase tracking-wider">Direct Contact</span>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Verified No.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <a 
                        href={`tel:${pro.phone.replace(/\s+/g, '')}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-extrabold text-[#102050] hover:text-[#f1b42f] hover:underline flex items-center gap-1.5"
                        id={`pro-phone-link-${pro.id}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-[#f1b42f] shrink-0" />
                        {pro.phone}
                      </a>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/${pro.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                          title="Chat on WhatsApp"
                          id={`pro-whatsapp-link-${pro.id}`}
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.498 1.452 5.43 1.453 5.414 0 9.814-4.396 9.817-9.813.002-2.622-1.012-5.088-2.859-6.94C17.228 1.994 14.773.98 12.01.98c-5.42 0-9.821 4.398-9.824 9.815-.001 1.93.504 3.814 1.465 5.43L2.696 22l5.951-1.56a9.75 9.75 0 0 0 4.846 1.282z" />
                          </svg>
                        </a>
                        <a 
                          href={`tel:${pro.phone.replace(/\s+/g, '')}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-[#102050]/5 hover:bg-[#102050]/10 text-[#102050] rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                          title="Call Technician"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Quotation Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedProId(expandedProId === pro.id ? null : pro.id);
                    }}
                    className="w-full mt-2 mb-4 flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-[#102050] transition-colors cursor-pointer"
                    id={`pro-quotes-toggle-btn-${pro.id}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-[#f1b42f]" />
                      {expandedProId === pro.id ? 'Hide Price Quotations' : 'View Price Quotations'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#102050]/60 transition-transform duration-300 ${expandedProId === pro.id ? 'rotate-180 text-[#f1b42f]' : ''}`} />
                  </button>

                  {/* Expandable Quotation Dropdown List */}
                  {expandedProId === pro.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="mb-4 bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-2.5 transition-all duration-300 animate-fade-in"
                      id={`pro-quotes-dropdown-${pro.id}`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-[10px] font-extrabold text-[#102050] uppercase tracking-wider">
                          Service Price Quotations
                        </span>
                        <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Best Local Rates
                        </span>
                      </div>
                      <div className="space-y-2 divide-y divide-slate-100 max-h-[160px] overflow-y-auto pr-1">
                        {getQuotations(pro.category, pro.startingPrice).map((quote, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs pt-2 first:pt-0">
                            <span className="text-gray-600 font-semibold text-left mr-2 leading-tight">
                              {quote.item}
                            </span>
                            <span className="font-extrabold text-[#102050] shrink-0 font-mono">
                              ₹{quote.price}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9.5px] text-gray-400 font-medium leading-relaxed pt-1.5 border-t border-slate-200/60 text-center">
                        💡 Final quotes can be customized before service.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer and Call-to-Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between" id={`pro-footer-${pro.id}`}>
                  <div className="flex flex-col" id={`pro-price-box-${pro.id}`}>
                    <span className="text-[10px] font-medium text-gray-400 uppercase leading-none">Starting at</span>
                    <span className="text-xs font-semibold text-gray-400 mt-1 leading-none">
                      <strong className="text-sm font-extrabold text-[#102050]">₹{pro.startingPrice}</strong>/visit
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBooking(pro.category, pro);
                    }}
                    className="bg-[#102050] hover:bg-[#1b356e] text-white px-4 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer"
                    id={`pro-quote-btn-${pro.id}`}
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
