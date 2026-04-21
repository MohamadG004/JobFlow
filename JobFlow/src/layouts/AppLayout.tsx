import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  Menu,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Profile', path: '/profile', icon: <User size={20} /> },
];

const AppLayout: React.FC = () => {
  const { user, signOut, avatarUrl } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Simple responsive check
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitial = (user?.username?.[0] || user?.email?.[0] || '').toUpperCase();

  const drawerContent = (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div
        onClick={handleSignOut}
        className="px-6 py-5 flex items-center gap-3 cursor-pointer hover:bg-blue-50 rounded-lg mx-2 mt-2 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Briefcase className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-extrabold text-slate-900 tracking-tight">
          JobFlow
        </span>
      </div>

      <div className="border-t border-[var(--color-divider)] my-2" />

      {/* Navigation */}
      <div className="px-3 py-3 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} className="mb-1">
              <button
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-[var(--color-primary)]' : 'text-inherit'}>
                  {item.icon}
                </span>
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-5 rounded-full bg-[var(--color-primary)] ml-auto" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[var(--color-divider)] my-2" />

      {/* User section */}
      <div className="px-3 py-3">
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 mb-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-blue-50 transition-colors"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {userInitial}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {user?.username || user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-default)]">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[var(--color-divider)] h-14 flex items-center px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div
            onClick={handleSignOut}
            className="flex items-center gap-2 ml-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            <Briefcase className="text-[var(--color-primary)]" size={20} />
            <span className="text-lg font-extrabold">JobFlow</span>
          </div>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full object-cover ml-auto cursor-pointer"
            />
          ) : (
            <div
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold ml-auto cursor-pointer"
            >
              {userInitial}
            </div>
          )}
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed' : 'relative'} z-30`}>
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div
          className={`${isMobile ? 'w-60' : 'w-60'} h-screen bg-white border-r border-[var(--color-divider)] ${
            isMobile ? 'fixed left-0 top-0 pt-14' : 'relative'
          }`}
        >
          {drawerContent}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 overflow-y-auto ${
          isMobile ? 'pt-14' : ''
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;