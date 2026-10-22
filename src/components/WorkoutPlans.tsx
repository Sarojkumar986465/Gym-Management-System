import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { WorkoutPlan } from '../types';
import { 
  CalendarDays, 
  Dumbbell, 
  Plus, 
  Clock, 
  Play, 
  ChevronRight, 
  Trash2, 
  UserCheck, 
  X,
  Target
} from 'lucide-react';

interface WorkoutPlansProps {
  onStartWorkout: (planId?: number, title?: string) => void;
}

export const WorkoutPlans: React.FC<WorkoutPlansProps> = ({ onStartWorkout }) => {
  const { workoutPlans, exercises, createWorkoutPlan, deleteWorkoutPlan, currentUser } = useGym();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(workoutPlans[0] || null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Plan Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Muscle Hypertrophy & Strength');
  const [difficultyLevel, setDifficultyLevel] = useState<WorkoutPlan['difficultyLevel']>('INTERMEDIATE');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([1, 2, 4]);

  const canManagePlans = currentUser?.role === 'ADMIN' || currentUser?.role === 'TRAINER';

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedExercises = selectedExerciseIds.map((exId, idx) => {
      const ex = exercises.find(e => e.id === exId);
      return {
        id: Date.now() + idx,
        workoutPlanId: 0,
        exerciseId: exId,
        exerciseName: ex?.name || 'Exercise',
        dayOfWeek: (idx % 4) + 1,
        dayName: `Session ${String.fromCharCode(65 + (idx % 3))}`,
        targetSets: 4,
        targetReps: '8-10',
        suggestedWeightKg: 50,
        restIntervalSeconds: 90,
        notes: 'Strict eccentric tempo',
        orderIndex: idx + 1,
      };
    });

    createWorkoutPlan({
      title: title.trim(),
      description: description.trim() || 'Structured periodized progressive resistance protocol.',
      creatorId: currentUser?.id || 1,
      creatorName: currentUser?.fullName || 'Coach',
      creatorRole: (currentUser?.role === 'ADMIN' ? 'ADMIN' : 'TRAINER') as any,
      fitnessGoal,
      difficultyLevel,
      durationWeeks,
      isTemplate: true,
      exercises: assignedExercises,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Prescribed Workout Plans & Splits</h2>
          <p className="text-xs text-slate-400 mt-1">
            Periodized training routines created by certified strength coaches and gym administrators.
          </p>
        </div>

        {canManagePlans && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        )}
      </div>

      {/* Main Layout: Plans List + Selected Plan Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plans Navigation Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Available Programs ({workoutPlans.length})
          </h3>
          {workoutPlans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="text-emerald-400 font-semibold">{plan.difficultyLevel}</span>
                  <span>·</span>
                  <span>{plan.durationWeeks} Weeks</span>
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {plan.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {plan.description}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    By {plan.creatorName || 'Coach'}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span>{plan.exercises.length} Exercises</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Detail View (2 Columns) */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
              
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
                    <span>{selectedPlan.fitnessGoal}</span>
                    <span>·</span>
                    <span>{selectedPlan.difficultyLevel}</span>
                    <span>·</span>
                    <span>{selectedPlan.durationWeeks} Week Cycle</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {selectedPlan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    {selectedPlan.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onStartWorkout(selectedPlan.id, selectedPlan.title)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Session Now</span>
                  </button>

                  {canManagePlans && (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this workout plan?')) {
                          deleteWorkoutPlan(selectedPlan.id);
                          setSelectedPlan(workoutPlans[0] || null);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Prescribed Movements Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Prescribed Exercise Schedule & Parameters
                </h4>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950/40 overflow-hidden">
                  {selectedPlan.exercises.map((pe, idx) => (
                    <div key={pe.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[11px] text-emerald-400 font-semibold block">
                            {pe.dayName}
                          </span>
                          <h5 className="text-sm font-bold text-white tracking-tight">
                            {pe.exerciseName}
                          </h5>
                          {pe.notes && (
                            <p className="text-xs text-slate-400 mt-0.5 italic">
                              "{pe.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono sm:text-right">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Sets × Reps</span>
                          <span className="text-white font-bold tabular-nums">{pe.targetSets} × {pe.targetReps}</span>
                        </div>
                        {pe.suggestedWeightKg ? (
                          <div>
                            <span className="text-[10px] text-slate-500 block font-sans">Suggested</span>
                            <span className="text-emerald-400 font-bold tabular-nums">{pe.suggestedWeightKg} kg</span>
                          </div>
                        ) : null}
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Rest</span>
                          <span className="text-slate-300 tabular-nums">{pe.restIntervalSeconds}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Tips & Safety Notice */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block mb-0.5">Coach's Periodization Advice:</strong>
                  Warm up thoroughly with dynamic mobility before compound lifts. Aim to add 1.25kg to 2.5kg or 1 extra repetition per session while maintaining pristine biomechanics and RPE between 7.5 and 9.0.
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/20 text-slate-400">
              Select a workout plan from the list to view routine details.
            </div>
          )}
        </div>

      </div>

      {/* Create Plan Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              Create New Workout Plan (Coach / Admin)
            </h3>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Plan Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Day Push Pull Legs Hypertrophy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Target audience, periodization structure, and weekly schedule..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fitness Goal</label>
                  <input
                    type="text"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 4)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Difficulty Level</label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Select Included Exercises from Library
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  {exercises.map((ex) => {
                    const isChecked = selectedExerciseIds.includes(ex.id);
                    return (
                      <label
                        key={ex.id}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-900 cursor-pointer text-slate-200"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExerciseIds(prev => [...prev, ex.id]);
                            } else {
                              setSelectedExerciseIds(prev => prev.filter(id => id !== ex.id));
                            }
                          }}
                          className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{ex.name}</span>
                        <span className="text-[10px] text-slate-500">({ex.muscleGroup})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Workout Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
