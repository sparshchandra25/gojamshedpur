import { Home, Search, Smartphone, CheckCircle2, MapPin, Check, Clock, ShieldAlert } from 'lucide-react';

export default function Process() {
  return (
    <section className="bg-slate-50 py-20 border-b border-gray-100" id="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="process-header">
          <span className="text-[11px] font-bold text-[#102050] tracking-widest uppercase block mb-3 leading-none">
            PROCESS
          </span>
          <h2 className="font-display font-extrabold text-[#102050] text-3xl sm:text-4xl tracking-tight">
            From Your Home to a Pro's Phone
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed font-normal">
            A seamless journey connecting Jamshedpur households with skilled local professionals in minutes.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative" id="process-steps-grid">
          
          {/* Step 1 */}
          <div className="relative bg-transparent flex flex-col items-center text-center px-4" id="process-step-1">
            {/* Massive Background Translucent Watermark */}
            <div className="absolute right-6 top-0 text-[10rem] font-display font-extrabold text-gray-200/50 leading-none select-none pointer-events-none z-0">
              1
            </div>

            {/* Icon Box */}
            <div className="w-14 h-14 bg-[#102050] rounded-xl flex items-center justify-center shadow-md relative z-10 hover:scale-105 transition-transform" id="step-icon-1">
              <Home className="w-6 h-6 text-[#f1b42f]" />
            </div>

            <h3 className="mt-6 font-display font-bold text-[#102050] text-base relative z-10">
              You Browse & Search
            </h3>
            <p className="mt-2.5 text-xs text-gray-500 leading-relaxed font-normal max-w-xs relative z-10">
              Explore listings of verified local service providers in your Jamshedpur neighborhood.
            </p>

            {/* Sub-badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#102050] relative z-10" id="step-badge-1">
              <MapPin className="w-3.5 h-3.5 text-[#f1b42f]" />
              Filter by local neighborhood
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-transparent flex flex-col items-center text-center px-4" id="process-step-2">
            {/* Massive Background Translucent Watermark */}
            <div className="absolute right-6 top-0 text-[10rem] font-display font-extrabold text-gray-200/50 leading-none select-none pointer-events-none z-0">
              2
            </div>

            {/* Icon Box */}
            <div className="w-14 h-14 bg-[#102050] rounded-xl flex items-center justify-center shadow-md relative z-10 hover:scale-105 transition-transform" id="step-icon-2">
              <Search className="w-6 h-6 text-[#f1b42f]" />
            </div>

            <h3 className="mt-6 font-display font-bold text-[#102050] text-base relative z-10">
              We Bridge the Connection
            </h3>
            <p className="mt-2.5 text-xs text-gray-500 leading-relaxed font-normal max-w-xs relative z-10">
              We provide a direct communication bridge between you and the verified provider.
            </p>

            {/* Sub-badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 relative z-10" id="step-badge-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Direct phone & WhatsApp link
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-transparent flex flex-col items-center text-center px-4" id="process-step-3">
            {/* Massive Background Translucent Watermark */}
            <div className="absolute right-6 top-0 text-[10rem] font-display font-extrabold text-gray-200/50 leading-none select-none pointer-events-none z-0">
              3
            </div>

            {/* Icon Box */}
            <div className="w-14 h-14 bg-[#102050] rounded-xl flex items-center justify-center shadow-md relative z-10 hover:scale-105 transition-transform" id="step-icon-3">
              <Smartphone className="w-6 h-6 text-[#f1b42f]" />
            </div>

            <h3 className="mt-6 font-display font-bold text-[#102050] text-base relative z-10">
              Direct Agreement
            </h3>
            <p className="mt-2.5 text-xs text-gray-500 leading-relaxed font-normal max-w-xs relative z-10">
              Discuss requirements, finalize dates, and confirm rates directly with the provider.
            </p>

            {/* Sub-badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#102050] relative z-10" id="step-badge-3">
              <Clock className="w-3.5 h-3.5 text-[#f1b42f]" />
              No platform booking commissions
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative bg-transparent flex flex-col items-center text-center px-4" id="process-step-4">
            {/* Massive Background Translucent Watermark */}
            <div className="absolute right-6 top-0 text-[10rem] font-display font-extrabold text-gray-200/50 leading-none select-none pointer-events-none z-0">
              4
            </div>

            {/* Icon Box */}
            <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md relative z-10 hover:scale-105 transition-transform" id="step-icon-4">
              <Check className="w-6 h-6 text-white stroke-[3px]" />
            </div>

            <h3 className="mt-6 font-display font-bold text-[#102050] text-base relative z-10">
              Transact & Rate Directly
            </h3>
            <p className="mt-2.5 text-xs text-gray-500 leading-relaxed font-normal max-w-xs relative z-10">
              Pay the service partner directly after completion and leave reviews to support our local registry.
            </p>

            {/* Sub-badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 relative z-10" id="step-badge-4">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
              100% peer-to-peer transactions
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
