import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { FitnessGoal, ProgressEntry } from '../types';
import { 
  Flame, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Target, 
  Calculator, 
  X,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const FitnessGoals: React.FC = () => {
  const { 
    fitnessGoals, 
    addFitnessGoal, 
    updateGoalProgress, 
    deleteFitnessGoal, 
    progressEntries, 
    addProgressEntry, 
    currentUser 
  } = useGym();

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isLogMeasurementModalOpen, setIsLogMeasurementModalOpen] = useState(false);

  // 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState<number>(80);
  const [calcReps, setCalcReps] = useState<number>(5);

  // Epley 1RM Formula: w * (1 + r/30)
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30) * 10) / 10;
  // Brzycki 1RM Formula: w * (36 / (37 - r))
  const brzycki1RM = calcReps < 37 ? Math.round(calcWeight * (36 / (37 - calcReps)) * 10) / 10 : estimated1RM;

  // Form State: Goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState<FitnessGoal['goalType']>('EXERCISE_1RM');
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [currentValue, setCurrentValue] = useState<number | ''>('');
  const [unit, setUnit] = useState('kg');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  // Form State: Body Measurements
  const [weightKg, setWeightKg] = useState<number | ''>(81.5);
  const [chestCm, setChestCm] = useState<number | ''>(105);
  const [waistCm, setWaistCm] = useState<number | ''>(84.5);
  const [armsCm, setArmsCm] = useState<number | ''>(38.4);
  const [thighsCm, setThighsCm] = useState<number | ''>(60.2);
  const [bodyFat, setBodyFat] = useState<number | ''>(14.4);
  const [measurementNotes, setMeasurementNotes] = useState('');

  const memberGoals = fitnessGoals.filter(g => g.memberId === (currentUser?.id || 3));
  const memberProgress = progressEntries.filter(p => p.memberId === (currentUser?.id || 3)).sort((a,b) => a.entryDate.localeCompare(b.entryDate));

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !targetValue) return;

    addFitnessGoal({
      memberId: currentUser?.id || 3,
      goalType,
      title: goalTitle.trim(),
      targetValue: Number(targetValue),
      currentValue: Number(currentValue) || 0,
      unit,
      targetDate,
      status: (Number(currentValue) >= Number(targetValue)) ? 'ACHIEVED' : 'IN_PROGRESS',
    });

    setIsAddGoalModalOpen(false);
    setGoalTitle('');
    setTargetValue('');
    setCurrentValue('');
  };

  const handleLogMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg) return;

    addProgressEntry({
      memberId: currentUser?.id || 3,
      entryDate: new Date().toISOString().split('T')[0],
      bodyWeightKg: Number(weightKg),
      chestCm: chestCm ? Number(chestCm) : undefined,
      waistCm: waistCm ? Number(waistCm) : undefined,
      armsCm: armsCm ? Number(armsCm) : undefined,
      thighsCm: thighsCm ? Number(thighsCm) : undefined,
      bodyFatPercent: bodyFat ? Number(bodyFat) : undefined,
      notes: measurementNotes.trim(),
    });

    setIsLogMeasurementModalOpen(false);
    setMeasurementNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Fitness Goals & Progression</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track quantitative strength thresholds, hypertrophy measurements, and periodized targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLogMeasurementModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <span>Log Measurements</span>
          </button>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Target Goal</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Goals List + 1RM Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Targets (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Fitness Targets ({memberGoals.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberGoals.map((goal) => {
              const progressPct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              const isAchieved = goal.status === 'ACHIEVED' || progressPct >= 100;

              return (
                <div 
                  key={goal.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[11px] text-slate-400">{goal.goalType.replace('_', ' ')}</span>
                      <span className={`text-[10px] font-semibold ${isAchieved ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isAchieved ? 'Goal Met' : `Target: ${goal.targetDate}`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {goal.title}
                    </h4>

                    {/* Progress Numbers */}
                    <div className="mt-3 flex items-baseline justify-between font-mono">
                      <div>
                        <span className="text-xl font-bold text-emerald-400 tabular-nums">
                          {goal.currentValue}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">{goal.unit}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Target: <strong className="text-white font-bold">{goal.targetValue} {goal.unit}</strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isAchieved ? 'bg-emerald-400' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                      {progressPct}% Completed
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const val = prompt('Update current progress value:', String(goal.currentValue));
                          if (val !== null) updateGoalProgress(goal.id, Number(val));
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteFitnessGoal(goal.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1RM Scientific Calculator Widget (1 Col) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Calculator className="w-4 h-4" />
              <span>Biomechanical Estimator</span>
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">One-Rep Maximum (1RM)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculate projected maximal 1RM using standardized Epley & Brzycki equations.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Lifted Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reps Completed (1-15)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={calcReps}
                  onChange={(e) => setCalcReps(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs tabular-nums focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Projected Outputs */}
            <div className="mt-4 p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Estimated 1RM (Epley):</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {estimated1RM} kg
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-xs text-slate-400">Brzycki Index:</span>
                <span className="text-sm font-semibold text-slate-200 font-mono tabular-nums">
                  {brzycki1RM} kg
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            Formula: Weight × (1 + Reps / 30). Most accurate between 2 and 10 repetitions.
          </div>
        </div>

      </div>

      {/* Body Measurements & Progression Log Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Body Measurements & Anthropometric History</h3>
          <span className="text-xs text-slate-400">{memberProgress.length} logs recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Body Weight</th>
                <th className="py-2.5 px-4 font-medium">Chest</th>
                <th className="py-2.5 px-4 font-medium">Waist</th>
                <th className="py-2.5 px-4 font-medium">Arms</th>
                <th className="py-2.5 px-4 font-medium">Thighs</th>
                <th className="py-2.5 px-4 font-medium">Est. Body Fat</th>
                <th className="py-2.5 px-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {memberProgress.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-slate-300 font-sans">{entry.entryDate}</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold tabular-nums">{entry.bodyWeightKg} kg</td>
                  <td className="py-2.5 px-4 text-slate-300 tabular-nums">{entry.chestCm ? `${entry.chestCm} cm` : '-'}</td>
                  <td className="py-2.5 px-4 text-slate-300 tabular-nums">{entry.waistCm ? `${entry.waistCm} cm` : '-'}</td>
                  <td className="py-2.5 px-4 text-slate-300 tabular-nums">{entry.armsCm ? `${entry.armsCm} cm` : '-'}</td>
                  <td className="py-2.5 px-4 text-slate-300 tabular-nums">{entry.thighsCm ? `${entry.thighsCm} cm` : '-'}</td>
                  <td className="py-2.5 px-4 text-cyan-400 tabular-nums">{entry.bodyFatPercent ? `${entry.bodyFatPercent}%` : '-'}</td>
                  <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px] truncate max-w-[200px]">{entry.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddGoalModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Set Quantitative Fitness Target</h3>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barbell Squat 1RM: 140 kg"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Goal Classification</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="EXERCISE_1RM">EXERCISE_1RM</option>
                  <option value="WEEKLY_WORKOUTS">WEEKLY_WORKOUTS</option>
                  <option value="TARGET_WEIGHT">TARGET_WEIGHT</option>
                  <option value="DAILY_CALORIES">DAILY_CALORIES</option>
                  <option value="CONSISTENCY">CONSISTENCY</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Current Value</label>
                  <input
                    type="number"
                    step="0.5"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Target Goal *</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Measurement Modal */}
      {isLogMeasurementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsLogMeasurementModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Record Body Measurements</h3>

            <form onSubmit={handleLogMeasurement} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Body Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={chestCm}
                    onChange={(e) => setChestCm(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={(e) => setWaistCm(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={armsCm}
                    onChange={(e) => setArmsCm(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Thighs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={thighsCm}
                    onChange={(e) => setThighsCm(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-sans font-medium mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Measured fasted in morning"
                  value={measurementNotes}
                  onChange={(e) => setMeasurementNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-sans focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setIsLogMeasurementModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
