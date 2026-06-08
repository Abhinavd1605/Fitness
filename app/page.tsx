/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Target,
  BookOpen,
  LineChart,
  Coffee,
  Flame,
  Scale,
  Droplet,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
  ChevronDown,
  InfoIcon,
  Search,
  Check,
  Footprints
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { WORKOUT_DAYS, Exercise, DayData, getMuscleGroupEmoji } from "@/lib/workoutData";

// Initial seeds
const INITIAL_STATS = [
  { date: "2026-06-05", weight: 104.8, bodyFat: 43.0 }
];

export default function FlexApp() {
  // Navigation & UI tabs
  const [activeTab, setActiveTab] = useState<"home" | "workout" | "library" | "stats" | "nutrition">("home");
  const [isMounted, setIsMounted] = useState(false);
  
  // Storage states
  const [bodyStats, setBodyStats] = useState<Array<{ date: string; weight: number; bodyFat: number }>>([]);
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, Record<string, boolean>>>({});
  const [nutritionLogs, setNutritionLogs] = useState<Record<string, Array<{ source: string; grams: number; time: string }>>>({});
  const [stepLogs, setStepLogs] = useState<Record<string, number>>({});
  
  // Custom manual state for visceral fat (part of transformation goals)
  const [visceralFatLevel, setVisceralFatLevel] = useState(23);

  // Modal active state
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Filter & search states for Library
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryFilter, setLibraryFilter] = useState<string>("All");

  // Form input states
  const [inputWeight, setInputWeight] = useState("");
  const [inputBodyFat, setInputBodyFat] = useState("");
  const [inputSteps, setInputSteps] = useState("");
  const [customProteinSource, setCustomProteinSource] = useState("");
  const [customProteinGrams, setCustomProteinGrams] = useState("");
  const [showCustomProteinForm, setShowCustomProteinForm] = useState(false);

  // Timing helper
  const [currentDateStr, setCurrentDateStr] = useState("");

  // Setup client-side state on mount
  useEffect(() => {
    setIsMounted(true);
    document.title = "FLEX – Fitness Tracker";

    // Set today's date string in YYYY-MM-DD
    const d = new Date();
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, "0");
    const dStr = String(d.getDate()).padStart(2, "0");
    const todayStr = `${yStr}-${mStr}-${dStr}`;
    setCurrentDateStr(todayStr);

    // 1. STATS
    const savedStats = localStorage.getItem("flex:stats");
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setBodyStats(parsed);
      } catch (e) {
        setBodyStats(INITIAL_STATS);
      }
    } else {
      localStorage.setItem("flex:stats", JSON.stringify(INITIAL_STATS));
      setBodyStats(INITIAL_STATS);
    }

    // 2. WORKOUTS
    const savedLogs = localStorage.getItem("flex:logs");
    if (savedLogs) {
      try {
        setWorkoutLogs(JSON.parse(savedLogs));
      } catch (e) {}
    }

    // 3. NUTRITION
    const savedNutrition = localStorage.getItem("flex:nutrition");
    if (savedNutrition) {
      try {
        setNutritionLogs(JSON.parse(savedNutrition));
      } catch (e) {}
    }

    // 4. VISCERAL FAT
    const savedVisceral = localStorage.getItem("flex:visceral");
    if (savedVisceral) {
      setVisceralFatLevel(Number(savedVisceral));
    }

    // 5. STEPS
    const savedSteps = localStorage.getItem("flex:steps");
    if (savedSteps) {
      try {
        setStepLogs(JSON.parse(savedSteps));
      } catch (e) {}
    } else {
      // Seed some initial steps data for past days to show progress instantly
      const initialSteps: Record<string, number> = {};
      const today = new Date();
      
      // We want to construct past 7 days step counts
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const yStr = d.getFullYear();
        const mStr = String(d.getMonth() + 1).padStart(2, "0");
        const dStr = String(d.getDate()).padStart(2, "0");
        const dateKey = `${yStr}-${mStr}-${dStr}`;
        if (i === 0) {
          initialSteps[dateKey] = 6820; // today's progress so far
        } else if (i === 1) {
          initialSteps[dateKey] = 10450; // met goal
        } else if (i === 2) {
          initialSteps[dateKey] = 9200;
        } else if (i === 3) {
          initialSteps[dateKey] = 11100; // met goal
        } else if (i === 4) {
          initialSteps[dateKey] = 7800;
        } else {
          initialSteps[dateKey] = Math.floor(Math.random() * 4000) + 7000;
        }
      }
      setStepLogs(initialSteps);
      localStorage.setItem("flex:steps", JSON.stringify(initialSteps));
    }
  }, []);

  // Sync state helpers
  const saveStatsToStorage = (newStats: typeof bodyStats) => {
    setBodyStats(newStats);
    localStorage.setItem("flex:stats", JSON.stringify(newStats));
  };

  const saveStepsToStorage = (newSteps: Record<string, number>) => {
    setStepLogs(newSteps);
    localStorage.setItem("flex:steps", JSON.stringify(newSteps));
  };

  const saveWorkoutsToStorage = (newLogs: typeof workoutLogs) => {
    setWorkoutLogs(newLogs);
    localStorage.setItem("flex:logs", JSON.stringify(newLogs));
  };

  const saveNutritionToStorage = (newNutrition: typeof nutritionLogs) => {
    setNutritionLogs(newNutrition);
    localStorage.setItem("flex:nutrition", JSON.stringify(newNutrition));
  };

  const saveVisceralToStorage = (level: number) => {
    setVisceralFatLevel(level);
    localStorage.setItem("flex:visceral", String(level));
  };

  // Date and Day calculation
  const getTodayDayNum = () => {
    // 0 is Sunday, 1 is Monday... 6 is Saturday
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  };

  const todayDayNum = getTodayDayNum();
  const todayWorkoutDay: DayData = WORKOUT_DAYS.find(d => d.dayNum === todayDayNum) || WORKOUT_DAYS[6];

  // Get current week dates (Mon to Sun)
  const getWeekDates = () => {
    const today = new Date();
    const day = today.getDay(); // 0 Sunday, 1 Monday...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(monday);
      next.setDate(monday.getDate() + i);
      const y = next.getFullYear();
      const m = String(next.getMonth() + 1).padStart(2, "0");
      const d = String(next.getDate()).padStart(2, "0");
      week.push(`${y}-${m}-${d}`);
    }
    return week;
  };

  const currentWeekDatesList = getWeekDates();

  // Helper: check completion status of any date Str
  const getDateWorkoutStatus = (dateStr: string, dayIdx: number) => {
    const dayData = WORKOUT_DAYS[dayIdx];
    if (dayData.dayNum === 7) return "rest"; // Sunday Rest
    
    const dayExercises = dayData.exercises;
    if (dayExercises.length === 0) return "rest";

    const logsForDate = workoutLogs[dateStr] || {};
    const completedCount = dayExercises.filter(ex => logsForDate[ex.id]).length;
    
    if (completedCount === 0) return "not_started";
    if (completedCount === dayExercises.length) return "complete";
    return "partial";
  };

  // Streak Calculation (skip Sundays, handle today)
  const computeStreak = () => {
    if (!currentDateStr || Object.keys(workoutLogs).length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    const getDateInfo = (offsetDays: number) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - offsetDays);
      const y = targetDate.getFullYear();
      const m = String(targetDate.getMonth() + 1).padStart(2, "0");
      const d = String(targetDate.getDate()).padStart(2, "0");
      return {
        dateStr: `${y}-${m}-${d}`,
        dayOfWeek: targetDate.getDay() // 0 is Sunday, 1 is Monday...
      };
    };

    // Check today
    const todayInfo = getDateInfo(0);
    const todayLogs = workoutLogs[todayInfo.dateStr] || {};
    const todayCompletions = Object.values(todayLogs).filter(Boolean).length;

    let checkIndex = 0;
    let fallbackToYesterday = false;

    if (todayCompletions > 0) {
      if (todayInfo.dayOfWeek !== 0) { // If it's a weekday and worked out, count today
        streak = 0;
        checkIndex = 0;
      }
    } else {
      // today has 0. If it's Sunday or they simply haven't worked out yet today, see if we can trace starting from yesterday.
      const yesterdayInfo = getDateInfo(1);
      const yesterdayLogs = workoutLogs[yesterdayInfo.dateStr] || {};
      const yesterdayCompletions = Object.values(yesterdayLogs).filter(Boolean).length;
      
      if (yesterdayCompletions > 0) {
        checkIndex = 1; // Start check from yesterday
      } else {
        // Did not work out yesterday either, so streak is truly broken/zero.
        return 0;
      }
    }

    let searchOffset = checkIndex;
    const maxDays = 180; // Safeguard

    while (searchOffset < maxDays) {
      const targetDay = getDateInfo(searchOffset);
      
      if (targetDay.dayOfWeek === 0) {
        // Sunday. Skip rest day in count (doesn't break, doesn't increment).
        searchOffset++;
        continue;
      }

      const logs = workoutLogs[targetDay.dateStr] || {};
      const compCount = Object.values(logs).filter(Boolean).length;
      
      if (compCount > 0) {
        streak++;
        searchOffset++;
      } else {
        // broken
        break;
      }
    }

    return streak;
  };

  const streakCount = computeStreak();

  // Baseline metrics & logic helpers
  const getStepChartData = () => {
    const keys = Object.keys(stepLogs).sort();
    return keys.map(key => ({
      date: key,
      steps: stepLogs[key]
    }));
  };
  const stepChartData = getStepChartData();

  const sortedStatsList = [...bodyStats].sort((a, b) => a.date.localeCompare(b.date));
  const latestLoggedStat = sortedStatsList[sortedStatsList.length - 1] || { weight: 104.8, bodyFat: 43.0 };
  const currentWeight = latestLoggedStat.weight;
  const currentBodyFat = latestLoggedStat.bodyFat;

  // Weight lost calculation from baseline 104.8kg
  const weightLostVal = 104.8 - currentWeight;
  const weightLostText = weightLostVal > 0 ? `${weightLostVal.toFixed(1)} kg` : "—";

  // Toggle single exercise on/off
  const toggleExercise = (exerciseId: string) => {
    const todayStr = currentDateStr || new Date().toISOString().split("T")[0];
    const updatedDateLogs = { ...(workoutLogs[todayStr] || {}) };
    const currentStatus = !!updatedDateLogs[exerciseId];
    
    updatedDateLogs[exerciseId] = !currentStatus;
    
    const newWorkoutLogs = {
      ...workoutLogs,
      [todayStr]: updatedDateLogs
    };
    saveWorkoutsToStorage(newWorkoutLogs);
  };

  // Get completed counts for today's workout
  const todayLogsList = workoutLogs[currentDateStr] || {};
  const todayTotalExercises = todayWorkoutDay.exercises.length;
  const todayCompletedCount = todayWorkoutDay.exercises.filter(ex => todayLogsList[ex.id]).length;
  const todayCompletionPercentage = todayTotalExercises > 0 
    ? Math.round((todayCompletedCount / todayTotalExercises) * 100) 
    : 0;

  // Deduplicate exercises for Library view
  const getDeduplicatedLibrary = () => {
    const cache = new Map<string, Exercise>();
    WORKOUT_DAYS.forEach(day => {
      day.exercises.forEach(ex => {
        if (!cache.has(ex.name)) {
          cache.set(ex.name, ex);
        }
      });
    });
    return Array.from(cache.values());
  };

  const librarySourceList = getDeduplicatedLibrary();

  // Handle library filtering logic
  const filteredLibrary = librarySourceList.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
                          ex.muscle.toLowerCase().includes(librarySearch.toLowerCase());
    if (!matchesSearch) return false;

    if (libraryFilter === "All") return true;
    const m = ex.muscle.toLowerCase();
    
    if (libraryFilter === "Legs") {
      return m.includes("quad") || m.includes("hamstring") || m.includes("glute") || m.includes("hip") || m.includes("leg");
    }
    if (libraryFilter === "Core") {
      return m.includes("core") || m.includes("oblique") || m.includes("tva");
    }
    if (libraryFilter === "Push") {
      return m.includes("chest") || m.includes("shoulder") || m.includes("tricep");
    }
    if (libraryFilter === "Pull") {
      return m.includes("back") || m.includes("bicep") || m.includes("lat") || m.includes("delt") || m.includes("trap");
    }
    if (libraryFilter === "Cardio") {
      return m.includes("full body") || m.includes("cardio") || m.includes("pool");
    }
    if (libraryFilter === "Mobility") {
      return m.includes("spinal") || m.includes("hip flexor") || m.includes("recovery") || m.includes("thoracic") || m.includes("flexibility");
    }
    return true;
  });

  // Log stats submission handler
  const handleLogMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWeight || !inputBodyFat) return;
    const weightNum = parseFloat(inputWeight);
    const fatNum = parseFloat(inputBodyFat);
    if (isNaN(weightNum) || isNaN(fatNum)) return;

    const todayStr = currentDateStr || new Date().toISOString().split("T")[0];
    
    // Find if date exists and update or push
    const statsCopy = [...bodyStats];
    const existingIndex = statsCopy.findIndex(s => s.date === todayStr);
    
    if (existingIndex > -1) {
      statsCopy[existingIndex] = { date: todayStr, weight: weightNum, bodyFat: fatNum };
    } else {
      statsCopy.push({ date: todayStr, weight: weightNum, bodyFat: fatNum });
    }
    
    saveStatsToStorage(statsCopy.sort((a, b) => a.date.localeCompare(b.date)));
    setInputWeight("");
    setInputBodyFat("");
  };

  // Nutrition quick add protein logs
  const logProtein = (source: string, grams: number) => {
    const todayStr = currentDateStr || new Date().toISOString().split("T")[0];
    const todayLogs = [...(nutritionLogs[todayStr] || [])];
    
    todayLogs.push({
      source,
      grams,
      time: new Date().toISOString()
    });

    const newNutritionLogs = {
      ...nutritionLogs,
      [todayStr]: todayLogs
    };
    saveNutritionToStorage(newNutritionLogs);
  };

  // Delete individual protein entry
  const deleteProteinLog = (index: number) => {
    const todayStr = currentDateStr || new Date().toISOString().split("T")[0];
    const todayLogs = [...(nutritionLogs[todayStr] || [])];
    todayLogs.splice(index, 1);

    const newNutritionLogs = {
      ...nutritionLogs,
      [todayStr]: todayLogs
    };
    saveNutritionToStorage(newNutritionLogs);
  };

  // Calculate today's protein logged
  const todayProteinList = nutritionLogs[currentDateStr] || [];
  const todayTotalProtein = todayProteinList.reduce((acc, curr) => acc + curr.grams, 0);

  // Steps action handlers
  const logSteps = (amount: number, isDirectSet = false) => {
    const todayStr = currentDateStr || new Date().toISOString().split("T")[0];
    const currentSteps = stepLogs[todayStr] || 0;
    const newSteps = isDirectSet ? Math.max(0, amount) : Math.max(0, currentSteps + amount);
    
    const updatedSteps = {
      ...stepLogs,
      [todayStr]: newSteps
    };
    saveStepsToStorage(updatedSteps);
  };

  // Custom protein timing format helper
  const formatLogTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F5F0] overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[230px] bg-[#0E0E0E] border-r border-white/10 h-full justify-between shrink-0">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
              FLEX<span className="text-[#E2FF31] font-serif not-italic">.</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold mt-1">
              FITNESS PROTOCOL
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: "home", label: "⚡ Home" },
              { id: "workout", label: "🎯 Workout" },
              { id: "library", label: "📚 Library" },
              { id: "stats", label: "📊 Stats" },
              { id: "nutrition", label: "🥛 Nutrition" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left font-sans text-xs font-semibold py-2.5 px-4 rounded-lg transition duration-200 cursor-pointer ${
                    isActive
                      ? "border-l-2 border-[#E2FF31] bg-white/5 text-[#E2FF31]"
                      : "bg-transparent text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar InBody Score Footer card */}
        <div className="p-5 border-t border-white/10 bg-[#0A0A0A]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">InBody Score</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-[#E2FF31]/10 text-[#E2FF31] font-sans font-medium uppercase tracking-wider">CRITICAL</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-serif italic text-[#E2FF31]">46</span>
            <span className="text-xs font-sans text-white/30">/100</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded overflow-hidden mb-1.5">
            <div className="h-full bg-[#E2FF31]" style={{ width: "46%" }}></div>
          </div>
          <p className="text-[9px] text-white/40 font-medium leading-none">Target: 70+ points</p>
        </div>
      </aside>

      {/* Side Vertical Text - Artistic Flair Signature */}
      <div className="hidden md:flex w-14 border-r border-white/10 items-center justify-center shrink-0">
        <span className="rotate-180 [writing-mode:vertical-lr] text-[8.5px] uppercase tracking-[0.55em] text-white/20 whitespace-nowrap font-mono selection:bg-[#E2FF31] selection:text-black">
          FLEX // RECOV & TRANSFORMATION PROGRAM 2026
        </span>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[#0E0E0E] border-t border-white/10 flex items-center justify-around px-2 z-40" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}>
        {[
          { id: "home", label: "Home", icon: "⚡" },
          { id: "workout", label: "Workout", icon: "🎯" },
          { id: "library", label: "Library", icon: "📚" },
          { id: "stats", label: "Stats", icon: "📊" },
          { id: "nutrition", label: "Protein", icon: "🥛" }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex flex-col items-center justify-center grow py-1"
            >
              <span className={`text-lg transition-colors duration-200 ${isActive ? "opacity-100 scale-110 text-[#E2FF31]" : "opacity-40 text-white"}`}>{tab.icon}</span>
              <span className={`text-[10px] font-sans font-semibold mt-0.5 transition-all duration-200 ${isActive ? "text-[#E2FF31]" : "text-white/45"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* CORE VIEW SCREEN */}
      <main className="flex-1 overflow-hidden relative flex flex-col md:pb-0 h-full">
        {/* Page transitioning wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 h-full shadow-inner pb-24"
          >
            
            {/* TAB CONTENT: HOME */}
            {activeTab === "home" && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase mb-1">
                      <Calendar className="w-3 h-3 text-[#E2FF31]" />
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white/90 leading-tight">
                      Hey <span className="font-serif italic text-[#E2FF31]">Abhi</span>
                    </h2>
                    <p className="text-xs text-white/40 tracking-wider font-light mt-1">YOUR PERSONAL TRANSFORMATION PROTOCOL</p>
                  </div>
                  
                  {/* Streak widget */}
                  <div className="flex items-center gap-3 bg-[#121212] border border-white/10 p-3.5 rounded-xl">
                    <div className="p-2 bg-[#E2FF31]/10 rounded text-[#E2FF31]">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-black tracking-widest leading-none">CURRENT STREAK</p>
                      <p className="font-serif italic text-xl mt-1 text-[#E2FF31]">{streakCount} days</p>
                    </div>
                  </div>
                </div>

                {/* Today's Workout Hero card */}
                <div 
                  className="rounded-xl border border-white/10 p-6 relative overflow-hidden transition-all duration-300 bg-[#121212]"
                  id="todays-session-card"
                >
                  {/* Decorative thin wireframe art circle in background */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-12 w-48 h-48 border border-white/5 rounded-full flex items-center justify-center pointer-events-none z-0">
                    <div className="w-36 h-36 border border-white/5 rounded-full flex items-center justify-center">
                      <div className="w-24 h-24 border border-white/5 rounded-full"></div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#E2FF31]">
                          ACTIVE PROTOCOL
                        </span>
                        <h3 className="text-3xl font-light text-white tracking-tight mt-1 flex items-center gap-2">
                          <span className="text-2xl">{todayWorkoutDay.icon}</span> 
                          <span>{todayWorkoutDay.name}</span>
                        </h3>
                        {todayWorkoutDay.dayNum !== 7 ? (
                          <p className="text-xs text-white/50 space-x-1.5 mt-1">
                            <span>{todayWorkoutDay.exercises.length} disciplines</span> 
                            <span>·</span> 
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
                          </p>
                        ) : (
                          <p className="text-xs text-white/50 mt-1">
                            Active Regeneration Cycle
                          </p>
                        )}
                      </div>

                      {/* Display Progress percentage */}
                      {todayWorkoutDay.dayNum !== 7 && (
                        <div className="space-y-2 max-w-sm">
                          <div className="flex justify-between text-xs font-mono text-white/50">
                            <span>{todayCompletedCount} / {todayTotalExercises} checked</span>
                            <span className="text-[#E2FF31] font-bold">{todayCompletionPercentage}%</span>
                          </div>
                          {/* Progress bar below */}
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#E2FF31] transition-all duration-500 ease"
                              style={{ 
                                width: `${Math.max(1, todayCompletionPercentage)}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab("workout")}
                          className="px-6 py-3 rounded bg-[#E2FF31] text-black text-xs font-bold uppercase tracking-[0.15em] transition duration-200 active:scale-95 text-center cursor-pointer hover:bg-[#E2FF31]/90"
                        >
                          {todayCompletedCount === 0 
                            ? "Initiate Session →" 
                            : todayCompletedCount < todayTotalExercises 
                              ? "Resume Session →" 
                              : "Review Session →"
                          }
                        </button>
                      </div>
                    </div>

                    {/* Progress Ring */}
                    {todayWorkoutDay.dayNum !== 7 && (
                      <div className="flex justify-center items-center shrink-0 z-10">
                        <div className="relative w-24 h-24">
                          <svg className="w-full h-full -rotate-90">
                            {/* Track circle */}
                            <circle
                              cx="48"
                              cy="48"
                              r="38"
                              stroke="rgba(255, 255, 255, 0.05)"
                              strokeWidth="5"
                              fill="transparent"
                            />
                            {/* Animated ring progress (r=38, circ=238.76) */}
                            <circle
                              cx="48"
                              cy="48"
                              r="38"
                              stroke="#E2FF31"
                              strokeWidth="5"
                              fill="transparent"
                              strokeDasharray="238.76"
                              strokeDashoffset={238.76 - (238.76 * todayCompletionPercentage) / 100}
                              strokeLinecap="round"
                              className="transition-all duration-700 ease"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-lg font-serif italic text-white leading-none">
                              {todayCompletionPercentage}%
                            </span>
                            <span className="text-[8px] uppercase font-bold text-white/40 tracking-wider mt-0.5">COMPL.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Four Stats mini-cards */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
                  
                  {/* Streak Card */}
                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[105px] relative overflow-hidden">
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/40">Streak</p>
                    <div className="flex items-baseline gap-1 mt-auto">
                      <span className={`text-2xl md:text-3xl font-serif italic ${(streakCount > 0) ? 'text-[#E2FF31]' : 'text-white/40'}`}>
                        {streakCount > 0 ? `${streakCount}d` : "0d"}
                      </span>
                    </div>
                  </div>

                  {/* Weight Lost Card */}
                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[105px] relative overflow-hidden">
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/40">WEIGHT LOSS</p>
                    <div className="flex items-baseline gap-1 mt-auto">
                      <span className="text-2xl md:text-3xl font-serif italic text-[#E2FF31]">
                        {weightLostText}
                      </span>
                    </div>
                  </div>

                  {/* Body Fat Card */}
                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[105px] relative overflow-hidden">
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/40">BODY FAT %</p>
                    <div className="flex items-baseline gap-1 mt-auto">
                      <span className="text-2xl md:text-3xl font-serif italic text-white/80">
                        {currentBodyFat.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Daily Steps Card */}
                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[105px] relative overflow-hidden">
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#E2FF31] flex items-center gap-1.5 font-sans leading-none">
                      <Footprints className="w-3 h-3 text-[#E2FF31]" />
                      <span>STEPS TODAY</span>
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-auto">
                      <span className="text-2xl md:text-3xl font-serif italic text-white">
                        {(stepLogs[currentDateStr] || 0).toLocaleString()}
                      </span>
                      <span className="text-[8px] text-white/30 font-mono">/ 10K</span>
                    </div>
                  </div>

                </div>

                {/* INTERACTIVE STEPS ADDITION PROTOCOL - MOBILITY TRACKER */}
                <div className="bg-[#121212] border border-white/10 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Footprints className="w-4 h-4 text-[#E2FF31]" />
                      <h4 className="text-[10px] uppercase font-bold tracking-[0.25em] text-white">
                        PHYSICAL MOBILITY CONTROLLER
                      </h4>
                    </div>
                    <span className="text-[9px] text-[#E2FF31] font-mono tracking-wider font-light uppercase">
                      Daily Goal: 10,000 Steps
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    
                    {/* Left: Quick status check */}
                    <div className="space-y-2 bg-[#1A1A1A] p-4 rounded-lg border border-white/5 flex flex-col justify-center h-24">
                      <p className="text-[9px] text-white/40 uppercase font-mono tracking-wider leading-none">TODAY'S DISCIPLINE</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif italic text-[#E2FF31]">
                          {(stepLogs[currentDateStr] || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-white/30 uppercase font-mono">Steps</span>
                      </div>
                      
                      {/* Mini progress check */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] text-white/40 leading-none">
                          <span>Progress rate</span>
                          <span>{Math.min(100, Math.round(((stepLogs[currentDateStr] || 0) / 10000) * 100))}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#E2FF31] transition-all duration-500 ease"
                            style={{ 
                              width: `${Math.min(100, Math.round(((stepLogs[currentDateStr] || 0) / 10000) * 100))}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Middle: Quick add controls */}
                    <div className="flex flex-col justify-center h-24 space-y-2">
                      <span className="text-[9px] text-white/40 uppercase font-mono tracking-wider leading-none">QUICK-ACCUMULATE DISCIPLINE</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => logSteps(1000)}
                          className="bg-[#1A1A1A] hover:bg-[#E2FF31]/15 hover:border-[#E2FF31]/40 border border-white/5 text-[10px] font-mono py-2 rounded text-white/95 active:scale-95 transition cursor-pointer"
                        >
                          +1,000
                        </button>
                        <button
                          onClick={() => logSteps(2500)}
                          className="bg-[#1A1A1A] hover:bg-[#E2FF31]/15 hover:border-[#E2FF31]/40 border border-white/5 text-[10px] font-mono py-2 rounded text-white/95 active:scale-95 transition cursor-pointer"
                        >
                          +2,500
                        </button>
                        <button
                          onClick={() => logSteps(5000)}
                          className="bg-[#1A1A1A] hover:bg-[#E2FF31]/15 hover:border-[#E2FF31]/40 border border-white/5 text-[10px] font-mono py-2 rounded text-white/95 active:scale-95 transition cursor-pointer"
                        >
                          +5,000
                        </button>
                      </div>
                    </div>

                    {/* Right: Manual input target precision */}
                    <div className="flex flex-col justify-center h-24 space-y-2">
                      <span className="text-[9px] text-white/40 uppercase font-mono tracking-wider leading-none">MANUAL OVERRIDE OR SET</span>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          placeholder="Set steps exactly..."
                          value={inputSteps}
                          onChange={(e) => setInputSteps(e.target.value)}
                          className="flex-1 bg-transparent border border-white/10 rounded py-2 px-2.5 focus:outline-none focus:border-[#E2FF31] text-white text-xs"
                        />
                        <button
                          onClick={() => {
                            const parsed = parseInt(inputSteps, 10);
                            if (!isNaN(parsed) && parsed >= 0) {
                              logSteps(parsed, true);
                              setInputSteps("");
                            }
                          }}
                          className="bg-[#E2FF31] hover:bg-[#E2FF31]/95 text-black px-3.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider active:scale-95 transition cursor-pointer shrink-0"
                        >
                          SET
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Simple Calendar Week overview grid */}
                <div className="bg-[#121212] border border-white/10 p-5 rounded-xl">
                  <h4 className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/40 mb-4">
                    WEEK PROTOCOL CONTINUUM
                  </h4>
                  <div className="grid grid-cols-7 gap-2 md:gap-3">
                    {currentWeekDatesList.map((dStr, idx) => {
                      const dayName = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][idx];
                      const isToday = dStr === currentDateStr;
                      const status = getDateWorkoutStatus(dStr, idx);
                      const dayColor = WORKOUT_DAYS[idx].color;

                      return (
                        <div key={dStr} className="flex flex-col items-center">
                          <span className="text-[9px] font-mono font-bold text-white/30 tracking-wider mb-2">{dayName}</span>
                          <div 
                            className="w-full aspect-square max-w-[42px] rounded-lg flex items-center justify-center transition-all duration-200 border"
                            style={{
                              backgroundColor: status === "rest" 
                                ? "rgba(255, 255, 255, 0.02)" 
                                : status === "not_started" 
                                  ? "#1A1A1A" 
                                  : status === "partial" 
                                    ? "rgba(226, 255, 49, 0.08)" 
                                    : "rgba(226, 255, 49, 0.18)",
                              borderColor: isToday ? "#E2FF31" : "rgba(255, 255, 255, 0.05)"
                            }}
                          >
                            {status === "rest" && <span className="text-[10px] opacity-40">😴</span>}
                            {status === "not_started" && <span className="text-[10px] text-white/20 font-bold">·</span>}
                            {status === "partial" && <span className="text-xs text-[#E2FF31]">⏳</span>}
                            {status === "complete" && <span className="text-xs text-[#E2FF31]">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transformation Goals Card */}
                <div className="bg-[#121212] border border-white/10 p-5 rounded-xl">
                  <h4 className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/40 mb-5">
                    METRIC TARGET PROFILES
                  </h4>
                  
                  <div className="space-y-5">
                    {/* Goal 1: Weight */}
                    {(() => {
                      const progress = Math.max(1, Math.min(100, ((104.8 - currentWeight) / 26.8) * 100));
                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-white/60 font-light">Body Mass</span>
                            <span className="text-[#E2FF31] font-serif italic text-sm">{currentWeight.toFixed(1)}kg → 78kg</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#E2FF31] transition-all duration-500 ease" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Goal 2: Body Fat */}
                    {(() => {
                      const progress = Math.max(1, Math.min(100, ((43.0 - currentBodyFat) / 23.0) * 100));
                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-white/60 font-light">Adipose Tissue Ratio</span>
                            <span className="text-white/80 font-serif italic text-sm">{currentBodyFat.toFixed(1)}% → &lt;20%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white/70 transition-all duration-500 ease" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Goal 3: Visceral Fat */}
                    {(() => {
                      // Visceral fat manual control
                      const progress = Math.max(1, Math.min(100, ((23 - visceralFatLevel) / 13) * 100));
                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="text-white/60 font-light">Visceral Adiposity</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#E2FF31] font-serif italic text-sm">Level {visceralFatLevel} → Level &lt;10</span>
                              {/* manual adjust buttons */}
                              <div className="flex items-center gap-0.5 bg-white/5 rounded-lg border border-white/10 p-0.5 ml-2">
                                <button 
                                  onClick={() => saveVisceralToStorage(Math.max(10, visceralFatLevel - 1))}
                                  className="w-4 h-4 text-[9px] bg-white/5 hover:bg-white/10 border border-white/5 rounded text-white cursor-pointer select-none active:scale-95 flex items-center justify-center font-bold"
                                  title="Decrease"
                                >
                                  -
                                </button>
                                <button 
                                  onClick={() => saveVisceralToStorage(Math.min(23, visceralFatLevel + 1))}
                                  className="w-4 h-4 text-[9px] bg-white/5 hover:bg-white/10 border border-white/5 rounded text-white cursor-pointer select-none active:scale-95 flex items-center justify-center font-bold"
                                  title="Increase"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#E2FF31] transition-all duration-500 ease" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: TODAY'S WORKOUT */}
            {activeTab === "workout" && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em]">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
                    </span>
                    <h2 className="text-3xl font-light text-white tracking-tight flex items-center gap-2 mt-1">
                      <span>{todayWorkoutDay.icon}</span>
                      <span>{todayWorkoutDay.name}</span>
                    </h2>
                  </div>
                </div>

                {/* Progress tracker box */}
                {todayWorkoutDay.dayNum !== 7 && (
                  <div className="bg-[#121212] border border-white/10 p-5 rounded-xl flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-xs font-mono text-white/50">
                        <span>Current Session Completion</span>
                        <span className="text-[#E2FF31] font-bold">{todayCompletedCount}/{todayTotalExercises} Done</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#E2FF31] transition-all duration-500 ease" 
                          style={{ 
                            width: `${Math.max(1, todayCompletionPercentage)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ASYMMETRY BANNER */}
                {todayWorkoutDay.dayNum !== 7 && todayWorkoutDay.exercises.some(ex => ex.LEFT_ARM_EXERCISE) && (
                  <div className="bg-yellow-500/5 border border-yellow-500/10 text-[#E2FF31] p-4 rounded-xl flex items-start gap-3.5">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E2FF31]">Asymmetrical Offset Program</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">Initiate ALL arm loads with your LEFT arm first to correct the 6% bilateral asymmetry from InBody analysis.</p>
                    </div>
                  </div>
                )}

                {/* SUNDAY REST DAY */}
                {todayWorkoutDay.dayNum === 7 && (
                  <div className="text-center py-12 px-6 bg-[#121212] border border-white/10 rounded-xl space-y-6">
                    <div className="text-5xl">🔋</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif italic text-white">Regenerative Cycle</h3>
                      <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed uppercase tracking-wider font-mono">
                        DECOMPRESS SPINAL PATHWAYS · STIMULATE POSTURAL EQUILIBRIUM
                      </p>
                    </div>

                    <div className="max-w-md mx-auto bg-[#1A1A1A] rounded-xl border border-white/5 p-5 text-left space-y-3">
                      <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em]">CYCLE MILESTONES</span>
                      <ul className="space-y-3.5 text-xs text-white/70">
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#E2FF31] font-bold">✓</span> Foam roll thoracic spine (T4–T8 segment focus)
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#E2FF31] font-bold">✓</span> Establish outdoor low-intensity walk (8,000+ steps)
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#E2FF31] font-bold">✓</span> Prioritize slow-wave sleep (7.5–9 hours target)
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#E2FF31] font-bold">✓</span> Consolidate amino profiles (140g+ macro protein baseline)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* WORKOUT DAY EXERCISE LIST */}
                {todayWorkoutDay.dayNum !== 7 && (
                  <div className="space-y-3">
                    {todayWorkoutDay.exercises.map((ex) => {
                      const isCompleted = !!todayLogsList[ex.id];

                      return (
                        <div 
                          key={ex.id}
                          className={`flex items-center justify-between border rounded-xl p-4 transition-all duration-200 ${
                            isCompleted 
                              ? "bg-[#E2FF31]/5 border-[#E2FF31]/20 opacity-90" 
                              : "bg-[#121212] border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Muscle Group Icon badge */}
                            <div 
                              className="w-10 h-10 rounded overflow-hidden flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: isCompleted ? "rgba(226, 255, 49, 0.1)" : "rgba(255, 255, 255, 0.03)"
                              }}
                            >
                              <span className="text-lg">{getMuscleGroupEmoji(ex.muscle)}</span>
                            </div>

                            {/* Middle Details */}
                            <div 
                              onClick={() => setSelectedExercise(ex)}
                              className="flex-1 min-w-0 cursor-pointer"
                            >
                              <h4 className={`text-sm font-semibold truncate transition-colors ${isCompleted ? "line-through text-white/30" : "text-white"}`}>
                                {ex.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5 font-sans text-xs">
                                <span className="font-bold text-[#E2FF31]">
                                  {ex.sets} sets · {ex.reps} reps
                                </span>
                                <span className="text-white/40">• {ex.equip}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Controls */}
                          <div className="flex items-center gap-2.5 shrink-0 ml-3">
                            <button
                              onClick={() => setSelectedExercise(ex)}
                              className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:border-[#E2FF31] text-white/60 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                              title="Info File"
                            >
                              <Info className="w-4 h-4" />
                            </button>

                            {/* Scale animated checkmark button */}
                            <motion.button
                              whileTap={{ scale: 0.88 }}
                              onClick={() => toggleExercise(ex.id)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base select-none cursor-pointer duration-300 transition-all ${
                                isCompleted
                                  ? "bg-[#E2FF31] text-black border border-[#E2FF31]"
                                  : "bg-white/5 border border-white/10 text-white/40 hover:border-[#E2FF31]"
                              }`}
                            >
                              <AnimatePresence mode="wait">
                                {isCompleted ? (
                                  <motion.span
                                    key="check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.25 }}
                                  >
                                    ✓
                                  </motion.span>
                                ) : (
                                  <span key="circle" className="text-xs">○</span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Complete celebration card */}
                {todayWorkoutDay.dayNum !== 7 && todayCompletedCount > 0 && todayCompletedCount === todayTotalExercises && (
                  <div className="bg-[#E2FF31]/10 border border-[#E2FF31]/20 rounded-xl p-6 text-center space-y-2 animate-pulse">
                    <div className="text-4xl">🔱</div>
                    <h4 className="text-lg font-serif italic text-[#E2FF31]">Protocol Concluded</h4>
                    <p className="text-xs text-white/50 tracking-wider">RECOVERY CYCLE AUTHORIZED. REFUEL PROTEIN MATRIX PROMPTLY.</p>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: EXERCISE LIBRARY */}
            {activeTab === "library" && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div>
                  <h2 className="text-3xl font-light text-white tracking-tight">
                    Exercise Library
                  </h2>
                  <p className="text-xs text-white/40 font-mono tracking-wider mt-1 uppercase">
                    {librarySourceList.length} disciplines programmed · Spinal extension focus
                  </p>
                </div>

                {/* Search banner */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search disciplines by name or muscle group..."
                    className="w-full bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-3 placeholder-white/20 focus:outline-none focus:border-[#E2FF31] text-xs font-light text-white transition-colors tracking-wide"
                  />
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
                  {[
                    "All",
                    "Legs",
                    "Core",
                    "Push",
                    "Pull",
                    "Cardio",
                    "Mobility"
                  ].map((filter) => {
                    const isActive = libraryFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setLibraryFilter(filter)}
                        className={`px-4 py-1.5 rounded text-xs font-mono font-medium cursor-pointer transition-colors shrink-0 ${
                          isActive
                            ? "bg-[#E2FF31] text-black border border-[#E2FF31]"
                            : "bg-transparent border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>

                {/* Exercises Grid with Hover Effects */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {filteredLibrary.map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      className="bg-[#121212] border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/20 hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Emoji box */}
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <span className="text-xl">{getMuscleGroupEmoji(ex.muscle)}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                            {ex.name}
                          </h4>
                          <span className="text-[11px] text-[#E2FF31] font-serif italic mt-1 block">
                            {ex.muscle}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-auto">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#E2FF31]/10 text-[#E2FF31]">
                          {ex.sets}s × {ex.reps}r
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/40 truncate max-w-full">
                          {ex.equip}
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredLibrary.length === 0 && (
                    <div className="col-span-full text-center py-10 bg-[#121212] border border-white/10 rounded-xl text-white/40 text-xs">
                      No programmed disciplines match your active filter.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: STATS & PROGRESS */}
            {activeTab === "stats" && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div>
                  <h2 className="text-3xl font-light text-white tracking-tight">
                    Stats & Progress
                  </h2>
                  <p className="text-xs text-white/40 font-mono tracking-wider mt-1 uppercase">
                    Bilateral metrics and transformation telemetry logs
                  </p>
                </div>

                {/* Submitting Log measurement Form Card */}
                <div className="bg-[#121212] border border-white/10 p-5 rounded-xl space-y-4">
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] block">LOG TODAY'S MEASUREMENTS</span>
                  <form onSubmit={handleLogMeasurements} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-light text-white/60">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 102.4"
                          value={inputWeight}
                          onChange={(e) => setInputWeight(e.target.value)}
                          className="w-full bg-transparent border border-white/10 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#E2FF31] text-white text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-light text-white/60">Body Fat %</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 42.1"
                          value={inputBodyFat}
                          onChange={(e) => setInputBodyFat(e.target.value)}
                          className="w-full bg-transparent border border-white/10 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#E2FF31] text-white text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#E2FF31] text-black py-3 rounded-lg font-bold text-xs uppercase tracking-[0.15em] hover:opacity-95 active:scale-[0.99] transition duration-150 cursor-pointer"
                    >
                      + Log Entry
                    </button>
                  </form>
                </div>

                {/* 2x2 statistics grids */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  
                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[115px]">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">CURRENT WEIGHT</span>
                    <p className="text-2xl font-serif italic text-[#E2FF31] mt-2">{currentWeight.toFixed(1)} kg</p>
                    <span className="text-[10px] text-white/40 mt-1.5">Baseline: 104.8 kg</span>
                  </div>

                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[115px]">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">KG TO TARGET</span>
                    <p className="text-2xl font-serif italic text-white/80 mt-2">{Math.max(0, currentWeight - 78).toFixed(1)} kg</p>
                    <span className="text-[10px] text-white/40 mt-1.5">Target: 78.0 kg</span>
                  </div>

                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[115px]">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">BODY FAT %</span>
                    <p className="text-2xl font-serif italic text-[#E2FF31] mt-2">{currentBodyFat.toFixed(1)} %</p>
                    <span className="text-[10px] text-white/40 mt-1.5">Target: &lt; 20.0%</span>
                  </div>

                  <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[115px]">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">TOTAL NET LOST</span>
                    <p className="text-2xl font-serif italic text-white mt-2">{Math.max(0, 104.8 - currentWeight).toFixed(1)} kg</p>
                    <span className="text-[10px] text-white/40 mt-1.5">Focus priority intact ✓</span>
                  </div>

                </div>

                {/* Progress charts container */}
                <div className="space-y-4">
                  
                  {/* Weight Chart */}
                  <div className="bg-[#121212] border border-white/10 p-5 rounded-xl h-[300px] flex flex-col justify-between">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">PROGRESS: BODY MASS TELEMETRY (KG)</span>
                    
                    {isMounted && bodyStats.length >= 2 ? (
                      <div className="w-full flex-1 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={bodyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E2FF31" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#E2FF31" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              stroke="rgba(255, 255, 255, 0.3)" 
                              fontSize={9} 
                              tickFormatter={(str) => str.slice(5)} 
                            />
                            <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={9} domain={["auto", "auto"]} />
                            <ChartTooltip 
                              contentStyle={{ backgroundColor: "#161616", borderColor: "rgba(255,255,255,0.15)", borderRadius: "6px", color: "#F5F5F0" }}
                              labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}
                            />
                            <Area type="monotone" dataKey="weight" stroke="#E2FF31" strokeWidth={1.5} fillOpacity={1} fill="url(#colorWeight)" dot={{ fill: "#E2FF31", r: 3.5 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex-1 flex justify-center items-center text-xs text-white/40 font-mono tracking-wider">
                        Awaiting sequential telemetry inputs to compile progress vector.
                      </div>
                    )}
                  </div>

                  {/* Body Fat Chart */}
                  <div className="bg-[#121212] border border-white/10 p-5 rounded-xl h-[300px] flex flex-col justify-between">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">PROGRESS: OUTLET ADIPOSITY RATIO (%)</span>
                    
                    {isMounted && bodyStats.length >= 2 ? (
                      <div className="w-full flex-1 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={bodyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              stroke="rgba(255, 255, 255, 0.3)" 
                              fontSize={9} 
                              tickFormatter={(str) => str.slice(5)} 
                            />
                            <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={9} domain={["auto", "auto"]} />
                            <ChartTooltip 
                              contentStyle={{ backgroundColor: "#161616", borderColor: "rgba(255,255,255,0.15)", borderRadius: "6px", color: "#F5F5F0" }}
                              labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}
                            />
                            <Area type="monotone" dataKey="bodyFat" stroke="#ffffff" strokeWidth={1.5} fillOpacity={1} fill="url(#colorFat)" dot={{ fill: "#ffffff", r: 3.5 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex-1 flex justify-center items-center text-xs text-white/40 font-mono tracking-wider">
                        Awaiting sequential telemetry inputs to compile progress vector.
                      </div>
                    )}
                  </div>

                  {/* Daily Steps Telemetry Chart */}
                  <div className="bg-[#121212] border border-white/10 p-5 rounded-xl h-[300px] flex flex-col justify-between">
                    <span className="text-[9px] text-[#E2FF31] uppercase font-bold tracking-[0.2em] flex items-center gap-1.5 font-sans leading-none">
                      <Footprints className="w-3.5 h-3.5 text-[#E2FF31]" />
                      <span>PROGRESS: DAILY MOBILITY TELEMETRY (STEPS)</span>
                    </span>
                    
                    {isMounted && stepChartData.length >= 2 ? (
                      <div className="w-full flex-1 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stepChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E2FF31" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#E2FF31" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              stroke="rgba(255, 255, 255, 0.3)" 
                              fontSize={9} 
                              tickFormatter={(str) => str.slice(5)} 
                            />
                            <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={9} domain={[0, "auto"]} />
                            <ChartTooltip 
                              contentStyle={{ backgroundColor: "#161616", borderColor: "rgba(255,255,255,0.15)", borderRadius: "6px", color: "#F5F5F0" }}
                              labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}
                            />
                            <Area type="monotone" dataKey="steps" stroke="#E2FF31" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSteps)" dot={{ fill: "#E2FF31", r: 3.5 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex-1 flex justify-center items-center text-xs text-white/40 font-mono tracking-wider">
                        Awaiting sequential mobility inputs to compile progress vector.
                      </div>
                    )}
                  </div>

                </div>

                {/* InBody Baseline Data Grid Reference card */}
                <div className="bg-[#121212] border border-white/10 p-5 rounded-xl space-y-4">
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] block">
                    INBODY BASELINE REFERENCE · June 5, 2026
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 px-1 text-xs">
                    {[
                      { label: "Weight", value: "104.8 kg", color: "#E2FF31", desc: "Baseline" },
                      { label: "SMM (Skeletal Muscle)", value: "33.7 kg", color: "#E2FF31", desc: "Under normal" },
                      { label: "Body Fat Mass", value: "45.1 kg", color: "rgba(255, 255, 255, 0.8)", desc: "Obese" },
                      { label: "Body Fat %", value: "43.0%", color: "rgba(255, 255, 255, 0.8)", desc: "Severely high" },
                      { label: "BMI", value: "33.3", color: "#E2FF31", desc: "Grade 1 Obesity" },
                      { label: "Visceral Fat", value: "Level 23", color: "rgba(255, 255, 255, 0.8)", desc: "Extremely High (risk)" },
                      { label: "Waist-Hip Ratio", value: "1.22", color: "#E2FF31", desc: "Abdominal adiposity" },
                      { label: "InBody Score", value: "46 / 100", color: "#E2FF31", desc: "Target 70+ points" },
                      { label: "BMR", value: "1,660 kcal / day", color: "rgba(255, 255, 255, 0.5)", desc: "Sustained budget" },
                      { label: "TARGET WEIGHT", value: "78 kg", color: "#E2FF31", desc: "-26.8 kg to lose" },
                      { label: "Left Arm Lean", value: "3.64 kg", color: "#E2FF31", desc: "Asymmetric (Right: 3.86 kg)" },
                      { label: "Leg Lean Mass", value: "Left: 9.13 kg · Right: 9.09 kg", color: "rgba(255, 255, 255, 0.8)", desc: "Both Under Normal" }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 h-[34px]">
                        <span className="text-white/50 text-xs font-light">{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-serif italic text-xs font-semibold" style={{ color: row.color }}>{row.value}</span>
                          <span className="text-[10px] text-white/30">({row.desc})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: NUTRITION & PROTEIN */}
            {activeTab === "nutrition" && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div>
                  <h2 className="text-3xl font-light text-white tracking-tight">
                    🥛 Daily Protein & Nutrition
                  </h2>
                  <p className="text-xs text-white/40 font-mono tracking-wider mt-1 uppercase">
                    Target parameters: 140g – 160g daily protein baseline for muscle sparing
                  </p>
                </div>

                {/* MuscleBlaze Whey Supplement Card at Top */}
                <div className="rounded-xl border border-white/10 p-5 relative overflow-hidden bg-[#121212]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] text-[#E2FF31] font-bold uppercase tracking-[0.2em] bg-[#E2FF31]/10 px-2.5 py-0.5 rounded">
                      GOLD STANDARD PROFILE
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">SUPPLEMENT DIRECTIVE</span>
                  </div>

                  <h3 className="text-xl font-light text-white tracking-tight">
                    MuscleBlaze Biozyme Whey Protein
                  </h3>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed">
                    1 scoop (30g dose) delivers <strong className="text-[#E2FF31] font-bold">25g protein</strong> · 120 kcal
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-[11px]">
                    <div className="bg-[#1A1A1A] rounded border border-white/5 p-3.5">
                      <span className="text-white/40 font-bold block mb-1 uppercase tracking-wider text-[9px] font-mono">TIMING TARGETS</span>
                      <p className="text-white/60 leading-relaxed">Post-workout: administer within 30–60 minutes of session closure for optimal delivery.</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded border border-white/5 p-3.5">
                      <span className="text-white/40 font-bold block mb-1 uppercase tracking-wider text-[9px] font-mono">CHEMISTRY TARGETS</span>
                      <p className="text-white/60 leading-relaxed">Mix strictly with cold WATER post-session for advanced rate speed of gastric absorption.</p>
                    </div>
                  </div>

                  {/* Actions scoops */}
                  <div className="flex gap-2.5 mt-5">
                    <button
                      onClick={() => logProtein("MuscleBlaze Whey (1 Scoop)", 25)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 px-4 rounded transition duration-150 select-none cursor-pointer tracking-wider uppercase border border-white/5"
                    >
                      +25g (1 scoop)
                    </button>
                    <button
                      onClick={() => logProtein("MuscleBlaze Whey (2 Scoops)", 50)}
                      className="flex-1 bg-[#E2FF31] hover:bg-[#E2FF31]/90 text-black text-xs font-bold py-3 px-4 rounded transition duration-150 select-none cursor-pointer tracking-wider uppercase"
                    >
                      +50g (2 scoops)
                    </button>
                  </div>
                </div>

                {/* Protein ring & Stats columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#121212] border border-white/10 p-5 rounded-xl">
                  
                  {/* Left: Interactive Circular progress */}
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="rgba(255, 255, 255, 0.04)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="#E2FF31"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="377"
                          strokeDashoffset={377 - (377 * Math.min(150, todayTotalProtein)) / 150}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-light text-white">{todayTotalProtein}g</span>
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.15em] mt-1">/ 150g target</span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      {todayTotalProtein >= 140 ? (
                        <p className="text-xs text-[#E2FF31] font-mono tracking-wider flex items-center justify-center gap-1 uppercase">
                          ✓ Protein Threshold Secured
                        </p>
                      ) : (
                        <p className="text-xs text-white/50 font-light">
                          Requires <span className="text-[#E2FF31] font-serif italic text-sm font-semibold">{Math.max(0, 150 - todayTotalProtein)}g</span> to secure daily profile
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: protein goals checklist */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">DAILY ACCUMULATION TARGET</span>
                      <h4 className="text-lg font-light text-white tracking-tight mt-1">Muscle Protein Sparing Phase</h4>
                      <p className="text-xs text-white/50 leading-relaxed font-light mt-1">
                        Sustained synthesis prevents structural nitrogen deficits, protecting motor-unit integrity and skeletal integrity during systemic lipids reductions.
                      </p>
                    </div>

                    {/* Weekly consistency square indicator */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] block">WEEKLY COMPLIANCE HISTOLOGY</span>
                      <div className="flex gap-1.5">
                        {currentWeekDatesList.map((dStr, idx) => {
                          const name = ["M", "T", "W", "T", "F", "S", "S"][idx];
                          // calculate total protein for that date
                          const logsForDate = nutritionLogs[dStr] || [];
                          const totalProtein = logsForDate.reduce((acc, c) => acc + c.grams, 0);
                          const isConsistent = totalProtein >= 140;

                          return (
                            <div 
                              key={dStr} 
                              className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold transition-all duration-200 border ${
                                isConsistent 
                                  ? "bg-[#E2FF31] border-[#E2FF31] text-black" 
                                  : "bg-transparent border-white/10 text-white/30"
                              }`}
                              title={`${totalProtein}g logged`}
                            >
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Quick Add buttons grid */}
                <div className="space-y-3">
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] block">QUICK COMPILING REGISTRY</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "MB Biozyme Whey", grams: 25, badge: "1 Scoop" },
                      { label: "Chicken breast", grams: 31, badge: "100g" },
                      { label: "Fresh Paneer", grams: 18, badge: "100g" },
                      { label: "Whole eggs", grams: 12, badge: "2 pieces" },
                      { label: "Lentils/Dal", grams: 9, badge: "100g cooked" },
                      { label: "Canned Tuna", grams: 26, badge: "100g" },
                      { label: "Double Scoop MB", grams: 50, badge: "2 Scoops" },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => logProtein(item.label, item.grams)}
                        className="bg-[#121212] border border-white/10 hover:border-white/20 rounded-xl p-3 text-left transition duration-150 cursor-pointer flex flex-col justify-between h-[100px] select-none hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white truncate w-full">{item.label}</p>
                          <span className="text-[9px] text-white/30 font-mono mt-0.5 block">{item.badge}</span>
                        </div>
                        <span className="text-sm font-serif italic text-[#E2FF31]">+{item.grams}g</span>
                      </button>
                    ))}

                    <button
                      onClick={() => setShowCustomProteinForm(!showCustomProteinForm)}
                      className="bg-transparent border border-dashed border-white/10 hover:border-white/20 rounded-xl p-3 text-center transition duration-150 cursor-pointer flex flex-col justify-center items-center gap-1 min-h-[100px] text-[#E2FF31] select-none hover:-translate-y-0.5 hover:bg-white/[0.01]"
                    >
                      <Plus className="w-5 h-5 text-white/30" />
                      <span className="text-[9px] font-mono uppercase tracking-[0.15em]">Custom add</span>
                    </button>
                  </div>
                </div>

                {/* Custom protein modal form inline view */}
                {showCustomProteinForm && (
                  <div className="bg-[#121212] border border-[#E2FF31]/20 p-4 rounded-xl space-y-4 animate-fadeIn">
                    <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/80">Log custom dietary peptide</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Source Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Greek Yogurt"
                          value={customProteinSource}
                          onChange={(e) => setCustomProteinSource(e.target.value)}
                          className="w-full bg-transparent border border-white/10 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-[#E2FF31] text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Grams (Protein)</label>
                        <input
                          type="number"
                          placeholder="e.g. 15"
                          value={customProteinGrams}
                          onChange={(e) => setCustomProteinGrams(e.target.value)}
                          className="w-full bg-transparent border border-white/10 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-[#E2FF31] text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!customProteinSource || !customProteinGrams) return;
                          logProtein(customProteinSource, parseInt(customProteinGrams));
                          setCustomProteinSource("");
                          setCustomProteinGrams("");
                          setShowCustomProteinForm(false);
                        }}
                        className="bg-[#E2FF31] text-black py-2 px-4 rounded text-xs font-bold uppercase font-mono tracking-wider cursor-pointer"
                      >
                        Save Entry
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomProteinForm(false);
                        }}
                        className="bg-white/5 text-white/70 py-2 px-3 rounded text-xs font-bold uppercase font-mono tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Today's logged foods */}
                <div className="bg-[#121212] border border-white/10 p-5 rounded-xl space-y-4">
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] block">TODAY'S PROTEIN INTAKE LOGS</span>
                  
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {todayProteinList.map((log, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-3 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/95 truncate">{log.source}</p>
                          <span className="text-[9px] text-white/30 font-mono">{formatLogTime(log.time)}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 ml-4 shrink-0">
                          <span className="text-sm font-serif italic text-[#E2FF31]">{log.grams}g</span>
                          <button
                            onClick={() => deleteProteinLog(index)}
                            className="text-white/40 hover:text-[#E2FF31] transition-colors cursor-pointer active:scale-95"
                            title="Delete Intake"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {todayProteinList.length === 0 && (
                      <div className="text-center py-8 text-xs text-white/30 font-light font-mono italic tracking-wide">
                        No dietary peptide source logged yet today.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* EXERCISE DETAIL MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Dark backing overlay wrap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
              className="absolute inset-0 bg-black/95 cursor-pointer"
            />

            {/* Sliding sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#121212] rounded-t-2xl border-t border-x border-white/10 max-h-[85vh] overflow-y-auto p-6 md:p-8 z-10"
            >
              
              {/* Header block */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-light text-white tracking-tight">
                    {selectedExercise.name}
                  </h3>
                  <p className="text-xs text-white/40 font-mono tracking-wider mt-1 uppercase">
                    {selectedExercise.muscle} · {selectedExercise.equip}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="bg-[#1A1A1A] border border-white/5 hover:border-white/20 text-white/60 py-1.5 px-3.5 rounded text-xs font-mono cursor-pointer transition-colors"
                >
                  ✕ CLOSE
                </button>
              </div>

              {/* Grid stat summary info circles */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">SETS TARGETED</span>
                  <p className="text-2xl font-serif italic text-[#E2FF31] mt-1.5">
                    {selectedExercise.sets}
                  </p>
                </div>
                <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">REPETITIONS</span>
                  <p className="text-2xl font-serif italic text-white mt-1.5">
                    {selectedExercise.reps}
                  </p>
                </div>
              </div>

              {/* Spinal Posture corrective alert boxes */}
              <div className="bg-white/[0.02] border border-[#E2FF31]/20 rounded-xl p-4 mb-6">
                <span className="text-[9px] text-[#E2FF31] uppercase font-bold tracking-[0.2em] block mb-1">
                  KYPHOSIS DIAGNOSTIC NOTE
                </span>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {selectedExercise.note}
                </p>
              </div>

              {/* Asymmetry Extra Instructions box */}
              {selectedExercise.LEFT_ARM_EXERCISE && (
                <div className="bg-white/[0.02] border border-[#E2FF31]/20 p-4 rounded-xl mb-6">
                  <span className="text-[9px] text-[#E2FF31] uppercase font-bold tracking-[0.2em] block mb-1">
                    💪 LEFT ARM DISCIPLINE
                  </span>
                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    Start with LEFT arm. InBody metrics: Left 3.64kg vs Right 3.86kg (6% gap). Perform 1 additional compensatory set on Left side to rebalance.
                  </p>
                </div>
              )}

              {/* Multi numbered cue highlights */}
              <div className="space-y-4 mb-8">
                <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] block">FORM PRECISION CUES</span>
                
                <div className="space-y-2.5">
                  {selectedExercise.cues.map((cue, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3.5 bg-[#1A1A1A] p-3 rounded-lg border border-white/5"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#E2FF31]/10 text-[#E2FF31] text-xs font-serif italic font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-xs text-white/70 font-light leading-relaxed">{cue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watch youtube trigger buttons */}
              <a
                href={`https://www.youtube.com/results?search_query=${selectedExercise.yt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#E2FF31] text-black py-3.5 rounded-lg font-bold text-center block text-xs tracking-wider uppercase transition-transform active:scale-[0.98] select-none hover:opacity-95"
              >
                ▶ SEARCH TUTORIAL ON YOUTUBE
              </a>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
