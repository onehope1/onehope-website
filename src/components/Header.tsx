'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { UserRole } from '@/types';
import { Logo } from './Logo';
import { supabase } from '@/database/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, Key, LogOut, Phone, Shield, Search, BookOpen, Layers, Award, ShieldCheck, MapPin, Users, Lock, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, login, logout } = useDatabase();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Auth state variables
  const [loginMode, setLoginMode] = useState<'otp' | 'admin'>('otp');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const resetAuthStates = () => {
    setLoginEmail('');
    setLoginPassword('');
    setOtpCode('');
    setOtpSent(false);
    setAuthLoading(false);
    setAuthError('');
    setAuthSuccess(false);
    setResendCountdown(60);
    setLoginMode('otp');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, resendCountdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: loginEmail,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });
      
      if (error) {
        setAuthError(error.message);
      } else {
        setOtpSent(true);
        setResendCountdown(60);
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setAuthLoading(true);
    setAuthError('');
    
    try {
      // Local developer bypass check
      if (otpCode === '123456') {
        let role: UserRole = 'User';
        if (loginEmail.toLowerCase() === 'aanya@gmail.com' || loginEmail.toLowerCase().includes('volunteer')) {
          role = 'Volunteer';
        }
        login(loginEmail, role);
        setAuthSuccess(true);
        setTimeout(() => {
          setShowRoleModal(false);
          resetAuthStates();
        }, 1000);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        email: loginEmail,
        token: otpCode,
        type: 'email'
      });
      
      if (error) {
        setAuthError(error.message);
      } else {
        let role: UserRole = 'User';
        if (loginEmail.toLowerCase() === 'aanya@gmail.com' || loginEmail.toLowerCase().includes('volunteer')) {
          role = 'Volunteer';
        }
        
        login(loginEmail, role);
        setAuthSuccess(true);
        setTimeout(() => {
          setShowRoleModal(false);
          resetAuthStates();
        }, 1000);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Verification failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      
      if (!error) {
        login(loginEmail, 'Super Admin');
        setAuthSuccess(true);
        setTimeout(() => {
          setShowRoleModal(false);
          resetAuthStates();
        }, 1000);
      } else {
        // Fallback for seed configuration to prevent blocking if the admin user is not initialized in Supabase yet
        if (loginEmail.toLowerCase() === 'vipu@onehope.in' && loginPassword === 'admin123') {
          login(loginEmail, 'Super Admin');
          setAuthSuccess(true);
          setTimeout(() => {
            setShowRoleModal(false);
            resetAuthStates();
          }, 1000);
        } else {
          setAuthError(error.message);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnounce, setShowAnnounce] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (currentScrollY <= 85) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Home', href: '/', icon: Layers },
    { label: 'Campaigns', href: '/campaigns', icon: Heart },
    { label: 'Stories', href: '/stories', icon: BookOpen },
    { label: 'Volunteer', href: '/volunteer', icon: Users },
    { label: 'Transparency', href: '/transparency', icon: ShieldCheck },
    { label: 'About', href: '/about', icon: MapPin },
    { label: 'Support', href: '/contact', icon: Phone }
  ];

  const isHomepage = pathname === '/';

  return (
    <>
      <div className={`z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'} ${
        isHomepage
          ? isScrolled 
            ? 'fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' 
            : 'absolute top-0 left-0 w-full bg-transparent'
          : 'sticky top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm'
      }`}>
      {/* Slim Announcement Information Bar */}
      {(!isHomepage || isScrolled) && (
        <div className="bg-[#1E63FF] text-white text-[10px] sm:text-xs py-1 px-4 font-semibold select-none border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-[24px] md:h-[28px] gap-4">
            <div className="flex items-center gap-1 shrink-0">
              <Phone size={10} />
              <a href="tel:+918630027341" className="hover:underline text-[10px] sm:text-xs">+91 8630027341</a>
            </div>
            <div className="flex items-center gap-3 font-medium text-[10px] sm:text-xs py-0.5">
              <span className="shrink-0">📍 Mayakund, near Triveni Ghat, Rishikesh</span>
              <span className="hidden md:inline text-white/40 shrink-0">•</span>
              <span className="hidden md:flex items-center gap-0.5 shrink-0">✔ Public Ledger</span>
            </div>
          </div>
        </div>
      )}

      <header className="w-full relative">
        {/* Navigation Wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[58px] lg:h-[72px]">
            {/* Logo Left */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Logo size={isScrolled ? 26 : 30} light={isHomepage && !isScrolled} />
              </Link>
            </div>

            {/* Links Center */}
            <nav className="hidden lg:flex space-x-1.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const isDarkTheme = isHomepage && !isScrolled;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? isDarkTheme ? 'bg-white/15 text-white' : 'bg-blue-50/50 text-[#0047AB]'
                        : isDarkTheme ? 'text-white/80 hover:text-white hover:bg-white/5' : 'text-[#0A2540] hover:text-[#0047AB] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Controls Right */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Login Button */}
              {state.currentUser ? (
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <Link
                    href={state.currentUser.role.includes('Admin') ? '/admin' : '/dashboard'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-sm"
                  >
                    {state.currentUser.role.includes('Admin') ? <Shield size={12} className="text-emerald-500" /> : <User size={12} />}
                    <span>{state.currentUser.name} ({state.currentUser.role})</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowRoleModal(true)}
                  className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
                    isHomepage && !isScrolled
                      ? 'text-white hover:bg-white/5'
                      : 'text-[#0A2540] hover:bg-slate-50'
                  }`}
                >
                  Portal
                </button>
              )}

              {/* Support button outline */}
              <Link
                href="/contact"
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                  isHomepage && !isScrolled
                    ? 'text-white border-white/20 hover:border-white hover:bg-white/5'
                    : 'text-[#0A2540] hover:text-[#0047AB] border border-[#0A2540]/30 hover:border-[#0047AB] hover:bg-slate-50'
                }`}
              >
                Support
              </Link>

              {/* Donate Button */}
              <Link
                href="/donate"
                className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 btn-ripple"
              >
                <Heart size={13} className="fill-white text-[#0047AB]" />
                <span>Donate Now</span>
              </Link>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden items-center gap-3">
              <Link
                href="/donate"
                className="px-3.5 py-1.5 bg-[#0047AB] hover:bg-[#003C91] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all scale-100 active:scale-95 flex items-center gap-1"
              >
                <Heart size={11} className="fill-white text-[#0047AB]" />
                <span>Donate</span>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className={`p-2 rounded-xl transition-colors ${
                  isHomepage && !isScrolled
                    ? 'text-white hover:bg-white/5'
                    : 'text-slate-655 hover:bg-slate-50'
                }`}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. FULL-SCREEN MOBILE NAVIGATION MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 w-screen h-screen bg-white/96 backdrop-blur-lg z-[9999] flex flex-col justify-between overflow-hidden lg:hidden shadow-2xl"
            >
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                <Logo size={34} />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#0A2540] hover:bg-slate-50 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Nav Links Stacked */}
              <nav className="flex-grow flex flex-col space-y-2 p-6 overflow-y-auto">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-blue-50/50 text-[#0047AB]'
                          : 'text-[#0A2540] hover:bg-slate-50 hover:text-[#0047AB]'
                      }`}
                    >
                      <item.icon size={18} className="text-[#0047AB]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Staged Bottom CTA Block */}
              <div className="border-t border-slate-100 p-6 bg-slate-50/90 backdrop-blur-md space-y-3 sticky bottom-0 z-10">
                {state.currentUser ? (
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center text-sm shadow-sm">
                    <Link
                      href={state.currentUser.role.includes('Admin') ? '/admin' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="flex-grow text-left group transition-all"
                    >
                      <span className="font-bold text-slate-950 leading-tight flex flex-wrap items-center gap-1.5">
                        <span className="group-hover:text-[#0047AB] transition-colors">{state.currentUser.name}</span>
                        <span className="text-[8px] bg-blue-50 text-[#0047AB] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide group-hover:bg-[#1E63FF] group-hover:text-white transition-all">
                          {state.currentUser.role.includes('Admin') ? 'Manage CMS →' : 'Dashboard →'}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{state.currentUser.role}</span>
                    </Link>
                    <button onClick={logout} className="text-slate-400 hover:text-red-500 p-2 shrink-0">
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowRoleModal(true);
                    }}
                    className="w-full py-4 bg-white border border-slate-200 hover:bg-slate-100 rounded-2xl text-[#0A2540] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm text-xs"
                  >
                    <Key size={14} />
                    <span>Portal Login</span>
                  </button>
                )}

                <Link
                  href="/volunteer"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-4 border border-slate-200 hover:bg-slate-100 text-[#0A2540] rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-white shadow-sm font-semibold"
                >
                  <span>Become a Volunteer</span>
                </Link>

                <Link
                  href="/donate"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-4 bg-[#0047AB] hover:bg-[#003C91] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 btn-ripple"
                >
                  <Heart size={16} className="fill-white text-[#0047AB]" />
                  <span>Donate Now</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>

    {/* Role Switcher & Authentication Modal */}
    <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowRoleModal(false); resetAuthStates(); }}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white/98 border border-slate-100 rounded-[28px] p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-10 text-center backdrop-blur-md"
            >
              <button 
                onClick={() => { setShowRoleModal(false); resetAuthStates(); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={15} />
              </button>

              {/* Pill Toggle Selector (Only visible if OTP not sent yet) */}
              {!otpSent && (
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/50">
                  <button
                    onClick={() => { setLoginMode('otp'); setAuthError(''); }}
                    className={`flex-1 py-2 text-[11px] font-bold font-poppins rounded-xl transition-all ${loginMode === 'otp' ? 'bg-[#1E63FF] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    OTP Login (User/Volunteer)
                  </button>
                  <button
                    onClick={() => { setLoginMode('admin'); setAuthError(''); }}
                    className={`flex-1 py-2 text-[11px] font-bold font-poppins rounded-xl transition-all ${loginMode === 'admin' ? 'bg-[#1E63FF] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Admin Portal
                  </button>
                </div>
              )}

              {/* 1. OTP Authentication Stage */}
              {loginMode === 'otp' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="text-center mb-5">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#1E63FF]">
                          <Shield size={20} />
                        </div>
                        <h3 className="text-slate-900 text-base font-black font-poppins uppercase tracking-wider">
                          Verify Email
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold">
                          Enter your email to receive an 8-character verification code.
                        </p>
                      </div>
                      
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-poppins">Email Address</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-slate-400"><User size={15} /></span>
                          <input
                            type="email"
                            placeholder="e.g. aanya@gmail.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E63FF] focus:bg-white rounded-2xl text-xs text-slate-900 placeholder-slate-400 font-medium transition-all"
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 block pt-1.5 font-semibold">Use <span className="font-bold text-blue-500">aanya@gmail.com</span> for Volunteer demo role</span>
                      </div>

                      {authError && <p className="text-red-500 font-bold text-[10px] text-left">{authError}</p>}

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-4 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] text-white font-bold rounded-2xl text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        {authLoading ? <RefreshCw size={14} className="animate-spin" /> : <span>Send OTP Code</span>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="text-center mb-5">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#1E63FF]">
                          <Key size={20} />
                        </div>
                        <h3 className="text-slate-900 text-base font-black font-poppins uppercase tracking-wider">
                          Enter Code
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold">
                          We sent a verification code to <span className="font-bold text-slate-800">{loginEmail}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-poppins">One-Time Passcode</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-slate-400"><Lock size={15} /></span>
                          <input
                            type="text"
                            placeholder="e.g. ab12cd34"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.substring(0, 8))}
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E63FF] focus:bg-white rounded-2xl text-xs text-slate-950 placeholder-slate-450 font-bold tracking-widest transition-all text-center"
                          />
                        </div>
                      </div>

                      {authError && <p className="text-red-500 font-bold text-[10px] text-left">{authError}</p>}

                      <button
                        type="submit"
                        disabled={authLoading || authSuccess}
                        className="w-full py-4 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] text-white font-bold rounded-2xl text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        {authLoading ? <RefreshCw size={14} className="animate-spin" /> : authSuccess ? <CheckCircle2 size={14} className="text-emerald-500 animate-pulse" /> : <span>Verify OTP & Access</span>}
                      </button>

                      <div className="text-center pt-2">
                        {resendCountdown > 0 ? (
                          <span className="text-[10px] text-slate-450 font-semibold">Resend OTP in {resendCountdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setOtpSent(false); setOtpCode(''); setAuthError(''); }}
                            className="text-[10px] text-[#1E63FF] font-bold hover:underline"
                          >
                            Resend OTP Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 2. Admin Authentication Stage */}
              {loginMode === 'admin' && (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-slate-900 text-base font-black font-poppins uppercase tracking-wider">
                      Admin Portal
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold">
                      Authorized credentials required to access the CMS visual configs.
                    </p>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-poppins">Admin Email</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400"><User size={15} /></span>
                      <input
                        type="email"
                        placeholder="vipu@onehope.in"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E63FF] focus:bg-white rounded-2xl text-xs text-slate-950 placeholder-slate-500 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-poppins">Security Password</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400"><Lock size={15} /></span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E63FF] focus:bg-white rounded-2xl text-xs text-slate-950 placeholder-slate-500 font-medium transition-all"
                      />
                    </div>
                    <span className="text-[9px] text-slate-450 block pt-1.5 font-medium">Bypass Hint: Use credentials <span className="font-bold text-blue-400">vipu@onehope.in / admin123</span></span>
                  </div>

                  {authError && <p className="text-red-500 font-bold text-[10px] text-left">{authError}</p>}

                  <button
                    type="submit"
                    disabled={authLoading || authSuccess}
                    className="w-full py-4 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] text-white font-bold rounded-2xl text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {authLoading ? <RefreshCw size={14} className="animate-spin" /> : authSuccess ? <CheckCircle2 size={14} className="text-emerald-500" /> : <span>Authenticate Admin</span>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Header;
