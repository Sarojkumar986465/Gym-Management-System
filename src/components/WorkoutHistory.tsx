import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp,
  Search
} from 'lucide-react';

interface WorkoutHistoryProps {
  onStartWorkout: () => void;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ onStartWorkout }) => {
  const { workoutSessions, deleteWorkoutSession, currentUser } = useGym();
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState<string>('ALL');
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const memberSessions = workoutSessions.filter(s => s.memberId === (currentUser?.id || 3));

  // Extract all distinct exercise names from member's history for filter
  const allExerciseNames = Array.from(
    new Set(memberSessions.flatMap(s => s.exercises.map(e => e.exerciseName)))
  );

  const filteredSessions = memberSessions.filter(session => {
    const matchesSearch = session.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExercise = selectedExerciseFilter === 'ALL' ||
      session.exercises.some(e => e.exerciseName === selectedExerciseFilter);

    return matchesSearch && matchesExercise;
  });

  const toggleExpand = (id: number) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workout log?')) {
      deleteWorkoutSession(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Workout History & Logs</h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of recorded workout sessions, sets, volume, and personal exertion.
          </p>
        </div>
        <button
          onClick={onStartWorkout}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Workout</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search session title or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedExerciseFilter}
            onChange={(e) => setSelectedExerciseFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">Filter by Exercise: All Movements</option>
            {allExerciseNames.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
          <span>Total Records Found:</span>
          <strong className="text-emerald-400 font-mono tabular-nums">{filteredSessions.length}</strong>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">No workout records matching criteria</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing filters or start logging your first workout.</p>
          <button
            onClick={onStartWorkout}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
          >
            Start Workout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isExpanded = expandedSessionId === session.id;
            const totalSets = session.exercises.reduce((acc, e) => acc + e.sets.length, 0);

            return (
              <div 
                key={session.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs transition-all hover:border-slate-700"
              >
                {/* Header Summary Row */}
                <div 
                  onClick={() => toggleExpand(session.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {session.sessionTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{session.sessionDate}</span>
                        <span>·</span>
                        <span>{session.startTime}</span>
                        {session.durationMinutes > 0 && (
                          <>
                            <span>·</span>
                            <span>{session.durationMinutes} mins</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{session.exercises.length} movements</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Volume</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                        {session.totalVolumeKg.toLocaleString()} kg
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Delete workout log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Session Detail: Exercises & Sets Table */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/50 p-4 sm:p-5 space-y-4">
                    {session.notes && (
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-slate-400 block mb-0.5">Session Notes:</strong>
                        {session.notes}
                      </div>
                    )}

                    <div className="space-y-3">
                      {session.exercises.map((ex, exIdx) => (
                        <div key={ex.id || exIdx} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-white text-xs">
                              {exIdx + 1}. {ex.exerciseName}
                            </span>
                            <span className="text-[11px] text-emerald-400 font-medium">
                              {ex.muscleGroup}
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px]">
                              <thead>
                                <tr className="text-slate-500 border-b border-slate-800/60 pb-1">
                                  <th className="py-1 px-2 font-medium w-12 text-center">Set</th>
                                  <th className="py-1 px-2 font-medium">Weight</th>
                                  <th className="py-1 px-2 font-medium">Reps</th>
                                  <th className="py-1 px-2 font-medium">RPE</th>
                                  <th className="py-1 px-2 font-medium text-right">Volume</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/30">
                                {ex.sets.map((set, sIdx) => (
                                  <tr key={set.id || sIdx} className="hover:bg-slate-800/30">
                                    <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-400">
                                      {set.setNumber}
                                    </td>
                                    <td className="py-1.5 px-2 font-mono text-slate-200 tabular-nums">
                                      {set.weightKg} kg
                                    </td>
                                    <td className="py-1.5 px-2 font-mono text-slate-200 tabular-nums">
                                      {set.repsCompleted} reps
                                    </td>
                                    <td className="py-1.5 px-2 font-mono text-slate-400 tabular-nums">
                                      {set.rpe || 8.0}
                                    </td>
                                    <td className="py-1.5 px-2 text-right font-mono text-emerald-400 tabular-nums">
                                      {(set.weightKg * set.repsCompleted).toLocaleString()} kg
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
