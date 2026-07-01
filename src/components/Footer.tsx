import { Zap, Facebook, Instagram, MessageCircle, Youtube, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenBooking: (service?: string) => void;
  onOpenRegister: () => void;
}

export default function Footer({ onOpenBooking, onOpenRegister }: FooterProps) {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (service: string) => {
    onOpenBooking(service);
  };

  return (
    <footer className="bg-[#0a0f1d] text-gray-400 text-sm py-16 border-t border-white/5" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="footer-container">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12" id="footer-main-grid">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4" id="footer-col-brand">
            <div 
              className="flex items-center gap-3 cursor-pointer group mb-5"
              onClick={scrollToTop}
            >
              <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center transition-transform group-hover:scale-105">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-white text-base tracking-tight leading-none">
                  Go
                </span>
                <span className="font-display font-semibold text-gray-300 text-[10px] tracking-widest uppercase mt-0.5 leading-none">
                  jamshdpur
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6" id="footer-bio-text">
              Jamshedpur's most trusted home services marketplace — connecting households with private skilled, verified local professionals.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-3" id="footer-social-links">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors" id="social-fb">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors" id="social-ig">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors" id="social-wa">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors" id="social-yt">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="md:col-span-2 col-span-6" id="footer-col-services">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-3 text-xs" id="footer-services-list">
              <li>
                <button onClick={() => handleServiceClick('Plumbing')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Plumbing
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('Electrical')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Electrical Work
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('AC Repair')} className="hover:text-white transition-colors text-left cursor-pointer">
                  AC Repair
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('Deep Cleaning')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Deep Cleaning
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('Painting')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Painting
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('Pest Control')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Pest Control
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-2 col-span-6" id="footer-col-company">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3 text-xs" id="footer-company-list">
              <li>
                <a href="#" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#how-it-works-section" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <button onClick={onOpenRegister} className="hover:text-white transition-colors text-left cursor-pointer">
                  Register as Pro
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Press</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Schedule Info */}
          <div className="md:col-span-4" id="footer-col-contact">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Get in Touch</h3>
            <ul className="space-y-3.5 text-xs text-gray-400 mb-6" id="footer-contact-list">
              <li className="flex items-center gap-3" id="contact-phone">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+91 9142111975</span>
              </li>
              <li className="flex items-center gap-3" id="contact-email">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>gojamshedpur@gmail.com</span>
              </li>
              <li className="flex items-start gap-3" id="contact-address">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Bistupur, Jamshedpur — 831001, Jharkhand</span>
              </li>
            </ul>

            {/* Working Hours Dark Box */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 max-w-sm" id="working-hours-card">
              <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none mb-2">Working Hours</h4>
              <p className="text-xs font-extrabold text-white leading-none mt-1">Mon–Sun: 7AM - 9PM</p>
            </div>
          </div>

        </div>

        {/* Thin bottom separation rule */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500" id="footer-sub-bar">
          <div className="space-y-1" id="footer-credits-container">
            <p id="footer-credits">
              © 2026 Go Jamshedpur. All rights reserved. Made with ❤️ by students in Jamshedpur.
            </p>
            <p className="text-[10px] text-gray-600 font-mono tracking-wider uppercase font-medium" id="footer-creator-credit">
              Created by Flightguy
            </p>
          </div>
          <div className="flex items-center gap-5" id="footer-policies">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
