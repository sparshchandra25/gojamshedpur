import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Mail, MapPin, ClipboardList, MessageSquare, 
  Briefcase, Star, CheckCircle, RefreshCw, AlertCircle, Sparkles, 
  Check, ToggleLeft, ToggleRight, ShieldAlert, LogOut, HeartHandshake,
  UserCheck, ShieldCheck
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Pro } from '../types';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string; phone: string; neighborhood: string } | null;
  onOpenAuth: () => void;
  onOpenRegister: () => void;
  onSignOut: () => void;
}

interface SupportInquiry {
  id: string;
  name: string;
  contact: string;
  category: string;
  message: string;
  createdAt?: any;
}

interface Booking {
  id: string;
  service: string;
  proName: string;
  proPhone: string;
  neighborhood: string;
  address: string;
  date: string;
  timeSlot: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function UserDashboard({ 
  isOpen, 
  onClose, 
  currentUser, 
  onOpenAuth, 
  onOpenRegister,
  onSignOut
}: UserDashboardProps) {
  
  // Tab control: 'bookings' | 'support' | 'provider_profile'
  const [activeTab, setActiveTab] = useState<'bookings' | 'support' | 'provider_profile'>('bookings');
  
  // Data lists
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userInquiries, setUserInquiries] = useState<SupportInquiry[]>([]);
  const [isSupportLoading, setIsSupportLoading] = useState(false);
  
