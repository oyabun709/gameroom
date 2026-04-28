export type Game = {
  slug: string;
  title: string;
  tagline: string;
  subject: string;
  inspiredBy: string;
  style: string;
  mascot: string;
  stage: number;
  icon: string;
  cardColor: string;
  shadowColor: string;
  isNew?: boolean;
  curriculum: Array<{
    grade: string;
    focus: string;
  }>;
};

export const games: Game[] = [
  {
    slug: "fox-and-friends",
    title: "FOX & FRIENDS",
    tagline: "LOGIC MISSIONS, CLUE HUNTS, AND SILLY SPY MYSTERIES.",
    subject: "LOGIC",
    inspiredBy: "SPY FOX",
    style: "SPY ADVENTURE, SILLY HUMOR, MYSTERY MISSIONS.",
    mascot: "SABLE",
    stage: 4,
    icon: "FF",
    cardColor: "#c4b5fd",
    shadowColor: "#7c3aed",
    curriculum: [
      { grade: "K", focus: "2-STEP CHOICES AND PICTURE CLUES." },
      { grade: "1ST", focus: "SEQUENCING, CAUSE AND EFFECT." },
      { grade: "2ND", focus: "PATTERNS, ELIMINATION, MULTI-VARIABLE THINKING." },
      { grade: "3RD", focus: "CODED MESSAGES AND STRATEGY." },
      { grade: "4TH", focus: "ARGUMENT ANALYSIS AND HYPOTHESIS TESTING." },
      { grade: "5TH", focus: "SOCRATIC REASONING AND COMPLEX STRATEGY." },
    ],
  },
  {
    slug: "number-blast",
    title: "NUMBER BLAST",
    tagline: "SPACE ARCADE MATH WITH FAST ANSWERS FLYING AT YOU.",
    subject: "MATH",
    inspiredBy: "MATH BLASTER",
    style: "SPACE SHOOTER ENERGY WITH SPEED AND NUMBER SENSE.",
    mascot: "COSMO",
    stage: 7,
    icon: "NB",
    cardColor: "#6ee7b7",
    shadowColor: "#047857",
    curriculum: [
      { grade: "K", focus: "COUNTING TO 20, SHAPES, PLUS AND MINUS TO 5." },
      { grade: "1ST", focus: "ADDITION, SUBTRACTION, PLACE VALUE." },
      { grade: "2ND", focus: "3-DIGIT OPERATIONS AND SKIP COUNTING." },
      { grade: "3RD", focus: "MULTIPLICATION, DIVISION, FRACTIONS." },
      { grade: "4TH", focus: "DECIMALS, GEOMETRY, DATA ANALYSIS." },
      { grade: "5TH", focus: "EARLY ALGEBRA, RATIOS, PROBABILITY." },
    ],
  },
  {
    slug: "wonder-bus",
    title: "WONDER BUS",
    tagline: "FIELD TRIPS, SCIENCE DISCOVERY, AND TAP-TO-EXPLORE WORLDS.",
    subject: "SCIENCE",
    inspiredBy: "MAGIC SCHOOL BUS",
    style: "CURIOUS EXPLORATION WITH BIG FIELD TRIP ENERGY.",
    mascot: "FLORA",
    stage: 6,
    icon: "WB",
    cardColor: "#fcd34d",
    shadowColor: "#d97706",
    curriculum: [
      { grade: "K", focus: "5 SENSES, SEASONS, BASIC ANIMALS." },
      { grade: "1ST", focus: "LIFE CYCLES, WEATHER, STATES OF MATTER." },
      { grade: "2ND", focus: "ECOSYSTEMS, FORCES, SIMPLE EXPERIMENTS." },
      { grade: "3RD", focus: "FOOD CHAINS, EARTH SCIENCE, SCIENTIFIC METHOD." },
      { grade: "4TH", focus: "CHEMISTRY BASICS, ELECTRICITY, HUMAN BODY." },
      { grade: "5TH", focus: "PHYSICS CONCEPTS AND ENVIRONMENTAL SCIENCE." },
    ],
  },
  {
    slug: "story-garden",
    title: "STORY GARDEN",
    tagline: "COZY WORD PUZZLES, STORY WORLDS, AND READING CONFIDENCE.",
    subject: "READING",
    inspiredBy: "READER RABBIT",
    style: "STORYBOOK SURPRISES WITH SOFT SURREAL HUMOR.",
    mascot: "INK",
    stage: 5,
    icon: "SG",
    cardColor: "#fda4af",
    shadowColor: "#be123c",
    curriculum: [
      { grade: "K", focus: "PHONICS, LETTER SOUNDS, SIGHT WORDS." },
      { grade: "1ST", focus: "BLENDING, FLUENCY, SIMPLE SENTENCES." },
      { grade: "2ND", focus: "VOCABULARY, COMPREHENSION, SHORT STORIES." },
      { grade: "3RD", focus: "INFERENCE, THEME, AUTHOR'S PURPOSE." },
      { grade: "4TH", focus: "FIGURATIVE LANGUAGE AND RESEARCH READING." },
      { grade: "5TH", focus: "ARGUMENT, CROSS-TEXT ANALYSIS, ADVANCED COMPREHENSION." },
    ],
  },
  {
    slug: "code-monkey",
    title: "CODE MONKEY",
    tagline: "BLOCK CODING, PUZZLE MISSIONS, AND REAL BUILDER ENERGY.",
    subject: "CODING",
    inspiredBy: "ORIGINAL CONCEPT",
    style: "VISUAL CODING CHALLENGES WITH DEXTER'S LAB CHAOS.",
    mascot: "BYTE",
    stage: 2,
    icon: "CM",
    cardColor: "#7dd3fc",
    shadowColor: "#0369a1",
    isNew: true,
    curriculum: [
      { grade: "K", focus: "SEQUENCING, BASIC COMMANDS, DRAG-TO-CODE." },
      { grade: "1ST", focus: "LOOPS, CONDITIONALS, SIMPLE ALGORITHMS." },
      { grade: "2ND", focus: "FUNCTIONS, DEBUGGING, MINI-PROJECTS." },
      { grade: "3RD", focus: "VARIABLES, EVENTS, INTERMEDIATE LOGIC." },
      { grade: "4TH", focus: "DATA STRUCTURES INTRO AND DECOMPOSITION." },
      { grade: "5TH", focus: "REAL CODE SYNTAX AND FULL PROGRAM THINKING." },
    ],
  },
];

export const featuredGames = games.filter((game) => game.slug !== "code-monkey");

export const gamesBySlug = Object.fromEntries(
  games.map((game) => [game.slug, game]),
) as Record<string, Game>;
