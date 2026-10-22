export type Role = 'ADMIN' | 'TRAINER' | 'MEMBER';

export interface User {
  id: number;
  email: string;
  role: Role;
  fullName: string;
  enabled: boolean;
  createdAt: string;
  phoneNumber?: string;
}

export interface MemberProfile {
  id: number;
  userId: number;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  fitnessLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  primaryGoal?: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE' | 'GENERAL_FITNESS';
  assignedTrainerId?: number;
  membershipStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'DEACTIVATED';
  membershipType: 'STANDARD' | 'PREMIUM' | 'VIP';
  emergencyContact?: string;
}

export interface TrainerProfile {
  id: number;
  userId: number;
  specialization: string;
  experienceYears: number;
  bio?: string;
  certification?: string;
  hourlyRate?: number;
  activeMemberCount?: number;
}

export interface Exercise {
  id: number;
  name: string;
  category: 'STRENGTH' | 'CARDIO' | 'HYPERTROPHY' | 'MOBILITY' | 'OLYMPIC';
  muscleGroup: 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'FULL_BODY';
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipmentRequired: string;
  description: string;
  instructions: string;
  imageUrl?: string;
  secondaryMuscles?: string[];
}

export interface WorkoutPlanExercise {
  id: number;
  workoutPlanId: number;
  exerciseId: number;
  exerciseName?: string;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  dayName: string;
  targetSets: number;
  targetReps: string;
  suggestedWeightKg?: number;
  restIntervalSeconds: number;
  notes?: string;
  orderIndex: number;
}

export interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  creatorName?: string;
  creatorRole: 'ADMIN' | 'TRAINER';
  fitnessGoal: string;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationWeeks: number;
  isTemplate: boolean;
  exercises: WorkoutPlanExercise[];
  createdAt: string;
}

export interface MemberWorkoutPlan {
  id: number;
  memberId: number;
  workoutPlanId: number;
  assignedByUserId: number;
  assignedAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export interface WorkoutSet {
  id: number;
  setNumber: number;
  repsCompleted: number;
  weightKg: number;
  isWarmup?: boolean;
  restSecondsTaken?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface WorkoutSessionExercise {
  id: number;
  exerciseId: number;
  exerciseName: string;
  muscleGroup: string;
  orderIndex: number;
  notes?: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  memberId: number;
  workoutPlanId?: number;
  sessionTitle: string;
  sessionDate: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  totalVolumeKg: number;
  exercises: WorkoutSessionExercise[];
}

export interface DietEntry {
  id: number;
  memberId: number;
  entryDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  foodName: string;
  servingSize: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  notes?: string;
  loggedAt: string;
}

export interface FitnessGoal {
  id: number;
  memberId: number;
  goalType: 'WEEKLY_WORKOUTS' | 'TARGET_WEIGHT' | 'EXERCISE_1RM' | 'DAILY_CALORIES' | 'CONSISTENCY';
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  status: 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED';
  createdAt: string;
}

export interface ProgressEntry {
  id: number;
  memberId: number;
  entryDate: string;
  bodyWeightKg: number;
  chestCm?: number;
  waistCm?: number;
  armsCm?: number;
  thighsCm?: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface TrainerFeedback {
  id: number;
  trainerId: number;
  trainerName: string;
  memberId: number;
  sessionId?: number;
  feedbackDate: string;
  subject: string;
  content: string;
  rating?: number; // 1 to 5
}

export interface AuditLog {
  id: number;
  timestamp: string;
  category: 'AUTH' | 'MEMBER' | 'TRAINER' | 'WORKOUT' | 'PLAN' | 'SYSTEM' | 'PAYMENT' | 'SUBSCRIPTION';
  action: string;
  details: string;
  performedBy: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  features: string[];
  popular?: boolean;
  activeSubscriberCount: number;
}

export interface PaymentRecord {
  id: number;
  invoiceNumber: string;
  memberId: number;
  memberName: string;
  planName: string;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'STRIPE';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'REFUNDED';
  paymentDate: string;
  dueDate: string;
}
