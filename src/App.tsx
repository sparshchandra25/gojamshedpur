import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import AboutJamshedpur from './components/AboutJamshedpur';
import VerifiedPros from './components/VerifiedPros';
import Process from './components/Process';
import Reviews from './components/Reviews';
import AboutUs from './components/AboutUs';
import BusinessOnboarding from './components/BusinessOnboarding';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import RegisterModal from './components/RegisterModal';
import AuthModal from './components/AuthModal';
import TermsModal from './components/TermsModal';
import { Pro } from './types';

export default function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Terms and conditions acceptance state
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jc_accepted_terms_v2') === 'true';
    } catch {
      return false;
    }
  });
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTermsDeclined, setIsTermsDeclined] = useState(false);

  // Visitor authentication state (persistent database proxy)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string; neighborhood: string } | null>(() => {
    try {
      const saved = localStorage.getItem('jc_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Simulate initial app resources loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('jc_current_user');
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: { name: string; email: string; phone: string; neighborhood: string }) => {
    setCurrentUser(user);
  };

  // Global filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefilledService, setBookingPrefilledService] = useState('');
  const [bookingPrefilledPro, setBookingPrefilledPro] = useState<Pro | null>(null);

  // Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleOpenBooking = (serviceName: string = '', pro: Pro | null = null) => {
    setBookingPrefilledService(serviceName);
    setBookingPrefilledPro(pro);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setBookingPrefilledService('');
    setBookingPrefilledPro(null);
  };

  const handleOpenRegister = () => {
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterOpen(false);
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 bg-[#102050] text-white flex flex-col items-center justify-center p-6 z-[9999]" id="full-page-splash-screen">
        {/* Soft radial gold accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,180,47,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Additional peripheral neutral glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#102050]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#f1b42f]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-md mx-auto space-y-8 relative z-10 flex flex-col items-center">
          {/* Logo Container with active entrance and metallic pulsing glow effect */}
          <div className="relative flex items-center justify-center mb-1 animate-[logo-entrance_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-[0_0_30px_rgba(241,180,47,0.15)] animate-[pulse-glow_2s_infinite_ease-in-out_alternate] flex items-center justify-center">
              <img src="logo.png" alt="Go Jamshedpur Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Main Branding - Elegant scale/fade entrance */}
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white animate-[logo-entrance_0.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
              Go <span className="bg-gradient-to-r from-[#f1b42f] via-white to-white bg-clip-text text-transparent">Jamshedpur</span>
            </h1>
            
            {/* Tagline - Sequenced fade & slide-in entrance */}
            <p className="text-xs text-[#f1b42f] font-mono tracking-[0.25em] font-bold uppercase animate-[tagline-entrance_0.5s_cubic-bezier(0.16,1,0.3,1)_0.35s_both]">
              "We take no cuts"
            </p>
          </div>

          {/* Tactile progress indicator - Thicker bar with silver-gradient sweep */}
          <div className="w-56 h-[5px] bg-[#0a1128] rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] animate-[logo-entrance_0.6s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
            <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#f1b42f] via-white to-[#f1b42f] shadow-[0_0_12px_rgba(241,180,47,0.45)] animate-[progress_2s_cubic-bezier(0.22,1,0.36,1)_forwards]" />
          </div>

          {/* Staggered peer-to-peer highlights emphasizing direct connectivity */}
          <div className="text-xs text-zinc-300 font-medium tracking-wide space-y-1.5 pt-1 animate-[tagline-entrance_0.5s_cubic-bezier(0.16,1,0.3,1)_0.55s_both]">
            <p className="text-[#f1b42f] font-bold">100% Peer-to-Peer Connections</p>
            <p className="text-[10px] text-zinc-400 font-medium">Direct WhatsApp • Zero Commissions • Verified Listings</p>
          </div>
        </div>

        {/* Global styles for high-fidelity micro-interactions */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes logo-entrance {
            0% { transform: scale(0.92); opacity: 0; filter: blur(4px); }
            100% { transform: scale(1); opacity: 1; filter: blur(0); }
          }
          @keyframes tagline-entrance {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-glow {
            0% { filter: drop-shadow(0 0 10px rgba(241, 180, 47, 0.08)); }
            100% { filter: drop-shadow(0 0 25px rgba(241, 180, 47, 0.25)) drop-shadow(0 0 8px rgba(241, 180, 47, 0.15)); }
          }
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#102050] selection:bg-[#f1b42f]/30" id="app-root-wrapper">
      {/* Top Banner Accent Line */}
      <div className="h-1.5 bg-gradient-to-r from-[#f1b42f] via-[#102050] to-[#f1b42f] w-full" id="top-accent-banner" />

      <div className={`transition-all duration-500 ${isTermsDeclined ? 'blur-md pointer-events-none select-none' : ''}`} id="app-blur-container">
        {/* Navigation Header */}
      <Header 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenRegister={handleOpenRegister} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Sections Assembly */}
      <main id="main-content">
        {/* Hero search and location dashboard */}
        <Hero 
          onSearchChange={setSearchQuery}
          onNeighborhoodSelect={setSelectedNeighborhood}
          selectedNeighborhood={selectedNeighborhood}
          onOpenBooking={(service) => handleOpenBooking(service)}
        />

        {/* Categories section */}
        <Categories 
          onSelectCategory={(category) => setSearchQuery(category)}
          onOpenBooking={(service) => handleOpenBooking(service)}
        />

        {/* Rooted Jamshedpur stats and landmarks */}
        <AboutJamshedpur />

        {/* Top-rated local professionals listing with search filter results */}
        <VerifiedPros 
          searchQuery={searchQuery}
          selectedNeighborhood={selectedNeighborhood}
          onOpenBooking={(service, pro) => handleOpenBooking(service, pro || null)}
          onClearSearch={() => setSearchQuery('')}
          onClearNeighborhood={() => setSelectedNeighborhood('')}
        />

        {/* Matchmaking process timeline */}
        <Process />

        {/* Customer reviews and testimonials */}
        <Reviews />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Our role as a connecting bridge about section */}
        <AboutUs />

        {/* Professional onboarding banner */}
        <BusinessOnboarding onOpenRegister={handleOpenRegister} />
      </main>

      {/* Footer copyright and contact block */}
      <Footer 
        onOpenBooking={(service) => handleOpenBooking(service)} 
        onOpenRegister={handleOpenRegister} 
        onOpenTerms={() => setIsTermsOpen(true)}
      />
    </div>

      {/* Modal overlays */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        prefilledService={bookingPrefilledService}
        prefilledPro={bookingPrefilledPro}
        currentUser={currentUser}
      />

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Terms and Conditions forced overlay on initial visit (after skeletons/splash ends) */}
      {!hasAcceptedTerms && !isTermsDeclined && (
        <TermsModal 
          isOpen={true}
          isForceAcceptMode={true}
          onDecline={() => setIsTermsDeclined(true)}
          onAccept={() => {
            try {
              localStorage.setItem('jc_accepted_terms_v2', 'true');
            } catch (e) {
              console.error(e);
            }
            setHasAcceptedTerms(true);
            setIsTermsDeclined(false);
          }}
        />
      )}

      {/* Access Restricted Overlay if Terms are Declined */}
      {isTermsDeclined && (
        <div 
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#102050]/95 backdrop-blur-2xl p-4 overflow-y-auto"
          id="terms-declined-lockscreen"
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl text-center space-y-6 relative overflow-hidden animate-[logo-entrance_0.4s_cubic-bezier(0.16,1,0.3,1)]" id="lockscreen-card">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5 animate-pulse" id="lockscreen-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#102050]">Access Restricted</h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                You have declined the Terms & Conditions of Go Jamshedpur Services. Because we operate as a direct peer-to-peer facilitator with local pros, you must review and accept these terms to browse or hire services.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100/80 rounded-2xl p-4 text-left text-[11px] text-amber-800 leading-normal" id="lockscreen-info-box">
              <span className="font-bold block mb-1">Why this is required:</span>
              Our Terms ensure you understand that service providers operate independently, helping maintain a safe, trusted, and zero-commission ecosystem for all of Jamshedpur.
            </div>

            <button
              onClick={() => setIsTermsDeclined(false)}
              className="w-full py-3.5 bg-[#102050] hover:bg-[#1b356e] text-white hover:text-[#f1b42f] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              id="lockscreen-retry-btn"
            >
              Review & Accept Terms
            </button>
          </div>
        </div>
      )}

      {/* Terms and Conditions manual viewer (accessible from Footer) */}
      {hasAcceptedTerms && (
        <TermsModal 
          isOpen={isTermsOpen}
          isForceAcceptMode={false}
          onClose={() => setIsTermsOpen(false)}
          onAccept={() => setIsTermsOpen(false)}
        />
      )}
    </div>
  );
}
