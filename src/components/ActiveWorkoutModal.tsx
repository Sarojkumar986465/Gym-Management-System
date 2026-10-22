import React, { useState, useEffect } from 'react';
import { useGym } from '../context/GymContext';
import { 
  Play, 
  Square, 
  Trash2, 
  Plus, 
  Clock, 
  Flame, 
  CheckCircle, 
  X, 
  Dumbbell, 
  Timer,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeWorkout, 
    activeWorkoutTimer, 
    exercises, 
    addExerciseToActiveWorkout, 
    removeExerciseFromActiveWorkout,
    addSetToActiveExercise,
    removeSetFromActiveExercise,
    completeActiveWorkout,
    cancelActiveWorkout
  } = useGym();

  const [selectedExerciseId, setSelectedExerciseId] = useState<number | ''>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);

  // Rest countdown timer
  useEffect(() => {
    let interval: any;
    if (restSecondsLeft !== null && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (restSecondsLeft === 0) {
      // Finished rest
      const timeout = setTimeout(() => setRestSecondsLeft(null), 2500);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [restSecondsLeft]);

  if (!isOpen || !activeWorkout) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddExercise = () => {
    if (selectedExerciseId) {
      addExerciseToActiveWorkout(Number(selectedExerciseId));
      setSelectedExerciseId('');
    }
  };

  const startRestTimer = (seconds: number) => {
    setRestSecondsLeft(seconds);
  };

  const handleFinish = () => {
    completeActiveWorkout(sessionNotes);
    onClose();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard this workout session?')) {
      cancelActiveWorkout();
      onClose();
    }
  };

  // Calculate live volume
  let liveVolume = 0;
  let totalSetsCount = 0;
  activeWorkout.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      liveVolume += (s.repsCompleted || 0) * (s.weightKg || 0);
      totalSetsCount++;
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#0d131f] border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeWorkout.sessionTitle}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>{activeWorkout.sessionDate}</span>
                <span>·</span>
                <span>Started {activeWorkout.startTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-emerald-400 font-bold text-sm tabular-nums">
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{formatTimer(activeWorkoutTimer)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Minimize (keeps running in background)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800 bg-slate-950/40 text-center py-2.5 px-4 text-xs">
          <div>
            <p className="text-slate-400">Total Exercises</p>
            <p className="font-bold text-white text-base mt-0.5 tabular-nums">{activeWorkout.exercises.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Sets Logged</p>
            <p className="font-bold text-white text-base mt-0.5 tabular-nums">{totalSetsCount}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Volume Tonnage</p>
            <p className="font-bold text-emerald-400 text-base mt-0.5 font-mono tabular-nums">
              {liveVolume.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
            </p>
          </div>
        </div>

        {/* Rest Timer Banner (Floating when active) */}
        {restSecondsLeft !== null && (
          <div className={`px-4 py-2 flex items-center justify-between border-b text-xs font-medium transition-all ${
            restSecondsLeft === 0
              ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
              : 'bg-cyan-950/40 border-cyan-800/60 text-cyan-200'
          }`}>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-cyan-400" />
              {restSecondsLeft === 0 ? (
                <span className="font-bold">Rest interval completed! Next set ready.</span>
              ) : (
                <span>
                  Rest Timer: <strong className="font-mono tabular-nums text-sm">{formatTimer(restSecondsLeft)}</strong>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestSecondsLeft((prev) => (prev ? prev + 30 : 30))}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
              >
                +30s
              </button>
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Body Content: Exercise & Sets Editor */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeWorkout.exercises.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
              <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-200">No exercises added yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Select an exercise from your library below to start logging sets, repetitions, and weights.
              </p>
            </div>
          ) : (
            activeWorkout.exercises.map((sessionEx, exIdx) => (
              <div 
                key={sessionEx.id || exIdx}
                className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs"
              >
                {/* Exercise Header */}
                <div className="p-3 sm:p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                      {exIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {sessionEx.exerciseName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Target Muscle: <span className="text-emerald-400 font-medium">{sessionEx.muscleGroup}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeExerciseFromActiveWorkout(exIdx)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="p-3 sm:p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                          <th className="py-2 px-2 font-medium w-12 text-center">Set</th>
                          <th className="py-2 px-2 font-medium">Weight (kg)</th>
                          <th className="py-2 px-2 font-medium">Reps</th>
                          <th className="py-2 px-2 font-medium">RPE (1-10)</th>
                          <th className="py-2 px-2 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {sessionEx.sets.map((s, setIdx) => (
                          <tr key={s.id || setIdx} className="hover:bg-slate-800/20">
                            <td className="py-2 px-2 text-center font-mono font-bold text-slate-400">
                              {s.setNumber}
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                step="0.5"
                                value={s.weightKg}
                                onChange={(e) => {
                                  s.weightKg = parseFloat(e.target.value) || 0;
                                }}
                                className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                min="1"
                                value={s.repsCompleted}
                                onChange={(e) => {
                                  s.repsCompleted = parseInt(e.target.value) || 0;
                                }}
                                className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                step="0.5"
                                value={s.rpe || 8}
                                onChange={(e) => {
                                  s.rpe = parseFloat(e.target.value) || 8;
                                }}
                                className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                              />
                            </td>
                            <td className="py-2 px-2 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startRestTimer(s.restSecondsTaken || 90)}
                                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 text-[11px] font-medium transition-colors flex items-center gap-1"
                                  title="Start rest timer"
                                >
                                  <Timer className="w-3 h-3" />
                                  <span>{s.restSecondsTaken || 90}s</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSetFromActiveExercise(exIdx, setIdx)}
                                  className="p-1 text-slate-500 hover:text-rose-400"
                                  title="Delete set"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Set Quick Button */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        const lastSet = sessionEx.sets[sessionEx.sets.length - 1];
                        const reps = lastSet ? lastSet.repsCompleted : 10;
                        const weight = lastSet ? lastSet.weightKg : 40;
                        addSetToActiveExercise(exIdx, reps, weight, 8);
                      }}
                      className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2 rounded hover:bg-emerald-500/10 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Next Set</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Subtotal: {sessionEx.sets.reduce((acc, s) => acc + (s.repsCompleted * s.weightKg), 0).toLocaleString()} kg
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Add Exercise Dropdown Bar */}
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1">
              <label className="block text-[11px] text-slate-400 mb-1">Add Exercise to Workout</label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="">-- Choose from Exercise Library --</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup} - {ex.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto self-end">
              <button
                type="button"
                onClick={handleAddExercise}
                disabled={!selectedExerciseId}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Session</span>
              </button>
            </div>
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Workout Notes & Energy Level
            </label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="e.g. Felt strong on bench press; bumped up set 4 to 87.5kg. Shoulder warmed up well with band pull-aparts."
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            Discard Workout
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Minimize
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="flex-1 sm:flex-initial px-6 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Workout ({liveVolume.toLocaleString()} kg)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
