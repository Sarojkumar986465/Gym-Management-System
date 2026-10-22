import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Role } from '../types';
import { 
  Dumbbell, 
  Flame, 
  UtensilsCrossed, 
  Target, 
  BookOpen, 
  CalendarDays, 
  Users, 
  ShieldAlert, 
  Play, 
  Menu, 
  X,
  LogOut,
  ChevronDown,
  Home,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenActiveWorkout: () => void;
  onOpenDeveloperModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenActiveWorkout,
  onOpenDeveloperModal 
}) => {
  const { currentUser, switchRole, logout, activeWorkout, activeWorkoutTimer } = useGym();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'landing', label: 'Landing / Home', icon: Home, roles: ['MEMBER', 'TRAINER', 'ADMIN'] },
    { id: 'dashboard', label: 'Dashboard', icon: Target, roles: ['MEMBER', 'TRAINER', 'ADMIN'] },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, roles: ['MEMBER'] },
    { id: 'plans', label: 'Plans', icon: CalendarDays, roles: ['MEMBER', 'TRAINER', 'ADMIN'] },
    { id: 'exercises', label: 'Exercise Library', icon: BookOpen, roles: ['MEMBER', 'TRAINER', 'ADMIN'] },
    { id: 'diet', label: 'Diet & Macros', icon: UtensilsCrossed, roles: ['MEMBER'] },
    { id: 'goals', label: 'Goals & Progress', icon: Flame, roles: ['MEMBER'] },
    { id: 'trainer-roster', label: 'Assigned Members', icon: Users, roles: ['TRAINER'] },
    { id: 'admin-panel', label: 'Admin Console', icon: ShieldAlert, roles: ['ADMIN'] },
  ];

  const visibleNav = navItems.filter(item => 
    currentUser ? item.roles.includes(currentUser.role) : ['landing', 'dashboard', 'plans', 'exercises'].includes(item.id)
  );

  const handleRoleSelect = (role: Role) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'ADMIN') setCurrentTab('admin-panel');
    else if (role === 'TRAINER') setCurrentTab('trainer-roster');
    else setCurrentTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              title="Return to Landing Page"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/60 transition-colors">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-none whitespace-nowrap">
                  Gym Management System
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 font-medium uppercase mt-0.5">
                  by Saroj Kumar (MCA)
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions, Active Workout Status, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Developer Profile Quick Trigger */}
            {onOpenDeveloperModal && (
              <button
                onClick={onOpenDeveloperModal}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium hover:border-emerald-500/40 transition-colors"
                title="Developer Profile: Saroj Kumar (MCA Student)"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xl:inline">Saroj Kumar (MCA)</span>
                <span className="xl:hidden">Developer</span>
              </button>
            )}

            {/* Active Workout Live Session Pill Button */}
            {activeWorkout && (
              <button
                onClick={onOpenActiveWorkout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-all animate-pulse"
                title="Active Workout in Progress"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono tabular-nums">{formatTimer(activeWorkoutTimer)}</span>
                <span className="hidden sm:inline">Active Session</span>
              </button>
            )}

            {/* Quick Switch to Admin Console for testing */}
            {currentUser?.role !== 'ADMIN' && (
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                title="Switch to Admin Console"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Role Switcher Pill Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors"
                >
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {currentUser.role}
                  </span>
                  <span className="hidden sm:inline max-w-[120px] truncate text-slate-300">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-[11px] text-slate-400">Logged in as</p>
                      <p className="font-semibold text-white truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Role (Testing)
                      </p>
                      <button
                        onClick={() => handleRoleSelect('MEMBER')}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 transition-colors ${currentUser.role === 'MEMBER' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}
                      >
                        <span>Member View</span>
                        <span className="text-[10px] text-slate-400">Alex Reynolds</span>
                      </button>
                      <button
                        onClick={() => handleRoleSelect('TRAINER')}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 transition-colors ${currentUser.role === 'TRAINER' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}
                      >
                        <span>Trainer View</span>
                        <span className="text-[10px] text-slate-400">Elena Rostova</span>
                      </button>
                      <button
                        onClick={() => handleRoleSelect('ADMIN')}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 transition-colors ${currentUser.role === 'ADMIN' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}
                      >
                        <span>Admin Console</span>
                        <span className="text-[10px] text-amber-400">Marcus Vance</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      {onOpenDeveloperModal && (
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            onOpenDeveloperModal();
                          }}
                          className="w-full text-left px-3 py-1.5 text-emerald-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>About Developer (Saroj Kumar)</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          setCurrentTab('landing');
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <Home className="w-3.5 h-3.5 text-slate-400" />
                        <span>View Landing Page</span>
                      </button>
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          setCurrentTab('signup');
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <span>Sign Up Another User</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                          setCurrentTab('login');
                        }}
                        className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!currentUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentTab('signup')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {onOpenDeveloperModal && (
            <button
              onClick={() => {
                onOpenDeveloperModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left text-emerald-400 hover:bg-slate-800/60 transition-colors pt-2 border-t border-slate-800"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Developer Profile: Saroj Kumar (MCA)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
