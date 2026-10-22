import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User, MemberProfile, TrainerProfile, Exercise, WorkoutPlan,
  WorkoutSession, DietEntry, FitnessGoal, ProgressEntry, TrainerFeedback, Role, AuditLog,
  SubscriptionPlan, PaymentRecord
} from '../types';
import {
  initialUsers, initialMemberProfiles, initialTrainerProfiles,
  initialExercises, initialWorkoutPlans, initialWorkoutSessions,
  initialDietEntries, initialFitnessGoals, initialProgressEntries,
  initialTrainerFeedback
} from '../data/seedData';

interface GymContextType {
  currentUser: User | null;
  users: User[];
  memberProfiles: MemberProfile[];
  trainerProfiles: TrainerProfile[];
  exercises: Exercise[];
  workoutPlans: WorkoutPlan[];
  workoutSessions: WorkoutSession[];
  dietEntries: DietEntry[];
  fitnessGoals: FitnessGoal[];
  progressEntries: ProgressEntry[];
  trainerFeedback: TrainerFeedback[];
  auditLogs: AuditLog[];
  subscriptionPlans: SubscriptionPlan[];
  paymentRecords: PaymentRecord[];
  activeWorkout: WorkoutSession | null;
  activeWorkoutTimer: number; // seconds elapsed
  
  // Auth & Roles
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: Role) => void;
  login: (email: string, role?: Role) => boolean;
  logout: () => void;
  register: (name: string, email: string, role: Role, password?: string) => void;

  // Active Workout Management
  startWorkout: (planId?: number, title?: string) => void;
  addExerciseToActiveWorkout: (exerciseId: number) => void;
  removeExerciseFromActiveWorkout: (exerciseIndex: number) => void;
  addSetToActiveExercise: (exerciseIndex: number, reps: number, weightKg: number, rpe?: number) => void;
  removeSetFromActiveExercise: (exerciseIndex: number, setIndex: number) => void;
  completeActiveWorkout: (notes?: string) => void;
  cancelActiveWorkout: () => void;
  deleteWorkoutSession: (sessionId: number) => void;

  // Exercise Management
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (id: number, exercise: Partial<Exercise>) => void;
  deleteExercise: (id: number) => void;

  // Workout Plans Management
  createWorkoutPlan: (plan: Omit<WorkoutPlan, 'id' | 'createdAt'>) => void;
  deleteWorkoutPlan: (id: number) => void;

  // Nutrition & Diet
  addDietEntry: (entry: Omit<DietEntry, 'id' | 'loggedAt'>) => void;
  deleteDietEntry: (id: number) => void;

  // Goals & Measurements
  addFitnessGoal: (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => void;
  updateGoalProgress: (id: number, currentValue: number) => void;
  deleteFitnessGoal: (id: number) => void;
  addProgressEntry: (entry: Omit<ProgressEntry, 'id'>) => void;

  // Trainer Feedback
  addTrainerFeedback: (feedback: Omit<TrainerFeedback, 'id' | 'feedbackDate'>) => void;

  // Admin Whole System Controls
  addMember: (user: Partial<User>, profile: Partial<MemberProfile>) => void;
  updateMember: (userId: number, userUpdates: Partial<User>, profileUpdates: Partial<MemberProfile>) => void;
  deleteMember: (userId: number) => void;
  addTrainer: (user: Partial<User>, profile: Partial<TrainerProfile>) => void;
  updateTrainer: (userId: number, userUpdates: Partial<User>, profileUpdates: Partial<TrainerProfile>) => void;
  deleteTrainer: (userId: number) => void;
  toggleUserStatus: (userId: number) => void;

  // Subscriptions & Payments
  addSubscriptionPlan: (plan: Omit<SubscriptionPlan, 'id' | 'activeSubscriberCount'>) => void;
  updateSubscriptionPlan: (id: number, plan: Partial<SubscriptionPlan>) => void;
  deleteSubscriptionPlan: (id: number) => void;
  addPaymentRecord: (payment: Omit<PaymentRecord, 'id' | 'invoiceNumber'>) => void;
  updatePaymentStatus: (id: number, status: PaymentRecord['status']) => void;

  resetToDefaults: () => void;
}

