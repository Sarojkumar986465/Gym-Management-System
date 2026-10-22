import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Role } from '../types';
import { DeveloperModal } from './DeveloperModal';
import { 
  Dumbbell, 
  Flame, 
  ShieldCheck, 
  Users, 
  Activity, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  X,
  GraduationCap,
  Mail,
  Copy,
  Check,
  Code,
  Sparkles,
  CalendarDays,
  UtensilsCrossed,
  BookOpen,
  Award
} from 'lucide-react';

interface PublicLandingProps {
  onEnterApp: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onEnterApp }) => {
  const { login, register, switchRole } = useGym();
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER' | null>(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('MEMBER');
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = (role: Role) => {
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sk9864652@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-none">
                Gym Management System
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                by Saroj Kumar (MCA)
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#developer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold text-slate-300">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Developer
            </a>
            <a href="#roles" className="hover:text-white transition-colors">Role Architecture</a>
            <a href="#plans" className="hover:text-white transition-colors">Membership Tiers</a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsDevModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>About Developer</span>
            </button>
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
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Full-Stack Gym & Workout Architecture</span>
            </div>
            <button
              onClick={() => setIsDevModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-300 text-xs font-medium transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Developed by <strong className="text-white">Saroj Kumar</strong> (MCA Student)</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Scientific Workout Logging, Diet Tracking & Gym Administration
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A complete management system engineered for gym members, personal trainers, and gym administrators. Designed with real-time volume tonnage tracking, periodized training splits, and complete member management.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-colors"
            >
              <span>Launch Live System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAuthModalMode('REGISTER')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              Register New Account
            </button>
            <button
              onClick={() => setIsDevModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Developer Profile</span>
            </button>
          </div>

          {/* Quick 1-Click Role Switcher for Instant Evaluation */}
          <div className="pt-8 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3 font-medium">Instant One-Click Test Role Access:</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => handleQuickLogin('MEMBER')}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Member: Alex Reynolds</span>
              </button>
              <button
                onClick={() => handleQuickLogin('TRAINER')}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Trainer: Elena Rostova</span>
              </button>
              <button
                onClick={() => handleQuickLogin('ADMIN')}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs text-slate-200 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Admin: Marcus Vance</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER SECTION (Saroj Kumar - MCA Student) */}
      <section id="developer" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="bg-gradient-to-br from-[#0c1322] via-[#090d16] to-[#0c1322] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Developer Identity Info */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Project Architect & Lead Developer</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg shadow-emerald-950 shrink-0">
                  SK
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Saroj Kumar
                  </h2>
                  <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mt-0.5">
                    <span>MCA Student</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-normal">Master of Computer Applications</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Email: <span className="text-slate-200">sk9864652@gmail.com</span>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This <strong>Gym Management System</strong> was conceptualized, architected, and developed by <strong>Saroj Kumar</strong> as part of his <strong>Master of Computer Applications (MCA)</strong> coursework and technical portfolio. It provides an end-to-end full-stack software system designed to automate fitness facility operations, member progress tracking, trainer assignment workflows, and subscription billing.
              </p>

              {/* Developer Skill Badges */}
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  React 19 & TypeScript
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  Spring Boot 3 & REST APIs
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  MySQL 8 / Relational DB
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  Tailwind CSS UI/UX
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
                  MCA Capstone
                </span>
              </div>
            </div>

            {/* Quick Contact & Info Card */}
            <div className="w-full lg:w-80 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shrink-0">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Developer Contact & Credentials
                </span>
                <span className="text-sm font-bold text-white mt-1 block">
                  Saroj Kumar
                </span>
                <span className="text-xs text-emerald-400">
                  Master of Computer Applications (MCA)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Role:</span>
                  <span className="text-slate-200 font-medium">Software Engineer</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Qualification:</span>
                  <span className="text-slate-200 font-medium">MCA Student</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Contact:</span>
                  <span className="text-slate-200 font-mono text-[11px]">sk9864652@gmail.com</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleCopyEmail}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied sk9864652@gmail.com</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email Address</span>
                    </>
                  )}
                </button>

                <a
                  href="mailto:sk9864652@gmail.com?subject=Inquiry regarding Gym Management System&body=Hello Saroj,%0D%0A%0D%0AI checked out your Gym Management System project."
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Modern Fitness Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A comprehensive suite of tools for athletes, certified trainers, and gym owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live Workout & Set Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time workout logger with set-by-set weight in kg, reps, RPE, rest countdown timer, and automatic volume tonnage calculation.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Diet & Nutrition Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track daily meals, calories, and macronutrient breakdowns (Protein, Carbohydrates, Fats) with clear estimation and macro targets.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Trainer-Member Coaching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified coaches assign periodized splits, inspect member logs, and provide technical feedback and performance ratings.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Admin Management Center</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full administrative console to add/delete members, manage trainers, configure subscription plans, and review payment history.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Scientific Exercise Library</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filterable library of strength and cardio movements categorized by target muscle groups, equipment requirements, and instructions.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Fitness Goals & Streaks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set target goals (1RM bench press, bodyweight loss, workout streaks) with automatic progress percentage visualization.
            </p>
          </div>
        </div>
      </section>

      {/* Role Architecture Section */}
      <section id="roles" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Role-Based Access Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailored interfaces engineered for every tier of gym operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs inline-block">
                MEMBER
              </span>
              <h3 className="text-lg font-bold text-white">Athlete & Member Portal</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time workout logger with timers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Diet & nutrition macro tracker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Volume tonnage & PR statistics</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickLogin('MEMBER')}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Test Member Portal
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold text-xs inline-block">
                TRAINER
              </span>
              <h3 className="text-lg font-bold text-white">Trainer & Coach Console</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Assigned client athlete roster</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Periodized split assignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Form review & technique notes</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickLogin('TRAINER')}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Test Trainer Console
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs inline-block">
                ADMIN
              </span>
              <h3 className="text-lg font-bold text-white">Admin Management Center</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Add, edit, & delete gym members</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Trainer staff roster & credentialing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Subscription plans & payment ledger</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickLogin('ADMIN')}
              className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Test Admin Console
            </button>
          </div>
        </div>
      </section>

      {/* Membership Tiers & Access Callout */}
      <section id="plans" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Full-Featured Gym Ecosystem</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">Ready to Explore the Live Gym Platform?</h4>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Developed by <strong>Saroj Kumar (MCA Student)</strong> as an enterprise software showcase. Test live logging, administrative controls, and coaching tools.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onEnterApp}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Launch Live Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer with Developer Credits */}
      <footer className="border-t border-slate-800 bg-[#070a12] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Gym Management System</span>
            <span>·</span>
            <span>Developed by <strong className="text-slate-200">Saroj Kumar</strong> (MCA Student)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setIsDevModalOpen(true)} className="hover:text-emerald-400 transition-colors">
              Developer Profile
            </button>
            <a href="mailto:sk9864652@gmail.com" className="hover:text-emerald-400 transition-colors">
              sk9864652@gmail.com
            </a>
            <button onClick={onEnterApp} className="hover:text-emerald-400 transition-colors">
              Live System
            </button>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-600">
          © 2026 Gym Management System. Master of Computer Applications (MCA) Project · Saroj Kumar
        </p>
      </footer>

      {/* Developer Modal */}
      <DeveloperModal 
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
      />

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
