export interface Exercise {
  id: string;
  name: string;
  sets: string | number;
  reps: string;
  muscle: string;
  equip: string;
  note: string;
  cues: string[];
  yt: string;
  LEFT_ARM_EXERCISE?: boolean;
}

export interface DayData {
  dayNum: number;
  name: string;
  color: string;
  icon: string;
  exercises: Exercise[];
}

export const WORKOUT_DAYS: DayData[] = [
  {
    dayNum: 1,
    name: "Lower Body & Core",
    color: "#4B9EFF",
    icon: "🦵",
    exercises: [
      {
        id: "goblet-squat",
        name: "Goblet Squat",
        sets: 4,
        reps: "12",
        muscle: "Quads · Glutes",
        equip: "Dumbbell",
        note: "Keeps spine neutral — safer than barbell squat for kyphosis",
        cues: [
          "Hold DB at chest height",
          "Feet shoulder-width apart",
          "Sit back and down",
          "Keep chest up throughout"
        ],
        yt: "goblet+squat+proper+form+tutorial"
      },
      {
        id: "rdl",
        name: "Romanian Deadlift",
        sets: 3,
        reps: "12",
        muscle: "Hamstrings · Glutes",
        equip: "Dumbbells",
        note: "Light weight — hinge at hips NOT waist. Stop before rounding.",
        cues: [
          "Hinge at hips not waist",
          "Back stays completely flat",
          "Feel hamstring stretch",
          "Stop before any rounding"
        ],
        yt: "romanian+deadlift+dumbbell+form+tutorial"
      },
      {
        id: "leg-press",
        name: "Leg Press",
        sets: 4,
        reps: "15",
        muscle: "Quads · Glutes",
        equip: "Machine",
        note: "Safe spinal load — no barbell squats with kyphosis",
        cues: [
          "Feet hip-width on platform",
          "Lower until 90° knee angle",
          "Don't lock knees at top",
          "Push through heels"
        ],
        yt: "leg+press+machine+proper+form"
      },
      {
        id: "leg-curl",
        name: "Lying Leg Curl",
        sets: 3,
        reps: "15",
        muscle: "Hamstrings",
        equip: "Machine",
        note: "InBody flagged both legs Under — this is a priority movement",
        cues: [
          "Lie face down flat",
          "Curl heels toward glutes",
          "Control the descent fully",
          "Don't arch lower back"
        ],
        yt: "lying+leg+curl+machine+form"
      },
      {
        id: "dead-bug",
        name: "Dead Bug",
        sets: 3,
        reps: "10/side",
        muscle: "Core · TVA",
        equip: "Bodyweight",
        note: "Anti-flexion core — completely safe for Scheuermann's kyphosis",
        cues: [
          "Back flat on floor entire time",
          "Extend opposite arm and leg",
          "Don't let lower back arch",
          "Breathe out as you extend"
        ],
        yt: "dead+bug+exercise+core+anti+flexion"
      },
      {
        id: "pallof-press",
        name: "Pallof Press",
        sets: 3,
        reps: "12/side",
        muscle: "Core · Obliques",
        equip: "Cable or Band",
        note: "Anti-rotation core stability — functional strength",
        cues: [
          "Stand sideways to cable",
          "Press straight away from chest",
          "Actively resist rotation",
          "Return slow and controlled"
        ],
        yt: "pallof+press+anti+rotation+core"
      },
      {
        id: "cable-curl-asym",
        name: "Single-Arm Cable Curl (Left Focus)",
        sets: "3L × 12, 2R × 12",
        reps: "12",
        muscle: "Biceps",
        equip: "Cable Machine",
        note: "LEFT ARM 3.64kg vs RIGHT 3.86kg — 6% gap. Always start LEFT. Extra set on left only.",
        cues: [
          "Elbow pinned to side",
          "Full supination at top",
          "Do NOT swing body",
          "Start with left arm always"
        ],
        yt: "single+arm+cable+bicep+curl+form",
        LEFT_ARM_EXERCISE: true
      }
    ]
  },
  {
    dayNum: 2,
    name: "Cardio & Posture",
    color: "#00E5AA",
    icon: "🏊",
    exercises: [
      {
        id: "swimming",
        name: "Swimming",
        sets: 1,
        reps: "30–40 min",
        muscle: "Full Body",
        equip: "Pool",
        note: "BEST cardio for Scheuermann's — decompresses the thoracic spine naturally",
        cues: [
          "Backstroke or freestyle",
          "Steady sustainable pace",
          "Focus on breathing rhythm",
          "Spine decompresses naturally in water"
        ],
        yt: "swimming+freestyle+beginner+proper+technique"
      },
      {
        id: "incline-walk",
        name: "Incline Treadmill Walk",
        sets: 1,
        reps: "45 min",
        muscle: "Legs · Cardio",
        equip: "Treadmill",
        note: "Use if no pool available — strong fat burner at 5–8% incline",
        cues: [
          "Set 5–8% incline",
          "Speed 3.5–4.5 km/h",
          "Stay fully upright",
          "Do NOT hold handrails"
        ],
        yt: "incline+treadmill+walking+fat+loss+calorie+burn"
      },
      {
        id: "thoracic-roll",
        name: "Thoracic Foam Rolling",
        sets: 1,
        reps: "5 min",
        muscle: "Thoracic Spine",
        equip: "Foam Roller",
        note: "CRITICAL DAILY — do this every single morning for Scheuermann's kyphosis at T4–T8",
        cues: [
          "Roller at T4–T8 region",
          "Arms crossed on chest",
          "Extend backwards over roller",
          "Slowly move up and down spine"
        ],
        yt: "thoracic+foam+rolling+kyphosis+extension+tutorial"
      },
      {
        id: "doorway-stretch",
        name: "Doorway Chest Stretch",
        sets: 3,
        reps: "30 sec",
        muscle: "Pectorals · Anterior Shoulder",
        equip: "Doorway",
        note: "Counteracts tight pecs and forward shoulder rounding from kyphosis",
        cues: [
          "Hands at shoulder height on frame",
          "Step one foot forward",
          "Lean gently forward",
          "Feel the chest and front shoulder open"
        ],
        yt: "doorway+chest+stretch+kyphosis+posture+correction"
      },
      {
        id: "cat-cow",
        name: "Cat-Cow Stretch",
        sets: 2,
        reps: "10 reps",
        muscle: "Spinal Mobility",
        equip: "Bodyweight",
        note: "Gentle daily spinal mobilization — do every morning on waking",
        cues: [
          "On hands and knees",
          "Cat: arch back up to ceiling",
          "Cow: drop belly toward floor",
          "Flow smoothly, breathe deeply"
        ],
        yt: "cat+cow+stretch+spinal+mobility+tutorial"
      }
    ]
  },
  {
    dayNum: 3,
    name: "Upper Body Push",
    color: "#FF6B6B",
    icon: "💪",
    exercises: [
      {
        id: "incline-press",
        name: "Incline DB Press (30°)",
        sets: 4,
        reps: "12",
        muscle: "Upper Chest · Shoulders",
        equip: "Dumbbells + Bench",
        note: "30° ONLY — better posture alignment than flat bench for kyphosis",
        cues: [
          "Bench at exactly 30°",
          "Lower DBs to chest level",
          "Press up and slightly inward",
          "Elbows at 45°, never flared"
        ],
        yt: "incline+dumbbell+press+30+degree+proper+form"
      },
      {
        id: "cable-fly",
        name: "Cable Chest Fly",
        sets: 3,
        reps: "15",
        muscle: "Chest",
        equip: "Cable Machine",
        note: "Light weight — focus entirely on the stretch and squeeze",
        cues: [
          "Slight forward lean from hips",
          "Wide arc down and inward",
          "Squeeze chest hard at center",
          "Return fully controlled"
        ],
        yt: "cable+chest+fly+proper+form+tutorial"
      },
      {
        id: "shoulder-press",
        name: "Seated DB Shoulder Press",
        sets: 3,
        reps: "12",
        muscle: "Shoulders · Triceps",
        equip: "Dumbbells",
        note: "Seated reduces spinal compression vs standing",
        cues: [
          "Back supported on bench",
          "Press overhead without arching back",
          "Lower to just below ear height",
          "Core braced throughout"
        ],
        yt: "seated+dumbbell+shoulder+press+form"
      },
      {
        id: "face-pull",
        name: "Face Pull (Cable Rope)",
        sets: 4,
        reps: "15",
        muscle: "Rear Delts · Rotator Cuff",
        equip: "Cable Machine",
        note: "🔑 MOST CRITICAL exercise for kyphosis — do every single session without fail",
        cues: [
          "Rope at face height",
          "Pull to forehead level",
          "External rotate at end position",
          "Elbows MUST be above shoulder level"
        ],
        yt: "face+pull+proper+form+kyphosis+posture"
      },
      {
        id: "pull-apart",
        name: "Band Pull-Apart",
        sets: 3,
        reps: "20",
        muscle: "Rear Delts · Upper Back",
        equip: "Resistance Band",
        note: "Daily posture correction — can do anywhere, even watching TV",
        cues: [
          "Band at shoulder height",
          "Pull band apart to full stretch",
          "Squeeze shoulder blades together",
          "Return slowly with resistance"
        ],
        yt: "band+pull+apart+posture+rear+delt+exercise"
      },
      {
        id: "wall-angels",
        name: "Wall Angels",
        sets: 3,
        reps: "10",
        muscle: "Thoracic Extension · Shoulders",
        equip: "Wall",
        note: "Essential thoracic mobility drill for Scheuermann's kyphosis",
        cues: [
          "Back FLAT against wall",
          "Arms in goal post position",
          "Slide arms slowly overhead",
          "Keep back AND head on wall"
        ],
        yt: "wall+angels+exercise+kyphosis+thoracic+mobility"
      }
    ]
  },
  {
    dayNum: 4,
    name: "Active Recovery",
    color: "#FFB830",
    icon: "🧘",
    exercises: [
      {
        id: "outdoor-walk",
        name: "Outdoor Walk",
        sets: 1,
        reps: "30–45 min",
        muscle: "Full Body",
        equip: "None",
        note: "Target 8,000+ steps — visceral fat Level 23 responds strongly to daily walking",
        cues: [
          "Shoulders back and down",
          "Upright posture throughout",
          "Natural arm swing",
          "Breathe through nose when possible"
        ],
        yt: "outdoor+walking+fat+loss+visceral+fat+benefits"
      },
      {
        id: "full-stretch",
        name: "Full Body Stretching",
        sets: 1,
        reps: "20 min",
        muscle: "Full Body Flexibility",
        equip: "Mat",
        note: "Focus on hip flexors, chest, and hamstrings — all chronically tight from kyphosis",
        cues: [
          "Hold each stretch 30–45 seconds",
          "No bouncing ever",
          "Breathe deeply into each stretch",
          "Never stretch to pain"
        ],
        yt: "full+body+stretching+routine+flexibility"
      },
      {
        id: "foam-roll-full",
        name: "Full Body Foam Rolling",
        sets: 1,
        reps: "10 min",
        muscle: "Recovery",
        equip: "Foam Roller",
        note: "Roll thoracic spine, glutes, hip flexors, and IT band",
        cues: [
          "Start with thoracic spine",
          "Move to glutes and IT band",
          "Then hip flexors",
          "Slow sustained pressure on tight spots"
        ],
        yt: "full+body+foam+rolling+recovery+routine"
      }
    ]
  },
  {
    dayNum: 5,
    name: "Lower Body + Core (Progressive)",
    color: "#4B9EFF",
    icon: "🦵",
    exercises: [
      {
        id: "goblet-squat-b",
        name: "Goblet Squat (Progressive)",
        sets: 4,
        reps: "14",
        muscle: "Quads · Glutes",
        equip: "Dumbbell",
        note: "Add 2.5kg from Monday — progressive overload is the key",
        cues: [
          "Heavier DB today",
          "Same perfect neutral spine",
          "Full depth every rep",
          "2-second controlled descent"
        ],
        yt: "goblet+squat+progressive+overload"
      },
      {
        id: "rdl-b",
        name: "Romanian Deadlift (Progressive)",
        sets: 4,
        reps: "12",
        muscle: "Hamstrings · Glutes",
        equip: "Dumbbells",
        note: "Increase weight if Monday felt manageable",
        cues: [
          "Hinge at hips precisely",
          "Flat back throughout",
          "Deep hamstring stretch at bottom",
          "Squeeze glutes at the top"
        ],
        yt: "romanian+deadlift+dumbbell+form+tutorial"
      },
      {
        id: "leg-press-b",
        name: "Leg Press (Progressive)",
        sets: 4,
        reps: "15",
        muscle: "Quads · Glutes",
        equip: "Machine",
        note: "Add 5–10kg from Monday",
        cues: [
          "Same technique as Monday",
          "Slightly heavier load",
          "Full range of motion",
          "Drive through heels"
        ],
        yt: "leg+press+machine+progressive+overload"
      },
      {
        id: "hip-flexor",
        name: "Hip Flexor Stretch",
        sets: 3,
        reps: "45 sec/side",
        muscle: "Hip Flexors · Psoas",
        equip: "Bodyweight",
        note: "Hip flexors are chronically tight with kyphosis — stretch every session",
        cues: [
          "Kneeling lunge starting position",
          "Tuck pelvis slightly under",
          "Lean forward gently from hip",
          "Feel deep stretch in front of hip"
        ],
        yt: "hip-flexor-stretch-kyphosis-psoas-tight"
      },
      {
        id: "glute-bridge",
        name: "Glute Bridge",
        sets: 3,
        reps: "15",
        muscle: "Glutes · Hamstrings",
        equip: "Bodyweight",
        note: "Safe posterior chain activation — improves posture and anterior pelvic tilt",
        cues: [
          "On back with knees bent",
          "Drive hips to ceiling",
          "Squeeze glutes hard at top",
          "Hold 1 second then lower slowly"
        ],
        yt: "glute+bridge+proper+form+beginner"
      },
      {
        id: "dead-bug-b",
        name: "Dead Bug (With Pause)",
        sets: 3,
        reps: "12/side",
        muscle: "Core · TVA",
        equip: "Bodyweight",
        note: "Progression from Monday — add a 2-second pause at the bottom position",
        cues: [
          "Same setup as Monday",
          "Add 2-second hold at bottom",
          "Breathe all the way out",
          "Lower back glued to floor"
        ],
        yt: "dead+bug+exercise+progression+pause"
      }
    ]
  },
  {
    dayNum: 6,
    name: "Upper Body Pull & Back",
    color: "#A855F7",
    icon: "🏋️",
    exercises: [
      {
        id: "cable-row",
        name: "Seated Cable Row",
        sets: 4,
        reps: "12",
        muscle: "Mid Back · Biceps",
        equip: "Cable Machine",
        note: "SIT UPRIGHT — never round the back. Spine-safe back builder.",
        cues: [
          "Tall neutral spine always",
          "Pull handle to lower chest",
          "Squeeze shoulder blades at end",
          "Controlled eccentric return"
        ],
        yt: "seated+cable+row+proper+form+tutorial"
      },
      {
        id: "lat-pulldown",
        name: "Lat Pulldown (Wide Grip)",
        sets: 4,
        reps: "12",
        muscle: "Lats · Biceps",
        equip: "Cable Machine",
        note: "Significantly improves posture when performed correctly — priority pull",
        cues: [
          "Wide overhand grip",
          "Lean back only 10°",
          "Pull bar to upper chest",
          "Feel lats contracting not just arms"
        ],
        yt: "lat+pulldown+wide+grip+proper+form"
      },
      {
        id: "db-row",
        name: "Single-Arm DB Row (Supported)",
        sets: 3,
        reps: "12/side",
        muscle: "Back · Rear Delt",
        equip: "Dumbbell + Bench",
        note: "Chest on bench = fully spine safe. No free-standing bent-over rows.",
        cues: [
          "Chest supported on bench",
          "Pull elbow straight to ceiling",
          "Full stretch at the bottom",
          "Squeeze hard at top"
        ],
        yt: "single+arm+dumbbell+row+supported+form",
        LEFT_ARM_EXERCISE: true
      },
      {
        id: "rear-delt",
        name: "Rear Delt Fly (Machine)",
        sets: 3,
        reps: "15",
        muscle: "Rear Delts · Upper Back",
        equip: "Machine",
        note: "High priority for correcting kyphosis posture and shoulder rounding",
        cues: [
          "Seat adjusted to chest pad height",
          "Wide arc outward to both sides",
          "Squeeze rear delts at full extension",
          "Controlled return"
        ],
        yt: "rear+delt+fly+machine+form+tutorial"
      },
      {
        id: "ytw",
        name: "Prone Y-T-W Raises",
        sets: 3,
        reps: "10 each position",
        muscle: "Lower Traps · Rear Delts",
        equip: "Light Dumbbells (2–5kg)",
        note: "CRITICAL for Scheuermann's — lower traps directly counter kyphosis curvature",
        cues: [
          "Lie face down on incline bench",
          "Arms: Y shape then T shape then W shape",
          "2–5kg only — not heavy",
          "Slow and full range of motion always"
        ],
        yt: "prone+YTW+raises+lower+trap+kyphosis+exercise"
      },
      {
        id: "hammer-curl-asym",
        name: "Unilateral DB Hammer Curl (Left Focus)",
        sets: "3L × 15, 2R × 15",
        reps: "15",
        muscle: "Biceps · Brachialis",
        equip: "Dumbbell",
        note: "LEFT ARM FIRST always. 3 sets left, 2 sets right. Neutral grip, 2-sec lowering.",
        cues: [
          "Neutral hammer grip",
          "Left arm first every time",
          "Controlled 2-second lowering",
          "Don't swing the body"
        ],
        yt: "hammer+curl+dumbbell+unilateral+form",
        LEFT_ARM_EXERCISE: true
      },
      {
        id: "tricep-pushdown-asym",
        name: "Single-Arm Tricep Pushdown (Left Focus)",
        sets: "3L × 15, 2R × 15",
        reps: "15",
        muscle: "Triceps",
        equip: "Cable Machine",
        note: "LEFT ARM FIRST always. 3 sets left, 2 sets right. Elbow tucked, full extension.",
        cues: [
          "Keep elbow tucked to side",
          "Full extension at bottom",
          "Left arm always goes first",
          "Control the eccentric"
        ],
        yt: "single+arm+tricep+pushdown+cable+form",
        LEFT_ARM_EXERCISE: true
      }
    ]
  },
  {
    dayNum: 7,
    name: "Rest Day",
    color: "#475569",
    icon: "😴",
    exercises: []
  }
];

export const getMuscleGroupEmoji = (muscle: string): string => {
  const m = muscle.toLowerCase();
  if (m.includes('quad') || m.includes('hamstring') || m.includes('glute') || m.includes('hip') || m.includes('leg')) return '🦵';
  if (m.includes('core') || m.includes('oblique') || m.includes('tva')) return '🔄';
  if (m.includes('chest') || m.includes('tricep')) return '💪';
  if (m.includes('back') || m.includes('lat') || m.includes('delt') || m.includes('trap')) return '🏋️';
  if (m.includes('full body') || m.includes('cardio') || m.includes('pool')) return '🏃';
  return '🧘';
};