const STORAGE_KEY = 'ironpulse_gym_state_v2';

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currUser`);
    if (saved) return JSON.parse(saved);
    return initialUsers[2]; // Default to Alex Reynolds (MEMBER)
  });

  const [memberProfiles, setMemberProfiles] = useState<MemberProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_memberProfiles`);
    return saved ? JSON.parse(saved) : initialMemberProfiles;
  });

  const [trainerProfiles, setTrainerProfiles] = useState<TrainerProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_trainerProfiles`);
    return saved ? JSON.parse(saved) : initialTrainerProfiles;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        timestamp: '2026-10-21 18:45:00',
        category: 'WORKOUT',
        action: 'Workout Session Completed',
        details: 'Alex Reynolds completed Upper Body Power Session (4,620 kg volume)',
        performedBy: 'Alex Reynolds',
      },
      {
        id: 2,
        timestamp: '2026-10-21 16:40:00',
        category: 'MEMBER',
        action: 'Diet Logged',
        details: 'Alex Reynolds logged Afternoon Snack (310 kcal, 28g protein)',
        performedBy: 'Alex Reynolds',
      },
      {
        id: 3,
        timestamp: '2026-10-20 10:15:00',
        category: 'TRAINER',
        action: 'Coach Feedback Dispatched',
        details: 'Elena Rostova provided technique advice on squat depth to Alex',
        performedBy: 'Elena Rostova (Coach)',
      },
      {
        id: 4,
        timestamp: '2026-10-15 09:00:00',
        category: 'PLAN',
        action: 'Workout Plan Created',
        details: 'Marcus Vance created template: Functional Full-Body Conditioning',
        performedBy: 'Marcus Vance (Admin)',
      },
    ];
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans_sub`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        name: 'Standard Membership',
        price: 39,
        billingCycle: 'MONTHLY',
        features: ['Full gym floor access', 'Locker room & showers', 'Mobile workout tracking app', 'Standard hours (6 AM - 10 PM)'],
        popular: false,
        activeSubscriberCount: 84,
      },
      {
        id: 2,
        name: 'Premium Athlete Pass',
        price: 69,
        billingCycle: 'MONTHLY',
        features: ['24/7 Unlimited access', 'All group classes & HIIT', '1 Monthly coach check-in', 'Sauna & cold plunge access', 'Advanced nutrition tracker'],
        popular: true,
        activeSubscriberCount: 142,
      },
      {
        id: 3,
        name: 'VIP Elite Performance',
        price: 99,
        billingCycle: 'MONTHLY',
        features: ['Everything in Premium', 'Weekly dedicated 1-on-1 PT session', 'Custom periodized split programming', 'Towel & laundry service', 'Complimentary whey shake daily'],
        popular: false,
        activeSubscriberCount: 46,
      },
      {
        id: 4,
        name: 'Annual Champion Pass',
        price: 699,
        billingCycle: 'ANNUAL',
        features: ['Full year all-inclusive VIP benefits', 'Save over 40% vs monthly', 'Complimentary gym kit & lifting belt', 'Priority coach booking'],
        popular: false,
        activeSubscriberCount: 38,
      },
    ];
  });

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        invoiceNumber: 'INV-2026-1001',
        memberId: 3,
        memberName: 'Alex Reynolds',
        planName: 'Premium Athlete Pass',
        amount: 69,
        paymentMethod: 'CREDIT_CARD',
        status: 'PAID',
        paymentDate: '2026-10-01',
        dueDate: '2026-10-01',
      },
      {
        id: 2,
        invoiceNumber: 'INV-2026-1002',
        memberId: 4,
        memberName: 'Sarah Jenkins',
        planName: 'Standard Membership',
        amount: 39,
        paymentMethod: 'STRIPE',
        status: 'PAID',
        paymentDate: '2026-10-05',
        dueDate: '2026-10-05',
      },
      {
        id: 3,
        invoiceNumber: 'INV-2026-1003',
        memberId: 3,
        memberName: 'Alex Reynolds',
        planName: 'Personal Training Session (Elena)',
        amount: 75,
        paymentMethod: 'DEBIT_CARD',
        status: 'PAID',
        paymentDate: '2026-10-18',
        dueDate: '2026-10-18',
      },
    ];
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exercises`);
    return saved ? JSON.parse(saved) : initialExercises;
  });

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : initialWorkoutPlans;
  });

  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
    return saved ? JSON.parse(saved) : initialWorkoutSessions;
  });

  const [dietEntries, setDietEntries] = useState<DietEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_diet`);
    return saved ? JSON.parse(saved) : initialDietEntries;
  });

  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : initialFitnessGoals;
  });

  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_progress`);
    return saved ? JSON.parse(saved) : initialProgressEntries;
  });

  const [trainerFeedback, setTrainerFeedback] = useState<TrainerFeedback[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_feedback`);
    return saved ? JSON.parse(saved) : initialTrainerFeedback;
  });

  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [activeWorkoutTimer, setActiveWorkoutTimer] = useState<number>(0);

  // Active workout timer
  useEffect(() => {
    let interval: any;
    if (activeWorkout) {
      interval = setInterval(() => {
        setActiveWorkoutTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setActiveWorkoutTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_currUser`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_memberProfiles`, JSON.stringify(memberProfiles));
    localStorage.setItem(`${STORAGE_KEY}_trainerProfiles`, JSON.stringify(trainerProfiles));
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    localStorage.setItem(`${STORAGE_KEY}_plans_sub`, JSON.stringify(subscriptionPlans));
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(paymentRecords));
    localStorage.setItem(`${STORAGE_KEY}_exercises`, JSON.stringify(exercises));
    localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(workoutPlans));
    localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(workoutSessions));
    localStorage.setItem(`${STORAGE_KEY}_diet`, JSON.stringify(dietEntries));
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(fitnessGoals));
    localStorage.setItem(`${STORAGE_KEY}_progress`, JSON.stringify(progressEntries));
    localStorage.setItem(`${STORAGE_KEY}_feedback`, JSON.stringify(trainerFeedback));
  }, [users, currentUser, memberProfiles, trainerProfiles, auditLogs, subscriptionPlans, paymentRecords, exercises, workoutPlans, workoutSessions, dietEntries, fitnessGoals, progressEntries, trainerFeedback]);

  const switchRole = (role: Role) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const login = (email: string, role?: Role): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    if (role) {
      const byRole = users.find(u => u.role === role);
      if (byRole) {
        setCurrentUser(byRole);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, email: string, role: Role) => {
    const newUser: User = {
      id: Date.now(),
      email,
      fullName: name,
      role,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    if (role === 'MEMBER') {
      const newProfile: MemberProfile = {
        id: Date.now(),
        userId: newUser.id,
        membershipStatus: 'ACTIVE',
        membershipType: 'STANDARD',
        fitnessLevel: 'BEGINNER',
        primaryGoal: 'GENERAL_FITNESS',
      };
      setMemberProfiles(prev => [...prev, newProfile]);
    }
    setCurrentUser(newUser);
  };

  // Workout Session Handlers
  const startWorkout = (planId?: number, title?: string) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().split('T')[0];

    let initialExercisesList: any[] = [];
    if (planId) {
      const plan = workoutPlans.find(p => p.id === planId);
      if (plan && plan.exercises) {
        initialExercisesList = plan.exercises.map((pe, idx) => {
          const ex = exercises.find(e => e.id === pe.exerciseId);
          return {
            id: Date.now() + idx,
            exerciseId: pe.exerciseId,
            exerciseName: pe.exerciseName || ex?.name || 'Exercise',
            muscleGroup: ex?.muscleGroup || 'FULL_BODY',
            orderIndex: idx + 1,
            notes: pe.notes || '',
            sets: Array.from({ length: pe.targetSets || 3 }).map((_, sIdx) => ({
              id: Date.now() + idx * 10 + sIdx,
              setNumber: sIdx + 1,
              repsCompleted: parseInt(pe.targetReps) || 8,
              weightKg: pe.suggestedWeightKg || 20,
              rpe: 7.5,
              restSecondsTaken: pe.restIntervalSeconds || 90,
            })),
          };
        });
      }
    }

    const newSession: WorkoutSession = {
      id: Date.now(),
      memberId: currentUser.id,
      workoutPlanId: planId,
      sessionTitle: title || (planId ? workoutPlans.find(p => p.id === planId)?.title || 'Scheduled Workout' : 'Custom Workout Session'),
      sessionDate: dateStr,
      startTime: timeStr,
      durationMinutes: 0,
      status: 'IN_PROGRESS',
      totalVolumeKg: 0,
      exercises: initialExercisesList,
    };
    setActiveWorkout(newSession);
    setActiveWorkoutTimer(0);
  };

  const addExerciseToActiveWorkout = (exerciseId: number) => {
    if (!activeWorkout) return;
    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) return;

    const newEx = {
      id: Date.now(),
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      orderIndex: activeWorkout.exercises.length + 1,
      sets: [
        {
          id: Date.now() + 1,
          setNumber: 1,
          repsCompleted: 10,
          weightKg: 40,
          rpe: 7,
          restSecondsTaken: 90,
        },
      ],
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newEx],
    });
  };

  const removeExerciseFromActiveWorkout = (exerciseIndex: number) => {
    if (!activeWorkout) return;
    const updated = [...activeWorkout.exercises];
    updated.splice(exerciseIndex, 1);
    setActiveWorkout({ ...activeWorkout, exercises: updated });
  };

  const addSetToActiveExercise = (exerciseIndex: number, reps: number, weightKg: number, rpe?: number) => {
    if (!activeWorkout) return;
    const updated = [...activeWorkout.exercises];
    const targetEx = updated[exerciseIndex];
    if (!targetEx) return;

    const newSet = {
      id: Date.now(),
      setNumber: targetEx.sets.length + 1,
      repsCompleted: reps,
      weightKg: weightKg,
      rpe: rpe || 8,
      restSecondsTaken: 90,
    };

    targetEx.sets = [...targetEx.sets, newSet];
    setActiveWorkout({ ...activeWorkout, exercises: updated });
  };

  const removeSetFromActiveExercise = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const updated = [...activeWorkout.exercises];
    const targetEx = updated[exerciseIndex];
    if (!targetEx) return;

    targetEx.sets.splice(setIndex, 1);
    // renumber
    targetEx.sets = targetEx.sets.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    setActiveWorkout({ ...activeWorkout, exercises: updated });
  };

  const completeActiveWorkout = (notes?: string) => {
    if (!activeWorkout) return;
    const now = new Date();
    const durationMins = Math.max(1, Math.round(activeWorkoutTimer / 60));

    // Calculate volume
    let totalVol = 0;
    activeWorkout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        totalVol += (s.repsCompleted || 0) * (s.weightKg || 0);
      });
    });

    const finished: WorkoutSession = {
      ...activeWorkout,
      endTime: now.toTimeString().slice(0, 5),
      durationMinutes: durationMins,
      status: 'COMPLETED',
      notes: notes || activeWorkout.notes || '',
      totalVolumeKg: Math.round(totalVol),
    };

    setWorkoutSessions(prev => [finished, ...prev]);
    setActiveWorkout(null);
    setActiveWorkoutTimer(0);
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
    setActiveWorkoutTimer(0);
  };

  const deleteWorkoutSession = (sessionId: number) => {
    setWorkoutSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Exercise Management
  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newEx: Exercise = {
      id: Date.now(),
      ...exercise,
    };
    setExercises(prev => [...prev, newEx]);
  };

  const updateExercise = (id: number, partial: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, ...partial } : e));
  };

  const deleteExercise = (id: number) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Workout Plans
  const createWorkoutPlan = (plan: Omit<WorkoutPlan, 'id' | 'createdAt'>) => {
    const newPlan: WorkoutPlan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...plan,
    };
    setWorkoutPlans(prev => [newPlan, ...prev]);
  };

  const deleteWorkoutPlan = (id: number) => {
    setWorkoutPlans(prev => prev.filter(p => p.id !== id));
  };

  // Diet
  const addDietEntry = (entry: Omit<DietEntry, 'id' | 'loggedAt'>) => {
    const newDiet: DietEntry = {
      id: Date.now(),
      loggedAt: new Date().toTimeString().slice(0, 5),
      ...entry,
    };
    setDietEntries(prev => [newDiet, ...prev]);
  };

  const deleteDietEntry = (id: number) => {
    setDietEntries(prev => prev.filter(d => d.id !== id));
  };

  // Goals
  const addFitnessGoal = (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    const newGoal: FitnessGoal = {
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      ...goal,
    };
    setFitnessGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalProgress = (id: number, currentValue: number) => {
    setFitnessGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const status = currentValue >= g.targetValue ? 'ACHIEVED' : 'IN_PROGRESS';
      return { ...g, currentValue, status };
    }));
  };

  const deleteFitnessGoal = (id: number) => {
    setFitnessGoals(prev => prev.filter(g => g.id !== id));
  };

  const addProgressEntry = (entry: Omit<ProgressEntry, 'id'>) => {
    const newProg: ProgressEntry = {
      id: Date.now(),
      ...entry,
    };
    setProgressEntries(prev => [...prev, newProg]);
  };

  // Feedback
  const addTrainerFeedback = (feedback: Omit<TrainerFeedback, 'id' | 'feedbackDate'>) => {
    const newFb: TrainerFeedback = {
      id: Date.now(),
      feedbackDate: new Date().toISOString(),
      ...feedback,
    };
    setTrainerFeedback(prev => [newFb, ...prev]);
  };

  // Admin Whole System Operations
  const addMember = (user: Partial<User>, profile: Partial<MemberProfile>) => {
    const newUserId = Date.now();
    const newUser: User = {
      id: newUserId,
      email: user.email || `member${newUserId}@gympulse.com`,
      fullName: user.fullName || 'New Member',
      role: 'MEMBER',
      enabled: user.enabled ?? true,
      createdAt: new Date().toISOString(),
      phoneNumber: user.phoneNumber || '',
    };

    const newProfile: MemberProfile = {
      id: Date.now() + 1,
      userId: newUserId,
      membershipStatus: profile.membershipStatus || 'ACTIVE',
      membershipType: profile.membershipType || 'STANDARD',
      fitnessLevel: profile.fitnessLevel || 'BEGINNER',
      primaryGoal: profile.primaryGoal || 'GENERAL_FITNESS',
      assignedTrainerId: profile.assignedTrainerId || undefined,
      currentWeightKg: profile.currentWeightKg || 75,
      targetWeightKg: profile.targetWeightKg || 70,
      heightCm: profile.heightCm || 175,
      emergencyContact: profile.emergencyContact || '',
    };

    setUsers(prev => [...prev, newUser]);
    setMemberProfiles(prev => [...prev, newProfile]);

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'MEMBER',
      action: 'Member Created',
      details: `Added new member ${newUser.fullName} (${newProfile.membershipType} tier)`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const updateMember = (userId: number, userUpdates: Partial<User>, profileUpdates: Partial<MemberProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...userUpdates } : u));
    setMemberProfiles(prev => prev.map(p => p.userId === userId ? { ...p, ...profileUpdates } : p));

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'MEMBER',
      action: 'Member Updated',
      details: `Updated profile details for user #${userId}`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const deleteMember = (userId: number) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    setMemberProfiles(prev => prev.filter(p => p.userId !== userId));
    setWorkoutSessions(prev => prev.filter(s => s.memberId !== userId));
    setDietEntries(prev => prev.filter(d => d.memberId !== userId));
    setFitnessGoals(prev => prev.filter(g => g.memberId !== userId));

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'MEMBER',
      action: 'Member Deleted',
      details: `Removed member ${target?.fullName || userId} and cascade cleaned records`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const addTrainer = (user: Partial<User>, profile: Partial<TrainerProfile>) => {
    const newUserId = Date.now();
    const newUser: User = {
      id: newUserId,
      email: user.email || `coach${newUserId}@gympulse.com`,
      fullName: user.fullName || 'New Coach',
      role: 'TRAINER',
      enabled: user.enabled ?? true,
      createdAt: new Date().toISOString(),
      phoneNumber: user.phoneNumber || '',
    };

    const newProfile: TrainerProfile = {
      id: Date.now() + 1,
      userId: newUserId,
      specialization: profile.specialization || 'Strength & Conditioning',
      experienceYears: profile.experienceYears || 3,
      bio: profile.bio || 'Certified strength and hypertrophy coach.',
      certification: profile.certification || 'NASM-CPT',
      hourlyRate: profile.hourlyRate || 65,
      activeMemberCount: 0,
    };

    setUsers(prev => [...prev, newUser]);
    setTrainerProfiles(prev => [...prev, newProfile]);

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'TRAINER',
      action: 'Trainer Added',
      details: `Recruited coach ${newUser.fullName} (${newProfile.specialization})`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const updateTrainer = (userId: number, userUpdates: Partial<User>, profileUpdates: Partial<TrainerProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...userUpdates } : u));
    setTrainerProfiles(prev => prev.map(p => p.userId === userId ? { ...p, ...profileUpdates } : p));

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'TRAINER',
      action: 'Trainer Updated',
      details: `Updated details for coach #${userId}`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const deleteTrainer = (userId: number) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    setTrainerProfiles(prev => prev.filter(p => p.userId !== userId));
    // Unassign members from this trainer
    setMemberProfiles(prev => prev.map(p => p.assignedTrainerId === userId ? { ...p, assignedTrainerId: undefined } : p));

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'TRAINER',
      action: 'Trainer Removed',
      details: `Removed coach ${target?.fullName || userId} and reassigned active members`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Admin User status toggle
  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: !u.enabled } : u));
    const target = users.find(u => u.id === userId);
    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'AUTH',
      action: 'User Status Toggled',
      details: `Toggled active status for ${target?.fullName || userId}`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Subscription Plans Management
  const addSubscriptionPlan = (plan: Omit<SubscriptionPlan, 'id' | 'activeSubscriberCount'>) => {
    const newPlan: SubscriptionPlan = {
      id: Date.now(),
      activeSubscriberCount: 0,
      ...plan,
    };
    setSubscriptionPlans(prev => [...prev, newPlan]);

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'SUBSCRIPTION',
      action: 'Subscription Plan Created',
      details: `Created new subscription plan ${newPlan.name} ($${newPlan.price}/${newPlan.billingCycle.toLowerCase()})`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const updateSubscriptionPlan = (id: number, planUpdates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(prev => prev.map(p => p.id === id ? { ...p, ...planUpdates } : p));
  };

  const deleteSubscriptionPlan = (id: number) => {
    const target = subscriptionPlans.find(p => p.id === id);
    setSubscriptionPlans(prev => prev.filter(p => p.id !== id));

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'SUBSCRIPTION',
      action: 'Subscription Plan Deleted',
      details: `Removed subscription plan ${target?.name || id}`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Payment Records Management
  const addPaymentRecord = (payment: Omit<PaymentRecord, 'id' | 'invoiceNumber'>) => {
    const newPayment: PaymentRecord = {
      id: Date.now(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...payment,
    };
    setPaymentRecords(prev => [newPayment, ...prev]);

    const newAudit: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'PAYMENT',
      action: 'Payment Recorded',
      details: `Invoice ${newPayment.invoiceNumber} recorded for ${newPayment.memberName} ($${newPayment.amount} - ${newPayment.status})`,
      performedBy: currentUser?.fullName || 'System Admin',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const updatePaymentStatus = (id: number, status: PaymentRecord['status']) => {
    setPaymentRecords(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setCurrentUser(initialUsers[2]);
    setMemberProfiles(initialMemberProfiles);
    setTrainerProfiles(initialTrainerProfiles);
    setExercises(initialExercises);
    setWorkoutPlans(initialWorkoutPlans);
    setWorkoutSessions(initialWorkoutSessions);
    setDietEntries(initialDietEntries);
    setFitnessGoals(initialFitnessGoals);
    setProgressEntries(initialProgressEntries);
    setTrainerFeedback(initialTrainerFeedback);
    setActiveWorkout(null);
  };

  return (
    <GymContext.Provider
      value={{
        currentUser,
        users,
        memberProfiles,
        trainerProfiles,
        exercises,
        workoutPlans,
        workoutSessions,
        dietEntries,
        fitnessGoals,
        progressEntries,
        trainerFeedback,
        auditLogs,
        subscriptionPlans,
        paymentRecords,
        activeWorkout,
        activeWorkoutTimer,
        setCurrentUser,
        switchRole,
        login,
        logout,
        register,
        startWorkout,
        addExerciseToActiveWorkout,
        removeExerciseFromActiveWorkout,
        addSetToActiveExercise,
        removeSetFromActiveExercise,
        completeActiveWorkout,
        cancelActiveWorkout,
        deleteWorkoutSession,
        addExercise,
        updateExercise,
        deleteExercise,
        createWorkoutPlan,
        deleteWorkoutPlan,
        addDietEntry,
        deleteDietEntry,
        addFitnessGoal,
        updateGoalProgress,
        deleteFitnessGoal,
        addProgressEntry,
        addTrainerFeedback,
        addMember,
        updateMember,
        deleteMember,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        toggleUserStatus,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        addPaymentRecord,
        updatePaymentStatus,
        resetToDefaults,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
