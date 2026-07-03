import { Network, Handshake, AlertTriangle, MessageSquareCode } from 'lucide-react';

export default function AboutUs() {
  return (
    <section 
      className="bg-gradient-to-b from-[#102050]/5 via-white to-white border-t border-b border-[#102050]/10 py-20" 
      id="about-us-bridge-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-us-container">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="about-us-header">
          <span className="text-[11px] font-bold text-[#102050] bg-[#f1b42f]/20 px-3 py-1 rounded-full tracking-widest uppercase inline-block mb-3 leading-none">
            OUR MISSION & DISCLOSURE
          </span>
          <h2 className="font-display font-extrabold text-[#102050] text-3xl sm:text-4xl tracking-tight">
            A Direct Bridge for Jamshedpur Households
          </h2>
          <p className="mt-4 text-sm text-[#102050]/70 max-w-2xl mx-auto leading-relaxed">
            We exist to simplify your daily errands. Learn how we connect you with local experts without any corporate clutter or transactional markups.
          </p>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about-us-layout">
          
          {/* Left Column: Visual/Card Presentation of Our Role */}
          <div className="lg:col-span-5 space-y-6" id="about-us-cards">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#102050]/5 flex items-center justify-center mb-4">
                <Network className="w-5 h-5 text-[#102050]" />
              </div>
              <h3 className="text-sm font-bold text-[#102050] mb-2">Connecting Communities</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Rather than knocking on neighbors' doors or spending hours searching for reliable help, we display verified contacts directly so you get quick, clean solutions.
              </p>
            </div>

            {/* Direct Communication Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <Handshake className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-[#102050] mb-2">100% Direct Agreements</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Talk, call, negotiate, and coordinate directly with the technicians. We don't take cuts, we don't control schedules, and we don't hide phone numbers.
              </p>
            </div>
          </div>

          {/* Right Column: Clear Explanatory Text and Liability Boundaries */}
          <div className="lg:col-span-7 space-y-6" id="about-us-text-block">
            <h3 className="text-lg font-extrabold text-[#102050]">
              Why We Are Simply a Connecting Bridge
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              We are not a traditional service agency, and these professionals do not work under us. Instead, we act strictly as a <strong>clean digital bridge</strong> between Jamshedpur households and self-employed service providers. 
            </p>

            <p className="text-sm text-gray-500 leading-relaxed">
              In a digital age, finding a plumber, electrician, or a water tank delivery driver shouldn't involve frantic phone calls or asking around neighbors. Our portal aggregates local verified professionals, enabling you to inspect their credentials and instantly access their direct mobile numbers.
            </p>

            {/* Notice / Exclusion Box */}
            <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-6 space-y-3" id="about-us-disclosure-box">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Important Service Boundary</span>
              </div>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                Because we are solely a bridge, we do not employ, control, or monitor the service providers. <strong>All conversations, scheduling, scope of work, safety agreements, and price negotiations that take place after you receive the phone number are completely between you (the consumer) and the service provider.</strong> 
              </p>
              <p className="text-xs text-amber-700/80 leading-relaxed">
                We are not responsible or liable for any work quality, payment disputes, or agreements reached between you and the provider. We strongly recommend discussing all terms clearly before starting any job.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <MessageSquareCode className="w-4 h-4 text-[#f1b42f]" />
              <span>Keeping Local Trades Direct & Independent</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
