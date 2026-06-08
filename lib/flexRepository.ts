import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { AppState, BodyStatEntry, LocalImportPayload, NutritionEntry } from "./appState";
import { WORKOUT_DAYS } from "./workoutData";

const PROFILE_ID = "default";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const INITIAL_STATS: BodyStatEntry[] = [
  { date: "2026-06-05", weight: 104.8, bodyFat: 43.0 },
];
type WorkoutDayWithExercises = Prisma.WorkoutDayGetPayload<{
  include: {
    exercises: true;
  };
}>;

function assertDate(date: unknown): string {
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    throw new Error("Invalid date");
  }
  return date;
}

function assertFiniteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

function assertPositiveInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function validDateFromUnknown(date: string): boolean {
  return DATE_RE.test(date);
}

function getCurrentDateKey(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function ensureDefaultProfile() {
  await prisma.profile.upsert({
    where: { id: PROFILE_ID },
    update: {},
    create: { id: PROFILE_ID },
  });
}

export async function seedWorkoutCatalog() {
  await ensureDefaultProfile();

  await prisma.$transaction(async (tx) => {
    for (const day of WORKOUT_DAYS) {
      const savedDay = await tx.workoutDay.upsert({
        where: { dayNum: day.dayNum },
        update: {
          name: day.name,
          color: day.color,
          icon: day.icon,
        },
        create: {
          dayNum: day.dayNum,
          name: day.name,
          color: day.color,
          icon: day.icon,
        },
      });

      for (const [index, exercise] of day.exercises.entries()) {
        await tx.exercise.upsert({
          where: { id: exercise.id },
          update: {
            dayId: savedDay.id,
            order: index,
            name: exercise.name,
            sets: String(exercise.sets),
            reps: exercise.reps,
            muscle: exercise.muscle,
            equip: exercise.equip,
            note: exercise.note,
            cues: exercise.cues,
            yt: exercise.yt,
            leftArmExercise: Boolean(exercise.LEFT_ARM_EXERCISE),
          },
          create: {
            id: exercise.id,
            dayId: savedDay.id,
            order: index,
            name: exercise.name,
            sets: String(exercise.sets),
            reps: exercise.reps,
            muscle: exercise.muscle,
            equip: exercise.equip,
            note: exercise.note,
            cues: exercise.cues,
            yt: exercise.yt,
            leftArmExercise: Boolean(exercise.LEFT_ARM_EXERCISE),
          },
        });
      }
    }

    for (const stat of INITIAL_STATS) {
      await tx.bodyStat.upsert({
        where: {
          profileId_date: {
            profileId: PROFILE_ID,
            date: stat.date,
          },
        },
        update: {},
        create: {
          profileId: PROFILE_ID,
          date: stat.date,
          weight: stat.weight,
          bodyFat: stat.bodyFat,
        },
      });
    }

    const stepCount = await tx.stepLog.count({ where: { profileId: PROFILE_ID } });
    if (stepCount === 0) {
      const steps = [
        { offset: -4, steps: 7800 },
        { offset: -3, steps: 11100 },
        { offset: -2, steps: 9200 },
        { offset: -1, steps: 10450 },
        { offset: 0, steps: 6820 },
      ];

      for (const entry of steps) {
        await tx.stepLog.upsert({
          where: {
            profileId_date: {
              profileId: PROFILE_ID,
              date: getCurrentDateKey(entry.offset),
            },
          },
          update: {},
          create: {
            profileId: PROFILE_ID,
            date: getCurrentDateKey(entry.offset),
            steps: entry.steps,
          },
        });
      }
    }
  });
}

async function ensureSeedData() {
  await ensureDefaultProfile();
  const dayCount = await prisma.workoutDay.count();
  if (dayCount === 0) {
    await seedWorkoutCatalog();
  }
}

function mapWorkoutDays(days: WorkoutDayWithExercises[]) {
  return days.map((day) => ({
    dayNum: day.dayNum,
    name: day.name,
    color: day.color,
    icon: day.icon,
    exercises: day.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      sets: Number.isNaN(Number(exercise.sets)) ? exercise.sets : Number(exercise.sets),
      reps: exercise.reps,
      muscle: exercise.muscle,
      equip: exercise.equip,
      note: exercise.note,
      cues: exercise.cues,
      yt: exercise.yt,
      LEFT_ARM_EXERCISE: exercise.leftArmExercise || undefined,
    })),
  }));
}

