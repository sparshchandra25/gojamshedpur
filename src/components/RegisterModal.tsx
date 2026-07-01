import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, User, Phone, Award, Check, Lock, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { JAMSHEDPUR_NEIGHBORHOODS } from '../data';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [step, setStep] = useState<'basic' | 'otp' | 'trade' | 'experience' | 'submitted'>('basic');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [trade, setTrade] = useState('');
  const [experience, setExperience] = useState('5');
  const [certifications, setCertifications] = useState(false);

  // Verification & validation states
  const [phoneError, setPhoneError] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Loading and helper states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Refs for recaptcha and confirmation result
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<any>(null);

  // Initialize invisible Recaptcha Verifier
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const container = document.getElementById('recaptcha-container');
      if (container && !recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved, ready to proceed
            },
            'expired-callback': () => {
              setPhoneError('reCAPTCHA verification expired. Please submit again.');
            }
          });
        } catch (err: any) {
          console.error('Error creating invisible RecaptchaVerifier:', err);
        }
      }
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (e) {
          // Ignore clear errors during unmount
        }
      }
    };
  }, [isOpen]);

  // Countdown timer for Resend OTP option
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  // Handles sending the real OTP using Firebase Authentication
  const handleSendOtp = async () => {
    // Clean phone number of any non-digit characters for 10-digit validation
    const cleanedPhone = phone.replace(/\D/g, '');
    
    if (cleanedPhone.length !== 10) {
      setPhoneError('WhatsApp / Phone number must be exactly 10 digits (e.g., 9876543210).');
      return;
    }
    
    setPhoneError('');
    setIsSendingOtp(true);
    setOtpError('');

    try {
      // Prepend +91 country code for Indian phone verification
      const formattedPhone = '+91' + cleanedPhone;

      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      // Send the real SMS code via Firebase
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
      confirmationResultRef.current = confirmationResult;
      
      // Reset input, start 60s countdown, and advance to verification step
      setOtpInput('');
      setCountdown(60);
      setStep('otp');
    } catch (err: any) {
      console.error('Firebase SMS transmission failure:', err);
      let errorMsg = 'Failed to send OTP. Please check your network connectivity and try again.';
      
      if (err.code === 'auth/invalid-phone-number') {
        errorMsg = 'Invalid phone number format. Please enter a valid 10-digit mobile number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'This number has been temporarily blocked due to too many request attempts. Please try again later.';
      } else if (err.code === 'auth/captcha-check-failed') {
        errorMsg = 'reCAPTCHA human validation failed. Please reload the tab and try again.';
      } else if (err.message && err.message.includes('reCAPTCHA')) {
        errorMsg = 'reCAPTCHA configuration error. Make sure your domain is registered in Firebase console.';
      }
      
      setPhoneError(errorMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handles verifying the OTP entered by the user
  const handleVerifyOtp = async () => {
    const cleanedCode = otpInput.replace(/\D/g, '');
    if (cleanedCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      if (!confirmationResultRef.current) {
        throw new Error('Onboarding session expired. Please go back and request a new code.');
      }

      // Verify OTP code with Firebase
      const result = await confirmationResultRef.current.confirm(cleanedCode);
      
      // Successfully authenticated! Go to profession step
      setOtpError('');
      setStep('trade');
    } catch (err: any) {
      console.error('Firebase OTP confirmation failure:', err);
      let errorMsg = 'Verification failed. The OTP code you entered is incorrect.';
      
      if (err.code === 'auth/invalid-verification-code') {
        errorMsg = 'Incorrect OTP code. Please enter the correct code sent to your mobile.';
      } else if (err.code === 'auth/code-expired') {
        errorMsg = 'This OTP code has expired. Please request a new code.';
      } else if (err.code === 'auth/session-expired') {
        errorMsg = 'Your verification session expired. Please go back and request a new code.';
      }
      
      setOtpError(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (step === 'basic') {
      handleSendOtp();
    } 
    else if (step === 'otp') {
      handleVerifyOtp();
    } 
    else if (step === 'trade') {
      setStep('experience');
    } 
    else if (step === 'experience') {
      // Save provider registration to local db as successfully onboarding
      try {
        const existingPros = JSON.parse(localStorage.getItem('jc_pros') || '[]');
        const newPro = {
          id: 'PRO-' + Math.floor(100000 + Math.random() * 900000),
          name,
          phone: '+91' + phone.replace(/\D/g, ''),
          category: trade,
          neighborhood,
          rating: 5.0,
          reviews: 0,
          experience: parseInt(experience, 10),
          verified: true,
          status: 'online',
          onboardedAt: new Date().toISOString()
        };
        existingPros.push(newPro);
        localStorage.setItem('jc_pros', JSON.stringify(existingPros));
      } catch (err) {
        console.error('Failed to save to mock db:', err);
      }
      setStep('submitted');
    }
  };

  const handleBack = () => {
    if (step === 'otp') setStep('basic');
    else if (step === 'trade') setStep('otp');
    else if (step === 'experience') setStep('trade');
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setNeighborhood('');
    setTrade('');
    setExperience('5');
    setCertifications(false);
    setPhoneError('');
    setOtpInput('');
    setOtpError('');
    setStep('basic');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="register-modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all transform scale-100 max-h-[90vh]" id="register-modal-container">
        
        {/* Modal Header */}
        {step !== 'submitted' && (
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-display font-extrabold text-[#0f172a] text-lg">Partner Onboarding</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Grow your business with Go Jamshedpur</p>
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
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Basic Information */}
          {step === 'basic' && (
            <div className="space-y-4" id="reg-step-basic">
              {phoneError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2 text-xs font-semibold animate-shake" id="phone-send-error">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{phoneError}</span>
                </div>
              )}

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wide mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm text-[#0f172a] placeholder-gray-400 font-medium outline-none focus:border-[#0f172a] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wide mb-2">WhatsApp Number (Verified via SMS)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 font-mono">+91</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-14 pr-4 text-sm text-[#0f172a] placeholder-gray-400 font-mono font-medium outline-none focus:border-[#0f172a] focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">We will send a real Firebase SMS verification OTP to this mobile number.</p>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wide mb-2">Primary Neighborhood Coverage</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-[#0f172a] font-medium outline-none focus:border-[#0f172a] focus:bg-white transition-all appearance-none"
                >
                  <option value="">Select location</option>
                  {JAMSHEDPUR_NEIGHBORHOODS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 1.5: OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-5" id="reg-step-otp">
              <div className="text-center max-w-sm mx-auto space-y-2">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mx-auto text-sky-600 border border-sky-100 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-display font-extrabold text-[#0f172a] text-base">Verify your number</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  We have sent a 6-digit verification code to <strong className="text-slate-800">+91 {phone}</strong>
                </p>
              </div>

              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2 text-xs font-semibold animate-shake" id="otp-verify-error">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* Code input */}
              <div className="flex flex-col max-w-xs mx-auto">
                <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wide mb-2 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-[0.5em] font-mono font-black bg-gray-50 border border-gray-200 rounded-xl py-3 text-lg text-[#0f172a] outline-none focus:border-[#0f172a] focus:bg-white transition-all"
                  id="otp-input-field"
                />
              </div>

              {/* Resend OTP Actions */}
              <div className="text-center" id="otp-resend-container">
                {countdown > 0 ? (
                  <p className="text-xs text-gray-400 font-medium">
                    Resend code in <strong className="text-gray-600 font-bold">{countdown}s</strong>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    Resend OTP Code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Trade Selection */}
          {step === 'trade' && (
            <div className="space-y-4" id="reg-step-trade">
              <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wide mb-2 block text-center">
                Select Your Core Profession / Trade
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Electrician',
                  'Plumber',
                  'AC Specialist',
                  'Deep Cleaning',
                  'Painter',
                  'Carpenter',
                  'Pest Control Expert',
                  'Solar Technician'
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTrade(item)}
                    className={`py-4 px-4 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      trade === item
                        ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-sm scale-[1.02]'
                        : 'border-gray-200 bg-white text-[#1c2541] hover:border-gray-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Experience details */}
          {step === 'experience' && (
            <div className="space-y-5" id="reg-step-exp">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wide mb-2">
                  Years of Professional Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-[#0f172a] font-medium outline-none focus:border-[#0f172a]"
                >
                  <option value="1">1 Year or less</option>
                  <option value="3">2 - 4 Years</option>
                  <option value="5">5 - 8 Years</option>
                  <option value="10">8 - 12 Years</option>
                  <option value="15">12+ Years</option>
                </select>
              </div>

              {/* Verified Badge Declaration */}
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <Award className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Background Checks & Verification</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal mt-1">
                    Go Jamshedpur maintains strict safety policies. Partners must present government ID proof, a police clearance certificate, and proof of address before being listed.
                  </p>
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-center gap-3 cursor-pointer p-1" id="certifications-agreement">
                <input
                  type="checkbox"
                  checked={certifications}
                  onChange={(e) => setCertifications(e.target.checked)}
                  className="w-4 h-4 text-[#0f172a] border-gray-300 rounded focus:ring-[#0f172a]"
                />
                <span className="text-xs text-gray-600 font-semibold leading-normal">
                  I agree to undergo standard verification background checks.
                </span>
              </label>
            </div>
          )}

          {/* STEP 4: Success Message */}
          {step === 'submitted' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-6" id="reg-step-success">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-50 shadow-md">
                <Check className="w-8 h-8 text-white stroke-[3px]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-[#0f172a] text-2xl tracking-tight">
                  Application Submitted!
                </h3>
                <p className="mt-3 text-sm text-gray-500 font-medium max-w-sm leading-relaxed mx-auto">
                  Thank you for applying, <strong>{name}</strong>. Our local Jamshedpur verification officer will call you within 24 hours on <strong>+91 {phone}</strong> to schedule your onboarding.
                </p>
              </div>

              {/* Next Steps Box */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left text-xs max-w-sm mx-auto space-y-3">
                <h4 className="font-bold text-[#0f172a] uppercase tracking-wider text-[10px]">What happens next?</h4>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <p className="text-gray-600 leading-normal font-medium">Verify your trade certification and photo identity proof.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <p className="text-gray-600 leading-normal font-medium">Undergo standard background validation clearance.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <p className="text-gray-600 leading-normal font-medium">Get listed on Go Jamshedpur and receive job requests instantly!</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}

        </div>

        {/* Modal Buttons Footer */}
        {step !== 'submitted' && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
            {step === 'basic' ? (
              <div />
            ) : (
              <button
                onClick={handleBack}
                disabled={isVerifying}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={
                (step === 'basic' && (!name || !phone || !neighborhood || isSendingOtp)) ||
                (step === 'otp' && (!otpInput || isVerifying)) ||
                (step === 'trade' && !trade) ||
                (step === 'experience' && !certifications)
              }
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              {isSendingOtp || isVerifying ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {step === 'experience' ? 'Submit Application' : 'Continue'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
