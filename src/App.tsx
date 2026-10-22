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

function AppContent() {
  const { currentUser, startWorkout, activeWorkout } = useGym();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);

  const handleStartWorkout = (planId?: number, title?: string) => {
    startWorkout(planId, title);
    setIsActiveModalOpen(true);
  };

  if (!currentUser && currentTab === 'landing') {
    return <PublicLanding onEnterApp={() => setCurrentTab('dashboard')} />;
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

      case 'landing':
        return <PublicLanding onEnterApp={() => setCurrentTab('dashboard')} />;

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

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070b13] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Gym Management System</span>
            <span>·</span>
            <span>Java 17 Spring Boot 3 & MySQL Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setCurrentTab('admin-panel')} className="hover:text-emerald-400 transition-colors">
              Admin Console
            </button>
            <button onClick={() => setCurrentTab('java-backend')} className="hover:text-emerald-400 transition-colors">
              Java Source Files
            </button>
            <button onClick={() => setCurrentTab('exercises')} className="hover:text-emerald-400 transition-colors">
              Exercise Library
            </button>
            <button onClick={() => setCurrentTab('signup')} className="hover:text-emerald-400 transition-colors">
              Sign Up
            </button>
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
