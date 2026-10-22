import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { DietEntry } from '../types';
import { 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Flame, 
  PieChart, 
  X,
  AlertCircle,
  Filter
} from 'lucide-react';

export const DietTracker: React.FC = () => {
  const { dietEntries, addDietEntry, deleteDietEntry, currentUser } = useGym();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [mealType, setMealType] = useState<DietEntry['mealType']>('BREAKFAST');
  const [foodName, setFoodName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [fats, setFats] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const memberEntries = dietEntries.filter(d => d.memberId === (currentUser?.id || 3));
  const dateEntries = memberEntries.filter(d => d.entryDate === selectedDate);
  const filteredEntries = dateEntries.filter(d => mealTypeFilter === 'ALL' || d.mealType === mealTypeFilter);

  // Aggregate macros for selected date
  const totalCalories = dateEntries.reduce((sum, d) => sum + d.calories, 0);
  const totalProtein = dateEntries.reduce((sum, d) => sum + d.proteinGrams, 0);
  const totalCarbs = dateEntries.reduce((sum, d) => sum + d.carbsGrams, 0);
  const totalFats = dateEntries.reduce((sum, d) => sum + d.fatsGrams, 0);

  // Macro calorie ratios (Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g)
  const proteinKcal = totalProtein * 4;
  const carbsKcal = totalCarbs * 4;
  const fatsKcal = totalFats * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatsKcal || 1;

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatsPct = Math.round((fatsKcal / totalMacroKcal) * 100);

  const targetCalories = 2600;
  const targetProtein = 175;

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !calories) return;

    addDietEntry({
      memberId: currentUser?.id || 3,
      entryDate: selectedDate,
      mealType,
      foodName: foodName.trim(),
      servingSize: servingSize.trim() || '1 serving',
      calories: Number(calories),
      proteinGrams: Number(protein) || 0,
      carbsGrams: Number(carbs) || 0,
      fatsGrams: Number(fats) || 0,
      notes: notes.trim(),
    });

    setIsAddModalOpen(false);
    setFoodName('');
    setServingSize('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setNotes('');
  };

  const mealTypes = ['ALL', 'BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Diet & Nutrition Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track daily caloric intake, macronutrient splits, and recovery fuel.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meal / Snack</span>
        </button>
      </div>

      {/* Date & Filter Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-400 font-medium">Viewing Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Meal Type Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {mealTypes.map((type) => (
            <button
              key={type}
              onClick={() => setMealTypeFilter(type)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                mealTypeFilter === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'All Meals' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Macro Dashboard Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily Calorie Total</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-white tabular-nums">{totalCalories}</span>
            <span className="text-xs text-slate-500 font-sans">/ {targetCalories} kcal</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Protein</span>
            <span className="text-[10px] text-cyan-400 font-mono tabular-nums">{proteinPct}% kcal</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-cyan-400 tabular-nums">{totalProtein}g</span>
            <span className="text-xs text-slate-500 font-sans">/ {targetProtein}g</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Carbohydrates</span>
            <span className="text-[10px] text-amber-400 font-mono tabular-nums">{carbsPct}% kcal</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-white tabular-nums">{totalCarbs}g</span>
            <span className="text-xs text-slate-500 font-sans">fuel</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCarbs / 300) * 100)}%` }}
            />
          </div>
        </div>

        {/* Fats Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Dietary Fats</span>
            <span className="text-[10px] text-indigo-400 font-mono tabular-nums">{fatsPct}% kcal</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-bold text-white tabular-nums">{totalFats}g</span>
            <span className="text-xs text-slate-500 font-sans">lipids</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalFats / 80) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Logged Meals for {selectedDate} ({filteredEntries.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Subtotal: {filteredEntries.reduce((acc, m) => acc + m.calories, 0)} kcal
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400 text-xs">
            No meal logs recorded for this day. Click "Log Meal / Snack" above to track nutrition.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredEntries.map((meal) => (
              <div key={meal.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 text-xs shrink-0 mt-0.5">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                      <span className="text-emerald-400 font-semibold">{meal.mealType}</span>
                      <span>·</span>
                      <span>{meal.loggedAt}</span>
                      <span>·</span>
                      <span>{meal.servingSize}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{meal.foodName}</h4>
                    {meal.notes && (
                      <p className="text-xs text-slate-400 mt-0.5 italic">"{meal.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white tabular-nums">{meal.calories} kcal</span>
                    <div className="text-[11px] text-slate-400 space-x-2">
                      <span>P: <strong className="text-cyan-400">{meal.proteinGrams}g</strong></span>
                      <span>C: <strong className="text-slate-300">{meal.carbsGrams}g</strong></span>
                      <span>F: <strong className="text-slate-300">{meal.fatsGrams}g</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDietEntry(meal.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                    title="Delete meal entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health & Nutrition Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Nutritional Information Estimate Disclaimer:</strong>
          All calorie and macronutrient figures are approximations based on user inputs and generic food composition databases. This tracking module is for personal fitness logging only and does not constitute medical, diagnostic, or clinical dietary advice.
        </div>
      </div>

      {/* Add Meal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d131f] border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              Log Meal / Nutrition Entry
            </h3>

            <form onSubmit={handleAddMeal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="BREAKFAST">BREAKFAST</option>
                    <option value="LUNCH">LUNCH</option>
                    <option value="DINNER">DINNER</option>
                    <option value="SNACK">SNACK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Entry Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Food / Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken, Brown Rice & Broccoli"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Serving Size / Weight</label>
                <input
                  type="text"
                  placeholder="e.g. 200g chicken, 1 cup cooked rice"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Calories *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="kcal"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="g"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="g"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Fats (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="g"
                    value={fats}
                    onChange={(e) => setFats(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Post-workout dinner with 1L water"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
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
                  Save Meal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
