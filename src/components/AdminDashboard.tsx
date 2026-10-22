import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { MemberProfile, TrainerProfile, Exercise, User, SubscriptionPlan, PaymentRecord } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Dumbbell, 
  CalendarDays, 
  Search, 
  UserCheck, 
  UserX, 
  RotateCcw, 
  Activity, 
  Flame, 
  CheckCircle,
  Database,
  Plus,
  Trash2,
  Edit2,
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  Award,
  Check,
  Receipt,
  Download
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    memberProfiles, 
    trainerProfiles, 
    exercises, 
    workoutPlans, 
    workoutSessions, 
    auditLogs,
    subscriptionPlans,
    paymentRecords,
    addMember,
    updateMember,
    deleteMember,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    addExercise,
    deleteExercise,
    addSubscriptionPlan,
    deleteSubscriptionPlan,
    addPaymentRecord,
    updatePaymentStatus,
    toggleUserStatus, 
    resetToDefaults 
  } = useGym();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MEMBERS' | 'TRAINERS' | 'PAYMENTS' | 'SUBSCRIPTIONS' | 'EXERCISES' | 'AUDIT'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Modals state
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ user: User; profile?: MemberProfile } | null>(null);

  const [isAddTrainerModalOpen, setIsAddTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<{ user: User; profile?: TrainerProfile } | null>(null);

  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Form states: Member
  const [mName, setMName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mTier, setMTier] = useState<'STANDARD' | 'PREMIUM' | 'VIP'>('PREMIUM');
  const [mGoal, setMGoal] = useState<'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE' | 'GENERAL_FITNESS'>('MUSCLE_GAIN');
  const [mLevel, setMLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [mWeight, setMWeight] = useState<number | ''>(80);
  const [mTrainerId, setMTrainerId] = useState<number | ''>('');

  // Form states: Trainer
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tSpecialization, setTSpecialization] = useState('Hypertrophy & Strength Conditioning');
  const [tExpYears, setTExpYears] = useState(5);
  const [tRate, setTRate] = useState(70);
  const [tCert, setTCert] = useState('NSCA-CSCS, NASM-CPT');
  const [tBio, setTBio] = useState('');

  // Form states: Subscription Plan
  const [subName, setSubName] = useState('');
  const [subPrice, setSubPrice] = useState<number | ''>(49);
  const [subCycle, setSubCycle] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('MONTHLY');
  const [subFeaturesText, setSubFeaturesText] = useState('Full floor access\nLocker & showers\nFree fitness assessment');

  // Form states: Payment Record
  const [payMemberId, setPayMemberId] = useState<number>(3);
  const [payPlanName, setPayPlanName] = useState('Premium Athlete Pass');
  const [payAmount, setPayAmount] = useState<number | ''>(69);
  const [payMethod, setPayMethod] = useState<PaymentRecord['paymentMethod']>('CREDIT_CARD');
  const [payStatus, setPayStatus] = useState<PaymentRecord['status']>('PAID');

  // Form states: Exercise
  const [exName, setExName] = useState('');
  const [exMuscle, setExMuscle] = useState<Exercise['muscleGroup']>('CHEST');
  const [exCategory, setExCategory] = useState<Exercise['category']>('STRENGTH');
  const [exDifficulty, setExDifficulty] = useState<Exercise['difficultyLevel']>('INTERMEDIATE');
  const [exEquipment, setExEquipment] = useState('Barbell, Power Rack');
  const [exDesc, setExDesc] = useState('');
  const [exInst, setExInst] = useState('');

  // Financial calculation:
  const totalPaidRevenue = paymentRecords
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = paymentRecords
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMembers = users.filter(u => u.role === 'MEMBER').length;
  const activeMembers = users.filter(u => u.role === 'MEMBER' && u.enabled).length;
  const totalTrainers = users.filter(u => u.role === 'TRAINER').length;
  const totalExercises = exercises.length;
  const totalPlans = workoutPlans.length;
  const totalVolumeTonnage = workoutSessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);

  // Filtered members list
  const memberUsers = users.filter(u => u.role === 'MEMBER');
  const filteredMembers = memberUsers.filter(u => {
    const profile = memberProfiles.find(p => p.userId === u.id);
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || profile?.membershipType === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Filtered trainers list
  const trainerUsers = users.filter(u => u.role === 'TRAINER');

  // Submit Member Add / Edit
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mEmail.trim()) return;

    if (editingMember) {
      updateMember(
        editingMember.user.id,
        { fullName: mName.trim(), email: mEmail.trim(), phoneNumber: mPhone.trim() },
        { 
          membershipType: mTier, 
          primaryGoal: mGoal, 
          fitnessLevel: mLevel, 
          currentWeightKg: Number(mWeight) || 75,
          assignedTrainerId: mTrainerId ? Number(mTrainerId) : undefined 
        }
      );
      setEditingMember(null);
    } else {
      addMember(
        { fullName: mName.trim(), email: mEmail.trim(), phoneNumber: mPhone.trim(), enabled: true },
        { 
          membershipType: mTier, 
          membershipStatus: 'ACTIVE', 
          primaryGoal: mGoal, 
          fitnessLevel: mLevel, 
          currentWeightKg: Number(mWeight) || 75,
          assignedTrainerId: mTrainerId ? Number(mTrainerId) : undefined 
        }
      );
      setIsAddMemberModalOpen(false);
    }

    setMName('');
    setMEmail('');
    setMPhone('');
  };

  // Submit Trainer Add / Edit
  const handleSaveTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tEmail.trim()) return;

    if (editingTrainer) {
      updateTrainer(
        editingTrainer.user.id,
        { fullName: tName.trim(), email: tEmail.trim(), phoneNumber: tPhone.trim() },
        {
          specialization: tSpecialization.trim(),
          experienceYears: Number(tExpYears) || 1,
          hourlyRate: Number(tRate) || 50,
          certification: tCert.trim(),
          bio: tBio.trim(),
        }
      );
      setEditingTrainer(null);
    } else {
      addTrainer(
        { fullName: tName.trim(), email: tEmail.trim(), phoneNumber: tPhone.trim(), enabled: true },
        {
          specialization: tSpecialization.trim(),
          experienceYears: Number(tExpYears) || 1,
          hourlyRate: Number(tRate) || 50,
          certification: tCert.trim(),
          bio: tBio.trim(),
        }
      );
      setIsAddTrainerModalOpen(false);
    }

    setTName('');
    setTEmail('');
    setTPhone('');
  };

  // Submit Subscription Plan
  const handleSaveSubscriptionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subPrice) return;

    const feats = subFeaturesText.split('\n').map(s => s.trim()).filter(Boolean);

    addSubscriptionPlan({
      name: subName.trim(),
      price: Number(subPrice),
      billingCycle: subCycle,
      features: feats,
      popular: false,
    });

    setIsAddPlanModalOpen(false);
    setSubName('');
    setSubPrice(49);
    setSubFeaturesText('Full floor access\nLocker & showers');
  };

  // Submit Payment Record
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const member = users.find(u => u.id === payMemberId);
    if (!member || !payAmount) return;

    const todayStr = new Date().toISOString().split('T')[0];

    addPaymentRecord({
      memberId: member.id,
      memberName: member.fullName,
      planName: payPlanName,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      status: payStatus,
      paymentDate: todayStr,
      dueDate: todayStr,
    });

    setIsAddPaymentModalOpen(false);
  };

  // Submit Exercise Add
  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName.trim() || !exInst.trim()) return;

    addExercise({
      name: exName.trim(),
      category: exCategory,
      muscleGroup: exMuscle,
      difficultyLevel: exDifficulty,
      equipmentRequired: exEquipment || 'Barbell',
      description: exDesc || 'Biomechanical resistance movement.',
      instructions: exInst,
      secondaryMuscles: [],
    });

    setIsAddExerciseModalOpen(false);
    setExName('');
    setExDesc('');
    setExInst('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1e1724] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Full System Command Center</span>
              <span>·</span>
              <span>Root Administrator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Gym Management System Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Complete administrative authority over member enrollment, coaching staff, payment transactions, gym subscription plans, and audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to clean factory state?')) {
                  resetToDefaults();
                }
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800">
        {[
          { id: 'OVERVIEW', label: 'System Overview' },
          { id: 'MEMBERS', label: `Manage Members (${totalMembers})` },
          { id: 'TRAINERS', label: `Manage Trainers (${totalTrainers})` },
          { id: 'PAYMENTS', label: `Billing & Payments (${paymentRecords.length})` },
          { id: 'SUBSCRIPTIONS', label: `Gym Plans (${subscriptionPlans.length})` },
          { id: 'EXERCISES', label: `Exercise Library (${totalExercises})` },
          { id: 'AUDIT', label: `Live Audit Logs (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-semibold whitespace-nowrap rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM KPIS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Members</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-bold text-white tabular-nums">{activeMembers}</span>
                <span className="text-xs text-slate-500 font-sans">/ {totalMembers} total</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Active gym memberships</p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Collected Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                  ${totalPaidRevenue.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-sans">USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">${pendingPayments} pending invoices</p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Certified Coaches</span>
                <UserCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-bold text-cyan-400 tabular-nums">{totalTrainers}</span>
                <span className="text-xs text-slate-500 font-sans">trainers</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Staff coaches on roster</p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Subscription Tiers</span>
                <CreditCard className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {subscriptionPlans.length}
                </span>
                <span className="text-xs text-slate-500 font-sans">membership plans</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Managed in Gym Plans tab</p>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              onClick={() => {
                setActiveTab('MEMBERS');
                setIsAddMemberModalOpen(true);
              }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Member</span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300">Add Member</h3>
              <p className="text-[11px] text-slate-400 mt-1">Enroll athlete, assign trainer & plan.</p>
            </div>

            <div 
              onClick={() => {
                setActiveTab('TRAINERS');
                setIsAddTrainerModalOpen(true);
              }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Trainer</span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">Add Trainer</h3>
              <p className="text-[11px] text-slate-400 mt-1">Recruit coach, set rate & specialties.</p>
            </div>

            <div 
              onClick={() => {
                setActiveTab('PAYMENTS');
                setIsAddPaymentModalOpen(true);
              }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Payments</span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300">Record Payment</h3>
              <p className="text-[11px] text-slate-400 mt-1">Log fee, create invoice & receipt.</p>
            </div>

            <div 
              onClick={() => {
                setActiveTab('SUBSCRIPTIONS');
                setIsAddPlanModalOpen(true);
              }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Plans</span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300">Create Gym Plan</h3>
              <p className="text-[11px] text-slate-400 mt-1">Configure pricing tier & perks.</p>
            </div>
          </div>

          {/* Recent System Activity Preview */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Recent System Audit Log</h3>
              <button
                onClick={() => setActiveTab('AUDIT')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                View Full Audit History →
              </button>
            </div>
            <div className="space-y-2">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {log.category}
                    </span>
                    <div>
                      <span className="font-bold text-white">{log.action}: </span>
                      <span className="text-slate-300">{log.details}</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 font-mono">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MEMBERS (ADD & DELETE) */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search members by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none shrink-0"
              >
                <option value="ALL">All Tiers</option>
                <option value="STANDARD">Standard ($39)</option>
                <option value="PREMIUM">Premium ($69)</option>
                <option value="VIP">VIP ($99)</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingMember(null);
                setMName('');
                setMEmail('');
                setMPhone('');
                setIsAddMemberModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                    <th className="py-2.5 px-4 font-medium">Athlete / Name</th>
                    <th className="py-2.5 px-4 font-medium">Contact</th>
                    <th className="py-2.5 px-4 font-medium">Tier & Plan</th>
                    <th className="py-2.5 px-4 font-medium">Assigned Coach</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium text-right">Delete / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredMembers.map((member) => {
                    const profile = memberProfiles.find(p => p.userId === member.id);
                    const trainerUser = users.find(u => u.id === profile?.assignedTrainerId);

                    return (
                      <tr key={member.id} className="hover:bg-slate-800/20">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{member.fullName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{member.email}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                          {member.phoneNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            profile?.membershipType === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            profile?.membershipType === 'PREMIUM' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {profile?.membershipType || 'STANDARD'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {trainerUser ? (
                            <span className="text-cyan-400 font-medium">{trainerUser.fullName}</span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {member.enabled ? (
                            <span className="text-emerald-400 font-medium">Active</span>
                          ) : (
                            <span className="text-rose-400 font-medium">Deactivated</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingMember({ user: member, profile });
                                setMName(member.fullName);
                                setMEmail(member.email);
                                setMPhone(member.phoneNumber || '');
                                setMTier(profile?.membershipType || 'PREMIUM');
                                setMGoal(profile?.primaryGoal || 'MUSCLE_GAIN');
                                setMLevel(profile?.fitnessLevel || 'INTERMEDIATE');
                                setMWeight(profile?.currentWeightKg || 80);
                                setMTrainerId(profile?.assignedTrainerId || '');
                                setIsAddMemberModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                              title="Edit member"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(member.id)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                member.enabled
                                  ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                            >
                              {member.enabled ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete member ${member.fullName} permanently from system?`)) {
                                  deleteMember(member.id);
                                }
                              }}
                              className="px-2 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded text-[11px] font-semibold flex items-center gap-1"
                              title="Delete member"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE TRAINERS (ADD & DELETE) */}
      {activeTab === 'TRAINERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Coaching Roster & Staff Management</h3>
              <p className="text-xs text-slate-400 mt-0.5">Add trainers, delete trainers, manage certifications and billing rates.</p>
            </div>
            <button
              onClick={() => {
                setEditingTrainer(null);
                setTName('');
                setTEmail('');
                setTPhone('');
                setIsAddTrainerModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Trainer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainerUsers.map((trainer) => {
              const profile = trainerProfiles.find(p => p.userId === trainer.id);
              const assignedMembersCount = memberProfiles.filter(m => m.assignedTrainerId === trainer.id).length;

              return (
                <div key={trainer.id} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{trainer.fullName}</h4>
                      <p className="text-xs text-cyan-400 font-medium mt-0.5">{profile?.specialization}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{trainer.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-400 font-bold">${profile?.hourlyRate}/hr</span>
                      <span className="block text-[11px] text-slate-400 font-mono">{profile?.experienceYears} yrs exp</span>
                    </div>
                  </div>

                  {profile?.certification && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-500">Certifications: </span>
                      <span className="font-mono">{profile.certification}</span>
                    </div>
                  )}

                  {profile?.bio && (
                    <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
                      "{profile.bio}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      Assigned Athletes: <strong className="text-white font-mono">{assignedMembersCount}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTrainer({ user: trainer, profile });
                          setTName(trainer.fullName);
                          setTEmail(trainer.email);
                          setTPhone(trainer.phoneNumber || '');
                          setTSpecialization(profile?.specialization || '');
                          setTExpYears(profile?.experienceYears || 3);
                          setTRate(profile?.hourlyRate || 65);
                          setTCert(profile?.certification || '');
                          setTBio(profile?.bio || '');
                          setIsAddTrainerModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                        title="Edit coach"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete coach ${trainer.fullName} permanently?`)) {
                            deleteTrainer(trainer.id);
                          }
                        }}
                        className="px-2 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded text-[11px] font-semibold flex items-center gap-1"
                        title="Delete trainer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT INFORMATION & BILLING */}
      {activeTab === 'PAYMENTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Payment Information & Transaction Invoices</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monitor member subscription fees, payment methods, receipts, and invoice status.</p>
            </div>
            <button
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Payment</span>
            </button>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                    <th className="py-2.5 px-4 font-medium">Invoice #</th>
                    <th className="py-2.5 px-4 font-medium">Member</th>
                    <th className="py-2.5 px-4 font-medium">Subscription / Item</th>
                    <th className="py-2.5 px-4 font-medium">Amount</th>
                    <th className="py-2.5 px-4 font-medium">Method</th>
                    <th className="py-2.5 px-4 font-medium">Date</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {paymentRecords.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">
                        {pay.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {pay.memberName}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {pay.planName}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        ${pay.amount} USD
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {pay.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {pay.paymentDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pay.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          pay.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pay.status !== 'PAID' && (
                            <button
                              onClick={() => updatePaymentStatus(pay.id, 'PAID')}
                              className="px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded text-[11px] font-semibold"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => alert(`Receipt downloaded for invoice ${pay.invoiceNumber} ($${pay.amount} - ${pay.memberName})`)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                            title="Download PDF Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GYM SUBSCRIPTION PLANS (ADD & DELETE) */}
      {activeTab === 'SUBSCRIPTIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Gym Membership Subscription Plans</h3>
              <p className="text-xs text-slate-400 mt-0.5">Configure gym packages, rates, perks, and custom subscription billing cycles.</p>
            </div>
            <button
              onClick={() => setIsAddPlanModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subscription Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.id}
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {plan.billingCycle}
                    </span>
                    {plan.popular && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                        Popular
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white tracking-tight">{plan.name}</h4>

                  <div className="mt-3 flex items-baseline gap-1 font-mono">
                    <span className="text-2xl font-black text-white">${plan.price}</span>
                    <span className="text-xs text-slate-400 font-sans">
                      /{plan.billingCycle === 'ANNUAL' ? 'year' : 'month'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {plan.activeSubscriberCount} active members
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete subscription plan "${plan.name}"?`)) {
                        deleteSubscriptionPlan(plan.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded"
                    title="Delete plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EXERCISES */}
      {activeTab === 'EXERCISES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Global Biomechanical Exercise Library</h3>
              <p className="text-xs text-slate-400 mt-0.5">Add, audit, and curate movement patterns used across workout plans.</p>
            </div>
            <button
              onClick={() => setIsAddExerciseModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Movement</span>
            </button>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                    <th className="py-2.5 px-4 font-medium">Exercise</th>
                    <th className="py-2.5 px-4 font-medium">Muscle Target</th>
                    <th className="py-2.5 px-4 font-medium">Category</th>
                    <th className="py-2.5 px-4 font-medium">Difficulty</th>
                    <th className="py-2.5 px-4 font-medium">Equipment</th>
                    <th className="py-2.5 px-4 font-medium text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {exercises.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-800/20">
                      <td className="py-2.5 px-4 font-bold text-white">
                        {ex.name}
                      </td>
                      <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                        {ex.muscleGroup}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">
                        {ex.category}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        {ex.difficultyLevel}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                        {ex.equipmentRequired}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete exercise "${ex.name}"?`)) {
                              deleteExercise(ex.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Full System Audit & Activity Log</h3>
              <p className="text-xs text-slate-400 mt-0.5">Immutable record of logins, member creations, payments, and admin actions.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">{auditLogs.length} total entries</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                    <th className="py-2.5 px-4 font-medium w-40">Timestamp</th>
                    <th className="py-2.5 px-4 font-medium w-28">Category</th>
                    <th className="py-2.5 px-4 font-medium w-44">Action</th>
                    <th className="py-2.5 px-4 font-medium">Details</th>
                    <th className="py-2.5 px-4 font-medium text-right">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/20">
                      <td className="py-2.5 px-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 font-semibold">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white font-sans">{log.action}</td>
                      <td className="py-2.5 px-4 text-slate-300 font-sans">{log.details}</td>
                      <td className="py-2.5 px-4 text-right text-slate-400 font-sans">{log.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEMBER */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddMemberModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingMember ? 'Edit Member Profile' : 'Enroll New Member in System'}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jordan@gympulse.com"
                    value={mEmail}
                    onChange={(e) => setMEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1-555-0199"
                    value={mPhone}
                    onChange={(e) => setMPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Membership Plan</label>
                  <select
                    value={mTier}
                    onChange={(e) => setMTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="STANDARD">Standard ($39/mo)</option>
                    <option value="PREMIUM">Premium ($69/mo)</option>
                    <option value="VIP">VIP All-Access ($99/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assign Coach</label>
                  <select
                    value={mTrainerId}
                    onChange={(e) => setMTrainerId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-- No Coach Assigned --</option>
                    {trainerUsers.map(t => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Fitness Goal</label>
                  <select
                    value={mGoal}
                    onChange={(e) => setMGoal(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="MUSCLE_GAIN">Muscle Hypertrophy</option>
                    <option value="STRENGTH">Strength / Powerlifting</option>
                    <option value="WEIGHT_LOSS">Weight Loss / Cut</option>
                    <option value="ENDURANCE">Endurance</option>
                    <option value="GENERAL_FITNESS">General Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={mWeight}
                    onChange={(e) => setMWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingMember ? 'Save Member Changes' : 'Confirm & Enroll Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TRAINER */}
      {isAddTrainerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddTrainerModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingTrainer ? 'Edit Trainer Credentials' : 'Recruit & Register New Fitness Coach'}
            </h3>

            <form onSubmit={handleSaveTrainer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Thorne"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. coach.thorne@gympulse.com"
                    value={tEmail}
                    onChange={(e) => setTEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1-555-0155"
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Specialization / Core Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Powerlifting, Kettlebell Biomechanics"
                  value={tSpecialization}
                  onChange={(e) => setTSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={tExpYears}
                    onChange={(e) => setTExpYears(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Hourly Coaching Rate ($)</label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={tRate}
                    onChange={(e) => setTRate(Number(e.target.value) || 50)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Certifications</label>
                <input
                  type="text"
                  placeholder="e.g. NSCA-CSCS, NASM-CPT, Precision Nutrition L1"
                  value={tCert}
                  onChange={(e) => setTCert(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Professional Bio</label>
                <textarea
                  rows={2}
                  placeholder="Background, coaching philosophy, athletic history..."
                  value={tBio}
                  onChange={(e) => setTBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTrainerModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  {editingTrainer ? 'Save Coach Changes' : 'Confirm & Register Coach'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GYM SUBSCRIPTION PLAN */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddPlanModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Create New Gym Subscription Plan</h3>

            <form onSubmit={handleSaveSubscriptionPlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Pass / Off-Peak"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={subPrice}
                    onChange={(e) => setSubPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Billing Cycle</label>
                  <select
                    value={subCycle}
                    onChange={(e) => setSubCycle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly (3 Mo)</option>
                    <option value="ANNUAL">Annual (1 Year)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Included Features (1 per line)</label>
                <textarea
                  rows={4}
                  required
                  value={subFeaturesText}
                  onChange={(e) => setSubFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPlanModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Publish Subscription Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Record Member Fee / Payment</h3>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Member *</label>
                <select
                  value={payMemberId}
                  onChange={(e) => setPayMemberId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                >
                  {memberUsers.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Plan / Line Item Description *</label>
                <input
                  type="text"
                  required
                  value={payPlanName}
                  onChange={(e) => setPayPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="CASH">Cash at Desk</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="STRIPE">Stripe / Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Initial Status</label>
                <select
                  value={payStatus}
                  onChange={(e) => setPayStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="PAID">Paid / Cleared</option>
                  <option value="PENDING">Pending Invoice</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXERCISE */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddExerciseModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              Add New Movement to Catalogue (Admin)
            </h3>

            <form onSubmit={handleSaveExercise} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Front Squat"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Muscle</label>
                  <select
                    value={exMuscle}
                    onChange={(e) => setExMuscle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CHEST">CHEST</option>
                    <option value="BACK">BACK</option>
                    <option value="LEGS">LEGS</option>
                    <option value="SHOULDERS">SHOULDERS</option>
                    <option value="ARMS">ARMS</option>
                    <option value="CORE">CORE</option>
                    <option value="FULL_BODY">FULL_BODY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={exCategory}
                    onChange={(e) => setExCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="STRENGTH">STRENGTH</option>
                    <option value="HYPERTROPHY">HYPERTROPHY</option>
                    <option value="CARDIO">CARDIO</option>
                    <option value="MOBILITY">MOBILITY</option>
                    <option value="OLYMPIC">OLYMPIC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
                  <select
                    value={exDifficulty}
                    onChange={(e) => setExDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Equipment</label>
                  <input
                    type="text"
                    placeholder="Barbell, Rack"
                    value={exEquipment}
                    onChange={(e) => setExEquipment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Execution Cues *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Step by step cues and setup..."
                  value={exInst}
                  onChange={(e) => setExInst(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddExerciseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
