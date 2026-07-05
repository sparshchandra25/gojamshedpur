import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'trust' | 'partners';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'general',
    question: 'What is Go Jamshedpur and how does it work?',
    answer: 'Go Jamshedpur is a direct peer-to-peer home services marketplace connecting Jamshedpur residents with verified local professionals like electricians, plumbers, painters, appliance technicians, and cleaning experts. You can explore verified listings, compare reviews, and connect directly with pros via WhatsApp or Phone calls with zero intermediate fees.'
  },
  {
    category: 'booking',
    question: 'Does Go Jamshedpur charge any commission or booking fee?',
    answer: 'No, absolutely not! Unlike corporate service apps that take 20% to 30% cuts from local professionals and charge customers extra service fees, Go Jamshedpur operates on a 100% peer-to-peer, zero-commission structure. You deal with the professionals directly, ensuring they keep their full earnings and you get the best possible rates.'
  },
  {
    category: 'trust',
    question: 'How do you verify the service professionals on your platform?',
    answer: 'Every professional onboarded onto Go Jamshedpur must present valid government ID proofs (Aadhaar, PAN), pass strict local address verification, and provide a clear background history check. We display active ratings and digital invoice badges so you can book with confidence.'
  },
  {
    category: 'trust',
    question: 'Is their any insurance or gurantee from your side?',
    answer: 'No , we do not provide any insurance or guarantee from our side. As we act as a bridge between the consumer and the service provider . All the guarantee is provided by the service provider itself. We do not take any responsibility for any damage or loss caused by the service provider.'
  },
  {
    category: 'booking',
    question: 'How do I contact or book a professional?',
    answer: 'It takes just seconds! Simply browse through our services or filter by your Jamshedpur neighborhood (Bistupur, Sakchi, Mango, Telco, Sonari, Kadma, etc.). Once you find a suitable pro, click "Book Service" to submit your request or connect with them directly on call or WhatsApp.'
  },
  {
    category: 'partners',
    question: 'Can I register my own local service business or join as a pro?',
    answer: 'Yes! We love empowering Jamshedpur\'s independent professionals and small service agencies. You can click on "Join as Partner" at the top of the page, fill out the simple registration form with your documents, and once verified, we will start directing nearby clients directly to your WhatsApp.'
  },
  {
    category: 'general',
    question: 'What areas of Jamshedpur do you cover?',
    answer: 'We cover almost all major neighborhoods of the city including Bistupur, Sakchi, Mango, Sonari, Kadma, Telco, Baridih, Sidhgora, Golmuri, Adityapur, and surrounding areas. Service availability is optimized based on the exact distance to your location.'
  },
  {
    category: 'booking',
    question: 'Can I cancel or reschedule my booking request?',
    answer: 'Yes. Since Go Jamshedpur connects you directly with the professional, you can simply coordinate directly with them to reschedule or modify your appointment time at no additional penalty. No bots, no customer care hold times—just direct, human-to-human coordination.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'booking' | 'trust' | 'partners'>('all');

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    category: 'General Support',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await addDoc(collection(db, 'support_inquiries'), {
        name: formData.name,
        contact: formData.contact,
        category: formData.category,
        message: formData.message,
        createdAt: serverTimestamp(),
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setSubmitError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      contact: '',
      category: 'General Support',
      message: '',
    });
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General Info' },
    { id: 'booking', label: 'Bookings & Pricing' },
    { id: 'trust', label: 'Safety & Trust' },
    { id: 'partners', label: 'For Partners' }
  ] as const;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="faq-section">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f1b42f]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#102050]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" id="faq-container">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-16" id="faq-header">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102050]/5 text-[#102050] text-xs font-mono font-bold uppercase tracking-wider" id="faq-pill">
            <HelpCircle className="w-4 h-4 text-[#f1b42f]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#102050] tracking-tight" id="faq-title">
            Have Questions? We Have <span className="bg-gradient-to-r from-[#102050] via-[#1b356e] to-[#f1b42f] bg-clip-text text-transparent">Answers</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed font-normal" id="faq-subtitle">
            Everything you need to know about Go Jamshedpur's direct peer-to-peer home services, verification, and zero-commission guarantees.
          </p>
        </div>

        {/* Search & Categories Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(16,32,80,0.03)] space-y-5 mb-8" id="faq-filters">
          {/* Real-time search bar */}
          <div className="relative flex items-center" id="faq-search-wrapper">
            <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for questions (e.g. commission, security, booking)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100/50 focus:bg-white text-sm text-[#102050] font-medium rounded-xl border border-gray-100 focus:border-[#102050]/20 focus:ring-4 focus:ring-[#102050]/5 transition-all outline-none"
              id="faq-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                id="faq-clear-search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Tab buttons */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50" id="faq-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(0); // reset expanded to first item in new list
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#102050] text-white shadow-md shadow-[#102050]/10'
                    : 'bg-gray-50 text-gray-500 hover:text-[#102050] hover:bg-gray-100'
                }`}
                id={`faq-tab-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4" id="faq-accordion-list">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-2xl border transition-all duration-300 ${
                      isOpen 
                        ? 'border-[#f1b42f]/30 shadow-[0_8px_30px_rgba(241,180,47,0.06)] ring-1 ring-[#f1b42f]/10' 
                        : 'border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                    id={`faq-item-card-${idx}`}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group"
                      aria-expanded={isOpen}
                      id={`faq-toggle-btn-${idx}`}
                    >
                      <span className="font-display font-bold text-[#102050] text-sm sm:text-base pr-4 leading-snug group-hover:text-[#f1b42f] transition-colors">
                        {faq.question}
                      </span>
                      <span 
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isOpen 
                            ? 'bg-[#f1b42f] text-[#102050] rotate-180 shadow-md shadow-[#f1b42f]/20' 
                            : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-[#102050]'
                        }`}
                        id={`faq-arrow-icon-${idx}`}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                          id={`faq-expanded-panel-${idx}`}
                        >
                          <div className="px-6 pb-6 pt-1 border-t border-gray-50 text-xs sm:text-sm text-gray-500 leading-relaxed font-normal space-y-3">
                            <p>{faq.answer}</p>
                            {faq.category === 'trust' && (
                              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100/50 mt-3">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                Protected by our verified guarantee and standard insurance cover.
                              </div>
                            )}
                            {faq.category === 'booking' && (
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#102050] bg-[#f1b42f]/5 rounded-xl p-2.5 border border-[#f1b42f]/10 mt-3">
                                <Zap className="w-4 h-4 text-[#f1b42f] shrink-0" />
                                Always book directly on WhatsApp or call with no platform charges!
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4"
                id="faq-no-results"
              >
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-[#102050] text-base">No matching questions found</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Try searching with simpler terms or resetting your category filter to browse our full list of help topics.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#102050] rounded-xl hover:bg-[#102050]/90 transition-all cursor-pointer shadow-md shadow-[#102050]/5"
                  id="faq-reset-btn"
                >
                  Clear Filters & Search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direct On-Website Inquiry / Support Form Card */}
        <div className="mt-16 bg-gradient-to-br from-[#102050] to-[#1b356e] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-[#102050]/10" id="faq-cta-card">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#f1b42f]/5 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10" id="faq-support-grid">
            {/* Column 1: Info */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-center" id="faq-support-info">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono uppercase tracking-wider w-fit" id="faq-support-pill">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f1b42f]" />
                Direct Website Support
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight">
                Still have questions? Ask us directly!
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Submit your inquiry right here on our website. Our dedicated local team in Jamshedpur will review and get back to you via your preferred contact channel within 24 hours.
              </p>
              
              <div className="space-y-3 pt-2 text-xs text-gray-200" id="faq-support-features">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold">Fast Response Guarantee</p>
                    <p className="text-[10px] text-gray-400">Response on email/phone within 24 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-[#f1b42f]/20 text-[#f1b42f] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold">100% Free Consultation</p>
                    <p className="text-[10px] text-gray-400">We assist you in finding the perfect professional with zero commissions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Interactive Form / Success Panel */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-inner" id="faq-support-form-container">
              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 py-6"
                    id="faq-support-success"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/10">
                      <CheckCircle className="w-10 h-10 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display font-extrabold text-white text-lg sm:text-xl">Inquiry Submitted!</h4>
                      <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                        Thank you, <strong className="text-[#f1b42f] font-bold">{formData.name}</strong>. We have received your question regarding <strong className="text-white font-bold">{formData.category}</strong> and will reach out to you within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={handleResetForm}
                      className="px-5 py-2.5 bg-white text-[#102050] hover:bg-[#f1b42f] font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer mt-2"
                      id="faq-support-reset-btn"
                    >
                      Ask Another Question
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                    id="faq-support-form"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-gray-300 uppercase block">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Anil Kumar"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-400 text-xs sm:text-sm rounded-xl border border-white/10 focus:border-[#f1b42f]/40 focus:ring-2 focus:ring-[#f1b42f]/10 transition-all outline-none"
                        />
                      </div>
                      
                      {/* Contact Info (Email/Phone) */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-gray-300 uppercase block">Email or Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. anil@gmail.com"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-400 text-xs sm:text-sm rounded-xl border border-white/10 focus:border-[#f1b42f]/40 focus:ring-2 focus:ring-[#f1b42f]/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Inquiry Category / Topic */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-gray-300 uppercase block">Inquiry Topic</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white text-xs sm:text-sm rounded-xl border border-white/10 focus:border-[#f1b42f]/40 focus:ring-2 focus:ring-[#f1b42f]/10 transition-all outline-none appearance-none"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="General Support">General Support / Help</option>
                        <option value="Booking Assistance">Booking Assistance</option>
                        <option value="Become a Partner">Joining as a Service Partner</option>
                        <option value="Complaint / Verification">Safety & Verification Inquiry</option>
                        <option value="Other">Other Query</option>
                      </select>
                    </div>

                    {/* Message / Question */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-gray-300 uppercase block">Your Question / Message</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Type your question or request details here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-400 text-xs sm:text-sm rounded-xl border border-white/10 focus:border-[#f1b42f]/40 focus:ring-2 focus:ring-[#f1b42f]/10 transition-all outline-none resize-none"
                      />
                    </div>

                    {submitError && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 bg-rose-500/10 rounded-xl p-3 border border-rose-500/20" id="faq-submit-error">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#f1b42f] disabled:bg-amber-500/50 hover:bg-[#fabc2c] active:scale-[0.98] disabled:scale-100 text-[#102050] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#f1b42f]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="faq-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Inquiry...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Question to Team
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
