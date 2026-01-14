import React, { useState } from "react";
import {
  Plus,
  Trash2,
  TrendingUp,
  Calendar,
  Dumbbell,
  BarChart3,
  Search,
  Edit2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const COMMON_EXERCISES = {
  Chest: [
    "Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Dumbbell Flyes",
    "Push-ups",
    "Cable Crossover",
    "Chest Press Machine",
  ],
  Back: [
    "Pull-ups",
    "Lat Pulldown",
    "Barbell Row",
    "Dumbbell Row",
    "Seated Cable Row",
    "T-Bar Row",
    "Deadlift",
    "Face Pulls",
  ],
  Shoulders: [
    "Overhead Press",
    "Lateral Raises",
    "Front Raises",
    "Rear Delt Flyes",
    "Arnold Press",
    "Shrugs",
    "Upright Row",
  ],
  Bicep: [
    "Bicep Curls",
    "Hammer Curls",
    "Preacher Curls",
    "Concentration Curls",
    "Cable Curls",
    "Chin-ups",
  ],
  Tricep: [
    "Tricep Pushdown",
    "Tricep Dips",
    "Overhead Tricep Extension",
    "Close-Grip Bench Press",
    "Skull Crushers",
    "Diamond Push-ups",
  ],
  Legs: [
    "Squat",
    "Leg Press",
    "Leg Extension",
    "Leg Curl",
    "Lunges",
    "Romanian Deadlift",
    "Calf Raises",
    "Leg Abduction",
    "Leg Adduction",
  ],
  Core: [
    "Crunches",
    "Plank",
    "Russian Twists",
    "Leg Raises",
    "Cable Crunches",
    "Mountain Climbers",
    "Bicycle Crunches",
    "Dead Bug",
  ],
};

const DEFAULT_SCHEDULE = {
  Monday: "Pull 1",
  Tuesday: "Rest",
  Wednesday: "Push 1",
  Thursday: "Rest",
  Friday: "Pull 2",
  Saturday: "Legs",
  Sunday: "Push 2",
};

const DEFAULT_WORKOUTS = {
  "Pull 1": [
    { name: "Pull-ups", sets: "3", reps: "10", weight: "" },
    { name: "Barbell Row", sets: "4", reps: "8", weight: "135" },
    { name: "Lat Pulldown", sets: "3", reps: "12", weight: "100" },
    { name: "Dumbbell Row", sets: "3", reps: "10", weight: "50" },
    { name: "Bicep Curls", sets: "3", reps: "12", weight: "30" },
    { name: "Hammer Curls", sets: "3", reps: "12", weight: "30" },
  ],
  "Pull 2": [
    { name: "Deadlift", sets: "4", reps: "6", weight: "225" },
    { name: "Seated Cable Row", sets: "4", reps: "10", weight: "120" },
    { name: "Face Pulls", sets: "3", reps: "15", weight: "40" },
    { name: "T-Bar Row", sets: "3", reps: "10", weight: "90" },
    { name: "Preacher Curls", sets: "3", reps: "12", weight: "30" },
    { name: "Concentration Curls", sets: "3", reps: "12", weight: "25" },
  ],
  "Push 1": [
    { name: "Bench Press", sets: "4", reps: "8", weight: "185" },
    { name: "Incline Bench Press", sets: "3", reps: "10", weight: "135" },
    { name: "Dumbbell Flyes", sets: "3", reps: "12", weight: "35" },
    { name: "Overhead Press", sets: "4", reps: "8", weight: "95" },
    { name: "Lateral Raises", sets: "3", reps: "15", weight: "20" },
    { name: "Tricep Pushdown", sets: "3", reps: "12", weight: "60" },
  ],
  "Push 2": [
    { name: "Incline Dumbbell Press", sets: "4", reps: "10", weight: "70" },
    { name: "Dips", sets: "3", reps: "12", weight: "" },
    { name: "Cable Crossover", sets: "3", reps: "15", weight: "30" },
    { name: "Arnold Press", sets: "3", reps: "10", weight: "45" },
    { name: "Front Raises", sets: "3", reps: "12", weight: "20" },
    { name: "Overhead Tricep Extension", sets: "3", reps: "12", weight: "40" },
    { name: "Skull Crushers", sets: "3", reps: "12", weight: "60" },
  ],
  "Legs": [
    { name: "Squat", sets: "4", reps: "8", weight: "225" },
    { name: "Leg Press", sets: "3", reps: "12", weight: "300" },
    { name: "Leg Extension", sets: "3", reps: "15", weight: "100" },
    { name: "Leg Curl", sets: "3", reps: "15", weight: "80" },
    { name: "Calf Raises", sets: "4", reps: "20", weight: "100" },
    { name: "Plank", sets: "3", reps: "60", weight: "" },
    { name: "Russian Twists", sets: "3", reps: "20", weight: "25" },
  ],
  "Rest": [],
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function GymTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [presetWorkouts, setPresetWorkouts] = useState(DEFAULT_WORKOUTS);
  const [exercises, setExercises] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [view, setView] = useState("calendar");
  const [editingDay, setEditingDay] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [expandedDays, setExpandedDays] = useState({});
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingPreset, setEditingPreset] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  });

  const getTodayDay = () =>
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
      new Date().getDay()
    ];

  const getTodaySchedule = () => {
    const today = getTodayDay();
    return schedule[today];
  };

  const startWorkout = () => {
    const todaySchedule = getTodaySchedule();
    const preset = presetWorkouts[todaySchedule] || [];
    
    setCurrentWorkout({ date: new Date().toISOString(), exercises: [] });
    setExercises(preset.map(ex => ({ ...ex, id: Date.now() + Math.random() })));
    setShowExerciseSelector(false);
  };

  const startCustomWorkout = (scheduleName) => {
    const preset = presetWorkouts[scheduleName] || [];
    setCurrentWorkout({ date: new Date().toISOString(), exercises: [] });
    setExercises(preset.map(ex => ({ ...ex, id: Date.now() + Math.random() })));
    setShowExerciseSelector(false);
    setView("log");
  };

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) return;
    setExercises((p) => [...p, { ...newExercise, id: Date.now() }]);
    setNewExercise({ name: "", sets: "", reps: "", weight: "" });
    setShowExerciseSelector(false);
  };

  const removeExercise = (id) => {
    setExercises((p) => p.filter((ex) => ex.id !== id));
  };

  const selectExerciseFromList = (name) => {
    setNewExercise({ ...newExercise, name });
    setShowExerciseSelector(false);
  };

  const finishWorkout = () => {
    if (!exercises.length) return;
    setWorkouts((p) => [{ ...currentWorkout, exercises }, ...p]);
    setCurrentWorkout(null);
    setExercises([]);
  };

  const cancelWorkout = () => {
    setCurrentWorkout(null);
    setExercises([]);
  };

  const deleteWorkout = (idx) => {
    setWorkouts((p) => p.filter((_, i) => i !== idx));
  };

  const getExerciseStats = () => {
    const stats = {};
    workouts.forEach((w) =>
      w.exercises.forEach((ex) => {
        if (!stats[ex.name])
          stats[ex.name] = { sessions: 0, totalSets: 0, totalReps: 0, maxWeight: 0 };
        stats[ex.name].sessions++;
        stats[ex.name].totalSets += +ex.sets;
        stats[ex.name].totalReps += +ex.sets * +ex.reps;
        stats[ex.name].maxWeight = Math.max(stats[ex.name].maxWeight, +ex.weight || 0);
      })
    );
    return stats;
  };

  const startEditDay = (day) => {
    setEditingDay(day);
    setEditValue(schedule[day]);
  };

  const saveEditDay = () => {
    setSchedule((p) => ({ ...p, [editingDay]: editValue }));
    setEditingDay(null);
  };

  const updateExercise = (id, field, value) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const savePresetWorkout = () => {
    if (editingPreset) {
      setPresetWorkouts(prev => ({ ...prev, [editingPreset]: exercises }));
      setEditingPreset(null);
      setExercises([]);
    }
  };

  const startEditPreset = (scheduleName) => {
    setEditingPreset(scheduleName);
    const preset = presetWorkouts[scheduleName] || [];
    setExercises(preset.map(ex => ({ ...ex, id: Date.now() + Math.random() })));
    setView("presets");
  };

  const toggleDayExpanded = (day) => {
    setExpandedDays((p) => ({ ...p, [day]: !p[day] }));
  };

  const getFilteredExercises = () => {
    if (!selectedCategory) return [];
    const exercises = COMMON_EXERCISES[selectedCategory] || [];
    if (!searchTerm) return exercises;
    return exercises.filter((ex) =>
      ex.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getWorkoutsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workouts.filter(w => {
      const workoutDate = new Date(w.date).toISOString().split('T')[0];
      return workoutDate === dateStr;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getScheduleForDate = (date) => {
    const dayName = DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1];
    return schedule[dayName];
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const today = getTodayDay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Gym Tracker Pro</h1>
                <a 
                  href="https://gevoglanyan.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-s text-blue-300 hover:text-purple-200 transition-colors"
                >
                  Created by Harry Gevoglanyan
                </a>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-300">Total Workouts</div>
              <div className="text-2xl font-bold text-white">{workouts.length}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2 mb-6">
          {[
            { id: "calendar", icon: Calendar, label: "Calendar" },
            { id: "log", icon: Plus, label: "Log Workout" },
            { id: "history", icon: TrendingUp, label: "History" },
            { id: "stats", icon: BarChart3, label: "Stats" },
          ].map(({ id, icon: Icon, label }) => ( // ignore warning
            <button
              key={id}
              onClick={() => setView(id)}
              className={`py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                view === id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {view === "calendar" && (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-purple-400" />
                Weekly Schedule
              </h2>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className={`bg-white/5 rounded-xl p-4 border ${
                      day === today ? "border-purple-400 bg-purple-500/10" : "border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{day}</span>
                          {day === today && (
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                        {editingDay === day ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="mt-2 w-full bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20"
                            autoFocus
                          />
                        ) : (
                          <p className="text-purple-300 mt-1">{schedule[day]}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingDay === day ? (
                          <>
                            <button
                              onClick={saveEditDay}
                              className="p-2 bg-green-600 rounded-lg hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => setEditingDay(null)}
                              className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditDay(day)}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                          >
                            <Edit2 className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-400" />
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    <ChevronUp className="w-5 h-5 text-white rotate-[-90deg]" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white font-semibold text-sm"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    <ChevronUp className="w-5 h-5 text-white rotate-90" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-purple-300 font-semibold text-sm py-2">
                    {day}
                  </div>
                ))}

                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                  const days = [];
                  
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(
                      <div key={`empty-${i}`} className="aspect-square p-2 bg-white/5 rounded-lg opacity-50"></div>
                    );
                  }
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const dateWorkouts = getWorkoutsForDate(date);
                    const scheduledWorkout = getScheduleForDate(date);
                    const isRestDay = scheduledWorkout === "Rest";
                    const isToday = date.toDateString() === new Date().toDateString();
                    const hasCompletedWorkout = dateWorkouts.length > 0;
                    
                    let bgColor = "bg-white/5"; 
                    let borderColor = "border-white/10";
                    
                    if (isToday) {
                      bgColor = "bg-purple-600";
                      borderColor = "border-purple-400 border-2";
                    } else if (hasCompletedWorkout) {
                      bgColor = "bg-green-600/40";
                      borderColor = "border-green-400";
                    } else if (isRestDay) {
                      bgColor = "bg-slate-700/50";
                      borderColor = "border-slate-600";
                    } else {
                      bgColor = "bg-blue-600/30";
                      borderColor = "border-blue-400/50";
                    }
                    
                    days.push(
                      <div
                        key={day}
                        className={`aspect-square p-2 rounded-lg relative ${bgColor} ${borderColor} border hover:brightness-110 transition-all cursor-pointer overflow-hidden`}
                        onClick={() => {
                          setExpandedDays(prev => ({ ...prev, [date.toISOString()]: !prev[date.toISOString()] }));
                        }}
                      >
                        <div className="text-white font-bold text-base mb-1">{day}</div>
                        
                        <div className={`text-xs leading-tight truncate font-medium ${
                          isRestDay ? "text-slate-300" : "text-white"
                        }`}>
                          {scheduledWorkout}
                        </div>
                        
                        {hasCompletedWorkout && (
                          <div className="absolute bottom-1 right-1">
                            <div className="bg-green-400 text-green-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                              ✓
                            </div>
                          </div>
                        )}
                        
                        {expandedDays[date.toISOString()] && (
                          <div className="absolute z-10 mt-1 left-0 top-full bg-slate-800 border-2 border-purple-400 rounded-lg p-4 shadow-2xl min-w-[280px]">
                            <div className="text-white font-bold mb-3 text-base border-b border-white/20 pb-2">
                              {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                            </div>
                            
                            <div className="mb-3 pb-3 border-b border-white/20">
                              <div className="text-purple-300 text-xs font-semibold mb-1">SCHEDULED:</div>
                              <div className={`font-semibold ${isRestDay ? "text-slate-400" : "text-white"}`}>
                                {scheduledWorkout}
                              </div>
                            </div>
                            
                            {hasCompletedWorkout ? (
                              <div>
                                <div className="text-green-400 text-xs font-semibold mb-2">✓ COMPLETED:</div>
                                {dateWorkouts.map((workout, idx) => (
                                  <div key={idx} className="mb-2 last:mb-0 bg-white/5 rounded p-2">
                                    <div className="text-purple-300 text-xs mb-1">
                                      {new Date(workout.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                    </div>
                                    <div className="space-y-1">
                                      {workout.exercises.map((ex, i) => (
                                        <div key={i} className="text-white text-xs">
                                          • {ex.name} - {ex.sets}×{ex.reps}
                                          {ex.weight && ` @ ${ex.weight} lbs`}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-white/50 text-xs italic">No workouts completed</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-600 rounded border-2 border-purple-400"></div>
                  <span className="text-white font-medium">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600/30 rounded border border-blue-400/50"></div>
                  <span className="text-white font-medium">Workout Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-slate-700/50 rounded border border-slate-600"></div>
                  <span className="text-white font-medium">Rest Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-600/40 rounded border border-green-400 relative">
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-400 text-green-900 text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                      ✓
                    </div>
                  </div>
                  <span className="text-white font-medium">Completed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "log" && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-purple-400" />
              Log Workout
            </h2>

            {!currentWorkout ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-white/70 mb-4">Today's workout: <span className="font-bold text-purple-400">{getTodaySchedule()}</span></p>
                  <button
                    onClick={startWorkout}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                  >
                    Start Today's Workout
                  </button>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <p className="text-white/70 text-center mb-3">Or choose a different workout:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.keys(presetWorkouts).filter(name => name !== "Rest").map(name => (
                      <button
                        key={name}
                        onClick={() => startCustomWorkout(name)}
                        className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-all"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="bg-white/5 p-4 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-white">{ex.name}</div>
                        <button
                          onClick={() => removeExercise(ex.id)}
                          className="p-1 bg-red-600/20 hover:bg-red-600/40 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Sets"
                          value={ex.sets}
                          onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          value={ex.reps}
                          onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Weight"
                          value={ex.weight}
                          onChange={(e) => updateExercise(ex.id, 'weight', e.target.value)}
                          className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {!showExerciseSelector ? (
                  <button
                    onClick={() => setShowExerciseSelector(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold mb-4"
                  >
                    + Add Exercise
                  </button>
                ) : (
                  <div className="bg-white/5 p-4 rounded-xl mb-4 space-y-3">
                    {!newExercise.name ? (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <Search className="w-5 h-5 text-purple-400" />
                          <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {Object.keys(COMMON_EXERCISES).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`py-2 px-3 rounded-lg font-semibold ${
                                selectedCategory === cat
                                  ? "bg-purple-600 text-white"
                                  : "bg-white/10 text-white/70"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        {selectedCategory && (
                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {getFilteredExercises().map((ex) => (
                              <button
                                key={ex}
                                onClick={() => selectExerciseFromList(ex)}
                                className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white"
                              >
                                {ex}
                              </button>
                            ))}
                          </div>
                        )}
                        <input
                          type="text"
                          placeholder="Or type custom exercise name..."
                          value={newExercise.name}
                          onChange={(e) =>
                            setNewExercise({ ...newExercise, name: e.target.value })
                          }
                          className="w-full bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20"
                        />
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-white mb-2">{newExercise.name}</div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder="Sets"
                            value={newExercise.sets}
                            onChange={(e) =>
                              setNewExercise({ ...newExercise, sets: e.target.value })
                            }
                            className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20"
                          />
                          <input
                            type="number"
                            placeholder="Reps"
                            value={newExercise.reps}
                            onChange={(e) =>
                              setNewExercise({ ...newExercise, reps: e.target.value })
                            }
                            className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20"
                          />
                          <input
                            type="number"
                            placeholder="Weight"
                            value={newExercise.weight}
                            onChange={(e) =>
                              setNewExercise({ ...newExercise, weight: e.target.value })
                            }
                            className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={addExercise}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setNewExercise({ name: "", sets: "", reps: "", weight: "" });
                              setShowExerciseSelector(false);
                            }}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={finishWorkout}
                    disabled={!exercises.length}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold"
                  >
                    Finish Workout
                  </button>
                  <button
                    onClick={cancelWorkout}
                    className="px-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {view === "history" && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Workout History
            </h2>
            {workouts.length === 0 ? (
              <div className="text-center py-12 text-white/70">
                No workouts logged yet. Start your first workout!
              </div>
            ) : (
              <div className="space-y-3">
                {workouts.map((w, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl border border-white/10">
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleDayExpanded(idx)}
                    >
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          {formatDate(w.date)}
                        </div>
                        <div className="text-purple-300 text-sm">
                          {w.exercises.length} exercises
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkout(idx);
                          }}
                          className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                        {expandedDays[idx] ? (
                          <ChevronUp className="w-5 h-5 text-white" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                    {expandedDays[idx] && (
                      <div className="px-4 pb-4 space-y-2">
                        {w.exercises.map((ex, i) => (
                          <div key={i} className="bg-white/5 p-3 rounded-lg">
                            <div className="font-semibold text-white">{ex.name}</div>
                            <div className="text-purple-300 text-sm">
                              {ex.sets} sets × {ex.reps} reps
                              {ex.weight && ` @ ${ex.weight} lbs`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "stats" && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Exercise Statistics
            </h2>
            {Object.keys(getExerciseStats()).length === 0 ? (
              <div className="text-center py-12 text-white/70">
                No statistics available yet. Log some workouts to see your progress!
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(getExerciseStats())
                  .sort((a, b) => b[1].sessions - a[1].sessions)
                  .map(([name, s]) => (
                    <div key={name} className="bg-white/5 p-4 rounded-xl">
                      <h3 className="text-white font-bold text-lg mb-2">{name}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <div className="text-purple-300 text-sm">Sessions</div>
                          <div className="text-white font-semibold text-xl">{s.sessions}</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Total Sets</div>
                          <div className="text-white font-semibold text-xl">{s.totalSets}</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Total Reps</div>
                          <div className="text-white font-semibold text-xl">{s.totalReps}</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Max Weight</div>
                          <div className="text-white font-semibold text-xl">
                            {s.maxWeight > 0 ? `${s.maxWeight} lbs` : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}