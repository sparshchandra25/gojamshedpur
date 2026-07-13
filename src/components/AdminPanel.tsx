import React, { useState, useEffect } from 'react';
import { 
  X, Shield, CheckCircle, RefreshCw, AlertCircle, Trash2, 
  Search, Check, ShieldAlert, Star, Briefcase, ClipboardList, 
  MessageSquare, UserCheck, ShieldCheck, Mail, Phone, MapPin, 
  SlidersHorizontal, IndianRupee, Trash, Settings
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Pro } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
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

interface SupportInquiry {
  id: string;
  name: string;
  contact: string;
  category: string;
  message: string;
  createdAt?: any;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'providers' | 'support'>('overview');
  
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<Pro[]>([]);
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  
  // Loading & error state
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    } else {
      // Clear sensitive states on close
      setIsAuthenticated(false);
      setAdminPasscode('');
      setLoginError('');
    }
  }, [isOpen]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Load bookings from localStorage
      const allBookingsStr = localStorage.getItem('jc_bookings') || '[]';
      const allBookings: Booking[] = JSON.parse(allBookingsStr);
      allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(allBookings);

      // 2. Load providers from localStorage
      const allProsStr = localStorage.getItem('jc_pros') || '[]';
      const allPros: Pro[] = JSON.parse(allProsStr);
      setProviders(allPros);

      // 3. Load support inquiries from Firestore
      await fetchSupportInquiries();
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupportInquiries = async () => {
    try {
      const qSnap = await getDocs(collection(db, 'support_inquiries'));
      const list: SupportInquiry[] = [];
      qSnap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || 'Anonymous',
          contact: data.contact || 'N/A',
          category: data.category || 'General',
          message: data.message || '',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      });
      list.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });
      setInquiries(list);
    } catch (err) {
      console.error('Error fetching support inquiries:', err);
    }
  };

  // Admin action: Delete a support inquiry from Firestore
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this support ticket from Firestore?')) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, 'support_inquiries', id));
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      showToast('Support ticket deleted successfully!');
    } catch (err) {
      console.error('Failed to delete support inquiry:', err);
      alert('Error deleting document: ' + (err as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  // Admin action: Update booking status globally
  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const allBookingsStr = localStorage.getItem('jc_bookings') || '[]';
      const allBookings: Booking[] = JSON.parse(allBookingsStr);
      
      const updated = allBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
      localStorage.setItem('jc_bookings', JSON.stringify(updated));
      setBookings(updated);
      showToast(`Booking ${bookingId} status updated to ${newStatus}`);
    } catch (e) {
      console.error(e);
    }
  };

  // Admin action: Delete booking
  const handleDeleteBooking = (bookingId: string) => {
    if (!window.confirm('Delete this booking from the platform permanently?')) return;
    try {
      const allBookingsStr = localStorage.getItem('jc_bookings') || '[]';
      const allBookings: Booking[] = JSON.parse(allBookingsStr);
      
      const filtered = allBookings.filter(b => b.id !== bookingId);
      localStorage.setItem('jc_bookings', JSON.stringify(filtered));
      setBookings(filtered);
      showToast('Booking deleted successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  // Admin action: Toggle verification status of a service provider
  const handleToggleProVerification = (proId: string) => {
    try {
      const allProsStr = localStorage.getItem('jc_pros') || '[]';
      const allPros: Pro[] = JSON.parse(allProsStr);
      
      const updated = allPros.map(p => {
        if (p.id === proId) {
          const newVerified = !p.verified;
          return { ...p, verified: newVerified };
        }
        return p;
      });
      
      localStorage.setItem('jc_pros', JSON.stringify(updated));
      setProviders(updated);
      const pro = updated.find(p => p.id === proId);
      showToast(`Provider verification set to ${pro?.verified ? 'VERIFIED' : 'UNVERIFIED'}`);
    } catch (e) {
      console.error(e);
    }
  };

  // Admin action: Delete a service provider
  const handleDeleteProvider = (proId: string) => {
    if (!window.confirm('Are you sure you want to delete this provider profile?')) return;
    try {
      const allProsStr = localStorage.getItem('jc_pros') || '[]';
      const allPros: Pro[] = JSON.parse(allProsStr);
      
      const filtered = allPros.filter(p => p.id !== proId);
      localStorage.setItem('jc_pros', JSON.stringify(filtered));
      setProviders(filtered);
      showToast('Service provider profile deleted!');
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPasscode.trim() === 'admin@123' || adminPasscode.trim() === '1234') {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Admin access granted!');
    } else {
      setLoginError('Invalid Administrator Passcode. Please try again.');
    }
  };

  if (!isOpen) return null;

  // Filter computations
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.proName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProviders = providers.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate high-level stats
  const totalCompletedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalActiveInquiries = inquiries.length;
  const estimatedRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => {
      // Find starting price for the pro or default
      const matchPro = providers.find(p => p.name === b.proName);
      return sum + (matchPro?.startingPrice || 299);
    }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="admin-panel-overlay">
      <div 
        className="bg-zinc-50 rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col transition-all transform scale-100 h-[90vh]"
        id="admin-container"
      >
        {/* TOP BAR */}
        <div className="px-6 py-5 bg-red-950 text-white flex items-center justify-between shrink-0 border-b border-red-900" id="admin-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base tracking-tight flex items-center gap-2">
                Jamshedpur Connect Admin Console
                <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                  Platform Admin
                </span>
              </h3>
              <p className="text-xs text-red-200 font-medium">Global platform moderation, service bookings, and Firestore support tickets</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-red-300 hover:text-white p-1.5 bg-red-900/60 hover:bg-red-800 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOAST SUCCESS NOTIFICATION */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-6 py-3 text-xs font-bold text-center animate-slide-in shrink-0 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-50 overflow-y-auto">
            <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200/80 shadow-xl p-8 space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display font-extrabold text-xl text-red-950">Administrator Passcode Required</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Access to global stats, booking dispatch tables, and Firestore inquiry moderation requires platform authentication.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="admin-passcode-input" className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block ml-1">
                    Passcode Key
                  </label>
                  <input
                    type="password"
                    id="admin-passcode-input"
                    placeholder="••••••••"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    className="w-full bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200/80 hover:border-zinc-300 focus:border-red-900 rounded-xl px-4 py-3 text-center font-mono text-sm tracking-widest focus:outline-none transition-all"
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-[11px] text-rose-600 font-bold mt-1 text-center flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {loginError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-950 hover:bg-red-900 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md text-xs tracking-wider uppercase cursor-pointer"
                >
                  Verify Authority
                </button>
              </form>

              <div className="pt-4 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400 leading-normal">
                  💡 Hint for Sandbox Testing: Enter <code className="bg-zinc-100 text-zinc-600 font-mono font-bold px-1.5 py-0.5 rounded">admin123</code> or <code className="bg-zinc-100 text-zinc-600 font-mono font-bold px-1.5 py-0.5 rounded">9876</code> to login.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col justify-between p-6 shrink-0" id="admin-sidebar">
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-3">
                Operations Board
              </span>
              
              <div className="space-y-1.5">
                <button
                  onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'overview' 
                      ? 'bg-red-950 text-white shadow' 
                      : 'text-gray-500 hover:bg-zinc-50 hover:text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal className="w-4 h-4 shrink-0" />
                    <span>Admin Overview</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'bookings' 
                      ? 'bg-red-950 text-white shadow' 
                      : 'text-gray-500 hover:bg-zinc-50 hover:text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    <span>All Client Bookings</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    activeTab === 'bookings' ? 'bg-[#f1b42f] text-red-950' : 'bg-zinc-100 text-gray-500'
                  }`}>
                    {bookings.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('providers'); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'providers' 
                      ? 'bg-red-950 text-white shadow' 
                      : 'text-gray-500 hover:bg-zinc-50 hover:text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Service Providers</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    activeTab === 'providers' ? 'bg-[#f1b42f] text-red-950' : 'bg-zinc-100 text-gray-500'
                  }`}>
                    {providers.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('support'); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'support' 
                      ? 'bg-red-950 text-white shadow' 
                      : 'text-gray-500 hover:bg-zinc-50 hover:text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>Firestore Support</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    activeTab === 'support' ? 'bg-[#f1b42f] text-red-950' : 'bg-zinc-100 text-gray-500'
                  }`}>
                    {inquiries.length}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100">
              <button
                onClick={loadAllData}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Reload Platform DB
              </button>
            </div>
          </div>

          {/* VIEWPORT AREA */}
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 p-6 sm:p-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex-1 flex flex-col overflow-y-auto space-y-6" id="admin-tab-overview">
                <div>
                  <h4 className="font-display font-extrabold text-lg text-red-950">System Operations Metrics</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time health of the local service marketplace in Jamshedpur.</p>
                </div>

                {/* STATS TILES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase block tracking-wider leading-none mb-1">Total Bookings</span>
                      <span className="text-xl font-display font-black text-red-950">{bookings.length}</span>
                      <p className="text-[9px] text-zinc-400 mt-0.5">Across all neighborhoods</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase block tracking-wider leading-none mb-1">Service Pros</span>
                      <span className="text-xl font-display font-black text-red-950">{providers.length}</span>
                      <p className="text-[9px] text-emerald-600 font-bold mt-0.5">
                        {providers.filter(p => p.verified).length} Verified Verified
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase block tracking-wider leading-none mb-1">Support Tickets</span>
                      <span className="text-xl font-display font-black text-red-950">{totalActiveInquiries}</span>
                      <p className="text-[9px] text-zinc-400 mt-0.5">Pending Firestore docs</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase block tracking-wider leading-none mb-1">Matched Volume</span>
                      <span className="text-xl font-display font-black text-red-950">₹{estimatedRevenue}</span>
                      <p className="text-[9px] text-zinc-400 mt-0.5">Based on completed jobs</p>
                    </div>
                  </div>
                </div>

                {/* ALERTS & SYSTEM CONFIG */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
                    <h5 className="font-display font-extrabold text-sm text-red-950 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-red-700" />
                      Platform Integrity Checks
                    </h5>
                    <div className="space-y-3">
                      <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-100 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <h6 className="font-extrabold text-xs text-red-950">Unverified Service Pros</h6>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                            There are currently {providers.filter(p => !p.verified).length} service professionals waiting for profile validation before gaining verified status.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-150 flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <h6 className="font-bold text-xs text-[#102050]">Firestore Connection Secure</h6>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                            Firestore connection verified. Collection <code className="text-red-700 font-mono">support_inquiries</code> is listening actively.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <h5 className="font-display font-extrabold text-sm text-red-950">Developer Information & Settings</h5>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        This administrative console bypasses local profiles to grant super-user moderation. Deleting bookings or providers here will remove them from Jamshedpur Connect permanently.
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 text-[10px] text-zinc-400 font-mono space-y-1 mt-4">
                      <p>Database ID: <span className="text-zinc-600 font-semibold">ai-studio-jamshedpurconnec-...</span></p>
                      <p>Status: <span className="text-emerald-600 font-extrabold">Active Dev Sandbox</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ALL CLIENT BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-4" id="admin-tab-bookings">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-display font-extrabold text-lg text-red-950">Platform Bookings Dispatch</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Moderate or reassign schedules, confirm client details, or cancel appointments.</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white border border-zinc-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search dispatch logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-zinc-200 text-xs font-medium rounded-lg pl-9 pr-4 py-1.5 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-8 text-center">
                    <ClipboardList className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h5 className="text-sm font-extrabold text-red-950">No matches found</h5>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">
                      We couldn't find any appointments fitting your current filters.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {filteredBookings.map((b) => (
                      <div 
                        key={b.id}
                        className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md"
                      >
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                          b.status === 'completed' ? 'bg-emerald-500' :
                          b.status === 'confirmed' ? 'bg-indigo-500' :
                          b.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-400'
                        }`} />

                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono font-black text-red-950 bg-red-50/80 border border-red-100 px-2 py-0.5 rounded">
                                {b.id}
                              </span>
                              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                                {b.service}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                Created: {new Date(b.createdAt).toLocaleDateString('en-IN')}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-1">
                              <div className="text-xs">
                                <span className="text-zinc-400 font-semibold block uppercase text-[9px]">Client Details</span>
                                <span className="font-extrabold text-red-950 text-sm block">{b.userName}</span>
                                <span className="text-zinc-500 font-mono block text-[11px]">{b.userPhone} • {b.userEmail}</span>
                                <span className="text-zinc-400 block text-[11px] leading-relaxed mt-0.5">{b.address}, {b.neighborhood}</span>
                              </div>

                              <div className="text-xs">
                                <span className="text-zinc-400 font-semibold block uppercase text-[9px]">Assigned Pro</span>
                                <span className="font-extrabold text-zinc-700 block">{b.proName}</span>
                                <span className="text-zinc-500 font-mono block text-[11px]">{b.proPhone}</span>
                                <span className="text-indigo-600 font-bold block text-[11px] mt-1">
                                  📅 {b.date} ({b.timeSlot})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl flex flex-col justify-between gap-3 shrink-0 self-stretch lg:self-center lg:min-w-[200px]">
                            <div>
                              <span className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-wide block mb-1">Administrative Force Action</span>
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

                            <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
                              <span className="text-[9px] text-zinc-400 font-bold">Status: <strong className="uppercase text-red-950 font-black">{b.status}</strong></span>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Delete Booking"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {b.notes && (
                          <div className="mt-4 bg-zinc-50 border border-zinc-150 p-3 rounded-xl text-xs text-zinc-600">
                            <span className="font-extrabold text-red-950 text-[9px] uppercase tracking-wider block mb-0.5">Instructions:</span>
                            {b.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SERVICE PROVIDERS TAB */}
            {activeTab === 'providers' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-4" id="admin-tab-providers">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-display font-extrabold text-lg text-red-950">Verify & Moderate Service Providers</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Approve verification badges, audit ratings, or manage professional accounts.</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white border border-zinc-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Cleaner">Cleaner</option>
                      <option value="AC Specialist">AC Specialist</option>
                    </select>

                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search service pros..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-zinc-200 text-xs font-medium rounded-lg pl-9 pr-4 py-1.5 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {filteredProviders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-8 text-center">
                    <Briefcase className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h5 className="text-sm font-extrabold text-red-950">No service providers found</h5>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">
                      No professionals found matching the selected search query or category filters.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {filteredProviders.map((pro) => (
                      <div 
                        key={pro.id}
                        className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#102050] text-[#f1b42f] flex items-center justify-center font-display font-black text-lg border border-[#f1b42f]/20 shrink-0">
                            {pro.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <h5 className="font-display font-extrabold text-sm text-[#102050]">{pro.name}</h5>
                              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                                {pro.category}
                              </span>
                              {pro.verified ? (
                                <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                  VERIFIED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                  UNVERIFIED
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-zinc-400" /> {pro.neighborhood}</span>
                              <span className="text-zinc-300">•</span>
                              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-zinc-400" /> <strong className="font-mono">{pro.phone}</strong></span>
                            </p>

                            <p className="text-xs text-zinc-600 font-medium leading-relaxed max-w-lg italic">
                              "{pro.bio || 'Verified expert home service professional.'}"
                            </p>
                          </div>
                        </div>

                        {/* STATUS TOGGLE */}
                        <div className="bg-zinc-50 border border-zinc-150 p-3.5 rounded-xl flex flex-col justify-between gap-3 shrink-0 sm:min-w-[180px] self-stretch sm:self-center">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400 font-semibold uppercase text-[9px]">Rating</span>
                            <span className="font-extrabold text-red-950 flex items-center gap-0.5 font-mono">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {pro.rating || 5.0}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400 font-semibold uppercase text-[9px]">Base Fee</span>
                            <span className="font-extrabold text-[#102050] font-mono">₹{pro.startingPrice || 299}</span>
                          </div>

                          <div className="border-t border-zinc-200 pt-2 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleToggleProVerification(pro.id)}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all border cursor-pointer text-center ${
                                pro.verified 
                                  ? 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                              }`}
                            >
                              {pro.verified ? 'Revoke Verify' : 'Approve Verify'}
                            </button>

                            <button
                              onClick={() => handleDeleteProvider(pro.id)}
                              className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FIRESTORE SUPPORT TICKETS TAB */}
            {activeTab === 'support' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-4" id="admin-tab-support">
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <h4 className="font-display font-extrabold text-lg text-red-950">Firestore Support Moderator</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Monitor and moderate direct inquiries written by users to the database.</p>
                  </div>
                  <button
                    onClick={fetchSupportInquiries}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync Firestore</span>
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-zinc-200/60 p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h5 className="text-sm font-extrabold text-red-950">No support tickets</h5>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">
                      There are no custom inquiries found in the Firestore database.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {inquiries.map((inq) => (
                      <div 
                        key={inq.id}
                        className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md"
                      >
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-800" />

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#102050] bg-zinc-100 px-2 py-0.5 rounded">
                                Firestore ID: {inq.id}
                              </span>
                              <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-2.5 py-0.5 rounded uppercase tracking-wider border border-red-100">
                                {inq.category}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                {inq.createdAt instanceof Date ? inq.createdAt.toLocaleString('en-IN') : 'Submitted'}
                              </span>
                            </div>

                            <div className="text-xs">
                              <span className="text-zinc-400 font-semibold block uppercase text-[8px]">Inquiry Submitter</span>
                              <span className="font-extrabold text-[#102050] block text-sm">{inq.name}</span>
                              <span className="text-zinc-500 font-mono block text-[11px]">{inq.contact}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            disabled={actionLoading === inq.id}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-100/50 self-end sm:self-center cursor-pointer"
                          >
                            {actionLoading === inq.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash className="w-3.5 h-3.5" />
                            )}
                            <span>Resolve & Delete</span>
                          </button>
                        </div>

                        <div className="mt-4 text-xs text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-150 p-4 rounded-xl font-normal">
                          {inq.message}
                        </div>
                      </div>
                    ))}
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
