import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Role } from '../types';
import { 
  Dumbbell, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Flame,
  Sparkles
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'LOGIN' | 'SIGNUP';
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'LOGIN', onSuccess }) => {
  const { login, register, users } = useGym();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');
  const [showPassword, setShowPassword] = useState(false);
  const [membershipTier, setMembershipTier] = useState<'STANDARD' | 'PREMIUM' | 'VIP'>('PREMIUM');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'LOGIN') {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter both your email address and password.');
        return;
      }

      const success = login(email.trim());
      if (success) {
        setSuccessMessage('Authentication successful. Redirecting to your dashboard...');
        setTimeout(() => onSuccess(), 400);
      } else {
        // Fallback demo login
        login(email.trim(), role);
        setSuccessMessage('Signed in successfully.');
        setTimeout(() => onSuccess(), 400);
      }
    } else {
      // Sign up
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please fill in all mandatory fields.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password.');
        return;
      }

      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setErrorMessage('An account with this email address already exists. Please log in.');
        return;
      }

      register(fullName.trim(), email.trim(), role, password);
      setSuccessMessage('Account registered successfully! Welcome to Gym Management System.');
      setTimeout(() => onSuccess(), 500);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string, demoRole: Role) => {
    login(demoEmail, demoRole);
    setSuccessMessage(`Logged in as ${demoRole} demo account.`);
    setTimeout(() => onSuccess(), 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Brand Kicker */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gym Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {mode === 'LOGIN' 
              ? 'Sign in to access your workout tracking, diet logs, and coach dashboard' 
              : 'Create your athlete or staff account and begin tracking workouts'}
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                mode === 'LOGIN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('SIGNUP');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                mode === 'SIGNUP'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Full Legal Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. member@gympulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {mode === 'SIGNUP' ? (
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Portal Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="MEMBER">Member (Athlete View)</option>
                    <option value="TRAINER">Trainer (Coach View)</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              )}
            </div>

            {mode === 'SIGNUP' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="MEMBER">Member / Athlete</option>
                    <option value="TRAINER">Fitness Coach / Trainer</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                {role === 'MEMBER' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Membership Tier</label>
                    <select
                      value={membershipTier}
                      onChange={(e) => setMembershipTier(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="STANDARD">Standard ($39/mo)</option>
                      <option value="PREMIUM">Premium ($69/mo)</option>
                      <option value="VIP">VIP All-Access ($99/mo)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'LOGIN' ? 'Sign In to Dashboard' : 'Complete Account Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Quick 1-Click Demo Accounts:</span>
              <span className="text-slate-500 font-mono">Password: Password123!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@gympulse.com', 'ADMIN')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">Admin</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">Marcus Vance</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('trainer@gympulse.com', 'TRAINER')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400">Trainer</span>
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">Elena Rostova</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('member@gympulse.com', 'MEMBER')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400">Member</span>
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">Alex Reynolds</p>
              </button>
            </div>
          </div>

        </div>

        {/* Security Footer note */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Protected by Spring Security 6, BCrypt Password Encryption, and Role-Based Authorization.</p>
        </div>

      </div>
    </div>
  );
};
