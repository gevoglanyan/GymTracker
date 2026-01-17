import React, { useState, useEffect, useCallback } from "react";
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
  Settings,
  LogOut,
  Copy,
  Palette,
  Menu,
  Home,
  History,
  Trophy,
  User,
} from "lucide-react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

// Color Themes
const COLOR_THEMES = {
  midnight: {
    name: "Midnight Purple",
    primary: "147, 51, 234",
    secondary: "168, 85, 247",
    accent: "192, 132, 252",
    background: "15, 23, 42",
    surface: "30, 41, 59",
  },
  ember: {
    name: "Ember",
    primary: "239, 68, 68",
    secondary: "251, 146, 60",
    accent: "252, 211, 77",
    background: "23, 23, 23",
    surface: "38, 38, 38",
  },
  ocean: {
    name: "Ocean Blue",
    primary: "14, 165, 233",
    secondary: "59, 130, 246",
    accent: "99, 102, 241",
    background: "15, 23, 42",
    surface: "30, 41, 59",
  },
  forest: {
    name: "Forest Green",
    primary: "34, 197, 94",
    secondary: "74, 222, 128",
    accent: "134, 239, 172",
    background: "20, 30, 20",
    surface: "30, 45, 30",
  },
  sunset: {
    name: "Sunset",
    primary: "249, 115, 22",
    secondary: "251, 146, 60",
    accent: "253, 186, 116",
    background: "28, 25, 23",
    surface: "41, 37, 36",
  },
  cyberpunk: {
    name: "Cyberpunk",
    primary: "236, 72, 153",
    secondary: "147, 51, 234",
    accent: "6, 182, 212",
    background: "17, 24, 39",
    surface: "31, 41, 55",
  },
};

