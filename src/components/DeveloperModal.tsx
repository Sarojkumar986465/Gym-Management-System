import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Code, 
  Copy, 
  Check, 
  X, 
  Award, 
  Layers, 
  Dumbbell, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Terminal
} from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sk9864652@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-[#0c121e] border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Developer Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950 shrink-0 font-bold text-2xl tracking-tight">
            SK
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Saroj Kumar</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                MCA Student
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Master of Computer Applications · Full-Stack Software Developer
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-300 font-mono">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>sk9864652@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-5 text-xs">
          {/* Project Details */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                Project Specification
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Academic Project</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Gym Management System</strong> is a full-featured fitness platform designed and engineered by <strong className="text-white">Saroj Kumar</strong> (MCA Student). The application combines real-time scientific workout logging with member progress analytics, coach assignment rosters, automated diet tracking, and complete administrative management.
            </p>
          </div>

          {/* Technical Competencies Grid */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              Developer Architecture & Stack
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block text-[11px]">Frontend Engineering</span>
                <span className="text-slate-400 text-[11px]">React 19, TypeScript, Tailwind CSS, Lucide Icons, Responsive Mobile-First UX</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block text-[11px]">Backend Architecture</span>
                <span className="text-slate-400 text-[11px]">Java 17, Spring Boot 3, RESTful APIs, Hibernate/JPA, MySQL 8 Schema</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block text-[11px]">Security & Access</span>
                <span className="text-slate-400 text-[11px]">Role-Based Access Control (Admin, Trainer, Member), Audit Logging, Secure Auth</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block text-[11px]">Business Logic</span>
                <span className="text-slate-400 text-[11px]">Volume tonnage tracking, RPE calculations, calorie/macro breakdowns, subscription management</span>
              </div>
            </div>
          </div>

          {/* Verified Highlights */}
          <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Developer Highlights</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Engineered by <strong>Saroj Kumar</strong> as part of Master of Computer Applications (MCA) portfolio.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Engineered complete lifecycle from database schema design to responsive client interface.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct inquiries or collaboration opportunities are welcome via email.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-slate-400 text-[11px]">
            Saroj Kumar · MCA Student
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied sk9864652@gmail.com</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <a
              href="mailto:sk9864652@gmail.com?subject=Inquiry regarding Gym Management System&body=Hello Saroj,%0D%0A%0D%0AI checked out your Gym Management System project."
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Saroj</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
