import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Exercise } from '../types';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Dumbbell, 
  Layers, 
  Activity, 
  Flame, 
  Filter, 
  X, 
  Info,
  Check
} from 'lucide-react';

interface ExerciseLibraryProps {
  onStartWithExercise?: (exerciseId: number) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onStartWithExercise }) => {
  const { exercises, addExercise, currentUser, activeWorkout, addExerciseToActiveWorkout } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('ALL');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Exercise Form State (Admin)
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState<Exercise['category']>('STRENGTH');
  const [newExMuscle, setNewExMuscle] = useState<Exercise['muscleGroup']>('CHEST');
  const [newExDifficulty, setNewExDifficulty] = useState<Exercise['difficultyLevel']>('INTERMEDIATE');
  const [newExEquipment, setNewExEquipment] = useState('');
  const [newExDescription, setNewExDescription] = useState('');
  const [newExInstructions, setNewExInstructions] = useState('');

  const categories = ['ALL', 'STRENGTH', 'HYPERTROPHY', 'CARDIO', 'MOBILITY', 'OLYMPIC'];
  const muscleGroups = ['ALL', 'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE'];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipmentRequired.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesMuscle = selectedMuscle === 'ALL' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesCat && matchesMuscle;
  });

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || !newExInstructions.trim()) return;

    addExercise({
      name: newExName.trim(),
      category: newExCategory,
      muscleGroup: newExMuscle,
      difficultyLevel: newExDifficulty,
      equipmentRequired: newExEquipment || 'Bodyweight / Standard Gym Barbell',
      description: newExDescription || 'Functional resistance exercise targeting specific kinetic pathways.',
      instructions: newExInstructions,
      secondaryMuscles: [],
    });

    setIsAddModalOpen(false);
    setNewExName('');
    setNewExEquipment('');
    setNewExDescription('');
    setNewExInstructions('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Biomechanical Exercise Library</h2>
          <p className="text-xs text-slate-400 mt-1">
            Standardized exercise directory with anatomical targets, equipment specifications, and execution instructions.
          </p>
        </div>

        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Exercise</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search exercises by name, equipment (barbell, cable, dumbbells), or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category Segmented Controls (Interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-medium mr-1 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Disciplines' : cat}
            </button>
          ))}
        </div>

        {/* Muscle Groups Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-medium mr-1 shrink-0">Target:</span>
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedMuscle === muscle
                  ? 'bg-slate-700 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-300'
              }`}
            >
              {muscle === 'ALL' ? 'All Muscles' : muscle}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group shadow-xs"
          >
            <div>
              {/* Card Meta Kicker */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-emerald-400 font-semibold">{exercise.muscleGroup}</span>
                <span>·</span>
                <span>{exercise.category}</span>
                <span>·</span>
                <span className="text-[11px] text-slate-500 font-medium">{exercise.difficultyLevel}</span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {exercise.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {exercise.description}
              </p>

              {/* Equipment */}
              <div className="mt-3 pt-3 border-t border-slate-800/70 text-[11px] text-slate-400 flex items-center gap-2">
                <Dumbbell className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{exercise.equipmentRequired}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                View Biomechanics →
              </span>

              {activeWorkout && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addExerciseToActiveWorkout(exercise.id);
                  }}
                  className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded border border-emerald-500/30 text-xs font-medium transition-colors"
                >
                  + Add to Active
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
              <span>{selectedExercise.muscleGroup}</span>
              <span>·</span>
              <span>{selectedExercise.category}</span>
              <span>·</span>
              <span>{selectedExercise.difficultyLevel}</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              {selectedExercise.name}
            </h3>

            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <p className="text-slate-400 font-medium mb-0.5">Required Equipment:</p>
              <p className="text-slate-200 font-mono">{selectedExercise.equipmentRequired}</p>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Overview & Target Anatomy
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedExercise.description}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Execution Instructions & Cues
              </h4>
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 whitespace-pre-line leading-relaxed font-mono">
                {selectedExercise.instructions}
              </div>
            </div>

            {selectedExercise.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0 && (
              <div className="mt-4 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Secondary Synergists: </span>
                <span>{selectedExercise.secondaryMuscles.join(', ')}</span>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              {activeWorkout && (
                <button
                  onClick={() => {
                    addExerciseToActiveWorkout(selectedExercise.id);
                    setSelectedExercise(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  Add to Current Workout Session
                </button>
              )}
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Modal (Admin only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              Add New Exercise to Database (Admin)
            </h3>

            <form onSubmit={handleCreateExercise} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bulgarian Split Squat"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Muscle Group</label>
                  <select
                    value={newExMuscle}
                    onChange={(e) => setNewExMuscle(e.target.value as any)}
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
                    value={newExCategory}
                    onChange={(e) => setNewExCategory(e.target.value as any)}
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
                    value={newExDifficulty}
                    onChange={(e) => setNewExDifficulty(e.target.value as any)}
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
                    placeholder="e.g. Dumbbells, Bench"
                    value={newExEquipment}
                    onChange={(e) => setNewExEquipment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Target mechanics and biomechanical objective..."
                  value={newExDescription}
                  onChange={(e) => setNewExDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Step-by-Step Instructions *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="1. Setup... 2. Descent... 3. Lockout..."
                  value={newExInstructions}
                  onChange={(e) => setNewExInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Exercise to MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
