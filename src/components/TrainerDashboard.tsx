import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { 
  Users, 
  MessageSquare, 
  Dumbbell, 
  Calendar, 
  CheckCircle, 
  Send, 
  Star, 
  Clock, 
  Plus, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const { 
    users, 
    memberProfiles, 
    workoutSessions, 
    workoutPlans, 
    trainerFeedback, 
    addTrainerFeedback,
    currentUser 
  } = useGym();

  const [selectedMemberId, setSelectedMemberId] = useState<number>(3); // Default Alex
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);

  // Find assigned members
  const assignedProfiles = memberProfiles.filter(p => p.assignedTrainerId === (currentUser?.id || 2));
  const assignedUsers = users.filter(u => assignedProfiles.some(p => p.userId === u.id));

  // If no members explicitly assigned in profile, show member accounts
  const visibleMembers = assignedUsers.length > 0 ? assignedUsers : users.filter(u => u.role === 'MEMBER');

  const activeMember = visibleMembers.find(m => m.id === selectedMemberId) || visibleMembers[0];
  const activeMemberProfile = memberProfiles.find(p => p.userId === activeMember?.id);
  const activeMemberSessions = workoutSessions.filter(s => s.memberId === activeMember?.id);
  const activeMemberFeedback = trainerFeedback.filter(f => f.memberId === activeMember?.id);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackContent.trim() || !activeMember) return;

    addTrainerFeedback({
      trainerId: currentUser?.id || 2,
      trainerName: currentUser?.fullName || 'Coach',
      memberId: activeMember.id,
      subject: feedbackSubject.trim(),
      content: feedbackContent.trim(),
      rating: feedbackRating,
    });

    setFeedbackSubject('');
    setFeedbackContent('');
    alert(`Feedback sent to ${activeMember.fullName}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#141b2d] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
              <span>Trainer & Strength Coach Portal</span>
              <span>·</span>
              <span>Assigned Athletes</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Coach Console: {currentUser?.fullName || 'Elena Rostova'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review member training logs, monitor biomechanical progression, and deliver coaching feedback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
              {visibleMembers.length} Assigned Members
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Member Roster (Left) + Member Dossier & Feedback (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Assigned Athletes List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Assigned Member Roster
          </h3>

          <div className="space-y-2">
            {visibleMembers.map((member) => {
              const isSelected = activeMember?.id === member.id;
              const profile = memberProfiles.find(p => p.userId === member.id);
              const sessionsCount = workoutSessions.filter(s => s.memberId === member.id).length;

              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">{member.fullName}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      {profile?.fitnessLevel || 'INTERMEDIATE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{member.email}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Goal: <strong className="text-slate-200">{profile?.primaryGoal || 'STRENGTH'}</strong></span>
                    <span className="text-emerald-400 font-mono tabular-nums">{sessionsCount} workouts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Member Dossier, History, and Coach Notes */}
        <div className="lg:col-span-2 space-y-6">
          {activeMember && (
            <>
              {/* Member Overview Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeMember.fullName}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>Status: <strong className="text-emerald-400">{activeMemberProfile?.membershipStatus}</strong></span>
                      <span>·</span>
                      <span>Plan: <strong className="text-slate-200">{activeMemberProfile?.membershipType}</strong></span>
                      <span>·</span>
                      <span>Joined {activeMember.createdAt.split('T')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Weight</span>
                      <span className="text-white font-bold tabular-nums">{activeMemberProfile?.currentWeightKg || 80} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Target</span>
                      <span className="text-emerald-400 font-bold tabular-nums">{activeMemberProfile?.targetWeightKg || 85} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Height</span>
                      <span className="text-slate-300 tabular-nums">{activeMemberProfile?.heightCm || 180} cm</span>
                    </div>
                  </div>
                </div>

                {/* Recent Member Workouts */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Recent Workout Logs ({activeMemberSessions.length})
                  </h4>

                  {activeMemberSessions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No workout sessions logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeMemberSessions.slice(0, 3).map((s) => (
                        <div key={s.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{s.sessionTitle}</span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              <span>{s.sessionDate}</span>
                              <span> · </span>
                              <span>{s.durationMinutes} mins</span>
                              <span> · </span>
                              <span>{s.exercises.length} exercises</span>
                            </div>
                            {s.notes && <p className="text-[11px] text-slate-400 mt-1 italic">"{s.notes}"</p>}
                          </div>
                          <div className="text-right font-mono text-emerald-400 font-bold tabular-nums">
                            {s.totalVolumeKg.toLocaleString()} kg
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Send Coach Feedback Form */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">
                    Submit Coach Feedback for {activeMember.fullName}
                  </h4>
                </div>

                <form onSubmit={handleSendFeedback} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Subject / Focus</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Squat Depth Cues & Adductor Engagement"
                      value={feedbackSubject}
                      onChange={(e) => setFeedbackSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Feedback Notes & Technique Adjustments</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Provide specific notes regarding rest intervals, form breakdown, or load progression..."
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Session Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`p-1 ${feedbackRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Feedback</span>
                    </button>
                  </div>
                </form>

                {/* Previous Feedback History */}
                {activeMemberFeedback.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Feedback History ({activeMemberFeedback.length})
                    </h5>
                    <div className="space-y-2">
                      {activeMemberFeedback.map((fb) => (
                        <div key={fb.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-200">{fb.subject}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{fb.feedbackDate.split('T')[0]}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed">"{fb.content}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
