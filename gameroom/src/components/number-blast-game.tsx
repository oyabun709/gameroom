"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BurstBadge,
  CharacterPanel,
  MissionArena,
  MissionHeader,
  MissionOverlay,
} from "@/components/game-shell";

type Question = {
  a: number;
  b: number;
  correct: number;
  choices: number[];
  operator: "+" | "-";
};

type TargetState = {
  x: number;
  y: number;
  baseY: number;
  direction: 1 | -1;
  speed: number;
  drift: number;
  size: number;
  hue: string;
};

type CosmoMood = "idle" | "celebrate" | "surprised";
type Phase =
  | "ready"
  | "countdown"
  | "playing"
  | "planet-complete"
  | "game-complete";

type Planet = {
  name: string;
  color: string;
  shadow: string;
  fact: string;
  fuelPerHit: number;
  maxOperand: number;
  allowSubtraction?: boolean;
};

const MIN_X = 0;
const ARENA_HEIGHT = 340;
const TARGET_COLORS = ["#ffe44d", "#7dd3fc", "#fcd34d"];
const PLANETS: Planet[] = [
  {
    name: "MERCURY",
    color: "#f5c27c",
    shadow: "#b45309",
    fact: "MERCURY IS THE CLOSEST PLANET TO THE SUN.",
    fuelPerHit: 34,
    maxOperand: 5,
  },
  {
    name: "VENUS",
    color: "#fda4af",
    shadow: "#be123c",
    fact: "VENUS HAS THICK CLOUDS ALL AROUND IT.",
    fuelPerHit: 25,
    maxOperand: 6,
  },
  {
    name: "EARTH",
    color: "#60a5fa",
    shadow: "#1d4ed8",
    fact: "EARTH IS THE ONLY PLANET WE KNOW WITH OCEANS FULL OF LIFE.",
    fuelPerHit: 25,
    maxOperand: 7,
  },
  {
    name: "MARS",
    color: "#fb7185",
    shadow: "#b91c1c",
    fact: "MARS IS CALLED THE RED PLANET.",
    fuelPerHit: 20,
    maxOperand: 8,
  },
  {
    name: "JUPITER",
    color: "#fdba74",
    shadow: "#c2410c",
    fact: "JUPITER IS THE BIGGEST PLANET IN OUR SOLAR SYSTEM.",
    fuelPerHit: 20,
    maxOperand: 9,
  },
  {
    name: "SATURN",
    color: "#fde68a",
    shadow: "#b45309",
    fact: "SATURN IS FAMOUS FOR ITS BIG RINGS.",
    fuelPerHit: 20,
    maxOperand: 10,
    allowSubtraction: true,
  },
  {
    name: "URANUS",
    color: "#67e8f9",
    shadow: "#0891b2",
    fact: "URANUS SPINS LIKE IT IS ROLLING ON ITS SIDE.",
    fuelPerHit: 17,
    maxOperand: 10,
    allowSubtraction: true,
  },
  {
    name: "NEPTUNE",
    color: "#818cf8",
    shadow: "#4338ca",
    fact: "NEPTUNE IS A WINDY ICE GIANT FAR FROM THE SUN.",
    fuelPerHit: 17,
    maxOperand: 12,
    allowSubtraction: true,
  },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function createQuestion(planetIndex: number): Question {
  const planet = PLANETS[planetIndex];
  const useSubtraction = Boolean(
    planet.allowSubtraction && Math.random() > 0.55,
  );
  let a = randomInt(0, planet.maxOperand);
  let b = randomInt(0, planet.maxOperand);
  let correct = 0;
  let operator: "+" | "-" = "+";

  if (useSubtraction) {
    if (b > a) {
      [a, b] = [b, a];
    }
    correct = a - b;
    operator = "-";
  } else {
    correct = a + b;
  }

  const wrongAnswers = new Set<number>();
  while (wrongAnswers.size < 2) {
    const guess = Math.max(
      0,
      correct + randomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1),
    );
    if (guess !== correct) {
      wrongAnswers.add(guess);
    }
  }

  return {
    a,
    b,
    correct,
    operator,
    choices: shuffle([correct, ...wrongAnswers]),
  };
}

