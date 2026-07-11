import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Wrench, Snowflake, Zap, Sparkles, Paintbrush, Shield, Droplets } from 'lucide-react';
import { api } from '../lib/api';

interface HeroProps {
  onSearchChange: (query: string) => void;
  onNeighborhoodSelect: (neighborhood: string) => void;
  selectedNeighborhood: string;
  onOpenBooking: (service: string) => void;
}

export default function Hero({ 
  onSearchChange, 
  onNeighborhoodSelect, 
  selectedNeighborhood,
  onOpenBooking
}: HeroProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [JAMSHEDPUR_NEIGHBORHOODS, setJamshedpurNeighborhoods] = useState<string[]>([]);

  useEffect(() => {
    api.getNeighborhoods().then(setJamshedpurNeighborhoods).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
    
    // Smooth scroll down to the verified pros section to show results
    const resultsSec = document.getElementById('pros-section');
    if (resultsSec) {
      resultsSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePopularClick = (service: string) => {
    setSearchVal(service);
    onSearchChange(service);
    
    // Smooth scroll down to the verified pros section to show results
    const resultsSec = document.getElementById('pros-section');
    if (resultsSec) {
      resultsSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative bg-gradient-to-br from-[#1b2c5c] via-[#102050] to-[#0a1535] animate-gradient-bg text-zinc-100 pt-20 pb-20 overflow-hidden border-b border-[#0a1128]" 
      id="hero-section"
    >
      <style>{`
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes drift-blob-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes drift-blob-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 60px) scale(1.15); }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: gradient-bg 25s ease infinite;
        }
        .animate-drift-1 {
          animation: drift-blob-1 25s infinite ease-in-out;
        }
        .animate-drift-2 {
          animation: drift-blob-2 32s infinite ease-in-out;
        }
      `}</style>

      {/* Cityscape background pattern overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop')` 
        }} 
      />
      
      {/* Subtle greyish/white and light neutral accent glows with drifting animations */}
      <div className="absolute -top-10 left-10 w-[600px] h-[600px] bg-zinc-600/10 rounded-full blur-[130px] opacity-70 pointer-events-none animate-drift-1" />
      <div className="absolute bottom-5 right-10 w-[550px] h-[550px] bg-zinc-700/8 rounded-full blur-[130px] opacity-60 pointer-events-none animate-drift-2" />

      {/* Oversized subtle watermark typography */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0" id="hero-watermark">
        <span className="font-display font-black text-[13vw] tracking-[0.18em] text-[#f1b42f] opacity-[0.025] uppercase">
          JAMSHEDPUR
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="hero-container">
        
        {/* Trusted Badge */}
        <div 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-850 text-xs font-semibold text-zinc-300 tracking-wide mb-8 hover:bg-zinc-900 transition-colors"
          id="trusted-badge"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Trusted by 500+ households in Jamshedpur
        </div>

        {/* Big Display Headings */}
        <h1 
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] max-w-4xl text-white"
          id="hero-heading"
        >
          <span className="block">Skilled Professionals,</span>
          <span className="block bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mt-1 pb-1">Right in Your</span>
          <span className="block bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mt-1 pb-1">Neighbourhood.</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed font-normal"
          id="hero-subtext"
        >
          Book verified local technicians across Sakchi, Bistupur, Telco and
          all parts of Jamshedpur. Real-time connections, zero middleman fees.
        </p>

        {/* Search Console */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-10 max-w-4xl bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 border border-zinc-200"
          id="hero-search-form"
        >
          {/* Location Selector */}
          <div className="relative shrink-0 flex items-center border-b md:border-b-0 md:border-r border-gray-100 px-4 py-1" id="location-selector-group">
            <button
              type="button"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center justify-between w-full md:w-52 text-left text-sm font-semibold text-gray-800 hover:text-zinc-950 py-2.5 transition-colors cursor-pointer"
              id="location-selector-btn"
            >
              <span>{selectedNeighborhood || 'All of Jamshedpur'}</span>
              <ChevronDown className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Location Dropdown */}
            {isLocationOpen && (
              <div 
                className="absolute left-0 right-0 md:right-auto md:w-64 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800"
                id="location-dropdown-menu"
              >
                <button
                  type="button"
                  onClick={() => {
                    onNeighborhoodSelect('');
                    setIsLocationOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  All Neighborhoods
                </button>
                <div className="h-[1px] bg-gray-100 my-1" />
                <div className="max-h-60 overflow-y-auto">
                  {JAMSHEDPUR_NEIGHBORHOODS.map((nh) => (
                    <button
                      key={nh}
                      type="button"
                      onClick={() => {
                        onNeighborhoodSelect(nh);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${selectedNeighborhood === nh ? 'bg-[#f1b42f]/10 text-[#102050] font-semibold' : ''}`}
                    >
                      {nh}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center px-4 py-3 md:py-0" id="search-input-group">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="What service do you need today? (e.g. plumber, ac repair, electrician)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent border-0 ring-0 outline-none focus:ring-0 focus:outline-none pl-3 text-sm text-gray-800 placeholder-gray-400"
              id="search-input-field"
            />
          </div>

          {/* Find Pros Button */}
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#f1b42f] hover:bg-[#fabc2c] text-[#102050] text-sm font-extrabold rounded-lg shadow-lg hover:shadow-[#f1b42f]/20 transition-all duration-150 shrink-0 cursor-pointer"
            id="find-pros-submit-btn"
          >
            Find Workers
          </button>
        </form>

        {/* Popular Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-zinc-300" id="popular-tags-row">
          <span className="font-semibold mr-1 text-zinc-300">Popular:</span>
          
          <button
            onClick={() => handlePopularClick('Plumber')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-plumber-btn"
          >
            <Wrench className="w-3.5 h-3.5 text-zinc-800" />
            Plumber
          </button>

          <button
            onClick={() => handlePopularClick('AC Repair')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-ac-btn"
          >
            <Snowflake className="w-3.5 h-3.5 text-zinc-800" />
            AC Repair
          </button>

          <button
            onClick={() => handlePopularClick('Electrician')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-electrician-btn"
          >
            <Zap className="w-3.5 h-3.5 text-zinc-800" />
            Electrician
          </button>

          <button
            onClick={() => handlePopularClick('Deep Cleaning')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-cleaning-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-800" />
            Deep Cleaning
          </button>

          <button
            onClick={() => handlePopularClick('Painting')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-painting-btn"
          >
            <Paintbrush className="w-3.5 h-3.5 text-zinc-800" />
            Painting
          </button>

          <button
            onClick={() => handlePopularClick('Pest Control')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-pest-btn"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-800" />
            Pest Control
          </button>

          <button
            onClick={() => handlePopularClick('Water Tank Delivery')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md border border-zinc-200 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            id="popular-water-tank-btn"
          >
            <Droplets className="w-3.5 h-3.5 text-zinc-800" />
            Water Tank Delivery
          </button>
        </div>

        {/* Hero Stats */}
        <div className="mt-16 pt-8 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 max-w-3xl" id="hero-stats">
          <div className="flex flex-col border-l-2 border-zinc-800 pl-4" id="stat-pros">
            <span className="text-3xl font-display font-extrabold tracking-tight text-white">500+</span>
            <span className="text-sm text-zinc-400 mt-1">Verified Pros</span>
          </div>
          <div className="flex flex-col border-l-2 border-zinc-800 pl-4" id="stat-rating">
            <span className="text-3xl font-display font-extrabold tracking-tight text-white">4.8★</span>
            <span className="text-sm text-zinc-400 mt-1">Avg. Rating</span>
          </div>
          <div className="flex flex-col border-l-2 border-zinc-800 pl-4" id="stat-response">
            <span className="text-3xl font-display font-extrabold tracking-tight text-white">24hr</span>
            <span className="text-sm text-zinc-400 mt-1">Avg. Response</span>
          </div>
        </div>

      </div>
    </section>
  );
}
