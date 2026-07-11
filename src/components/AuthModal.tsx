import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Lock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string; phone: string; neighborhood: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [JAMSHEDPUR_NEIGHBORHOODS, setJamshedpurNeighborhoods] = useState<string[]>([]);
  
  // Status states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset fields on open
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setNeighborhood('');
      api.getNeighborhoods().then(setJamshedpurNeighborhoods).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }
    if (isSignUp && (!name || !phone)) {
      setError('Please fill in your name and phone number.');
      setIsLoading(false);
      return;
    }

    const request = isSignUp
      ? api.signup({ name, email, password, phone, neighborhood })
      : api.login({ email, password });

    request
      .then(({ user }) => {
        setSuccessMsg(isSignUp ? `Welcome aboard, ${user.name}! Your account has been saved.` : `Welcome back, ${user.name}!`);
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, isSignUp ? 1800 : 1500);
      })
      .catch((err: any) => {
        setError(err.message || 'An error occurred during authentication.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="auth-modal-overlay">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all transform scale-100 max-h-[95vh]" 
        id="auth-modal-container"
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0" id="auth-modal-header">
          <div>
            <h3 className="font-display font-extrabold text-[#102050] text-lg">
              {isSignUp ? 'Create Visitor Account' : 'Sign In'}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {isSignUp ? 'Register to save your profile in our local database' : 'Access your Go Jamshedpur profile'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1" id="auth-modal-body">
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-shake" id="auth-error-banner">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold" id="auth-success-banner">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            
            {/* SIGN UP ONLY FIELDS */}
            {isSignUp && (
              <>
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sparsh Kumar"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-1.5">
                    WhatsApp / Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Neighborhood Locality */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-1.5">
                    Your Local Area / Neighborhood
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#102050] font-medium outline-none focus:border-[#102050] focus:bg-white transition-all appearance-none"
                    >
                      <option value="">Select your locality</option>
                      {JAMSHEDPUR_NEIGHBORHOODS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[#102050] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#102050] placeholder-gray-400 font-medium outline-none focus:border-[#102050] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="w-full bg-[#102050] hover:bg-[#1b356e] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
              id="auth-submit-btn"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {isSignUp ? 'Register Visitor Account' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Tab Switcher Link */}
          <div className="mt-6 text-center text-xs text-gray-500" id="auth-tab-toggle">
            {isSignUp ? (
              <p>
                Already have a visitor profile?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-[#102050] font-bold hover:text-[#f1b42f] underline decoration-[#f1b42f] ml-1 cursor-pointer"
                >
                  Sign In here
                </button>
              </p>
            ) : (
              <p>
                First time visiting Go Jamshedpur?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-[#102050] font-bold hover:text-[#f1b42f] underline decoration-[#f1b42f] ml-1 cursor-pointer"
                >
                  Create Account / Register Here
                </button>
              </p>
            )}
          </div>

          {/* Extra Database persistence note */}
          <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-gray-400 leading-normal">
            <strong>Database Status:</strong> Secure account storage. Accounts are saved on our servers and persist across devices and browser sessions. Go Jamshedpur does not share your contact credentials with third parties.
          </div>

        </div>

      </div>
    </div>
  );
}
