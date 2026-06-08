import type { DayData } from "./workoutData";

export interface BodyStatEntry {
  date: string;
  weight: number;
  bodyFat: number;
}

export interface NutritionEntry {
  id?: string;
  source: string;
  grams: number;
  time: string;
}

export interface AppState {
  workoutDays: DayData[];
  bodyStats: BodyStatEntry[];
  workoutLogs: Record<string, Record<string, boolean>>;
  nutritionLogs: Record<string, NutritionEntry[]>;
  stepLogs: Record<string, number>;
  visceralFatLevel: number;
}

export interface LocalImportPayload {
  stats?: unknown;
  logs?: unknown;
  nutrition?: unknown;
  steps?: unknown;
  visceral?: unknown;
}