function groupWorkoutLogs(logs: Array<{ date: string; exerciseId: string }>) {
  return logs.reduce<Record<string, Record<string, boolean>>>((acc, log) => {
    acc[log.date] = acc[log.date] || {};
    acc[log.date][log.exerciseId] = true;
    return acc;
  }, {});
}

function groupNutritionLogs(logs: Array<{ id: string; date: string; source: string; grams: number; time: Date }>) {
  return logs.reduce<Record<string, NutritionEntry[]>>((acc, log) => {
    acc[log.date] = acc[log.date] || [];
    acc[log.date].push({
      id: log.id,
      source: log.source,
      grams: log.grams,
      time: log.time.toISOString(),
    });
    return acc;
  }, {});
}

function mapStepLogs(logs: Array<{ date: string; steps: number }>) {
  return logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.date] = log.steps;
    return acc;
  }, {});
}

export async function getAppState(): Promise<AppState> {
  await ensureSeedData();

  const [profile, workoutDays, bodyStats, workoutCompletions, nutritionLogs, stepLogs] = await Promise.all([
    prisma.profile.findUniqueOrThrow({ where: { id: PROFILE_ID } }),
    prisma.workoutDay.findMany({
      orderBy: { dayNum: "asc" },
      include: {
        exercises: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.bodyStat.findMany({
      where: { profileId: PROFILE_ID },
      orderBy: { date: "asc" },
      take: 500,
    }),
    prisma.workoutCompletion.findMany({
      where: { profileId: PROFILE_ID },
      orderBy: { date: "asc" },
      take: 5000,
    }),
    prisma.nutritionLog.findMany({
      where: { profileId: PROFILE_ID },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 5000,
    }),
    prisma.stepLog.findMany({
      where: { profileId: PROFILE_ID },
      orderBy: { date: "asc" },
      take: 500,
    }),
  ]);

  return {
    workoutDays: mapWorkoutDays(workoutDays),
    bodyStats: bodyStats.map((stat) => ({
      date: stat.date,
      weight: stat.weight,
      bodyFat: stat.bodyFat,
    })),
    workoutLogs: groupWorkoutLogs(workoutCompletions),
    nutritionLogs: groupNutritionLogs(nutritionLogs),
    stepLogs: mapStepLogs(stepLogs),
    visceralFatLevel: profile.visceralFatLevel,
  };
}

export async function upsertBodyStat(input: { date: unknown; weight: unknown; bodyFat: unknown }) {
  await ensureDefaultProfile();
  const date = assertDate(input.date);
  const weight = assertFiniteNumber(input.weight, "weight");
  const bodyFat = assertFiniteNumber(input.bodyFat, "bodyFat");

  await prisma.bodyStat.upsert({
    where: {
      profileId_date: {
        profileId: PROFILE_ID,
        date,
      },
    },
    update: { weight, bodyFat },
    create: { profileId: PROFILE_ID, date, weight, bodyFat },
  });

  return getAppState();
}

export async function toggleWorkoutCompletion(input: { date: unknown; exerciseId: unknown }) {
  await ensureSeedData();
  const date = assertDate(input.date);
  if (typeof input.exerciseId !== "string" || input.exerciseId.length === 0) {
    throw new Error("Invalid exerciseId");
  }

  const existing = await prisma.workoutCompletion.findUnique({
    where: {
      profileId_date_exerciseId: {
        profileId: PROFILE_ID,
        date,
        exerciseId: input.exerciseId,
      },
    },
  });

  if (existing) {
    await prisma.workoutCompletion.delete({ where: { id: existing.id } });
  } else {
    await prisma.workoutCompletion.create({
      data: {
        profileId: PROFILE_ID,
        date,
        exerciseId: input.exerciseId,
      },
    });
  }

  return getAppState();
}

export async function addNutritionLog(input: { date: unknown; source: unknown; grams: unknown }) {
  await ensureDefaultProfile();
  const date = assertDate(input.date);
  if (typeof input.source !== "string" || input.source.trim().length === 0 || input.source.length > 120) {
    throw new Error("Invalid source");
  }
  const grams = assertPositiveInteger(input.grams, "grams");

  await prisma.nutritionLog.create({
    data: {
      profileId: PROFILE_ID,
      date,
      source: input.source.trim(),
      grams,
      time: new Date(),
    },
  });

  return getAppState();
}

export async function deleteNutritionLog(input: { id: unknown }) {
  await ensureDefaultProfile();
  if (typeof input.id !== "string" || input.id.length === 0) {
    throw new Error("Invalid nutrition log id");
  }

  await prisma.nutritionLog.deleteMany({
    where: {
      id: input.id,
      profileId: PROFILE_ID,
    },
  });

  return getAppState();
}

export async function setSteps(input: { date: unknown; steps: unknown }) {
  await ensureDefaultProfile();
  const date = assertDate(input.date);
  const steps = assertPositiveInteger(input.steps, "steps");

  await prisma.stepLog.upsert({
    where: {
      profileId_date: {
        profileId: PROFILE_ID,
        date,
      },
    },
    update: { steps },
    create: { profileId: PROFILE_ID, date, steps },
  });

  return getAppState();
}

export async function setVisceralFatLevel(input: { level: unknown }) {
  await ensureDefaultProfile();
  const level = assertPositiveInteger(input.level, "level");
  if (level < 1 || level > 50) {
    throw new Error("Invalid visceral fat level");
  }

  await prisma.profile.update({
    where: { id: PROFILE_ID },
    data: { visceralFatLevel: level },
  });

  return getAppState();
}

export async function importLocalData(payload: LocalImportPayload) {
  await ensureSeedData();
  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: PROFILE_ID } });
  if (profile.localStorageImportedAt) {
    return getAppState();
  }

  const stats = Array.isArray(payload.stats) ? payload.stats : [];
  const workoutLogs = asRecord(payload.logs);
  const nutritionLogs = asRecord(payload.nutrition);
  const stepLogs = asRecord(payload.steps);
  const visceral = typeof payload.visceral === "number" && Number.isFinite(payload.visceral) ? payload.visceral : null;

  await prisma.$transaction(async (tx) => {
    for (const item of stats) {
      const stat = asRecord(item);
      if (typeof stat.date === "string" && validDateFromUnknown(stat.date) && typeof stat.weight === "number" && typeof stat.bodyFat === "number") {
        await tx.bodyStat.upsert({
          where: {
            profileId_date: {
              profileId: PROFILE_ID,
              date: stat.date,
            },
          },
          update: {
            weight: stat.weight,
            bodyFat: stat.bodyFat,
          },
          create: {
            profileId: PROFILE_ID,
            date: stat.date,
            weight: stat.weight,
            bodyFat: stat.bodyFat,
          },
        });
      }
    }

    for (const [date, dateLogs] of Object.entries(workoutLogs)) {
      if (!validDateFromUnknown(date)) continue;
      for (const [exerciseId, completed] of Object.entries(asRecord(dateLogs))) {
        if (typeof exerciseId === "string" && completed === true) {
          await tx.workoutCompletion.upsert({
            where: {
              profileId_date_exerciseId: {
                profileId: PROFILE_ID,
                date,
                exerciseId,
              },
            },
            update: {},
            create: {
              profileId: PROFILE_ID,
              date,
              exerciseId,
            },
          }).catch((error) => {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") return null;
            throw error;
          });
        }
      }
    }

    for (const [date, logs] of Object.entries(nutritionLogs)) {
      if (!validDateFromUnknown(date) || !Array.isArray(logs)) continue;
      for (const item of logs) {
        const log = asRecord(item);
        if (typeof log.source === "string" && typeof log.grams === "number" && typeof log.time === "string") {
          const time = new Date(log.time);
          if (!Number.isNaN(time.valueOf())) {
            await tx.nutritionLog.create({
              data: {
                profileId: PROFILE_ID,
                date,
                source: log.source.slice(0, 120),
                grams: Math.max(0, Math.round(log.grams)),
                time,
              },
            });
          }
        }
      }
    }

    for (const [date, steps] of Object.entries(stepLogs)) {
      if (validDateFromUnknown(date) && typeof steps === "number") {
        await tx.stepLog.upsert({
          where: {
            profileId_date: {
              profileId: PROFILE_ID,
              date,
            },
          },
          update: { steps: Math.max(0, Math.round(steps)) },
          create: {
            profileId: PROFILE_ID,
            date,
            steps: Math.max(0, Math.round(steps)),
          },
        });
      }
    }

    await tx.profile.update({
      where: { id: PROFILE_ID },
      data: {
        visceralFatLevel: visceral ?? undefined,
        localStorageImportedAt: new Date(),
      },
    });
  });

  return getAppState();
}
