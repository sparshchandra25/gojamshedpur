import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ChevronDown, Check, FileText, Lock, Unlock, AlertTriangle, X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline?: () => void;
  onClose?: () => void;
  isForceAcceptMode: boolean; // if true, they MUST accept to close. If false (e.g. from footer), they can just close it.
}

export default function TermsModal({ isOpen, onAccept, onDecline, onClose, isForceAcceptMode }: TermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset scroll state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      setScrollProgress(0);
      
      // Give a tiny timeout for DOM layout, then reset scroll position of the inner container
      const timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Use Intersection Observer as a super-robust sentinel at the bottom of the scroll container
  useEffect(() => {
    if (!isOpen || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasScrolledToBottom(true);
          setScrollProgress(100);
        }
      },
      {
        root: containerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Calculate scroll progress percentage
    const totalScrollable = scrollHeight - clientHeight;
    if (totalScrollable > 0) {
      const progress = Math.min((scrollTop / totalScrollable) * 100, 100);
      setScrollProgress(progress);
      
      // Fallback scroll-to-bottom check (if scrolled to within 15px of bottom)
      if (totalScrollable - scrollTop <= 15) {
        setHasScrolledToBottom(true);
      }
    } else {
      // If content is too short and doesn't scroll (though with this length it will)
      setHasScrolledToBottom(true);
      setScrollProgress(100);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#102050]/80 backdrop-blur-md p-4 overflow-y-auto"
        id="terms-overlay-container"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl w-full max-w-2xl border border-gray-100 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
          id="terms-card-wrapper"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#102050] to-[#1b356e] px-6 py-6 sm:px-8 text-white flex items-center justify-between shrink-0" id="terms-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#f1b42f] shadow-inner" id="terms-header-icon-box">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">Terms & Conditions</h2>
                <p className="text-[10px] sm:text-xs text-[#f1b42f] font-mono tracking-wider font-semibold uppercase">Go Jamshedpur Services</p>
              </div>
            </div>

            {/* Close button only available if NOT in force accept mode */}
            {!isForceAcceptMode && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                id="terms-close-btn"
                aria-label="Close Terms"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress Bar Indicator */}
          <div className="w-full h-1 bg-gray-100 relative shrink-0" id="terms-progress-container">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#f1b42f] to-[#fabc2c] transition-all duration-75"
              style={{ width: `${scrollProgress}%` }}
              id="terms-progress-fill"
            />
          </div>

          {/* Scrolling Content Panel */}
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6 text-gray-600 text-xs sm:text-sm leading-relaxed scroll-smooth bg-gray-50/50"
            id="terms-scrollable-body"
          >
            {/* Disclaimer Alert Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-[#102050]" id="terms-disclaimer-box">
              <AlertTriangle className="w-5 h-5 text-[#f1b42f] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-xs">Please review carefully</p>
                <p className="text-[11px] text-gray-600 leading-normal">
                  To access our platform, you must read our complete Terms and Conditions. Please scroll all the way to the bottom of the box below to unlock the agreement button.
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none space-y-4" id="terms-legal-document">
              <div className="border-b border-gray-200/60 pb-3">
                <h1 className="font-display font-extrabold text-base sm:text-lg text-[#102050]" id="terms-main-title">
                  Terms & Conditions – Go Jamshedpur Services
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-1 font-semibold uppercase tracking-wider" id="terms-effective-date">
                  Effective Date: July 7, 2026
                </p>
              </div>

              <p className="font-semibold text-gray-700">
                Welcome to Go Jamshedpur Services. By accessing or using our website, you agree to the following Terms & Conditions. If you do not agree with these terms, please do not use our platform.
              </p>

              {/* Sections list */}
              <div className="space-y-5" id="terms-numbered-sections">
                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">1.</span> Our Role
                  </h3>
                  <p className="text-gray-600">
                    Go Jamshedpur Services is an online platform that connects customers with independent service providers. We act only as a facilitator by providing contact information and do not provide, supervise, or guarantee any service listed on the platform.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">2.</span> Independent Service Providers
                  </h3>
                  <p className="text-gray-600">
                    All service providers listed on the website operate independently. They are solely responsible for their services, pricing, conduct, quality of work, timelines, warranties, and compliance with applicable laws.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">3.</span> User Responsibility
                  </h3>
                  <div className="text-gray-600 space-y-2">
                    <p>Before hiring any service provider, users are responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-500">
                      <li>Verifying the provider's identity, qualifications, and suitability.</li>
                      <li>Discussing and agreeing on the scope of work, pricing, payment terms, and timelines.</li>
                      <li>Taking reasonable precautions before allowing anyone onto their property.</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">4.</span> Payments
                  </h3>
                  <p className="text-gray-600">
                    Go Jamshedpur Services is not a party to any payment made between a customer and a service provider unless explicitly stated. Any payment disputes must be resolved directly between the customer and the service provider.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">5.</span> Limitation of Liability
                  </h3>
                  <p className="text-gray-600">
                    Go Jamshedpur Services shall not be liable for any loss, damage, injury, delay, poor workmanship, fraud, misconduct, property damage, financial loss, or any other claim arising from services provided by independent service providers.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">6.</span> Accuracy of Information
                  </h3>
                  <p className="text-gray-600">
                    We strive to keep service provider information accurate and up to date. However, we do not guarantee the accuracy, completeness, availability, or reliability of any listing.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">7.</span> Reviews and Feedback
                  </h3>
                  <p className="text-gray-600">
                    Users are encouraged to provide honest and respectful feedback. We reserve the right to remove reviews or content that is false, abusive, defamatory, misleading, or violates applicable laws.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">8.</span> Prohibited Use
                  </h3>
                  <div className="text-gray-600 space-y-2">
                    <p>Users must not:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-500">
                      <li>Use the website for unlawful purposes.</li>
                      <li>Submit false or misleading information.</li>
                      <li>Attempt to disrupt or compromise the website's security.</li>
                      <li>Misuse the contact details of listed service providers.</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">9.</span> Intellectual Property
                  </h3>
                  <p className="text-gray-600">
                    All website content, including logos, branding, graphics, text, and design, is the property of Go Jamshedpur Services unless otherwise stated. Unauthorized reproduction or distribution is prohibited.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">10.</span> Changes to These Terms
                  </h3>
                  <p className="text-gray-600">
                    We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the website after changes are published constitutes acceptance of the updated terms.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">11.</span> Governing Law
                  </h3>
                  <p className="text-gray-600">
                    These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in Jamshedpur, Jharkhand.
                  </p>
                </section>

                <section className="space-y-1 pb-4">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#102050] flex items-center gap-2">
                    <span className="text-[#f1b42f] font-mono">12.</span> Contact Us
                  </h3>
                  <p className="text-gray-600">
                    For questions regarding these Terms & Conditions, please contact Go Jamshedpur Services through the contact details provided on our website.
                  </p>
                </section>
              </div>
            </div>

            {/* Invisible Sentinel Element to trigger intersection observer when reached */}
            <div ref={sentinelRef} className="h-4 w-full" id="terms-scroll-sentinel" />
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0" id="terms-action-footer">
            <div className="flex items-center gap-2.5 text-xs text-gray-500 font-semibold" id="terms-status-indicator">
              {hasScrolledToBottom ? (
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 font-bold animate-pulse" id="status-unlocked">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Document Unlocked</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 font-bold" id="status-locked">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Please scroll to bottom</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto" id="terms-buttons-group">
              {/* Decline button (only in force accept mode, or as close button) */}
              {isForceAcceptMode && (
                <button
                  onClick={onDecline}
                  className="px-4 py-2.5 text-xs text-gray-500 hover:text-red-500 bg-white hover:bg-gray-100 font-bold rounded-xl border border-gray-200 transition-all flex-1 sm:flex-initial cursor-pointer"
                  id="terms-decline-button"
                >
                  Decline
                </button>
              )}

              {/* Accept & Proceed button */}
              <button
                disabled={!hasScrolledToBottom}
                onClick={onAccept}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-md ${
                  hasScrolledToBottom 
                    ? 'bg-[#102050] text-white hover:bg-[#1b356e] active:scale-95 shadow-[#102050]/10 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
                id="terms-accept-button"
              >
                <Check className={`w-4 h-4 ${hasScrolledToBottom ? 'text-[#f1b42f] stroke-[3.5]' : 'text-gray-300'}`} />
                <span>{isForceAcceptMode ? 'Accept & Continue' : 'Agree & Close'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
