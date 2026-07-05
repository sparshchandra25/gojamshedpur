import React from 'react';
import { Briefcase, Zap, Menu, X, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: (service?: string) => void;
  onOpenRegister: () => void;
  currentUser: { name: string; email: string; phone: string; neighborhood: string } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export default function Header({ 
  onOpenBooking, 
  onOpenRegister,
  currentUser,
  onOpenAuth,
  onSignOut
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          id="header-logo-container"
        >
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center transition-transform group-hover:scale-105 border border-gray-100 shadow-sm" id="header-logo-badge">
            <img src="logo.png" alt="Go Jamshedpur Logo" className="w-8 h-8 object-contain rounded" />
          </div>
          <div className="flex flex-col" id="header-logo-text">
            <span className="font-display font-extrabold text-[#102050] text-lg tracking-tight leading-none">
              Go
            </span>
            <span className="font-display font-semibold text-[#f1b42f] text-xs tracking-widest uppercase mt-0.5 leading-none">
              JAMSHEDPUR
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600" id="desktop-nav">
          <button 
            onClick={() => scrollToSection('services-section')} 
            className="hover:text-[#102050] transition-colors cursor-pointer"
            id="nav-services"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('pros-section')} 
            className="hover:text-[#102050] transition-colors cursor-pointer"
            id="nav-pros"
          >
            Find Workers
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works-section')} 
            className="hover:text-[#102050] transition-colors cursor-pointer"
            id="nav-how-it-works"
          >
            How we Work
          </button>
          <button 
            onClick={() => scrollToSection('pro-banner-section')} 
            className="hover:text-[#102050] transition-colors cursor-pointer"
            id="nav-pricing"
          >
            Pricing
          </button>
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden md:flex items-center gap-5" id="desktop-actions">
          {currentUser ? (
            <div className="flex items-center gap-4 bg-[#f1b42f]/10 border border-[#f1b42f]/20 py-1.5 px-4 rounded-xl" id="header-user-badge">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#102050] text-[#f1b42f] font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#102050] leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#f1b42f] font-bold leading-none">
                    {currentUser.neighborhood || 'Visitor'}
                  </span>
                </div>
              </div>
              <button 
                onClick={onSignOut}
                title="Sign Out"
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                id="header-signout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="text-sm font-bold text-[#102050] hover:text-[#102050]/80 bg-[#f1b42f]/10 hover:bg-[#f1b42f]/20 border border-[#f1b42f]/30 px-4 py-2 rounded-xl transition-all cursor-pointer"
              id="header-signin-btn"
            >
              Sign In
            </button>
          )}
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-2 bg-[#102050] hover:bg-[#1b356e] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            id="header-register-btn"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#f1b42f]" />
            Register as a Provider
          </button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="md:hidden flex items-center" id="mobile-menu-toggle-container">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-[#102050] p-2"
            id="mobile-menu-toggle-btn"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg absolute w-full left-0 transition-all duration-200" id="mobile-menu-panel">
          <button
            onClick={() => scrollToSection('services-section')}
            className="block w-full text-left py-2.5 px-4 rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#102050] font-medium"
            id="mobile-nav-services"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('pros-section')}
            className="block w-full text-left py-2.5 px-4 rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#102050] font-medium"
            id="mobile-nav-pros"
          >
            Find Pros
          </button>
          <button
            onClick={() => scrollToSection('how-it-works-section')}
            className="block w-full text-left py-2.5 px-4 rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#102050] font-medium"
            id="mobile-nav-how-it-works"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection('pro-banner-section')}
            className="block w-full text-left py-2.5 px-4 rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#102050] font-medium"
            id="mobile-nav-pricing"
          >
            Pricing
          </button>
          <div className="h-[1px] bg-gray-100 my-2" />
          {currentUser ? (
            <div className="p-3 bg-[#f1b42f]/10 border border-[#f1b42f]/20 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#102050] text-[#f1b42f] font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102050]">{currentUser.name}</p>
                  <p className="text-[10px] text-[#f1b42f] font-bold">{currentUser.neighborhood || 'Visitor Profile'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100/70 py-2 rounded-lg transition-colors"
                id="mobile-nav-signout"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="block w-full text-left py-2.5 px-4 rounded-md text-[#102050] hover:bg-gray-50 font-semibold"
              id="mobile-nav-signin"
            >
              Sign In / Sign Up
            </button>
          )}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#102050] hover:bg-[#1b356e] text-white py-3 px-4 rounded-md font-semibold transition-all shadow-sm"
            id="mobile-nav-register"
          >
            <Briefcase className="w-4 h-4 text-[#f1b42f]" />
            Register as a Provider
          </button>
        </div>
      )}
    </header>
  );
}