function createInitialTargets(): TargetState[] {
  return [
    {
      x: 24,
      y: 20,
      baseY: 20,
      direction: 1,
      speed: 180,
      drift: 10,
      size: 108,
      hue: TARGET_COLORS[0],
    },
    {
      x: 240,
      y: 90,
      baseY: 90,
      direction: -1,
      speed: 220,
      drift: 12,
      size: 112,
      hue: TARGET_COLORS[1],
    },
    {
      x: 120,
      y: 160,
      baseY: 160,
      direction: 1,
      speed: 200,
      drift: 10,
      size: 104,
      hue: TARGET_COLORS[2],
    },
  ];
}

export function NumberBlastGame() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [planetIndex, setPlanetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [streak, setStreak] = useState(0);
  const [misses, setMisses] = useState(0);
  const [question, setQuestion] = useState<Question>(() => createQuestion(0));
  const [targets, setTargets] = useState<TargetState[]>(() => createInitialTargets());
  const [arenaWidth, setArenaWidth] = useState(920);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctChoice, setCorrectChoice] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [cosmoMood, setCosmoMood] = useState<CosmoMood>("idle");
  const [speech, setSpeech] = useState("COSMO IS READY FOR A SPACE TRIP!");
  const [burst, setBurst] = useState<string | null>(null);
  const [startBurst, setStartBurst] = useState<"READY" | "GO" | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const planet = PLANETS[planetIndex];

  useEffect(() => {
    const element = arenaRef.current;
    if (!element) return;

    const measure = () => {
      setArenaWidth(Math.max(element.clientWidth, 220));
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const step = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setTargets((current) =>
        current.map((target, index) => {
          const buttonSize = target.size + 18;
          const maxX = Math.max(arenaWidth - buttonSize, 0);
          const maxY = ARENA_HEIGHT - buttonSize;
          let nextX = target.x + target.speed * target.direction * delta;
          let nextDirection = target.direction;
          const nextY = Math.min(
            Math.max(target.baseY + Math.sin(time / 800 + index * 2.1) * target.drift, 0),
            maxY,
          );

          if (nextX <= MIN_X) {
            nextX = MIN_X;
            nextDirection = 1;
          } else if (nextX >= maxX) {
            nextX = maxX;
            nextDirection = -1;
          }

          return { ...target, x: nextX, y: nextY, direction: nextDirection };
        }),
      );

      frameRef.current = window.requestAnimationFrame(step);
    };

    frameRef.current = window.requestAnimationFrame(step);
    return () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [arenaWidth, phase]);

  useEffect(() => {
    if (wrongChoice == null) return;
    const timeout = window.setTimeout(() => {
      setWrongChoice(null);
      setIsFlashing(false);
      setCosmoMood("idle");
      setSpeech("GOOD TRY! KEEP POWERING THE ROCKET!");
    }, 480);
    return () => window.clearTimeout(timeout);
  }, [wrongChoice]);

  useEffect(() => {
    if (correctChoice == null) return;
    const timeout = window.setTimeout(() => {
      setCorrectChoice(null);
      setCosmoMood("idle");
    }, 420);
    return () => window.clearTimeout(timeout);
  }, [correctChoice]);

  useEffect(() => {
    if (!burst) return;
    const timeout = window.setTimeout(() => setBurst(null), 1300);
    return () => window.clearTimeout(timeout);
  }, [burst]);

  useEffect(() => {
    if (phase !== "countdown") return;

    const readyTimeout = window.setTimeout(() => {
      setStartBurst("GO");
      setSpeech(`BLAST OFF TO ${planet.name}!`);
      setCosmoMood("celebrate");
    }, 650);

    const goTimeout = window.setTimeout(() => {
      setStartBurst(null);
      setPhase("playing");
      setSpeech(`POWER THE ROCKET TO ${planet.name}!`);
      setCosmoMood("idle");
    }, 1350);

    return () => {
      window.clearTimeout(readyTimeout);
      window.clearTimeout(goTimeout);
    };
  }, [phase, planet.name]);

  const fuelLabel = useMemo(() => `${Math.min(fuel, 100)}%`, [fuel]);

  function startAdventure() {
    setStartBurst("READY");
    setSpeech(`READY FOR ${planet.name}!`);
    setPhase("countdown");
  }

  function advancePlanet() {
    const nextIndex = planetIndex + 1;
    if (nextIndex >= PLANETS.length) {
      setPhase("game-complete");
      setSpeech("YOU HELPED COSMO VISIT EVERY PLANET!");
      return;
    }

    setPlanetIndex(nextIndex);
    setFuel(0);
    setStreak(0);
    setQuestion(createQuestion(nextIndex));
    setSpeech(`NEXT STOP: ${PLANETS[nextIndex].name}!`);
    setPhase("countdown");
    setStartBurst("READY");
  }

  function handleChoice(value: number) {
    if (phase !== "playing") return;

    if (value === question.correct) {
      const nextFuel = Math.min(100, fuel + planet.fuelPerHit);
      const nextStreak = streak + 1;

      setScore((current) => current + 10);
      setFuel(nextFuel);
      setStreak(nextStreak);
      setCorrectChoice(value);
      setCosmoMood("celebrate");

      if (nextStreak > 0 && nextStreak % 5 === 0) {
        setBurst("STREAK!");
        setSpeech("WOW! COSMO'S ROCKET IS GLOWING!");
      } else {
        setBurst(`+${planet.fuelPerHit}%`);
        setSpeech("NICE! MORE ROCKET FUEL!");
      }

      if (nextFuel >= 100) {
        setPhase("planet-complete");
        setSpeech(`${planet.name} COMPLETE!`);
        return;
      }

      setQuestion(createQuestion(planetIndex));
      return;
    }

    setMisses((current) => current + 1);
    setWrongChoice(value);
    setIsFlashing(true);
    setCosmoMood("surprised");
    setSpeech("OOPS! TRY ANOTHER NUMBER BUBBLE!");
  }

  return (
    <div className="flex flex-col gap-5">
      <MissionHeader
        eyebrow="COSMO'S SOLAR SYSTEM TRIP"
        title="NUMBER BLAST"
        rightSlot={
          <div className="rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-4 py-3 text-sm leading-none text-gameroom-navy shadow-[3px_3px_0_var(--color-gameroom-navy)]">
            SCORE {score}
          </div>
        }
        stats={[
          { label: "PLANET", value: `${planetIndex + 1} / ${PLANETS.length}` },
          { label: "FUEL", value: fuelLabel },
          { label: "MISSES", value: String(misses) },
        ]}
      />

      <div className={isFlashing ? "animate-[arena-shake_0.32s_linear]" : ""}>
        <MissionArena
          title={planet.name}
          progressLabel="ROCKET FUEL"
          progressValue={fuelLabel}
          progressPercent={Math.min(fuel, 100)}
          badge="POWER THE ROCKET"
          topRight={undefined}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.45),transparent_12%),radial-gradient(circle_at_70%_28%,rgba(255,255,255,0.2),transparent_14%),radial-gradient(circle_at_82%_76%,rgba(255,255,255,0.16),transparent_12%),linear-gradient(180deg,#2255a4_0%,#173d84_45%,#132d63_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-[6%] top-[10%] h-2 w-2 rounded-full bg-white shadow-[120px_20px_0_0_#fff,260px_50px_0_0_#fff,420px_12px_0_0_#fff,540px_80px_0_0_#fff,650px_30px_0_0_#fff,760px_110px_0_0_#fff,820px_40px_0_0_#fff]" />
            <div
              className="absolute right-[10%] top-[10%] h-28 w-28 rounded-full border-[3px] border-gameroom-navy"
              style={{ backgroundColor: planet.color, boxShadow: `6px 6px 0 ${planet.shadow}` }}
            />
          </div>

          <div className="relative grid min-h-[444px] grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <CharacterPanel
              speech={speech}
              mood={cosmoMood}
              name="COSMO"
              footer="ROCKET READY"
              accent="#7dd3fc"
            >
              <div className="mt-5 flex items-center gap-2">
                <div className="h-10 w-16 rounded-l-[20px] rounded-r-[12px] border-[3px] border-gameroom-navy bg-gameroom-orange" />
                <div className="h-5 w-8 rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow" />
              </div>
            </CharacterPanel>

            <div className="relative overflow-hidden rounded-[28px] border-[3px] border-gameroom-navy bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              {(phase === "ready" || phase === "countdown") && (
                <MissionOverlay
                  eyebrow="SPACE ADVENTURE"
                  title="COSMO NEEDS YOUR HELP!"
                  body="ANSWER MATH QUESTIONS TO FLY FROM PLANET TO PLANET."
                  action={
                    phase === "ready" ? (
                      <button
                        type="button"
                        onClick={startAdventure}
                        className="mt-5 inline-flex min-w-[200px] items-center justify-center rounded-full border-[3px] border-gameroom-navy bg-gameroom-orange px-6 py-4 text-xl leading-none text-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)]"
                      >
                        START
                      </button>
                    ) : undefined
                  }
                />
              )}

              {phase === "countdown" && startBurst ? (
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[rgba(26,10,46,0.14)]">
                  <div
                    className={[
                      "rounded-full border-[4px] border-gameroom-navy px-10 py-6 text-5xl leading-none shadow-[8px_8px_0_var(--color-gameroom-navy)] sm:text-7xl",
                      startBurst === "READY"
                        ? "animate-[ready-go-pop_0.7s_ease-out] bg-white text-gameroom-orange"
                        : "animate-[go-flash_0.65s_ease-out] bg-gameroom-yellow text-gameroom-navy",
                    ].join(" ")}
                  >
                    {startBurst}
                  </div>
                </div>
              ) : null}

              {phase === "planet-complete" && (
                <MissionOverlay
                  eyebrow="PLANET COMPLETE"
                  title={planet.name}
                  body={planet.fact}
                  media={
                    <div
                      className="mx-auto mb-4 h-24 w-24 rounded-full border-[3px] border-gameroom-navy"
                      style={{
                        backgroundColor: planet.color,
                        boxShadow: `6px 6px 0 ${planet.shadow}`,
                      }}
                    />
                  }
                  action={
                    <button
                      type="button"
                      onClick={advancePlanet}
                      className="mt-5 inline-flex min-w-[200px] items-center justify-center rounded-full border-[3px] border-gameroom-navy bg-gameroom-orange px-6 py-4 text-xl leading-none text-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)]"
                    >
                      {planetIndex === PLANETS.length - 1 ? "FINISH" : "NEXT PLANET"}
                    </button>
                  }
                />
              )}

              {phase === "game-complete" && (
                <MissionOverlay
                  eyebrow="MISSION COMPLETE"
                  title="SOLAR SYSTEM COMPLETE!"
                  body="COSMO MADE IT FROM MERCURY TO NEPTUNE THANKS TO YOU!"
                />
              )}

              {burst ? <BurstBadge text={burst} /> : null}

              <div className="mb-3 mt-16 px-4">
                <div className="inline-flex rounded-[24px] border-[3px] border-gameroom-navy bg-white px-6 py-3 text-4xl leading-none text-gameroom-navy shadow-[4px_4px_0_var(--color-gameroom-navy)] sm:text-5xl">
                  {`${question.a} ${question.operator} ${question.b}`}
                </div>
              </div>

              <div ref={arenaRef} className="relative h-[340px]">
                {question.choices.map((choice, index) => {
                  const target = targets[index];
                  const isWrong = wrongChoice === choice;
                  const isCorrect = correctChoice === choice;
                  const x = target?.x ?? 0;
                  const y = target?.y ?? 0;
                  const size = target?.size ?? 100;

                  return (
                    <button
                      key={`${question.correct}-${choice}-${index}`}
                      type="button"
                      onClick={() => handleChoice(choice)}
                      disabled={phase !== "playing"}
                      className={[
                        "absolute z-10 flex select-none items-center justify-center rounded-full border-[3px] border-gameroom-navy text-4xl leading-none text-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)] transition-transform active:scale-95 sm:text-5xl",
                        phase !== "playing"
                          ? "pointer-events-none opacity-80"
                          : "",
                        isWrong ? "bg-[#fb7185] animate-[wrong-flash_0.42s_ease] ring-4 ring-white/60" : "",
                        isCorrect ? "animate-[correct-pop_0.48s_ease] ring-4 ring-white/70" : "",
                      ].join(" ")}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        width: `${size + 18}px`,
                        height: `${size + 18}px`,
                        backgroundColor: isWrong ? "#fb7185" : target?.hue ?? "#ffe44d",
                        WebkitTapHighlightColor: "transparent",
                        touchAction: "manipulation",
                      }}
                    >
                      <span className="absolute inset-[10px] rounded-full border-2 border-[rgba(255,255,255,0.65)]" />
                      <span className="absolute inset-[20px] rounded-full border border-[rgba(26,10,46,0.16)]" />
                      <span className="relative z-10 drop-shadow-[0_2px_0_rgba(255,255,255,0.55)]">
                        {choice}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </MissionArena>
      </div>
    </div>
  );
}
