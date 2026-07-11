import { useEffect, useState } from 'react';
import { TreePine, Factory, Mountain, Store } from 'lucide-react';
import { api } from '../lib/api';
import { NeighborhoodInfo } from '../types';

export default function AboutJamshedpur() {
  const [NEIGHBORHOOD_INFOS, setNeighborhoodInfos] = useState<NeighborhoodInfo[]>([]);

  useEffect(() => {
    api.getNeighborhoodZones().then(setNeighborhoodInfos).catch(() => {});
  }, []);

  const getAreaIcon = (iconName: string) => {
    switch (iconName) {
      case 'tree':
        return <TreePine className="w-6 h-6 text-[#f1b42f]" />;
      case 'factory':
        return <Factory className="w-6 h-6 text-[#f1b42f]" />;
      case 'mountain':
        return <Mountain className="w-6 h-6 text-[#f1b42f]" />;
      case 'shop':
        return <Store className="w-6 h-6 text-[#f1b42f]" />;
      default:
        return <TreePine className="w-6 h-6 text-[#f1b42f]" />;
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#102050] via-[#0d1b46] to-[#0a1128] text-white py-20 relative overflow-hidden" id="about-jamshedpur-section">
      {/* Massive watermark background text */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-display font-extrabold text-[#f1b42f] opacity-[0.025] uppercase select-none tracking-widest pointer-events-none text-center whitespace-nowrap z-0"
        id="jamshedpur-watermark"
      >
        JAMSHEDPUR
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="jamshedpur-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="jamshedpur-header">
          <span className="text-[11px] font-bold text-[#f1b42f] tracking-widest uppercase block mb-3 leading-none">
            ROOTED IN JAMSHEDPUR
          </span>
          <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl tracking-tight">
            We Know This City Like You Do
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
            From the lanes of Bistupur Market to the residential blocks of Telco Colony — our pros know every neighbourhood.
          </p>
        </div>

        {/* Neighborhood Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="neighborhood-grid">
          {NEIGHBORHOOD_INFOS.map((info) => (
            <div
              key={info.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-[#f1b42f]/30 transition-all duration-300 flex flex-col items-center text-center group"
              id={`area-card-${info.id}`}
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5 group-hover:scale-105 transition-transform" id={`area-icon-box-${info.id}`}>
                {getAreaIcon(info.iconName)}
              </div>
              <h3 className="font-display font-semibold text-white text-base group-hover:text-[#f1b42f] transition-colors" id={`area-title-${info.id}`}>
                {info.name}
              </h3>
              <p className="mt-1.5 text-xs text-gray-400 font-normal" id={`area-desc-${info.id}`}>
                {info.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stylish "WE TAKE ZERO CUTS" Banner */}
        <div 
          className="mt-16 bg-gradient-to-r from-[#f1b42f]/10 via-[#102050]/5 to-transparent border border-[#f1b42f]/20 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-sm"
          id="zero-cuts-banner"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-[#f1b42f]/10 flex items-center justify-center border border-[#f1b42f]/30 text-[#f1b42f] font-mono font-black text-xl select-none shrink-0 shadow-sm animate-pulse" id="zero-cuts-pill-badge">
              ₹0
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-bold text-[#f1b42f] bg-[#f1b42f]/15 px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                  DIRECT ACCESS
                </span>
                <span className="text-xs text-amber-100/80 font-medium">100% Commission-Free</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1" id="zero-cuts-title">
                WE TAKE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f1b42f] to-white">ZERO CUTS</span>
              </h3>
            </div>
          </div>
          
          <div className="max-w-xl text-center lg:text-left border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0 lg:pl-6">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              Unlike big corporate service agencies that inflate prices and squeeze local service providers, we are a pure connection platform. Every rupee you pay goes directly into the hands of the hard-working local experts in your neighborhood.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
