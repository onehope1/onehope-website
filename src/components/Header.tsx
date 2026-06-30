'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { UserRole } from '@/types';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, Key, LogOut, Phone, Shield, Search, BookOpen, Layers, Award, ShieldCheck, MapPin, Users } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, login, logout } = useDatabase();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleQuickLogin = (role: UserRole) => {
    let email = 'user@onehope.in';
    if (role === 'Super Admin') email = 'vipu@onehope.in';
    else if (role === 'Volunteer') email = 'aanya@gmail.com';
    
    login(email, role);
    setShowRoleModal(false);
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
    { label: 'Transparency', href: '/transparency', icon: ShieldCheck },
    { label: 'Support', href: '/contact', icon: Phone },
    { label: 'About', href: '/about', icon: MapPin }
  ];

  const isHomepage = pathname === '/';

  return (
    <>
      <div className={`z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'} ${
        isScrolled 
        ? 'fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-150' 
        : isHomepage 
          ? 'absolute top-0 left-0 w-full bg-transparent' 
          : 'sticky top-0 w-full bg-white/95 border-b border-slate-150 shadow-sm'
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
              {/* Search Icon */}
              <Link
                href="/search"
                className={`p-2.5 rounded-xl transition-all ${
                  isHomepage && !isScrolled 
                    ? 'text-white/80 hover:text-white hover:bg-white/5' 
                    : 'text-slate-500 hover:text-[#0047AB] hover:bg-slate-50'
                }`}
                title="Search Hub"
              >
                <Search size={18} />
              </Link>

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
                    <div>
                      <span className="font-bold block text-slate-900 leading-tight">{state.currentUser.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{state.currentUser.role}</span>
                    </div>
                    <button onClick={logout} className="text-slate-400 hover:text-red-500 p-2">
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

      {/* Role Switcher Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoleModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 border border-slate-100"
            >
              <button 
                onClick={() => setShowRoleModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Shield size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-poppins">
                  Developer Identity Switcher
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Quickly switch between authorization roles to test different pages.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { role: 'Super Admin', desc: 'CMS visuals editor & configurations', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                  { role: 'Volunteer', desc: 'Log tasks, check-in, badges', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                  { role: 'User', desc: 'Standard user dashboard & receipts history', color: 'bg-slate-50 text-slate-600 border-slate-150' }
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleQuickLogin(item.role as UserRole)}
                    className="w-full text-left p-4 border border-slate-100 hover:border-blue-500 rounded-2xl hover:bg-slate-50 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.color}`}>
                        {item.role}
                      </span>
                      <p className="text-slate-500 text-[11px] mt-1 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:text-blue-500 font-bold">→</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Header;
