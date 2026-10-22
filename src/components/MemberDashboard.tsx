import React from 'react';
import { useGym } from '../context/GymContext';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  TrendingUp, 
  Plus, 
  Calendar, 
  ArrowRight, 
  UtensilsCrossed, 
  ChevronRight,
  Sparkles,
  MessageSquare,
  Award
} from 'lucide-react';

interface MemberDashboardProps {
  onStartWorkout: (planId?: number, title?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onStartWorkout, onNavigateTab }) => {
  const { 
    currentUser, 
    workoutSessions, 
    dietEntries, 
    fitnessGoals, 
    workoutPlans, 
    trainerFeedback,
    activeWorkout 
  } = useGym();

  // Streak calculation from actual dates
  const calculateStreak = () => {
    if (!currentUser) return 0;
    const memberSessions = workoutSessions.filter(s => s.memberId === currentUser.id);
    const dates = Array.from(new Set(memberSessions.map(s => s.sessionDate))).sort().reverse();
    if (dates.length === 0) return 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentExpected = dates[0] === todayStr ? todayStr : yesterday;
    if (!dates.includes(currentExpected)) return 0;

    let streak = 0;
    for (const d of dates) {
      if (d === currentExpected) {
        streak++;
        const prevDate = new Date(new Date(currentExpected).getTime() - 86400000).toISOString().split('T')[0];
        currentExpected = prevDate;
      } else if (d < currentExpected) {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  // Aggregate stats
  const memberSessions = workoutSessions.filter(s => s.memberId === (currentUser?.id || 3));
  const totalCompletedWorkouts = memberSessions.length;
  const totalVolumeTonnage = memberSessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);
  const weeklyDurationMins = memberSessions.slice(0, 5).reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  // Today's diet
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = dietEntries.filter(d => d.memberId === (currentUser?.id || 3) && d.entryDate === todayStr);
  const todayCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const todayProtein = todayMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const todayCarbs = todayMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const todayFats = todayMeals.reduce((acc, m) => acc + m.fatsGrams, 0);

  // Assigned active plan
  const activePlan = workoutPlans[0];

  // Assigned feedback
  const feedbackList = trainerFeedback.filter(f => f.memberId === (currentUser?.id || 3));

  // Chart data: 7-day workout volume
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = [
    { day: 'Mon', vol: 4620, duration: 75 },
    { day: 'Tue', vol: 0, duration: 0 },
    { day: 'Wed', vol: 4980, duration: 70 },
    { day: 'Thu', vol: 0, duration: 0 },
    { day: 'Fri', vol: 5850, duration: 70 },
    { day: 'Sat', vol: 0, duration: 0 },
    { day: 'Sun', vol: 0, duration: 0 },
  ];
  const maxVolume = Math.max(...weeklyData.map(d => d.vol), 6000);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0e1726] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
              <span>Member Overview</span>
              <span>·</span>
              <span>Active Training Cycle</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.fullName || 'Athlete'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Consistent strength progression logged. You are on a <span className="text-emerald-400 font-semibold">{streakDays}-day workout streak</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onStartWorkout(undefined, 'Quick Workout')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Start Workout</span>
            </button>
            <button
              onClick={() => onNavigateTab('diet')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400" />
              <span>Log Meal</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (4 columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Completed Sessions</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">
              {totalCompletedWorkouts}
            </span>
            <span className="text-xs text-slate-500">logged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Lifetime session volume recorded
          </p>
        </div>

        {/* Stat 2 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Training Duration</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">
              {weeklyDurationMins}
            </span>
            <span className="text-xs text-slate-500">minutes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Across recent 5 training logs
          </p>
        </div>

        {/* Stat 3 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Workout Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 tabular-nums">
              {streakDays}
            </span>
            <span className="text-xs text-slate-500">days active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Calculated from database dates
          </p>
        </div>

        {/* Stat 4 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Volume Tonnage</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {totalVolumeTonnage.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Sum of (reps × load) across all sets
          </p>
        </div>
      </div>

      {/* Main Grid: Weekly Chart & Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2 Cols: Weekly Activity & Volume Progression Chart */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Weekly Workout Volume & Load</h3>
                <p className="text-xs text-slate-400 mt-0.5">Calculated total weight moved (kg) per day</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  Volume (kg)
                </span>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-800">
              {weeklyData.map((item, idx) => {
                const heightPct = item.vol > 0 ? Math.max(12, Math.round((item.vol / maxVolume) * 100)) : 4;
                const hasSession = item.vol > 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] text-slate-400 font-mono tabular-nums mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {hasSession ? `${item.vol}kg` : '-'}
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[40px] rounded-t transition-all ${
                        hasSession 
                          ? 'bg-emerald-500/80 group-hover:bg-emerald-400' 
                          : 'bg-slate-800/60'
                      }`}
                    />
                    <span className="text-[11px] text-slate-400 font-medium mt-2">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Peak Day: <strong className="text-slate-200">Friday (5,850 kg)</strong></span>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Detailed Workout Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1 Col: Assigned Plan & Today's Target */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Assigned Workout Plan
              </span>
              <span className="text-[11px] text-slate-500">Week 3 of 8</span>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              {activePlan?.title || '4-Day Hypertrophy & Power Split'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {activePlan?.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Upcoming Prescribed Routine:</p>
              {activePlan?.exercises?.slice(0, 3).map((ex, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 text-slate-300">
                  <span className="truncate max-w-[180px]">{ex.exerciseName}</span>
                  <span className="font-mono text-slate-400 tabular-nums">{ex.targetSets} × {ex.targetReps}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => onStartWorkout(activePlan?.id, activePlan?.title)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Launch Prescribed Session</span>
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Grid: Nutrition & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Diet & Daily Macro Summary */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Today's Nutrition Summary</h3>
              <p className="text-xs text-slate-400 mt-0.5">Target: 2,600 kcal · 170g Protein</p>
            </div>
            <button
              onClick={() => onNavigateTab('diet')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View Meals
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Calories Meter */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Calories</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  <strong className="text-white">{todayCalories}</strong> / 2,600 kcal
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todayCalories / 2600) * 100)}%` }}
                />
              </div>
            </div>

            {/* Protein Meter */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Protein</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  <strong className="text-emerald-400">{todayProtein}g</strong> / 170g
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todayProtein / 170) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs & Fats */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded bg-slate-950/50 border border-slate-800">
                <span className="text-[11px] text-slate-400">Carbohydrates</span>
                <p className="text-sm font-bold text-white font-mono mt-0.5 tabular-nums">{todayCarbs}g</p>
              </div>
              <div className="p-2.5 rounded bg-slate-950/50 border border-slate-800">
                <span className="text-[11px] text-slate-400">Dietary Fats</span>
                <p className="text-sm font-bold text-white font-mono mt-0.5 tabular-nums">{todayFats}g</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Goals Progression */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Fitness Goals & Progression</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active targets for this quarter</p>
            </div>
            <button
              onClick={() => onNavigateTab('goals')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              All Goals
            </button>
          </div>

          <div className="space-y-3.5">
            {fitnessGoals.slice(0, 3).map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <div key={goal.id} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200 truncate max-w-[190px]">
                      {goal.title}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trainer Feedback / Coach Notes */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Coach Notes & Feedback</h3>
              </div>
              <span className="text-[10px] text-slate-400">Coach Elena</span>
            </div>

            {feedbackList.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <p className="font-semibold text-slate-200">{feedbackList[0].subject}</p>
                  <p className="text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    "{feedbackList[0].content}"
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">
                    {feedbackList[0].feedbackDate.split('T')[0]}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No trainer notes logged yet.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400">
              Assigned Coach: Elena Rostova (CSCS)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
