import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Navbar } from './components/Navbar';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { MemberDashboard } from './components/MemberDashboard';
import { WorkoutHistory } from './components/WorkoutHistory';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { WorkoutPlans } from './components/WorkoutPlans';
import { DietTracker } from './components/DietTracker';
import { FitnessGoals } from './components/FitnessGoals';
import { TrainerDashboard } from './components/TrainerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { JavaProjectExplorer } from './components/JavaProjectExplorer';
import { PublicLanding } from './components/PublicLanding';
import { AuthPage } from './components/AuthPage';
import { DeveloperModal } from './components/DeveloperModal';
import { GraduationCap, Mail } from 'lucide-react';

function AppContent() {
  const { currentUser, startWorkout, activeWorkout } = useGym();
  // Default to landing page as requested by user to showcase system and developer profile
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  const handleStartWorkout = (planId?: number, title?: string) => {
    startWorkout(planId, title);
    setIsActiveModalOpen(true);
  };

  // If on landing tab, render the full dedicated landing page
  if (currentTab === 'landing') {
    return (
      <>
        <PublicLanding onEnterApp={() => setCurrentTab('dashboard')} />
        <DeveloperModal 
          isOpen={isDevModalOpen} 
          onClose={() => setIsDevModalOpen(false)} 
        />
      </>
    );
  }

  // Render view by tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        if (currentUser?.role === 'ADMIN') return <AdminDashboard />;
        if (currentUser?.role === 'TRAINER') return <TrainerDashboard />;
        return <MemberDashboard onStartWorkout={handleStartWorkout} onNavigateTab={setCurrentTab} />;
      
      case 'workouts':
        return <WorkoutHistory onStartWorkout={() => handleStartWorkout()} />;

      case 'plans':
        return <WorkoutPlans onStartWorkout={handleStartWorkout} />;

      case 'exercises':
        return <ExerciseLibrary />;

      case 'diet':
        return <DietTracker />;

      case 'goals':
        return <FitnessGoals />;

      case 'trainer-roster':
        return <TrainerDashboard />;

      case 'admin-panel':
        return <AdminDashboard />;

      case 'java-backend':
        return <JavaProjectExplorer />;

      case 'login':
        return <AuthPage initialMode="LOGIN" onSuccess={() => setCurrentTab('dashboard')} />;

      case 'signup':
        return <AuthPage initialMode="SIGNUP" onSuccess={() => setCurrentTab('dashboard')} />;

      default:
        return <MemberDashboard onStartWorkout={handleStartWorkout} onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenActiveWorkout={() => setIsActiveModalOpen(true)}
        onOpenDeveloperModal={() => setIsDevModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderTabContent()}
      </main>

      {/* Active Workout Session Modal */}
      <ActiveWorkoutModal
        isOpen={isActiveModalOpen}
        onClose={() => setIsActiveModalOpen(false)}
      />

      {/* Developer Profile Modal */}
      <DeveloperModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
      />

      {/* Persistent Global Footer with Developer Credentials */}
      <footer className="border-t border-slate-800 bg-[#070b13] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-slate-400">
            <span className="font-bold text-white">Gym Management System</span>
            <span>·</span>
            <span>Developed by <strong className="text-emerald-400 font-medium">Saroj Kumar</strong> (MCA Student)</span>
            <span>·</span>
            <span className="font-mono text-slate-300">sk9864652@gmail.com</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <button 
              onClick={() => setIsDevModalOpen(true)} 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-300"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Developer Details</span>
            </button>
            <button onClick={() => setCurrentTab('landing')} className="hover:text-emerald-400 transition-colors">
              Landing Page
            </button>
            <button onClick={() => setCurrentTab('admin-panel')} className="hover:text-emerald-400 transition-colors">
              Admin Console
            </button>
            <button onClick={() => setCurrentTab('plans')} className="hover:text-emerald-400 transition-colors">
              Workout Plans
            </button>
            <a 
              href="mailto:sk9864652@gmail.com" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3 text-emerald-400" />
              <span>Contact Developer</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
}
