CREATE TABLE "Profile" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "visceralFatLevel" INTEGER NOT NULL DEFAULT 23,
    "localStorageImportedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutDay" (
    "id" TEXT NOT NULL,
    "dayNum" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "WorkoutDay_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sets" TEXT NOT NULL,
    "reps" TEXT NOT NULL,
    "muscle" TEXT NOT NULL,
    "equip" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "cues" TEXT[] NOT NULL,
    "yt" TEXT NOT NULL,
    "leftArmExercise" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BodyStat" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bodyFat" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyStat_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutCompletion" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutCompletion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NutritionLog" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "grams" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StepLog" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "steps" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StepLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WorkoutDay_dayNum_key" ON "WorkoutDay"("dayNum");
CREATE UNIQUE INDEX "BodyStat_profileId_date_key" ON "BodyStat"("profileId", "date");
CREATE UNIQUE INDEX "WorkoutCompletion_profileId_date_exerciseId_key" ON "WorkoutCompletion"("profileId", "date", "exerciseId");
CREATE INDEX "NutritionLog_profileId_date_idx" ON "NutritionLog"("profileId", "date");
CREATE UNIQUE INDEX "StepLog_profileId_date_key" ON "StepLog"("profileId", "date");

ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "WorkoutDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BodyStat" ADD CONSTRAINT "BodyStat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkoutCompletion" ADD CONSTRAINT "WorkoutCompletion_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkoutCompletion" ADD CONSTRAINT "WorkoutCompletion_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NutritionLog" ADD CONSTRAINT "NutritionLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StepLog" ADD CONSTRAINT "StepLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