// Workout Presets
const WORKOUT_PRESETS = {
  ppl_split: {
    name: "PPL Split",
    description: "Push/Pull/Legs split focused on muscle growth (8-12 reps)",
    schedule: {
      Monday: "Pull Day 1",
      Tuesday: "Rest",
      Wednesday: "Push Day 1",
      Thursday: "Rest",
      Friday: "Pull Day 2",
      Saturday: "Legs & Core",
      Sunday: "Push Day 2",
    },
    workouts: {
      "Pull Day 1": [
        { name: "Pull-ups", sets: "4", reps: "8-10", weight: "" },
        { name: "Barbell Row", sets: "4", reps: "8-10", weight: "135" },
        { name: "Lat Pulldown", sets: "3", reps: "12-15", weight: "100" },
        { name: "Seated Cable Row", sets: "3", reps: "12-15", weight: "120" },
        { name: "Face Pulls", sets: "3", reps: "15-20", weight: "40" },
        { name: "Barbell Curl", sets: "3", reps: "10-12", weight: "60" },
        { name: "Hammer Curls", sets: "3", reps: "10-12", weight: "35" },
      ],
      "Push Day 1": [
        { name: "Bench Press", sets: "4", reps: "8-10", weight: "185" },
        { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", weight: "70" },
        { name: "Cable Flyes", sets: "3", reps: "12-15", weight: "30" },
        { name: "Overhead Press", sets: "4", reps: "8-10", weight: "95" },
        { name: "Lateral Raises", sets: "4", reps: "12-15", weight: "20" },
        { name: "Tricep Pushdown", sets: "3", reps: "12-15", weight: "60" },
        { name: "Overhead Tricep Extension", sets: "3", reps: "12-15", weight: "40" },
      ],
      "Pull Day 2": [
        { name: "Deadlift", sets: "4", reps: "6-8", weight: "225" },
        { name: "Weighted Pull-ups", sets: "4", reps: "8-10", weight: "25" },
        { name: "T-Bar Row", sets: "4", reps: "10-12", weight: "90" },
        { name: "Single Arm Dumbbell Row", sets: "3", reps: "10-12", weight: "70" },
        { name: "Reverse Flyes", sets: "3", reps: "15-20", weight: "20" },
        { name: "Preacher Curls", sets: "3", reps: "10-12", weight: "50" },
        { name: "Cable Curls", sets: "3", reps: "12-15", weight: "40" },
      ],
      "Legs & Core": [
        { name: "Squat", sets: "4", reps: "8-10", weight: "225" },
        { name: "Romanian Deadlift", sets: "4", reps: "8-10", weight: "185" },
        { name: "Leg Press", sets: "3", reps: "12-15", weight: "300" },
        { name: "Leg Extension", sets: "3", reps: "12-15", weight: "100" },
        { name: "Leg Curl", sets: "3", reps: "12-15", weight: "80" },
        { name: "Calf Raises", sets: "4", reps: "15-20", weight: "100" },
        { name: "Cable Crunches", sets: "3", reps: "15-20", weight: "70" },
        { name: "Plank", sets: "3", reps: "60s", weight: "" },
      ],
      "Push Day 2": [
        { name: "Incline Barbell Press", sets: "4", reps: "8-10", weight: "155" },
        { name: "Dumbbell Bench Press", sets: "4", reps: "10-12", weight: "75" },
        { name: "Dips", sets: "3", reps: "10-12", weight: "" },
        { name: "Dumbbell Shoulder Press", sets: "4", reps: "10-12", weight: "55" },
        { name: "Front Raises", sets: "3", reps: "12-15", weight: "20" },
        { name: "Skull Crushers", sets: "3", reps: "10-12", weight: "60" },
        { name: "Cable Tricep Kickbacks", sets: "3", reps: "12-15", weight: "20" },
      ],
      "Rest": [],
    },
  },
  ppl_strength: {
    name: "PPL - Strength",
    description: "Push/Pull/Legs focused on strength building (3-6 reps)",
    schedule: {
      Monday: "Pull Day 1",
      Tuesday: "Rest",
      Wednesday: "Push Day 1",
      Thursday: "Rest",
      Friday: "Pull Day 2",
      Saturday: "Legs & Core",
      Sunday: "Push Day 2",
    },
    workouts: {
      "Pull Day 1": [
        { name: "Deadlift", sets: "5", reps: "5", weight: "315" },
        { name: "Barbell Row", sets: "5", reps: "5", weight: "185" },
        { name: "Weighted Pull-ups", sets: "4", reps: "5-6", weight: "45" },
        { name: "T-Bar Row", sets: "3", reps: "6-8", weight: "135" },
        { name: "Barbell Curl", sets: "3", reps: "6-8", weight: "80" },
      ],
      "Push Day 1": [
        { name: "Bench Press", sets: "5", reps: "5", weight: "225" },
        { name: "Overhead Press", sets: "5", reps: "5", weight: "115" },
        { name: "Incline Bench Press", sets: "4", reps: "6", weight: "185" },
        { name: "Weighted Dips", sets: "3", reps: "6-8", weight: "45" },
        { name: "Close Grip Bench Press", sets: "3", reps: "6-8", weight: "165" },
      ],
      "Pull Day 2": [
        { name: "Rack Pulls", sets: "4", reps: "5", weight: "365" },
        { name: "Weighted Chin-ups", sets: "4", reps: "5-6", weight: "45" },
        { name: "Pendlay Row", sets: "4", reps: "6", weight: "165" },
        { name: "Cable Row", sets: "3", reps: "8-10", weight: "160" },
        { name: "Face Pulls", sets: "3", reps: "15-20", weight: "50" },
        { name: "Hammer Curls", sets: "3", reps: "8-10", weight: "50" },
      ],
      "Legs & Core": [
        { name: "Squat", sets: "5", reps: "5", weight: "275" },
        { name: "Front Squat", sets: "4", reps: "6", weight: "185" },
        { name: "Romanian Deadlift", sets: "4", reps: "6", weight: "225" },
        { name: "Leg Press", sets: "3", reps: "8", weight: "400" },
        { name: "Leg Curl", sets: "3", reps: "10", weight: "100" },
        { name: "Calf Raises", sets: "4", reps: "10", weight: "150" },
        { name: "Weighted Plank", sets: "3", reps: "45s", weight: "45" },
        { name: "Hanging Leg Raises", sets: "3", reps: "12-15", weight: "" },
      ],
      "Push Day 2": [
        { name: "Incline Barbell Press", sets: "5", reps: "5", weight: "185" },
        { name: "Dumbbell Bench Press", sets: "4", reps: "6-8", weight: "90" },
        { name: "Dips", sets: "4", reps: "6-8", weight: "" },
        { name: "Arnold Press", sets: "4", reps: "6-8", weight: "60" },
        { name: "Lateral Raises", sets: "3", reps: "10-12", weight: "25" },
        { name: "Tricep Pushdown", sets: "4", reps: "10-12", weight: "80" },
      ],
      "Rest": [],
    },
  },
  upper_lower: {
    name: "Upper/Lower Split",
    description: "5-day split alternating upper and lower body with core work",
    schedule: {
      Monday: "Pull Day",
      Tuesday: "Rest",
      Wednesday: "Push Day",
      Thursday: "Rest",
      Friday: "Upper Body",
      Saturday: "Legs & Core",
      Sunday: "Full Body",
    },
    workouts: {
      "Pull Day": [
        { name: "Deadlift", sets: "4", reps: "6-8", weight: "245" },
        { name: "Pull-ups", sets: "4", reps: "8-10", weight: "" },
        { name: "Barbell Row", sets: "4", reps: "8-10", weight: "135" },
        { name: "Lat Pulldown", sets: "3", reps: "10-12", weight: "120" },
        { name: "Face Pulls", sets: "3", reps: "15-20", weight: "40" },
        { name: "Barbell Curl", sets: "3", reps: "10-12", weight: "60" },
        { name: "Hammer Curls", sets: "3", reps: "10-12", weight: "35" },
      ],
      "Push Day": [
        { name: "Bench Press", sets: "4", reps: "8-10", weight: "185" },
        { name: "Incline Dumbbell Press", sets: "4", reps: "10-12", weight: "70" },
        { name: "Overhead Press", sets: "3", reps: "8-10", weight: "95" },
        { name: "Dumbbell Flyes", sets: "3", reps: "12-15", weight: "35" },
        { name: "Lateral Raises", sets: "3", reps: "12-15", weight: "20" },
        { name: "Tricep Pushdown", sets: "3", reps: "10-12", weight: "60" },
        { name: "Skull Crushers", sets: "3", reps: "10-12", weight: "60" },
      ],
      "Upper Body": [
        { name: "Incline Barbell Press", sets: "4", reps: "8-10", weight: "155" },
        { name: "Cable Row", sets: "4", reps: "10-12", weight: "120" },
        { name: "Dumbbell Shoulder Press", sets: "3", reps: "10-12", weight: "55" },
        { name: "Chin-ups", sets: "3", reps: "8-10", weight: "" },
        { name: "Cable Flyes", sets: "3", reps: "12-15", weight: "30" },
        { name: "Preacher Curls", sets: "3", reps: "10-12", weight: "50" },
        { name: "Overhead Tricep Extension", sets: "3", reps: "12-15", weight: "40" },
      ],
      "Legs & Core": [
        { name: "Squat", sets: "4", reps: "6-8", weight: "225" },
        { name: "Romanian Deadlift", sets: "4", reps: "8-10", weight: "185" },
        { name: "Leg Press", sets: "3", reps: "12-15", weight: "300" },
        { name: "Leg Curl", sets: "3", reps: "12-15", weight: "80" },
        { name: "Calf Raises", sets: "4", reps: "15-20", weight: "100" },
        { name: "Cable Crunches", sets: "3", reps: "15-20", weight: "70" },
        { name: "Plank", sets: "3", reps: "60s", weight: "" },
      ],
      "Full Body": [
        { name: "Front Squat", sets: "3", reps: "8-10", weight: "155" },
        { name: "Dips", sets: "3", reps: "10-12", weight: "" },
        { name: "T-Bar Row", sets: "3", reps: "10-12", weight: "90" },
        { name: "Bulgarian Split Squats", sets: "3", reps: "12-15", weight: "40" },
        { name: "Arnold Press", sets: "3", reps: "10-12", weight: "45" },
        { name: "Hanging Leg Raises", sets: "3", reps: "12-15", weight: "" },
        { name: "Russian Twists", sets: "3", reps: "20", weight: "25" },
      ],
      "Rest": [],
    },
  },
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  const [currentTheme, setCurrentTheme] = useState("midnight");
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const [workouts, setWorkouts] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [presetWorkouts, setPresetWorkouts] = useState({});
  const [exercises, setExercises] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [view, setView] = useState("home");
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

  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    height: "",
    currentWeight: "",
    goalWeight: "",
  });
  const [weightHistory, setWeightHistory] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newWeightEntry, setNewWeightEntry] = useState({ weight: "", date: "" });

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.email.split('@')[0]); 
        setAuthError("");
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setWorkouts([]);
        setSchedule({});
        setPresetWorkouts({});
        setProfile({ name: "", age: "", height: "", currentWeight: "", goalWeight: "" });
        setWeightHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = useCallback(async () => {
    if (!auth.currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setWorkouts(data.workouts || []);
        setSchedule(data.schedule || {});
        setPresetWorkouts(data.presetWorkouts || {});
        setCurrentTheme(data.theme || "midnight");
        setProfile(data.profile || { name: "", age: "", height: "", currentWeight: "", goalWeight: "" });
        setWeightHistory(data.weightHistory || []);
        setSelectedPreset(data.selectedPreset || null);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && auth.currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadUserData();
    }
  }, [isLoggedIn, loadUserData]);

  const saveUserData = useCallback(async () => {
    if (!auth.currentUser) return;
    
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        workouts,
        schedule,
        presetWorkouts,
        theme: currentTheme,
        profile,
        weightHistory,
        selectedPreset,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, [workouts, schedule, presetWorkouts, currentTheme, profile, weightHistory, selectedPreset]);

  useEffect(() => {
    if (isLoggedIn && auth.currentUser) {
      const timeoutId = setTimeout(() => {
        saveUserData();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoggedIn, saveUserData]);

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      setAuthError("Please enter both email and password");
      return;
    }

    const email = loginUsername.includes('@') ? loginUsername : `${loginUsername}@gymtracker.app`;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, loginPassword);
        applyPreset("ppl_split");
      } else {
        await signInWithEmailAndPassword(auth, email, loginPassword);
      }
      
      setAuthError("");
      setLoginUsername("");
      setLoginPassword("");
    } catch (error) {
      console.error("Auth error:", error);
      
      if (error.code === "auth/email-already-in-use") {
        setAuthError("Username already exists");
      } else if (error.code === "auth/user-not-found") {
        setAuthError("User not found");
      } else if (error.code === "auth/wrong-password") {
        setAuthError("Incorrect password");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("Invalid email format");
      } else {
        setAuthError("An error occurred. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView("home");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will permanently delete all your workouts, schedules, and settings. This action cannot be undone."
    );
    
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid));
        await deleteUser(auth.currentUser);
        
        setView("home");
        
        alert("Your account has been deleted successfully.");
      } catch (error) {
        console.error("Error deleting account:", error);
        if (error.code === "auth/requires-recent-login") {
          alert("For security reasons, please log out and log back in, then try deleting your account again.");
        } else {
          alert("An error occurred while deleting your account. Please try again.");
        }
      }
    }
  };

  const applyPreset = (presetKey) => {
    const preset = WORKOUT_PRESETS[presetKey];
    if (preset) {
      setSchedule(preset.schedule);
      setPresetWorkouts(preset.workouts);
      setSelectedPreset(presetKey);
      setShowPresetSelector(false);
    }
  };

  const saveProfile = () => {
    setEditingProfile(false);
  };

  const addWeightEntry = () => {
    if (!newWeightEntry.weight || !newWeightEntry.date) return;
    
    const entry = {
      weight: parseFloat(newWeightEntry.weight),
      date: newWeightEntry.date,
      timestamp: new Date(newWeightEntry.date).getTime(),
    };
    
    const updatedHistory = [...weightHistory, entry].sort((a, b) => a.timestamp - b.timestamp);
    setWeightHistory(updatedHistory);
    setNewWeightEntry({ weight: "", date: "" });
  };

  const deleteWeightEntry = (timestamp) => {
    setWeightHistory(weightHistory.filter(entry => entry.timestamp !== timestamp));
  };

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
    setView("log");
  };

  const startCustomWorkout = (scheduleName) => {
    const preset = presetWorkouts[scheduleName] || [];
    setCurrentWorkout({ date: new Date().toISOString(), exercises: [] });
    setExercises(preset.map(ex => ({ ...ex, id: Date.now() + Math.random() })));
    setShowExerciseSelector(false);
    setView("log");
  };

  const finishWorkout = () => {
    if (exercises.length === 0) return;
    
    const workout = {
      ...currentWorkout,
      // eslint-disable-next-line no-unused-vars
      exercises: exercises.map(({ id, ...ex }) => ex), 
    };
    
    setWorkouts([workout, ...workouts]);
    setCurrentWorkout(null);
    setExercises([]);
    setView("home");
  };

  const cancelWorkout = () => {
    setCurrentWorkout(null);
    setExercises([]);
    setView("home");
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) return;
    
    setExercises([...exercises, { ...newExercise, id: Date.now() }]);
    setNewExercise({ name: "", sets: "", reps: "", weight: "" });
    setShowExerciseSelector(false);
  };

  const selectExerciseFromList = (name) => {
    setNewExercise({ ...newExercise, name });
  };

  const deleteWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleDayExpanded = (day) => {
    setExpandedDays({ ...expandedDays, [day]: !expandedDays[day] });
  };

  // eslint-disable-next-line no-unused-vars
  const startEditingDay = (day) => {
    setEditingDay(day);
    setEditValue(schedule[day] || "");
  };

  // eslint-disable-next-line no-unused-vars
  const saveScheduleEdit = () => {
    if (editingDay) {
      setSchedule({ ...schedule, [editingDay]: editValue });
      setEditingDay(null);
      setEditValue("");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const cancelScheduleEdit = () => {
    setEditingDay(null);
    setEditValue("");
  };

  const startEditingPreset = (workoutName) => {
    setEditingPreset(workoutName);
  };

  const savePresetEdit = () => {
    setEditingPreset(null);
  };

  // eslint-disable-next-line no-unused-vars
  const cancelPresetEdit = () => { 
    setEditingPreset(null);
  };

  const updatePresetExercise = (workoutName, index, field, value) => {
    const updated = { ...presetWorkouts };
    updated[workoutName][index][field] = value;
    setPresetWorkouts(updated);
  };

  const deletePresetExercise = (workoutName, index) => {
    const updated = { ...presetWorkouts };
    updated[workoutName] = updated[workoutName].filter((_, i) => i !== index);
    setPresetWorkouts(updated);
  };

  const addPresetExercise = (workoutName) => {
    const updated = { ...presetWorkouts };
    if (!updated[workoutName]) {
      updated[workoutName] = [];
    }
    updated[workoutName].push({ name: "", sets: "", reps: "", weight: "" });
    setPresetWorkouts(updated);
  };

  const getExerciseStats = () => {
    const stats = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (!stats[ex.name]) {
          stats[ex.name] = {
            sessions: 0,
            totalSets: 0,
            totalReps: 0,
            maxWeight: 0,
          };
        }
        
        stats[ex.name].sessions++;
        stats[ex.name].totalSets += parseInt(ex.sets) || 0;
        stats[ex.name].totalReps += (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0);
        
        const weight = parseInt(ex.weight) || 0;
        if (weight > stats[ex.name].maxWeight) {
          stats[ex.name].maxWeight = weight;
        }
      });
    });
    
    return stats;
  };

  const filteredExercises = selectedCategory
    ? COMMON_EXERCISES[selectedCategory].filter(ex =>
        ex.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const theme = COLOR_THEMES[currentTheme];

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, rgb(${theme.background}) 0%, rgb(${theme.surface}) 100%)`,
        }}
      >
        <div className="w-full max-w-md">
          <div 
            className="rounded-3xl p-8 shadow-2xl backdrop-blur-lg border"
            style={{
              backgroundColor: `rgba(${theme.surface}, 0.4)`,
              borderColor: `rgba(${theme.primary}, 0.2)`,
            }}
          >
            <div className="text-center mb-8">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                style={{
                  background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                }}
              >
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Gym Tracker Pro</h1>
              <p className="text-white/70">Track your fitness journey</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
              />
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl text-white font-bold transition-all hover:scale-105 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                }}
              >
                {isRegistering ? "Create Account" : "Login"}
              </button>
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthError("");
                }}
                className="w-full py-3 rounded-xl text-white/70 hover:text-white transition-colors"
              >
                {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-20 md:pb-8"
      style={{
        background: `linear-gradient(135deg, rgb(${theme.background}) 0%, rgb(${theme.surface}) 100%)`,
      }}
    >
      <div 
        className="sticky top-0 z-50 backdrop-blur-lg border-b"
        style={{
          backgroundColor: `rgba(${theme.surface}, 0.9)`,
          borderColor: `rgba(${theme.primary}, 0.2)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                }}
              >
                <Dumbbell className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Gym Tracker Pro</h1>
                <p className="text-base md:text-lg font-bold mt-1">
                  <span className="text-white/70">Welcome back, </span>
                  <span 
                    className="font-black bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                    }}
                  >
                    {username}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => {
                  setShowThemeSelector(!showThemeSelector);
                  setShowSettingsMenu(false);
                }}
                className="relative p-3 md:p-4 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 group"
                style={{
                  backgroundColor: showThemeSelector ? `rgba(${theme.primary}, 0.2)` : 'transparent',
                }}
              >
                <Palette className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white transition-colors" />
                
                {showThemeSelector && (
                  <div 
                    className="absolute top-full right-0 mt-6 md:mt-3 p-5 rounded-3xl shadow-2xl border backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.95)`,
                      borderColor: `rgba(${theme.primary}, 0.3)`,
                      boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5)`,
                    }}
                  >
                    <h3 className="text-white font-bold text-lg mb-4">Choose Theme</h3>
                    <div className="grid grid-cols-2 gap-3 min-w-[280px]">
                      {Object.entries(COLOR_THEMES).map(([key, t]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setCurrentTheme(key);
                            setShowThemeSelector(false);
                          }}
                          className="p-4 rounded-2xl text-left hover:scale-105 transition-all relative overflow-hidden group"
                          style={{
                            background: `linear-gradient(135deg, rgb(${t.primary}), rgb(${t.secondary}))`,
                          }}
                        >
                          <div className="text-white font-bold text-base mb-1">{t.name}</div>
                          {key === currentTheme && (
                            <div className="flex items-center gap-1 text-white/90 text-xs">
                              <Check className="w-4 h-4" />
                              <span>Active</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  setShowThemeSelector(false);
                }}
                className="relative p-3 md:p-4 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 group hidden md:block"
                style={{
                  backgroundColor: showSettingsMenu ? `rgba(${theme.primary}, 0.2)` : 'transparent',
                }}
              >
                <Settings className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-white transition-colors" />
                
                {showSettingsMenu && (
                  <div 
                    className="absolute top-full right-0 mt-6 md:mt-3 p-4 rounded-3xl shadow-2xl border backdrop-blur-xl z-50 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.95)`,
                      borderColor: `rgba(${theme.primary}, 0.3)`,
                      boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5)`,
                    }}
                  >
                    <h3 className="text-white font-bold text-lg mb-3 px-2">Settings</h3>
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        handleDeleteAccount();
                      }}
                      className="w-full text-left p-4 rounded-2xl hover:bg-red-500/20 text-red-400 font-bold transition-all flex items-center gap-3 group"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-base text-white/80 hover:text-white transition-all hover:scale-105"
                style={{
                  backgroundColor: `rgba(${theme.primary}, 0.15)`,
                }}
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-3 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 md:hidden"
              >
                <Menu className="w-7 h-7 text-white/80" />
              </button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div 
            className="md:hidden p-5 border-t backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              borderColor: `rgba(${theme.primary}, 0.2)`,
              backgroundColor: `rgba(${theme.surface}, 0.95)`,
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 transition-all mb-3 group"
            >
              <LogOut className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
              <span className="text-white/80 group-hover:text-white font-semibold transition-colors">Logout</span>
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                handleDeleteAccount();
              }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/20 transition-all text-red-400 group"
            >
              <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Delete Account</span>
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:block max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "log", label: "Workout", icon: Dumbbell },
            { id: "presets", label: "Presets", icon: Calendar },
            { id: "history", label: "History", icon: History },
            { id: "stats", label: "Stats", icon: Trophy },
            { id: "profile", label: "Profile", icon: User },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex-1 py-4 px-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
              style={{
                background: view === item.id
                  ? `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`
                  : `rgba(${theme.surface}, 0.4)`,
                color: view === item.id ? "white" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-0 pb-6">
        {view === "home" && (
          <div className="space-y-6">
            <div 
              className="rounded-3xl p-6 md:p-8 shadow-xl border"
              style={{
                background: `linear-gradient(135deg, rgba(${theme.primary}, 0.2), rgba(${theme.secondary}, 0.1))`,
                borderColor: `rgba(${theme.primary}, 0.3)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Today's Workout</h2>
                  <p className="text-lg text-white/70 mt-2">{getTodayDay()}</p>
                </div>
                {!currentWorkout && (
                  <button
                    onClick={() => setShowPresetSelector(true)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-semibold transition-colors"
                  >
                    Change Preset
                  </button>
                )}
              </div>
              
              <div 
                className="rounded-2xl p-6 mb-6"
                style={{
                  backgroundColor: `rgba(${theme.surface}, 0.6)`,
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {getTodaySchedule() || "Rest Day"}
                </h3>
                {getTodaySchedule() && getTodaySchedule() !== "Rest" && presetWorkouts[getTodaySchedule()] && (
                  <div className="text-white/70 text-base">
                    {presetWorkouts[getTodaySchedule()].length} exercises planned
                  </div>
                )}
              </div>

              {!currentWorkout && getTodaySchedule() && getTodaySchedule() !== "Rest" && (
                <button
                  onClick={startWorkout}
                  className="w-full py-5 rounded-2xl text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                  }}
                >
                  Start Workout
                </button>
              )}
            </div>

            <div 
              className="rounded-3xl p-6 md:p-8 shadow-xl border"
              style={{
                backgroundColor: `rgba(${theme.surface}, 0.4)`,
                borderColor: `rgba(${theme.primary}, 0.2)`,
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Weekly Schedule</h3>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                {DAYS_OF_WEEK.map((day) => {
                  const isToday = day === getTodayDay();
                  const workout = schedule[day];
                  
                  return (
                    <div
                      key={day}
                      onClick={() => workout && workout !== "Rest" && startCustomWorkout(workout)}
                      className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-105"
                      style={{
                        background: isToday
                          ? `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`
                          : `rgba(${theme.surface}, 0.6)`,
                        borderColor: `rgba(${theme.primary}, 0.2)`,
                      }}
                    >
                      <div className="text-white/70 text-sm mb-1">{day.slice(0, 3)}</div>
                      <div className="text-white font-bold text-base">
                        {workout || "Rest"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div 
              className="rounded-3xl p-6 md:p-8 shadow-xl border"
              style={{
                backgroundColor: `rgba(${theme.surface}, 0.4)`,
                borderColor: `rgba(${theme.primary}, 0.2)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white">Calendar</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const prev = new Date(currentMonth);
                      prev.setMonth(prev.getMonth() - 1);
                      setCurrentMonth(prev);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 text-white/70 rotate-90" />
                  </button>
                  <div className="text-white font-bold text-lg">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => {
                      const next = new Date(currentMonth);
                      next.setMonth(next.getMonth() + 1);
                      setCurrentMonth(next);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 text-white/70 -rotate-90" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-white/60 text-sm font-semibold py-2">
                    {day}
                  </div>
                ))}
                
                {(() => {
                  const year = currentMonth.getFullYear();
                  const month = currentMonth.getMonth();
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  const days = [];
                  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="aspect-square" />);
                  }
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    date.setHours(0, 0, 0, 0);
                    const isToday = date.getTime() === today.getTime();
                    const dayOfWeek = dayNames[date.getDay()];
  
                    const scheduledWorkout = schedule[dayOfWeek];
                    
                    const completedWorkout = workouts.find(w => {
                      const workoutDate = new Date(w.date);
                      workoutDate.setHours(0, 0, 0, 0);
                      return workoutDate.getTime() === date.getTime();
                    });
                    
                    const isRestDay = scheduledWorkout === "Rest" || !scheduledWorkout;
                    
                    days.push(
                      <div
                        key={day}
                        className="aspect-square p-1.5 md:p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 relative"
                        style={{
                          background: isToday
                            ? `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`
                            : isRestDay
                            ? `rgba(${theme.surface}, 0.4)`
                            : `rgba(${theme.primary}, 0.2)`,
                          border: completedWorkout ? `2px solid rgb(${theme.accent})` : isRestDay ? 'none' : `1px solid rgba(${theme.primary}, 0.3)`,
                        }}
                      >
                        <div className="text-white font-bold text-sm md:text-base mb-0.5">
                          {day}
                        </div>
                        {scheduledWorkout && (
                          <div 
                            className="text-center text-xs font-semibold leading-tight px-1"
                            style={{ 
                              color: isToday ? 'white' : `rgb(${theme.accent})`,
                            }}
                          >
                            {scheduledWorkout === "Rest" ? "Rest" : scheduledWorkout.split(' ')[0]}
                          </div>
                        )}
                        {completedWorkout && (
                          <div 
                            className="absolute top-1 right-1 w-2 h-2 rounded-full"
                            style={{ backgroundColor: `rgb(${theme.accent})` }}
                          />
                        )}
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{
                      background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                    }}
                  />
                  <span className="text-white/70">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{
                      backgroundColor: `rgba(${theme.primary}, 0.2)`,
                      borderColor: `rgba(${theme.primary}, 0.3)`,
                    }}
                  />
                  <span className="text-white/70">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border-2 relative"
                    style={{
                      backgroundColor: `rgba(${theme.primary}, 0.2)`,
                      borderColor: `rgb(${theme.accent})`,
                    }}
                  >
                    <div 
                      className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: `rgb(${theme.accent})` }}
                    />
                  </div>
                  <span className="text-white/70">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.4)`,
                    }}
                  />
                  <span className="text-white/70">Rest</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPresetSelector && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div 
              className="w-full max-w-2xl rounded-3xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: `rgb(${theme.surface})`,
                borderColor: `rgba(${theme.primary}, 0.3)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Choose Workout Preset</h2>
                <button
                  onClick={() => setShowPresetSelector(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white/70" />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(WORKOUT_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="w-full text-left p-6 rounded-2xl transition-all hover:scale-105"
                    style={{
                      background: selectedPreset === key
                        ? `linear-gradient(135deg, rgba(${theme.primary}, 0.3), rgba(${theme.secondary}, 0.2))`
                        : `rgba(${theme.surface}, 0.6)`,
                      borderColor: `rgba(${theme.primary}, 0.2)`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{preset.name}</h3>
                      {selectedPreset === key && (
                        <Check className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <p className="text-white/70 text-sm mb-4">{preset.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(preset.schedule).map(day => (
                        <span 
                          key={day}
                          className="text-xs px-3 py-1 rounded-lg"
                          style={{
                            backgroundColor: `rgba(${theme.primary}, 0.2)`,
                            color: `rgb(${theme.accent})`,
                          }}
                        >
                          {day.slice(0, 3)}: {preset.schedule[day]}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "log" && (
          <div 
            className="rounded-3xl p-6 shadow-xl border"
            style={{
              backgroundColor: `rgba(${theme.surface}, 0.4)`,
              borderColor: `rgba(${theme.primary}, 0.2)`,
            }}
          >
            {!currentWorkout ? (
              <div>
                <div className="text-center py-8 mb-6">
                  <Dumbbell 
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: `rgb(${theme.primary})` }}
                  />
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to train?</h2>
                  <p className="text-white/70 mb-6">Start your workout from the home screen</p>
                  <button
                    onClick={() => setView("home")}
                    className="px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                    }}
                  >
                    Go to Home
                  </button>
                </div>

                <div 
                  className="rounded-2xl p-6 border"
                  style={{
                    backgroundColor: `rgba(${theme.surface}, 0.6)`,
                    borderColor: `rgba(${theme.primary}, 0.2)`,
                  }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Exercise Library</h3>
                  
                  {Object.entries(COMMON_EXERCISES).map(([category, exerciseList]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <button
                        onClick={() => toggleDayExpanded(category)}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                        style={{
                          backgroundColor: `rgba(${theme.background}, 0.4)`,
                        }}
                      >
                        <div>
                          <h4 className="text-lg font-bold text-white">{category}</h4>
                          <p className="text-sm text-white/60 mt-1">{exerciseList.length} exercises</p>
                        </div>
                        {expandedDays[category] ? (
                          <ChevronUp className="w-6 h-6 text-white/70" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white/70" />
                        )}
                      </button>
                      
                      {expandedDays[category] && (
                        <div className="mt-3 space-y-2 pl-4">
                          {exerciseList.map((exercise, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg"
                              style={{
                                backgroundColor: `rgba(${theme.background}, 0.3)`,
                              }}
                            >
                              <div className="text-white font-medium">{exercise}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Current Workout</h2>
                  <div className="text-white/70 text-sm">
                    {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="rounded-2xl p-4"
                      style={{
                        backgroundColor: `rgba(${theme.surface}, 0.6)`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{ex.name}</h3>
                        <button
                          onClick={() => deleteExercise(ex.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-white/60 mb-1 block">Sets</label>
                          <input
                            type="text"
                            value={ex.sets}
                            onChange={(e) => updateExercise(ex.id, "sets", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60 mb-1 block">Reps</label>
                          <input
                            type="text"
                            value={ex.reps}
                            onChange={(e) => updateExercise(ex.id, "reps", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/60 mb-1 block">Weight (lbs)</label>
                          <input
                            type="text"
                            value={ex.weight}
                            onChange={(e) => updateExercise(ex.id, "weight", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!showExerciseSelector ? (
                  <button
                    onClick={() => setShowExerciseSelector(true)}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 mb-4 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Exercise
                  </button>
                ) : (
                  <div 
                    className="rounded-2xl p-6 mb-4 space-y-4"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.6)`,
                    }}
                  >
                    {!newExercise.name ? (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <Search className="w-5 h-5 text-white/60" />
                          <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {Object.keys(COMMON_EXERCISES).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                setSelectedCategory(cat);
                                setSearchTerm("");
                              }}
                              className="py-2 px-3 rounded-lg text-sm font-semibold transition-all"
                              style={{
                                background: selectedCategory === cat
                                  ? `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`
                                  : `rgba(${theme.surface}, 0.6)`,
                                color: selectedCategory === cat ? "white" : "rgba(255, 255, 255, 0.7)",
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        {selectedCategory && (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {filteredExercises.map((ex) => (
                              <button
                                key={ex}
                                onClick={() => selectExerciseFromList(ex)}
                                className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
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
                          onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                          className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-white text-lg mb-4">{newExercise.name}</div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div>
                            <label className="text-xs text-white/60 mb-1 block">Sets</label>
                            <input
                              type="text"
                              placeholder="Sets"
                              value={newExercise.sets}
                              onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                              className="w-full bg-white/10 text-white px-3 py-3 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-white/60 mb-1 block">Reps</label>
                            <input
                              type="text"
                              placeholder="Reps"
                              value={newExercise.reps}
                              onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                              className="w-full bg-white/10 text-white px-3 py-3 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-white/60 mb-1 block">Weight</label>
                            <input
                              type="text"
                              placeholder="Weight"
                              value={newExercise.weight}
                              onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                              className="w-full bg-white/10 text-white px-3 py-3 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={addExercise}
                            className="flex-1 py-3 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-transform"
                            style={{
                              background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                            }}
                          >
                            Add Exercise
                          </button>
                          <button
                            onClick={() => {
                              setNewExercise({ name: "", sets: "", reps: "", weight: "" });
                              setShowExerciseSelector(false);
                              setSelectedCategory("");
                            }}
                            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
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
                    className="flex-1 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: exercises.length 
                        ? `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`
                        : `rgba(${theme.surface}, 0.6)`,
                    }}
                  >
                    Finish Workout
                  </button>
                  <button
                    onClick={cancelWorkout}
                    className="px-6 py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {view === "history" && (
          <div 
            className="rounded-3xl p-6 shadow-xl border"
            style={{
              backgroundColor: `rgba(${theme.surface}, 0.4)`,
              borderColor: `rgba(${theme.primary}, 0.2)`,
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp 
                className="w-6 h-6"
                style={{ color: `rgb(${theme.accent})` }}
              />
              Workout History
            </h2>
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <Calendar 
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: `rgb(${theme.primary})` }}
                />
                <p className="text-white/70">No workouts logged yet.</p>
                <p className="text-white/60 text-sm mt-2">Start your first workout to see it here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workouts.map((w, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.6)`,
                    }}
                  >
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => toggleDayExpanded(idx)}
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <Calendar 
                            className="w-4 h-4"
                            style={{ color: `rgb(${theme.accent})` }}
                          />
                          {formatDate(w.date)}
                        </div>
                        <div 
                          className="text-sm mt-1"
                          style={{ color: `rgb(${theme.accent})` }}
                        >
                          {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkout(idx);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                        {expandedDays[idx] ? (
                          <ChevronUp className="w-5 h-5 text-white/70" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/70" />
                        )}
                      </div>
                    </div>
                    {expandedDays[idx] && (
                      <div className="px-4 pb-4 space-y-2 border-t"
                        style={{ borderColor: `rgba(${theme.primary}, 0.2)` }}
                      >
                        {w.exercises.map((ex, i) => (
                          <div 
                            key={i}
                            className="p-3 rounded-lg mt-2"
                            style={{
                              backgroundColor: `rgba(${theme.background}, 0.6)`,
                            }}
                          >
                            <div className="font-semibold text-white">{ex.name}</div>
                            <div 
                              className="text-sm mt-1"
                              style={{ color: `rgb(${theme.accent})` }}
                            >
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
          <div 
            className="rounded-3xl p-6 shadow-xl border"
            style={{
              backgroundColor: `rgba(${theme.surface}, 0.4)`,
              borderColor: `rgba(${theme.primary}, 0.2)`,
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 
                className="w-6 h-6"
                style={{ color: `rgb(${theme.accent})` }}
              />
              Exercise Statistics
            </h2>
            {Object.keys(getExerciseStats()).length === 0 ? (
              <div className="text-center py-12">
                <Trophy 
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: `rgb(${theme.primary})` }}
                />
                <p className="text-white/70">No statistics available yet.</p>
                <p className="text-white/60 text-sm mt-2">Log some workouts to see your progress!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(getExerciseStats())
                  .sort((a, b) => b[1].sessions - a[1].sessions)
                  .map(([name, s]) => (
                    <div
                      key={name}
                      className="rounded-2xl p-6"
                      style={{
                        backgroundColor: `rgba(${theme.surface}, 0.6)`,
                      }}
                    >
                      <h3 className="text-white font-bold text-lg mb-4">{name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div 
                            className="text-sm mb-1"
                            style={{ color: `rgb(${theme.accent})` }}
                          >
                            Sessions
                          </div>
                          <div className="text-white font-bold text-2xl">{s.sessions}</div>
                        </div>
                        <div>
                          <div 
                            className="text-sm mb-1"
                            style={{ color: `rgb(${theme.accent})` }}
                          >
                            Total Sets
                          </div>
                          <div className="text-white font-bold text-2xl">{s.totalSets}</div>
                        </div>
                        <div>
                          <div 
                            className="text-sm mb-1"
                            style={{ color: `rgb(${theme.accent})` }}
                          >
                            Total Reps
                          </div>
                          <div className="text-white font-bold text-2xl">{s.totalReps}</div>
                        </div>
                        <div>
                          <div 
                            className="text-sm mb-1"
                            style={{ color: `rgb(${theme.accent})` }}
                          >
                            Max Weight
                          </div>
                          <div className="text-white font-bold text-2xl">
                            {s.maxWeight > 0 ? `${s.maxWeight}` : "-"}
                            {s.maxWeight > 0 && <span className="text-sm font-normal"> lbs</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {view === "profile" && (
          <div className="space-y-6">
            <div 
              className="rounded-3xl p-6 md:p-8 shadow-xl border"
              style={{
                backgroundColor: `rgba(${theme.surface}, 0.4)`,
                borderColor: `rgba(${theme.primary}, 0.2)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <User 
                    className="w-7 h-7"
                    style={{ color: `rgb(${theme.accent})` }}
                  />
                  Personal Information
                </h2>
                <button
                  onClick={() => {
                    if (editingProfile) {
                      saveProfile();
                    } else {
                      setEditingProfile(true);
                    }
                  }}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {editingProfile ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <Edit2 className="w-6 h-6 text-white/70" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none disabled:opacity-50 text-base"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none disabled:opacity-50 text-base"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Height (inches)</label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none disabled:opacity-50 text-base"
                    placeholder="e.g., 70"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Current Weight (lbs)</label>
                  <input
                    type="number"
                    value={profile.currentWeight}
                    onChange={(e) => setProfile({ ...profile, currentWeight: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none disabled:opacity-50 text-base"
                    placeholder="Enter current weight"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Goal Weight (lbs)</label>
                  <input
                    type="number"
                    value={profile.goalWeight}
                    onChange={(e) => setProfile({ ...profile, goalWeight: e.target.value })}
                    disabled={!editingProfile}
                    className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none disabled:opacity-50 text-base"
                    placeholder="Enter goal weight"
                  />
                </div>

                {profile.currentWeight && profile.goalWeight && (
                  <div 
                    className="md:col-span-2 rounded-2xl p-6"
                    style={{
                      backgroundColor: `rgba(${theme.primary}, 0.1)`,
                      borderColor: `rgba(${theme.primary}, 0.3)`,
                    }}
                  >
                    <div className="text-white/70 text-sm mb-2">Progress to Goal</div>
                    <div className="text-white font-bold text-3xl">
                      {Math.abs(parseFloat(profile.currentWeight) - parseFloat(profile.goalWeight)).toFixed(1)} lbs
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {parseFloat(profile.currentWeight) > parseFloat(profile.goalWeight) ? "to lose" : "to gain"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div 
              className="rounded-3xl p-6 md:p-8 shadow-xl border"
              style={{
                backgroundColor: `rgba(${theme.surface}, 0.4)`,
                borderColor: `rgba(${theme.primary}, 0.2)`,
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp 
                  className="w-7 h-7"
                  style={{ color: `rgb(${theme.accent})` }}
                />
                Weight Progress
              </h2>

              <div 
                className="rounded-2xl p-6 mb-6"
                style={{
                  backgroundColor: `rgba(${theme.surface}, 0.6)`,
                }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Log Weight</h3>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newWeightEntry.weight}
                    onChange={(e) => setNewWeightEntry({ ...newWeightEntry, weight: e.target.value })}
                    className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none text-base"
                    placeholder="Weight (lbs)"
                  />
                  <input
                    type="date"
                    value={newWeightEntry.date}
                    onChange={(e) => setNewWeightEntry({ ...newWeightEntry, date: e.target.value })}
                    className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none text-base"
                  />
                  <button
                    onClick={addWeightEntry}
                    disabled={!newWeightEntry.weight || !newWeightEntry.date}
                    className="px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: newWeightEntry.weight && newWeightEntry.date
                        ? `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`
                        : `rgba(${theme.surface}, 0.6)`,
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {weightHistory.length > 0 ? (
                <>
                  <div 
                    className="rounded-2xl p-6 mb-6"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.6)`,
                    }}
                  >
                    <div className="relative h-64">
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-white/60 text-xs pr-2">
                        {(() => {
                          const weights = weightHistory.map(w => w.weight);
                          const maxWeight = Math.max(...weights);
                          const minWeight = Math.min(...weights);
                          const range = maxWeight - minWeight;
                          const step = range / 4;
                          
                          return [maxWeight, maxWeight - step, maxWeight - 2*step, maxWeight - 3*step, minWeight].map((w, i) => (
                            <div key={i}>{Math.round(w)}</div>
                          ));
                        })()}
                      </div>
                      
                      <div className="ml-10 h-full relative">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          {[0, 25, 50, 75, 100].map(y => (
                            <line
                              key={y}
                              x1="0"
                              y1={`${y}%`}
                              x2="100%"
                              y2={`${y}%`}
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth="1"
                            />
                          ))}
                          
                          {/* Line chart */}
                          {weightHistory.length > 1 && (
                            <polyline
                              points={weightHistory.map((entry, i) => {
                                const weights = weightHistory.map(w => w.weight);
                                const maxWeight = Math.max(...weights);
                                const minWeight = Math.min(...weights);
                                const range = maxWeight - minWeight || 1;
                                
                                const x = (i / (weightHistory.length - 1)) * 100;
                                const y = 100 - ((entry.weight - minWeight) / range) * 100;
                                
                                return `${x},${y}`;
                              }).join(' ')}
                              fill="none"
                              stroke={`rgb(${theme.primary})`}
                              strokeWidth="3"
                            />
                          )}
                          
                          {weightHistory.map((entry, i) => {
                            const weights = weightHistory.map(w => w.weight);
                            const maxWeight = Math.max(...weights);
                            const minWeight = Math.min(...weights);
                            const range = maxWeight - minWeight || 1;
                            
                            const x = (i / Math.max(weightHistory.length - 1, 1)) * 100;
                            const y = 100 - ((entry.weight - minWeight) / range) * 100;
                            
                            return (
                              <circle
                                key={i}
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="4"
                                fill={`rgb(${theme.accent})`}
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 ml-10 text-white/60 text-xs">
                      <span>{new Date(weightHistory[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      {weightHistory.length > 1 && (
                        <span>{new Date(weightHistory[weightHistory.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </div>

                  <div 
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: `rgba(${theme.surface}, 0.6)`,
                    }}
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Weight History</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[...weightHistory].reverse().map((entry) => (
                        <div
                          key={entry.timestamp}
                          className="flex justify-between items-center p-3 rounded-lg"
                          style={{
                            backgroundColor: `rgba(${theme.background}, 0.6)`,
                          }}
                        >
                          <div>
                            <div className="text-white font-bold text-lg">{entry.weight} lbs</div>
                            <div className="text-white/60 text-sm">
                              {new Date(entry.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteWeightEntry(entry.timestamp)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp 
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: `rgb(${theme.primary})` }}
                  />
                  <p className="text-white/70 text-base">No weight entries yet.</p>
                  <p className="text-white/60 text-sm mt-2">Start tracking your progress above!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "presets" && (
          <div 
            className="rounded-3xl p-6 md:p-8 shadow-xl border"
            style={{
              backgroundColor: `rgba(${theme.surface}, 0.4)`,
              borderColor: `rgba(${theme.primary}, 0.2)`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Calendar 
                  className="w-7 h-7"
                  style={{ color: `rgb(${theme.accent})` }}
                />
                Workout Templates
              </h2>
              <button
                onClick={() => setShowPresetSelector(true)}
                className="px-5 py-3 rounded-xl font-bold text-base text-white shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, rgb(${theme.primary}), rgb(${theme.secondary}))`,
                }}
              >
                Change Preset
              </button>
            </div>

            {selectedPreset && (
              <div 
                className="rounded-2xl p-6 mb-6 border"
                style={{
                  backgroundColor: `rgba(${theme.primary}, 0.1)`,
                  borderColor: `rgba(${theme.primary}, 0.3)`,
                }}
              >
                <div className="text-white/70 text-base mb-2">Current Preset</div>
                <div className="text-white font-bold text-2xl mb-2">
                  {WORKOUT_PRESETS[selectedPreset]?.name}
                </div>
                <div className="text-white/60 text-base">
                  {WORKOUT_PRESETS[selectedPreset]?.description}
                </div>
              </div>
            )}

            <div>
              <div className="space-y-4">
                {Object.entries(presetWorkouts).map(([workoutName, exercises]) => {
                  if (workoutName === "Rest" || !exercises || exercises.length === 0) return null;
                  
                  return (
                    <div
                      key={workoutName}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: `rgba(${theme.surface}, 0.6)`,
                      }}
                    >
                      <div
                        className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => toggleDayExpanded(workoutName)}
                      >
                        <div>
                          <div className="font-bold text-white text-xl">{workoutName}</div>
                          <div 
                            className="text-base mt-1"
                            style={{ color: `rgb(${theme.accent})` }}
                          >
                            {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (editingPreset === workoutName) {
                                savePresetEdit();
                              } else {
                                startEditingPreset(workoutName);
                              }
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {editingPreset === workoutName ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Edit2 className="w-5 h-5 text-white/70" />
                            )}
                          </button>
                          {expandedDays[workoutName] ? (
                            <ChevronUp className="w-6 h-6 text-white/70" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-white/70" />
                          )}
                        </div>
                      </div>
                      {expandedDays[workoutName] && (
                        <div className="px-5 pb-5 space-y-3 border-t"
                          style={{ borderColor: `rgba(${theme.primary}, 0.2)` }}
                        >
                          {exercises.map((ex, i) => (
                            <div 
                              key={i}
                              className="p-4 rounded-lg mt-3"
                              style={{
                                backgroundColor: `rgba(${theme.background}, 0.6)`,
                              }}
                            >
                              {editingPreset === workoutName ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={ex.name}
                                    onChange={(e) => updatePresetExercise(workoutName, i, "name", e.target.value)}
                                    className="w-full bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                                    placeholder="Exercise name"
                                  />
                                  <div className="grid grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      value={ex.sets}
                                      onChange={(e) => updatePresetExercise(workoutName, i, "sets", e.target.value)}
                                      className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                                      placeholder="Sets"
                                    />
                                    <input
                                      type="text"
                                      value={ex.reps}
                                      onChange={(e) => updatePresetExercise(workoutName, i, "reps", e.target.value)}
                                      className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                                      placeholder="Reps"
                                    />
                                    <input
                                      type="text"
                                      value={ex.weight}
                                      onChange={(e) => updatePresetExercise(workoutName, i, "weight", e.target.value)}
                                      className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-white/40 focus:outline-none"
                                      placeholder="Weight"
                                    />
                                  </div>
                                  <button
                                    onClick={() => deletePresetExercise(workoutName, i)}
                                    className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm font-semibold transition-colors"
                                  >
                                    Delete Exercise
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="font-semibold text-white text-base">{ex.name}</div>
                                  <div 
                                    className="text-base mt-1"
                                    style={{ color: `rgb(${theme.accent})` }}
                                  >
                                    {ex.sets} sets × {ex.reps} reps
                                    {ex.weight && ` @ ${ex.weight} lbs`}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                          {editingPreset === workoutName && (
                            <button
                              onClick={() => addPresetExercise(workoutName)}
                              className="w-full py-3 mt-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                              <Plus className="w-5 h-5" />
                              Add Exercise
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-50"
        style={{
          backgroundColor: `rgba(${theme.surface}, 0.95)`,
          borderColor: `rgba(${theme.primary}, 0.2)`,
        }}
      >
        <div className="grid grid-cols-6 gap-1 p-2">
          {[
            { id: "home", icon: Home },
            { id: "log", icon: Dumbbell },
            { id: "presets", icon: Calendar },
            { id: "history", icon: History },
            { id: "stats", icon: Trophy },
            { id: "profile", icon: User },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center justify-center py-2 rounded-xl transition-all"
              style={{
                background: view === item.id
                  ? `linear-gradient(135deg, rgba(${theme.primary}, 0.3), rgba(${theme.secondary}, 0.2))`
                  : "transparent",
              }}
            >
              <item.icon 
                className="w-6 h-6"
                style={{
                  color: view === item.id ? `rgb(${theme.accent})` : "rgba(255, 255, 255, 0.5)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}