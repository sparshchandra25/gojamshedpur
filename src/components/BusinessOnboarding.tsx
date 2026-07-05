import { Briefcase, Calendar, UserPlus, Play, IndianRupee } from 'lucide-react';

interface BusinessOnboardingProps {
  onOpenRegister: () => void;
}

export default function BusinessOnboarding({ onOpenRegister }: BusinessOnboardingProps) {
  return (
    <section 
      className="relative bg-gradient-to-r from-[#0a1128] via-[#102050] to-[#1b356e] text-white py-20 overflow-hidden" 
      id="pro-banner-section"
    >
      {/* Background Image of worker overlaid */}
      <div 
        className="absolute inset-0 bg-cover bg-right md:bg-center opacity-30 mix-blend-luminosity pointer-events-none"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop')` 
        }} 
        id="onboarding-bg-image"
      />
      {/* Absolute gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-[#0a1128]/70 to-transparent z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="onboarding-container">
        <div className="max-w-2xl" id="onboarding-content-block">
          
          {/* For Skilled Professionals Pill Badge */}
          <div 
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#f1b42f] text-[11px] font-extrabold text-[#102050] tracking-wide mb-6 uppercase shadow-sm"
            id="onboarding-pill-badge"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#102050]" />
            For Skilled Professionals
          </div>

          {/* Heading */}
          <h2 
            className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.15]"
            id="onboarding-heading"
          >
            Grow Your Trade Business in Jamshedpur
          </h2>

          {/* Subtext */}
          <p 
            className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed font-normal"
            id="onboarding-subtext"
          >
            Join 100+ local professionals already earning more by getting direct, verified
            job requests from households across the city. No commissions for your first 1 month.
          </p>

          {/* Core Highlights Rows */}
          <div className="mt-8 flex flex-col sm:flex-row gap-6" id="onboarding-highlights">
            {/* Highlight 1: Earnings */}
            <div className="flex items-start gap-3.5" id="highlight-earnings">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/5 flex items-center justify-center shrink-0" id="earnings-icon-box">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Earn ₹30K–80K/month</h4>
                <p className="text-xs text-gray-400 mt-1 font-medium">Based on top earners in FY24</p>
              </div>
            </div>

            {/* Highlight 2: Schedule */}
            <div className="flex items-start gap-3.5" id="highlight-schedule">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/5 flex items-center justify-center shrink-0" id="schedule-icon-box">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Flexible Schedule</h4>
                <p className="text-xs text-gray-400 mt-1 font-medium">Work when you want</p>
              </div>
            </div>
          </div>

          {/* Active Call-to-Action Buttons */}
          <div className="mt-10 flex flex-wrap gap-4" id="onboarding-actions">
            {/* Register white filled button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 bg-white hover:bg-[#f1b42f] text-[#102050] px-6 py-3.5 rounded-lg text-sm font-extrabold transition-all shadow-md hover:shadow-lg cursor-pointer"
              id="onboarding-register-btn"
            >
              <UserPlus className="w-4 h-4 text-[#102050]" />
              Register as a Provider
            </button>

            {/* Watch outline button */}
            <button
              onClick={() => alert("Simulating 'How we Work' introduction video. In a live deployment, this opens our onboarding tutorial.")}
              className="flex items-center gap-2 border border-white/20 hover:border-white/50 hover:bg-white/5 text-white px-6 py-3.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              id="onboarding-watch-btn"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              Watch How We Work
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
