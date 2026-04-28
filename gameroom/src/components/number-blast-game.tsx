"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Question = {
  a: number;
  b: number;
  correct: number;
  choices: number[];
};

type TargetState = {
  x: number;
  y: number;
  direction: 1 | -1;
  speed: number;
  drift: number;
  size: number;
  hue: string;
};

type CosmoMood = "idle" | "celebrate" | "surprised";
type Phase = "ready" | "playing";

const MIN_X = 0;
const TARGET_COLORS = ["#ffe44d", "#7dd3fc", "#fcd34d"];

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

function createQuestion(streak: number): Question {
  const boosted = streak >= 5;
  const maxOperand = boosted ? 12 : 5;
  const minOperand = boosted ? 2 : 0;
  const a = randomInt(minOperand, maxOperand);
  const b = randomInt(minOperand, maxOperand);
  const correct = a + b;
  const wrongAnswers = new Set<number>();

  while (wrongAnswers.size < 2) {
    const offset = randomInt(1, boosted ? 5 : 3) * (Math.random() > 0.5 ? 1 : -1);
    const guess = Math.max(0, correct + offset);

    if (guess !== correct) {
      wrongAnswers.add(guess);
    }
  }

  return {
    a,
    b,
    correct,
    choices: shuffle([correct, ...wrongAnswers]),
  };
}

function createInitialTargets(): TargetState[] {
  return [
    {
      x: 24,
      y: 44,
      direction: 1,
      speed: 180,
      drift: 0.35,
      size: 102,
      hue: TARGET_COLORS[0],
    },
    {
      x: 230,
      y: 170,
      direction: -1,
      speed: 225,
      drift: 0.42,
      size: 108,
      hue: TARGET_COLORS[1],
    },
    {
      x: 520,
      y: 298,
      direction: 1,
      speed: 205,
      drift: 0.3,
      size: 98,
      hue: TARGET_COLORS[2],
    },
  ];
}

