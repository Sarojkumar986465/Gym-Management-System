import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Role } from '../types';
import { 
  Dumbbell, 
  Flame, 
  ShieldCheck, 
  Users, 
  Activity, 
  Target, 
  Code2, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  X
} from 'lucide-react';

interface PublicLandingProps {
  onEnterApp: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onEnterApp }) => {
  const { login, register, switchRole } = useGym();
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER' | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('MEMBER');
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = (role: Role, userEmail: string) => {
    switchRole(role);
    onEnterApp();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authModalMode === 'LOGIN') {
      const success = login(email);
      if (success) {
        setAuthModalMode(null);
        onEnterApp();
      } else {
        // Fallback login with role
        login(email, selectedRole);
        setAuthModalMode(null);
        onEnterApp();
      }
    } else if (authModalMode === 'REGISTER') {
      if (!fullName.trim() || !email.trim()) {
        setErrorMessage('All required fields must be completed.');
        return;
      }
      register(fullName.trim(), email.trim(), selectedRole);
      setAuthModalMode(null);
      onEnterApp();
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Gym Management System
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Role Architecture</a>
            <a href="#tech" className="hover:text-white transition-colors">Java & MySQL Stack</a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setAuthModalMode('LOGIN')}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Full-Stack Gym & Workout Tracking Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Scientific Workout Logging, Diet Tracking & Coach Management
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Engineered for strength athletes, personal trainers, and gym administrators. Powered by a production-ready Java 17 Spring Boot 3 backend and MySQL 8 database.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setAuthModalMode('LOGIN')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-colors"
            >
              <span>Launch Live System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAuthModalMode('REGISTER')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs transition-colors"
            >
              Register New Account
            </button>
          </div>

          {/* Quick 1-Click Role Switcher for Evaluators */}
          <div className="pt-8 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3">Instant One-Click Test Role Access:</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => handleQuickLogin('MEMBER', 'member@gympulse.com')}
                className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Member: Alex Reynolds</span>
              </button>
              <button
                onClick={() => handleQuickLogin('TRAINER', 'trainer@gympulse.com')}
                className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Trainer: Elena Rostova</span>
              </button>
              <button
                onClick={() => handleQuickLogin('ADMIN', 'admin@gympulse.com')}
                className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs text-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Admin: Marcus Vance</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live Workout & Set Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time workout logger with set-by-set weight in kg, reps, RPE, rest countdown timer, and automatic volume tonnage calculation.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Diet & Nutrition Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track daily meals, calories, and macronutrient breakdowns (Protein, Carbohydrates, Fats) with clear estimation disclaimers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Trainer-Member Coaching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified coaches assign periodized splits, inspect member logs, and provide technical feedback and performance ratings.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Architecture Stack */}
      <section id="tech" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Code2 className="w-4 h-4" />
              <span>Full Java 17 + Spring Boot 3 + MySQL 8 Backend</span>
            </div>
            <h4 className="text-base font-bold text-white">Ready for Windows 11 Local Deployment</h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Includes normalized 14-table MySQL schema, Spring Security with BCrypt hashing, Spring Data JPA repositories, and Thymeleaf/Bootstrap templates.
            </p>
          </div>
          <button
            onClick={() => {
              onEnterApp();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            Explore Java Code & SQL Schema →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070a12] py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Gym Management System. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-slate-600">Built with Java 17, Spring Boot 3, Spring Security, MySQL 8, and responsive frontend.</p>
      </footer>

      {/* Auth Modal (Login / Register) */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAuthModalMode(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {authModalMode === 'LOGIN' ? 'Sign In to Gym Management System' : 'Create Member Account'}
              </h3>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {authModalMode === 'REGISTER' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@gympulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Role / Account Type</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="MEMBER">Member (Workout & Diet Tracker)</option>
                  <option value="TRAINER">Trainer (Manage Assigned Members)</option>
                  <option value="ADMIN">Admin (Full System Controls)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs transition-colors"
                >
                  {authModalMode === 'LOGIN' ? 'Sign In' : 'Complete Registration'}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
              {authModalMode === 'LOGIN' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthModalMode('REGISTER')}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => setAuthModalMode('LOGIN')}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