  // Provider integration
  const [matchingProvider, setMatchingProvider] = useState<any | null>(null);
  const [providerBookings, setProviderBookings] = useState<Booking[]>([]);
  const [providerStatus, setProviderStatus] = useState<'online' | 'offline' | 'busy'>('online');

  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserData();
    }
  }, [isOpen, currentUser]);

  const loadUserData = () => {
    if (!currentUser) return;

    // 1. Load user bookings from localStorage
    try {
      const allBookingsStr = localStorage.getItem('jc_bookings') || '[]';
      const allBookings: Booking[] = JSON.parse(allBookingsStr);
      
      // Match by phone number or email address
      const matchedUserBookings = allBookings.filter(b => 
        (b.userEmail && b.userEmail.toLowerCase() === currentUser.email.toLowerCase()) || 
        (b.userPhone && b.userPhone.replace(/\D/g, '').includes(currentUser.phone.replace(/\D/g, '')))
      );
      
      // Sort newest first
      matchedUserBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUserBookings(matchedUserBookings);
    } catch (e) {
      console.error('Error loading user bookings:', e);
    }

    // 2. Load Firestore inquiries for this user
    fetchSupportInquiries();

    // 3. Check if user is a registered provider
    checkProviderStatus();
  };

  const fetchSupportInquiries = async () => {
    if (!currentUser) return;
    setIsSupportLoading(true);
    try {
      const qSnap = await getDocs(collection(db, 'support_inquiries'));
      const list: SupportInquiry[] = [];
      
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        // Match by phone/email/name
        const inqContact = (data.contact || '').toLowerCase();
        const userEmailLower = currentUser.email.toLowerCase();
        const userPhoneDigits = currentUser.phone.replace(/\D/g, '');
        const inqNameLower = (data.name || '').toLowerCase();
        const userNameLower = currentUser.name.toLowerCase();

        const isMatch = 
          inqContact.includes(userEmailLower) || 
          (userPhoneDigits && inqContact.replace(/\D/g, '').includes(userPhoneDigits)) ||
          inqNameLower === userNameLower;

        if (isMatch) {
          list.push({
            id: docSnap.id,
            name: data.name || 'Anonymous',
            contact: data.contact || 'N/A',
            category: data.category || 'General',
            message: data.message || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
          });
        }
      });

      // Sort newest first
      list.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });

      setUserInquiries(list);
    } catch (err) {
      console.error('Error loading user support inquiries:', err);
    } finally {
      setIsSupportLoading(false);
    }
  };

  const checkProviderStatus = () => {
    if (!currentUser) return;
    try {
      const allProsStr = localStorage.getItem('jc_pros') || '[]';
      const allPros = JSON.parse(allProsStr);
      
      const userPhoneClean = currentUser.phone.replace(/\D/g, '');
      const userEmailLower = currentUser.email.toLowerCase();

      // Look for a pro in localStorage matching phone or email
      const match = allPros.find((p: any) => {
        const proPhoneClean = (p.phone || '').replace(/\D/g, '');
        return (proPhoneClean && proPhoneClean.includes(userPhoneClean)) || 
               (p.email && p.email.toLowerCase() === userEmailLower);
      });

      if (match) {
        setMatchingProvider(match);
        setProviderStatus(match.status || 'online');
        
        // Load direct bookings assigned to this pro (match pro phone or pro name)
        const allBookingsStr = localStorage.getItem('jc_bookings') || '[]';
        const allBookings: Booking[] = JSON.parse(allBookingsStr);
        
        const assigned = allBookings.filter((b: any) => {
          const bProPhoneClean = (b.proPhone || '').replace(/\D/g, '');
          const proPhoneClean = (match.phone || '').replace(/\D/g, '');
          
          return (bProPhoneClean && bProPhoneClean === proPhoneClean) || 
                 (b.proName && b.proName.toLowerCase() === match.name.toLowerCase());
        });

        // Sort bookings newest first
        assigned.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProviderBookings(assigned);
      } else {
        setMatchingProvider(null);
      }
    } catch (e) {
      console.error('Error checking provider status:', e);
    }
  };

  // Change online/offline status for Provider
  const handleToggleProviderStatus = (newStatus: 'online' | 'offline' | 'busy') => {
    if (!matchingProvider) return;
    try {
      const allProsStr = localStorage.getItem('jc_pros') || '[]';
      const allPros = JSON.parse(allProsStr);
      
      const updated = allPros.map((p: any) => {
        if (p.id === matchingProvider.id) {
          return { ...p, status: newStatus };
        }
        return p;
      });

      localStorage.setItem('jc_pros', JSON.stringify(updated));
      setProviderStatus(newStatus);
      setMatchingProvider({ ...matchingProvider, status: newStatus });
    } catch (e) {
      console.error(e);
    }
  };

  // Provider: update client booking appointment status
  const handleUpdateBookingStatus = (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const allBookingsStr = localStorage.getItem('jc_bookings') || '[]';
      const allBookings: Booking[] = JSON.parse(allBookingsStr);
      
      const updated = allBookings.map((b: any) => {
        if (b.id === bookingId) {
          return { ...b, status };
        }
        return b;
      });

      localStorage.setItem('jc_bookings', JSON.stringify(updated));
      
      // Update state
      setProviderBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      
      // Reload user side as well
      loadUserData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="dashboard-panel-overlay">
      <div 
        className="bg-zinc-50 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col transition-all transform scale-100 h-[90vh]"
        id="dashboard-container"
      >
        {/* TOP BAR */}
        <div className="px-6 py-5 bg-[#102050] text-white flex items-center justify-between shrink-0" id="dashboard-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f1b42f]/10 text-[#f1b42f] rounded-xl flex items-center justify-center border border-[#f1b42f]/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base tracking-tight flex items-center gap-2">
                Jamshedpur Connect Dashboard
                {currentUser && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                    Member
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-300 font-medium">Manage your personal bookings and professional profiles</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 bg-zinc-800 hover:bg-zinc-700/80 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOT SIGNED IN STATE */}
        {!currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-zinc-50 to-zinc-100" id="dashboard-not-signed-in">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-lg text-center space-y-6">
              <div className="w-16 h-16 bg-[#102050]/15 text-[#102050] rounded-full flex items-center justify-center mx-auto shadow">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-display font-extrabold text-[#102050]">Member Access Required</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Sign in to view your placed service bookings, check active support inquiries, or view and manage your verified service professional profile!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="flex-1 py-3.5 bg-[#102050] hover:bg-[#1b356e] text-white hover:text-[#f1b42f] font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Sign In / Sign Up
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="flex-1 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-[#102050] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Onboard as Provider
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SIGNED IN WORKSPACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* SIDE NAVIGATION */}
            <div className="w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col justify-between p-6 shrink-0" id="dashboard-sidebar">
              <div className="space-y-6">
                {/* PROFILE INFORMATION BAR */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#102050] text-[#f1b42f] flex items-center justify-center font-display font-extrabold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#102050] truncate max-w-[130px]">{currentUser.name}</h4>
                      <p className="text-[10px] text-[#f1b42f] font-bold flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#f1b42f]/80" /> {currentUser.neighborhood || 'Visitor'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-500 font-medium space-y-1.5">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{currentUser.email}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono">{currentUser.phone}</span>
                    </p>
                  </div>
                </div>

                {/* NAVIGATION CHIPS */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-3">
                    Personal Hub
                  </span>
                  
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'bookings' 
                        ? 'bg-[#102050] text-white shadow' 
                        : 'text-gray-500 hover:bg-zinc-50 hover:text-[#102050]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ClipboardList className="w-4 h-4 shrink-0" />
                      <span>My Bookings</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      activeTab === 'bookings' ? 'bg-[#f1b42f] text-[#102050]' : 'bg-zinc-100 text-gray-500'
                    }`}>
                      {userBookings.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('support')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'support' 
                        ? 'bg-[#102050] text-white shadow' 
                        : 'text-gray-500 hover:bg-zinc-50 hover:text-[#102050]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span>My Support Requests</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      activeTab === 'support' ? 'bg-[#f1b42f] text-[#102050]' : 'bg-zinc-100 text-gray-500'
                    }`}>
                      {userInquiries.length}
                    </span>
                  </button>

                  <div className="h-[1px] bg-zinc-100 my-4" />
                  
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-3">
                    Service Professionals
                  </span>

                  <button
                    onClick={() => setActiveTab('provider_profile')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'provider_profile' 
                        ? 'bg-[#102050] text-white shadow' 
                        : 'text-gray-500 hover:bg-zinc-50 hover:text-[#102050]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span>Partner Profile Portal</span>
                    </div>
                    {matchingProvider && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* LOGOUT AT THE BOTTOM */}
              <div className="pt-6 border-t border-zinc-100">
                <button
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Account
                </button>
              </div>
            </div>

            {/* DASHBOARD VIEWPORT */}
            <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 p-6 sm:p-8">
              
              {/* TAB 1: MY BOOKINGS (USER BOOKING HISTORY) */}
              {activeTab === 'bookings' && (
                <div className="flex-1 flex flex-col overflow-hidden space-y-6" id="dashboard-tab-bookings">
                  <div className="flex items-center justify-between shrink-0">
                    <div>
                      <h4 className="font-display font-extrabold text-lg text-[#102050]">Your Booking Appointments</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Track status updates and schedules for your Jamshedpur home service requests.</p>
                    </div>
                    <button
                      onClick={loadUserData}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync List</span>
                    </button>
                  </div>

                  {userBookings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-8 text-center">
                      <ClipboardList className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                      <h5 className="text-sm font-extrabold text-[#102050]">No appointments scheduled yet</h5>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                        Ready to find a certified professional electrician, plumber, AC specialist, or deep cleaner? Place your first booking request now!
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          // Scroll to services
                          const section = document.getElementById('services-section');
                          if (section) section.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="mt-4 px-5 py-2.5 bg-[#102050] hover:bg-[#1b356e] text-white hover:text-[#f1b42f] text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
                      >
                        Explore Home Services
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1" id="user-bookings-scroll">
                      {userBookings.map((b) => (
                        <div 
                          key={b.id}
                          className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md"
                        >
                          {/* Left boundary highlight based on status */}
                          <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                            b.status === 'completed' ? 'bg-emerald-500' :
                            b.status === 'confirmed' ? 'bg-indigo-500' :
                            b.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-400'
                          }`} />

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-[#102050] bg-zinc-100 px-2 py-0.5 rounded">
                                  {b.id}
                                </span>
                                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                                  {b.service}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 mt-1">
                                Scheduled Date: <strong className="text-zinc-700">{b.date}</strong> at <strong className="text-zinc-700">{b.timeSlot}</strong>
                              </p>
                              <p className="text-xs text-zinc-400">
                                Address: <span className="font-medium text-zinc-600">{b.address}, {b.neighborhood}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center">
                              <div className="text-right hidden sm:block">
                                <span className="text-[10px] text-zinc-400 font-extrabold uppercase block leading-none mb-1">Status</span>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                                  b.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                                  b.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                                  b.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-150' : 
                                  'bg-amber-50 text-amber-700 border-amber-150'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    b.status === 'completed' ? 'bg-emerald-500' :
                                    b.status === 'confirmed' ? 'bg-indigo-500' :
                                    b.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                                  }`} />
                                  {b.status.toUpperCase()}
                                </span>
                              </div>

                              <div className="bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl text-center min-w-[120px]">
                                <span className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-wide block mb-0.5">Assigned Partner</span>
                                <span className="text-xs font-extrabold text-[#102050] block truncate">{b.proName}</span>
                                {b.proPhone && (
                                  <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{b.proPhone}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {b.notes && (
                            <div className="mt-3.5 bg-zinc-50 border border-zinc-150 p-3 rounded-xl text-xs text-zinc-600 leading-normal">
                              <span className="font-extrabold text-[#102050] block text-[10px] uppercase tracking-wider mb-0.5">Special Instructions:</span>
                              {b.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MY SUPPORT REQUESTS (FIRESTORE) */}
              {activeTab === 'support' && (
                <div className="flex-1 flex flex-col overflow-hidden space-y-6" id="dashboard-tab-support">
                  <div className="flex items-center justify-between shrink-0">
                    <div>
                      <h4 className="font-display font-extrabold text-lg text-[#102050]">Your Support Messages</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Messages and inquiries submitted to customer support, synced directly with Firebase Firestore.</p>
                    </div>
                    <button
                      onClick={fetchSupportInquiries}
                      disabled={isSupportLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSupportLoading ? 'animate-spin' : ''}`} />
                      <span>Sync Firestore</span>
                    </button>
                  </div>

                  {isSupportLoading && userInquiries.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-8 text-center">
                      <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                      <p className="text-xs font-bold text-[#102050]">Connecting to Firestore database...</p>
                    </div>
                  ) : userInquiries.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                      <h5 className="text-sm font-extrabold text-[#102050]">No inquiries submitted yet</h5>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                        If you need any assistance, you can submit questions or support inquiries directly via the FAQ Support portal.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1" id="user-inquiries-scroll">
                      {userInquiries.map((inq) => (
                        <div 
                          key={inq.id}
                          className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md"
                        >
                          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#f1b42f]" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                              {inq.category}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {inq.createdAt instanceof Date ? inq.createdAt.toLocaleString('en-IN') : 'Submitted'}
                            </span>
                          </div>

                          <div className="mt-3.5 text-xs text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-150 p-4 rounded-xl">
                            {inq.message}
                          </div>
                          <div className="mt-2 text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                            <span>Reference ID:</span>
                            <span className="font-mono text-zinc-500">{inq.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SERVICE PROVIDER PORTAL */}
              {activeTab === 'provider_profile' && (
                <div className="flex-1 flex flex-col overflow-hidden space-y-6" id="dashboard-tab-provider">
                  
                  {/* CASE 1: USER IS NOT REGISTERED AS A SERVICE PROVIDER */}
                  {!matchingProvider ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-zinc-200/60 p-8 shadow-sm text-center space-y-6">
                      <div className="w-16 h-16 bg-[#f1b42f]/10 text-[#f1b42f] rounded-2xl border border-[#f1b42f]/30 flex items-center justify-center mx-auto">
                        <HeartHandshake className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-display font-extrabold text-[#102050]">Partner with Go Jamshedpur</h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                          Grow your independent service business! Register as an authorized professional electrician, plumber, cleaner, or AC specialist to start receiving local service booking requests directly on your mobile device.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto w-full pt-2">
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 text-left">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
                          <h5 className="font-extrabold text-xs text-[#102050]">Direct Local Leads</h5>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Receive work matches near your Jamshedpur neighborhood coverage.</p>
                        </div>
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 text-left">
                          <Star className="w-5 h-5 text-amber-500 mb-2" />
                          <h5 className="font-extrabold text-xs text-[#102050]">Professional Badges</h5>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Gain customer trust through our verified professional rating engine.</p>
                        </div>
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 text-left">
                          <Sparkles className="w-5 h-5 text-indigo-500 mb-2" />
                          <h5 className="font-extrabold text-xs text-[#102050]">Zero Platform Fees</h5>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Keep 100% of your earnings. We offer premium, direct connection channels.</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenRegister();
                        }}
                        className="px-6 py-3.5 bg-[#102050] hover:bg-[#1b356e] text-white hover:text-[#f1b42f] text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Start 2-Minute Provider Onboarding
                      </button>
                    </div>
                  ) : (
                    
                    /* CASE 2: USER IS A REGISTERED SERVICE PROVIDER */
                    <div className="flex-1 flex flex-col overflow-hidden space-y-6" id="dashboard-provider-portal">
                      
                      {/* HEADER SUMMARY SECTION */}
                      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                            <Briefcase className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-display font-extrabold text-base text-[#102050]">{matchingProvider.name}</h4>
                              {matchingProvider.verified && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                  VERIFIED PRO
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span>Specialist: <strong>{matchingProvider.category}</strong></span>
                              <span className="text-zinc-300">•</span>
                              <span>Coverage: <strong>{matchingProvider.neighborhood}</strong></span>
                              <span className="text-zinc-300">•</span>
                              <span>Experience: <strong>{matchingProvider.experience} Years</strong></span>
                            </p>
                          </div>
                        </div>

                        {/* STATUS TOGGLE MECHANISM */}
                        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
                          <div>
                            <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wide block leading-none mb-1">Service Status</span>
                            <span className="text-xs font-extrabold text-[#102050] block capitalize">
                              {providerStatus === 'online' ? '🟢 Online & Ready' : 
                               providerStatus === 'busy' ? '🟡 Busy / On Duty' : '🔴 Offline'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleToggleProviderStatus('online')}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                providerStatus === 'online' ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-150 border border-zinc-200'
                              }`}
                            >
                              Ready
                            </button>
                            <button
                              onClick={() => handleToggleProviderStatus('busy')}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                providerStatus === 'busy' ? 'bg-amber-500 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-150 border border-zinc-200'
                              }`}
                            >
                              Busy
                            </button>
                            <button
                              onClick={() => handleToggleProviderStatus('offline')}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                providerStatus === 'offline' ? 'bg-rose-500 text-white' : 'bg-white text-zinc-500 hover:bg-zinc-150 border border-zinc-200'
                              }`}
                            >
                              Off
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* STATS STRIP */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
                        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm text-center">
                          <span className="text-[9px] text-zinc-400 font-extrabold uppercase block tracking-wider mb-1">Your Base Visiting Rate</span>
                          <span className="text-lg font-extrabold text-[#102050] font-mono">₹{matchingProvider.startingPrice || 299}</span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">Fixed call-out charges</span>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm text-center">
                          <span className="text-[9px] text-zinc-400 font-extrabold uppercase block tracking-wider mb-1">Professional Rating</span>
                          <span className="text-lg font-extrabold text-[#102050] flex items-center justify-center gap-1 font-mono">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                            {matchingProvider.rating || 5.0}
                          </span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">Based on community reviews</span>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm text-center">
                          <span className="text-[9px] text-zinc-400 font-extrabold uppercase block tracking-wider mb-1">Assigned Bookings</span>
                          <span className="text-lg font-extrabold text-[#102050] font-mono">{providerBookings.length}</span>
                          <span className="text-[9px] text-zinc-400 block mt-0.5">Direct client matched</span>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm text-center">
                          <span className="text-[9px] text-zinc-400 font-extrabold uppercase block tracking-wider mb-1">Profile Status</span>
                          <span className="text-xs font-bold text-emerald-600 block mt-1">Verified Partner</span>
                          <span className="text-[9px] text-zinc-400 block">Jamshedpur Local DB</span>
                        </div>
                      </div>

                      {/* DIRECT CLIENT BOOKING PIPELINE LIST */}
                      <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                        <div className="flex items-center justify-between shrink-0">
                          <div>
                            <h5 className="font-display font-extrabold text-sm text-[#102050]">Your Customer Appointment Dispatch</h5>
                            <p className="text-[11px] text-gray-400">Manage status updates and contact information for direct user bookings matched with you.</p>
                          </div>
                          <button
                            onClick={loadUserData}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Refresh Jobs</span>
                          </button>
                        </div>

                        {providerBookings.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-6 text-center">
                            <ClipboardList className="w-10 h-10 text-zinc-300 mx-auto mb-2.5" />
                            <h6 className="text-xs font-bold text-[#102050]">No client bookings matched yet</h6>
                            <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed mt-1">
                              Keep your service status toggled to <strong>Ready</strong>. When a user requests your category in {matchingProvider.neighborhood}, you'll receive direct dispatches!
                            </p>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1" id="provider-bookings-scroll">
                            {providerBookings.map((b) => (
                              <div 
                                key={b.id}
                                className="bg-white rounded-xl p-4.5 border border-zinc-200 shadow-sm relative overflow-hidden flex flex-col justify-between gap-4.5"
                              >
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500" />
                                
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                                        {b.id}
                                      </span>
                                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                        {b.service}
                                      </span>
                                      <span className="text-[10px] text-zinc-400 font-mono">
                                        Placed {new Date(b.createdAt).toLocaleDateString('en-IN')}
                                      </span>
                                    </div>
                                    <div className="text-xs font-semibold text-zinc-700">
                                      Customer: <strong className="text-[#102050] font-bold text-sm">{b.userName}</strong>
                                    </div>
                                    <div className="text-xs text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                      <span>WhatsApp: <strong className="font-mono font-bold text-[#102050]">{b.userPhone}</strong></span>
                                      <span className="text-zinc-300">|</span>
                                      <span>Area: <strong className="font-medium text-zinc-700">{b.address}, {b.neighborhood}</strong></span>
                                    </div>
                                    <div className="text-xs text-indigo-600 font-bold bg-indigo-50/50 border border-indigo-100 px-2.5 py-1 rounded-lg w-fit mt-1.5">
                                      Appointment: {b.date} ({b.timeSlot})
                                    </div>
                                  </div>

                                  {/* WORK STATUS MANAGEMENT OPTIONS */}
                                  <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-3 flex flex-col justify-between gap-2.5 self-stretch sm:self-center sm:min-w-[180px]">
                                    <div>
                                      <span className="text-[8px] text-zinc-400 font-extrabold uppercase block mb-1">Update Client Appointment Status</span>
                                      <div className="flex flex-wrap gap-1">
                                        <button
                                          onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                          className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                            b.status === 'confirmed' ? 'bg-indigo-500 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                                          }`}
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                                          className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                            b.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                                          }`}
                                        >
                                          Complete
                                        </button>
                                        <button
                                          onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                          className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                            b.status === 'cancelled' ? 'bg-rose-500 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                                          }`}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="text-center pt-1 border-t border-zinc-200">
                                      <span className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-wide inline-block mr-1">Current Status:</span>
                                      <span className={`text-[10px] font-bold capitalize ${
                                        b.status === 'completed' ? 'text-emerald-600' :
                                        b.status === 'confirmed' ? 'text-indigo-600' :
                                        b.status === 'cancelled' ? 'text-rose-600' : 'text-amber-500'
                                      }`}>
                                        {b.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {b.notes && (
                                  <div className="bg-zinc-50 border border-zinc-150 p-2.5 rounded-lg text-xs text-zinc-600 font-normal">
                                    <span className="font-extrabold text-[#102050] text-[9px] uppercase tracking-wider block mb-0.5">Customer Message:</span>
                                    {b.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
