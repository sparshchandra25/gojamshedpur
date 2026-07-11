import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Check, Sparkles, Phone, Mail, User, Info } from 'lucide-react';
import { Pro } from '../types';
import { api } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledService?: string;
  prefilledPro?: Pro | null;
  currentUser?: { name: string; email: string; phone: string; neighborhood: string } | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  prefilledService = '',
  prefilledPro = null,
  currentUser = null
}: BookingModalProps) {
  
  const [step, setStep] = useState<'details' | 'neighborhood' | 'schedule' | 'contact' | 'submitting' | 'confirmed'>('details');
  const [selectedService, setSelectedService] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [JAMSHEDPUR_NEIGHBORHOODS, setJamshedpurNeighborhoods] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.getNeighborhoods().then(setJamshedpurNeighborhoods).catch(() => {});
    }
  }, [isOpen]);

  // Update states when modal opens or receives pre-filled data
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setSelectedService(prefilledPro ? prefilledPro.category : (prefilledService || 'AC Repair'));
      setNeighborhood(prefilledPro ? prefilledPro.neighborhood : (currentUser?.neighborhood || ''));
      setAddress('');
      
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTimeSlot('09:00 AM - 12:00 PM');
      
      setUserName(currentUser ? currentUser.name : '');
      setUserPhone(currentUser ? currentUser.phone : '');
      setUserEmail(currentUser ? currentUser.email : '');
      setNotes('');
      setBookingId('');
      setSubmitError('');
    }
  }, [isOpen, prefilledService, prefilledPro, currentUser]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 'details') setStep('neighborhood');
    else if (step === 'neighborhood') setStep('schedule');
    else if (step === 'schedule') setStep('contact');
    else if (step === 'contact') {
      setStep('submitting');
      api
        .createBooking({
          serviceName: selectedService,
          providerId: prefilledPro?.id,
          neighborhood,
          address,
          date,
          timeSlot,
          userName,
          userPhone,
          userEmail,
          notes,
        })
        .then((booking) => {
          setBookingId(booking.bookingId);
          setStep('confirmed');
        })
        .catch((err: any) => {
          console.error('Failed to create booking:', err);
          setSubmitError(err.message || 'Failed to submit your booking. Please try again.');
          setStep('contact');
        });
    }
  };

  const handlePrevStep = () => {
    if (step === 'neighborhood') setStep('details');
    else if (step === 'schedule') setStep('neighborhood');
    else if (step === 'contact') setStep('schedule');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="booking-modal-overlay">
      
      {/* Modal Container */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col transition-all transform scale-100 max-h-[90vh]"
        id="booking-modal-container"
      >
        
        {/* Header (except for submitting and confirmed states) */}
        {step !== 'submitting' && step !== 'confirmed' && (
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0" id="modal-header">
            <div>
              <h3 className="font-display font-extrabold text-[#102050] text-lg">
                {prefilledPro ? `Book ${prefilledPro.name}` : 'Request a Professional'}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {prefilledPro ? `${prefilledPro.category} • Verified Local Pro` : 'Step-by-step verified matching'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1" id="modal-body">
          
          {/* STEP 1: Details */}
          {step === 'details' && (
            <div className="space-y-5" id="step-details-panel">
              {/* Service Select */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Select Service Profile
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  disabled={!!prefilledPro}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-[#102050] font-medium outline-none focus:border-[#102050] transition-all disabled:opacity-75"
                >
                  <option value="Electrician">Electrician Work</option>
                  <option value="Plumber">Plumbing Repair</option>
                  <option value="AC Repair">AC Service & Repair</option>
                  <option value="Deep Cleaning">Full House Deep Cleaning</option>
                  <option value="Painting">Wall & Trim Painting</option>
                  <option value="Pest Control">Pest & Termite Eradication</option>
                  <option value="Carpenter">Carpenter & Furniture setup</option>
                  <option value="Water Tank">Water Tank Sanitization</option>
                </select>
              </div>

              {/* Prefilled Pro Info Banner */}
              {prefilledPro && (
                <div className="flex flex-col gap-3" id="modal-pro-banner-container">
                  <div className="bg-[#f1b42f]/10 border border-[#f1b42f]/20 rounded-xl p-4 flex items-center gap-3" id="modal-pro-banner">
                    <img
                      src={prefilledPro.avatarUrl}
                      alt={prefilledPro.name}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#102050]">{prefilledPro.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                        Starting from ₹{prefilledPro.startingPrice} • Rating {prefilledPro.rating}★
                      </p>
                    </div>
                  </div>
                  
                  {/* Direct Contact Bridge Section */}
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-600 font-bold mb-2">Connect Directly with {prefilledPro.name}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <a
                        href={`tel:${prefilledPro.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-2 bg-[#102050] hover:bg-[#1b356e] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-400" />
                        Call {prefilledPro.phone}
                      </a>
                      <a
                        href={`https://wa.me/${prefilledPro.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.498 1.452 5.43 1.453 5.414 0 9.814-4.396 9.817-9.813.002-2.622-1.012-5.088-2.859-6.94C17.228 1.994 14.773.98 12.01.98c-5.42 0-9.821 4.398-9.824 9.815-.001 1.93.504 3.814 1.465 5.43L2.696 22l5.951-1.56a9.75 9.75 0 0 0 4.846 1.282z" />
                        </svg>
                        WhatsApp Chat
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Service description advice */}
              <div className="bg-gray-50 rounded-xl p-4 flex gap-3" id="modal-service-info">
                <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  Go Jamshedpur acts solely as a platform connecting users with independent service providers . We are <strong>Not Responsible </strong> for the quality, conduct, pricing, agreements, damages, delays, or outcomes of any services provided. All dealings are solely between the customer and the service provider.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Neighborhood & Address */}
          {step === 'neighborhood' && (
            <div className="space-y-5" id="step-location-panel">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Select Jamshedpur Locality
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {JAMSHEDPUR_NEIGHBORHOODS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setNeighborhood(area)}
                      className={`py-3 px-4 rounded-lg border text-xs font-bold text-center transition-all ${
                        neighborhood === area
                          ? 'border-[#102050] bg-[#102050] text-white shadow-sm'
                          : 'border-gray-200 bg-white text-[#102050] hover:border-gray-300'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Specific Street/House Address
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 304, Block B, Premsons Apartment, Bistupur"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050] transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Schedule Date & Time */}
          {step === 'schedule' && (
            <div className="space-y-5" id="step-schedule-panel">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Select Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm text-[#102050] font-medium outline-none focus:border-[#102050]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Select Time Slot
                </label>
                <div className="space-y-2.5">
                  {[
                    '08:00 AM - 11:00 AM (Morning Slot)',
                    '11:00 AM - 02:00 PM (Mid-day Slot)',
                    '02:00 PM - 05:00 PM (Afternoon Slot)',
                    '05:00 PM - 08:00 PM (Evening Slot)'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`w-full py-3.5 px-4 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        timeSlot === slot
                          ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{slot}</span>
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Customer Contact Info */}
          {step === 'contact' && (
            <div className="space-y-5" id="step-contact-panel">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2 text-xs font-semibold" id="booking-submit-error">
                  <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050]"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                    WhatsApp / Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-2">
                  Additional Details / Problem Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe specific issues (e.g. leaking overhead tank pipes, need split AC installation)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050] resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Matching Radar Animation */}
          {step === 'submitting' && (
            <div className="py-12 flex flex-col items-center justify-center text-center" id="matching-radar-panel">
              {/* Radar Pulsing Rings */}
              <div className="relative w-28 h-28 flex items-center justify-center mb-8" id="radar-container">
                <div className="absolute inset-0 rounded-full bg-[#f1b42f]/10 border border-[#f1b42f]/30 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full bg-[#f1b42f]/20 border border-[#f1b42f]/40 animate-ping opacity-60" />
                <div className="w-16 h-16 rounded-full bg-[#102050] flex items-center justify-center border border-[#f1b42f]/40 relative z-10 shadow-lg">
                  <Sparkles className="w-7 h-7 text-[#f1b42f] animate-pulse" />
                </div>
              </div>
              
              <h3 className="font-display font-extrabold text-[#102050] text-xl tracking-tight">
                Matching Best Local Pros...
              </h3>
              <p className="mt-3 text-sm text-gray-500 font-medium max-w-sm leading-relaxed">
                Searching background-verified, five-star rated technicians near <strong>{neighborhood || 'your area'}</strong> within 5km radius...
              </p>
              <div className="mt-6 flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-[11px] font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Locking in standard pre-negotiated local prices
              </div>
            </div>
          )}

          {/* STEP 6: Confirmed Ticket Summary */}
          {step === 'confirmed' && (
            <div className="py-6 space-y-6" id="booking-confirmed-panel">
              {/* Success Badge */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-50 shadow-md mb-4">
                  <Check className="w-8 h-8 text-white stroke-[3px]" />
                </div>
                <h3 className="font-display font-extrabold text-[#102050] text-2xl tracking-tight">
                  Booking Confirmed!
                </h3>
                <p className="mt-1.5 text-xs text-gray-400 font-semibold uppercase tracking-widest">
                  Order ID: {bookingId}
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4" id="receipt-summary">
                <h4 className="text-xs font-extrabold text-[#102050] uppercase tracking-wider border-b border-gray-200/60 pb-2.5">
                  Job Match Summary
                </h4>

                <div className="grid grid-cols-2 gap-y-3.5 text-xs" id="receipt-details">
                  <div>
                    <span className="text-gray-400 font-medium block">SERVICE PROFILE</span>
                    <span className="text-[#102050] font-bold mt-1 block">{selectedService}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">LOCAL AREA</span>
                    <span className="text-[#102050] font-bold mt-1 block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f1b42f]" />
                      {neighborhood}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">DATE & SCHEDULE</span>
                    <span className="text-[#102050] font-bold mt-1 block">{date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">TIMEFRAME</span>
                    <span className="text-[#102050] font-bold mt-1 block">{timeSlot.split(' ')[0]} {timeSlot.split(' ')[1]}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 font-medium block">SPECIFIC ADDRESS</span>
                    <span className="text-[#102050] font-bold mt-1 block leading-relaxed">{address}</span>
                  </div>
                </div>

                {/* Match confirmation and contact guarantee */}
                <div className="pt-4 border-t border-gray-200/60 flex items-center gap-3 text-xs text-gray-500" id="receipt-guarantee">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <p>
                    {prefilledPro 
                      ? `We have notified ${prefilledPro.name} directly. He will contact you on ${userPhone} shortly.` 
                      : `A top 5-star professional has been assigned and will call you within 15 minutes.`}
                  </p>
                </div>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={onClose}
                className="w-full bg-[#102050] hover:bg-[#1b356e] text-white py-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                id="receipt-close-btn"
              >
                Return to Landing Page
              </button>
            </div>
          )}

        </div>

        {/* Modal Buttons Footer (only for basic step funnels) */}
        {step !== 'submitting' && step !== 'confirmed' && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0" id="modal-footer">
            {step === 'details' ? (
              <div />
            ) : (
              <button
                onClick={handlePrevStep}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                id="modal-back-btn"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNextStep}
              disabled={
                (step === 'details' && !selectedService) ||
                (step === 'neighborhood' && (!neighborhood || !address)) ||
                (step === 'schedule' && (!date || !timeSlot)) ||
                (step === 'contact' && (!userName || !userPhone || !userEmail))
              }
              className="bg-[#102050] hover:bg-[#1b356e] text-white px-6 py-3 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="modal-next-btn"
            >
              {step === 'contact' ? 'Book Appointment' : 'Continue'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}