export function NumberBlastGame() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [misses, setMisses] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [targets, setTargets] = useState<TargetState[]>([]);
  const [arenaWidth, setArenaWidth] = useState(920);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [correctChoice, setCorrectChoice] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [cosmoMood, setCosmoMood] = useState<CosmoMood>("idle");
  const [speech, setSpeech] = useState("COSMO IS READY TO BLAST SOME NUMBERS!");
  const [streakBurst, setStreakBurst] = useState<string | null>(null);
  const [pointBurst, setPointBurst] = useState<string | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const initFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    initFrameRef.current = window.requestAnimationFrame(() => {
      setQuestion(createQuestion(0));
      setTargets(createInitialTargets());
      setIsReady(true);
    });

    return () => {
      if (initFrameRef.current != null) {
        window.cancelAnimationFrame(initFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const element = arenaRef.current;

    if (!element) {
      return;
    }

    const measure = () => {
      setArenaWidth(Math.max(element.clientWidth - 120, 220));
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isReady || phase !== "playing") {
      return;
    }

    const step = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setTargets((current) =>
        current.map((target, index) => {
          const maxX = Math.max(arenaWidth - target.size, 220);
          let nextX = target.x + target.speed * target.direction * delta;
          let nextDirection = target.direction;
          let nextY = target.y + Math.sin(time / 350 + index) * target.drift;

          if (nextX <= MIN_X) {
            nextX = MIN_X;
            nextDirection = 1;
          } else if (nextX >= maxX) {
            nextX = maxX;
            nextDirection = -1;
          }

          nextY = Math.min(Math.max(nextY, 28), 320);

          return {
            ...target,
            x: nextX,
            y: nextY,
            direction: nextDirection,
          };
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
  }, [arenaWidth, isReady, phase]);

  useEffect(() => {
    if (wrongChoice == null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setWrongChoice(null);
      setIsFlashing(false);
      setCosmoMood("idle");
      setSpeech("TRY AGAIN! COSMO KNOWS YOU CAN GET IT!");
    }, 460);

    return () => window.clearTimeout(timeout);
  }, [wrongChoice]);

  useEffect(() => {
    if (correctChoice == null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCorrectChoice(null);
      setCosmoMood("idle");
    }, 420);

    return () => window.clearTimeout(timeout);
  }, [correctChoice]);

  useEffect(() => {
    if (!pointBurst) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPointBurst(null);
    }, 520);

    return () => window.clearTimeout(timeout);
  }, [pointBurst]);

  useEffect(() => {
    if (!streakBurst) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStreakBurst(null);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [streakBurst]);

  const difficultyLabel = useMemo(
    () => (streak >= 5 ? "BOOSTED" : "WARM-UP"),
    [streak],
  );

  function startRound() {
    setPhase("playing");
    setSpeech("AALIYAH, TAP THE RIGHT NUMBER!");
    setCosmoMood("idle");
  }

  function handleChoice(value: number) {
    if (!question || phase !== "playing") {
      return;
    }

    if (value === question.correct) {
      const nextStreak = streak + 1;
      setScore((current) => current + 1);
      setStreak(nextStreak);
      setCorrectChoice(value);
      setCosmoMood("celebrate");
      setPointBurst("+10!");

      if (nextStreak > 0 && nextStreak % 5 === 0) {
        setStreakBurst(`STREAK x${nextStreak}!`);
        setSpeech("WOW! COSMO'S THRUSTERS ARE GLOWING!");
      } else {
        setSpeech(nextStreak >= 3 ? "YOU'RE BLASTING THROUGH THESE!" : "NICE SHOT!");
      }

      setQuestion(createQuestion(nextStreak));
      return;
    }

    setMisses((current) => current + 1);
    setStreak(0);
    setWrongChoice(value);
    setIsFlashing(true);
    setCosmoMood("surprised");
    setSpeech("WHOOPS! THAT ONE ZIPPED PAST US!");
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="hard-border rounded-[28px] bg-white p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)] sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-[11px] tracking-[0.18em] text-gameroom-orange">
              COSMO&apos;S NUMBER BLAST ARENA
            </p>
            <h1 className="text-4xl leading-[0.9] text-gameroom-navy sm:text-5xl">
              NUMBER BLAST
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-4 py-3 text-sm leading-none text-gameroom-navy shadow-[3px_3px_0_var(--color-gameroom-navy)]">
              SCORE {score}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-[20px] border-[3px] border-gameroom-navy bg-gameroom-cream px-3 py-3 text-xs text-gameroom-navy">
            STREAK {streak}
          </div>
          <div className="rounded-[20px] border-[3px] border-gameroom-navy bg-gameroom-cream px-3 py-3 text-xs text-gameroom-navy">
            MODE {difficultyLabel}
          </div>
          <div className="rounded-[20px] border-[3px] border-gameroom-navy bg-gameroom-cream px-3 py-3 text-xs text-gameroom-navy">
            MISSES {misses}
          </div>
        </div>
      </section>

      <section
        className={[
          "hard-border relative overflow-hidden rounded-[32px] bg-gameroom-number p-4 shadow-[5px_5px_0_var(--color-gameroom-number-shadow)] transition-transform sm:p-5",
          isFlashing ? "animate-[arena-shake_0.32s_linear] bg-[#fda4af]" : "",
        ].join(" ")}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-[11px] tracking-[0.16em] text-gameroom-navy">
              SPACE ARCADE MISSION
            </p>
            <div className="inline-flex rounded-[24px] border-[3px] border-gameroom-navy bg-white px-6 py-3 text-4xl leading-none text-gameroom-navy shadow-[4px_4px_0_var(--color-gameroom-navy)] sm:text-5xl">
              {question ? `${question.a} + ${question.b}` : "0 + 0"}
            </div>
          </div>

          <p className="max-w-xs text-right text-[11px] leading-[1.15] text-gameroom-navy">
            HELP COSMO CATCH THE RIGHT NUMBER BUBBLE BEFORE IT ZOOMS AWAY!
          </p>
        </div>

        <div
          ref={arenaRef}
          className="relative min-h-[470px] overflow-hidden rounded-[28px] border-[3px] border-gameroom-navy bg-[#173d84] p-3 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.08)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.45),transparent_12%),radial-gradient(circle_at_70%_28%,rgba(255,255,255,0.2),transparent_14%),radial-gradient(circle_at_82%_76%,rgba(255,255,255,0.16),transparent_12%),linear-gradient(180deg,#2255a4_0%,#173d84_45%,#132d63_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-[6%] top-[10%] h-2 w-2 rounded-full bg-white shadow-[120px_20px_0_0_#fff,260px_50px_0_0_#fff,420px_12px_0_0_#fff,540px_80px_0_0_#fff,650px_30px_0_0_#fff,760px_110px_0_0_#fff,820px_40px_0_0_#fff]" />
            <div className="absolute right-[12%] top-[12%] h-16 w-16 rounded-full border-[3px] border-gameroom-navy bg-[#fcd34d]" />
            <div className="absolute bottom-[18%] right-[8%] h-24 w-24 rounded-full border-[3px] border-gameroom-navy bg-[#fda4af]" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[repeating-linear-gradient(90deg,rgba(255,228,77,0.26)_0_28px,transparent_28px_56px)]" />
          </div>

          <div className="relative grid min-h-[444px] grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hard-border relative rounded-[28px] bg-gameroom-cream p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
              <div className="mb-3 rounded-[20px] border-[3px] border-gameroom-navy bg-white px-3 py-2 text-center text-[10px] leading-[1.2] text-gameroom-navy">
                {speech}
              </div>

              <div className="flex min-h-[290px] flex-col items-center justify-center">
                <div
                  className={[
                    "relative flex h-36 w-28 items-center justify-center rounded-[999px] border-[3px] border-gameroom-navy bg-[#7dd3fc] text-center shadow-[5px_5px_0_var(--color-gameroom-navy)]",
                    cosmoMood === "idle" ? "animate-[cosmo-bounce_1.8s_ease-in-out_infinite]" : "",
                    cosmoMood === "celebrate" ? "animate-[cosmo-celebrate_0.55s_ease-in-out]" : "",
                    cosmoMood === "surprised" ? "animate-[cosmo-surprised_0.35s_linear]" : "",
                  ].join(" ")}
                >
                  <div className="absolute -top-3 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow" />
                  <div className="absolute top-8 flex w-full justify-center gap-4">
                    <span className="h-3 w-3 rounded-full bg-gameroom-navy" />
                    <span className="h-3 w-3 rounded-full bg-gameroom-navy" />
                  </div>
                  <div className="absolute top-[58px] h-3 w-10 rounded-full border-[3px] border-gameroom-navy bg-white" />
                  <div className="absolute bottom-6 flex gap-2">
                    <span className="h-8 w-3 rounded-full border-[3px] border-gameroom-navy bg-gameroom-orange" />
                    <span className="h-8 w-3 rounded-full border-[3px] border-gameroom-navy bg-gameroom-orange" />
                  </div>
                  <span className="mt-14 block max-w-[72px] text-[11px] leading-[1.05] text-gameroom-navy">
                    COSMO
                  </span>
                </div>
              </div>

              <div className="rounded-[20px] border-[3px] border-gameroom-navy bg-gameroom-yellow px-3 py-3 text-center text-[11px] leading-[1.15] text-gameroom-navy">
                {phase === "ready"
                  ? "READY FOR LAUNCH!"
                  : streak >= 5
                    ? "THRUSTERS BOOSTED!"
                    : "KEEP BLASTING!"}
              </div>
            </aside>

            <div className="relative overflow-hidden rounded-[28px] border-[3px] border-gameroom-navy bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-4 py-2 text-[10px] text-gameroom-navy shadow-[3px_3px_0_var(--color-gameroom-navy)]">
                TAP THE RIGHT NUMBER
              </div>

              {phase === "ready" ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(26,10,46,0.22)] p-5">
                  <div className="hard-border max-w-md rounded-[30px] bg-white p-6 text-center shadow-[7px_7px_0_var(--color-gameroom-navy)]">
                    <p className="mb-2 text-[11px] tracking-[0.18em] text-gameroom-orange">
                      LAUNCH BAY
                    </p>
                    <h2 className="text-4xl leading-[0.92] text-gameroom-navy">
                      COSMO NEEDS YOUR HELP!
                    </h2>
                    <p className="mt-3 text-sm leading-[1.2] text-gameroom-navy">
                      TAP THE RIGHT NUMBER!
                    </p>
                    <button
                      type="button"
                      onClick={startRound}
                      disabled={!question}
                      className="mt-5 inline-flex min-w-[180px] items-center justify-center rounded-full border-[3px] border-gameroom-navy bg-gameroom-orange px-6 py-4 text-xl leading-none text-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                    >
                      START
                    </button>
                  </div>
                </div>
              ) : null}

              {streakBurst ? (
                <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 animate-[streak-pop_1.25s_ease-out] rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-5 py-3 text-sm leading-none text-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)]">
                  {streakBurst}
                </div>
              ) : null}

              {pointBurst ? (
                <div className="pointer-events-none absolute right-6 top-16 z-20 animate-[point-burst_0.5s_ease-out] rounded-full border-[3px] border-gameroom-navy bg-white px-3 py-2 text-xs leading-none text-gameroom-orange shadow-[4px_4px_0_var(--color-gameroom-navy)]">
                  {pointBurst}
                </div>
              ) : null}

              <div className="relative h-[444px]">
                {(question?.choices ?? [0, 0, 0]).map((choice, index) => {
                  const target = targets[index];
                  const isWrong = wrongChoice === choice;
                  const isCorrect = correctChoice === choice;
                  const x = target?.x ?? 0;
                  const y = target?.y ?? 0;
                  const size = target?.size ?? 100;

                  return (
                    <button
                      key={`${question?.correct ?? "loading"}-${choice}-${index}`}
                      type="button"
                      onClick={() => handleChoice(choice)}
                      disabled={!question || phase !== "playing"}
                      className={[
                        "absolute z-10 flex items-center justify-center rounded-full border-[3px] border-gameroom-navy text-3xl leading-none text-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)] transition-transform active:scale-95 sm:text-4xl",
                        phase === "playing" ? "hover:-translate-y-1" : "",
                        !question || phase !== "playing"
                          ? "pointer-events-none opacity-80"
                          : "",
                        isWrong ? "bg-[#fb7185] animate-[wrong-flash_0.35s_ease]" : "",
                        isCorrect ? "animate-[correct-pop_0.35s_ease]" : "",
                      ].join(" ")}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: isWrong ? "#fb7185" : target?.hue ?? "#ffe44d",
                      }}
                    >
                      <span className="absolute inset-[10px] rounded-full border-2 border-[rgba(255,255,255,0.65)]" />
                      <span className="relative z-10">{choice}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
