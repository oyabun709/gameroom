import type { ReactNode } from "react";

type StatItem = {
  label: string;
  value: string;
};

type MissionHeaderProps = {
  eyebrow: string;
  title: string;
  rightSlot?: ReactNode;
  stats: StatItem[];
};

type CharacterPanelProps = {
  speech: string;
  mood: "idle" | "celebrate" | "surprised";
  name: string;
  footer: string;
  accent?: string;
  children?: ReactNode;
};

type MissionArenaProps = {
  title: string;
  progressLabel: string;
  progressValue: string;
  progressPercent: number;
  badge: string;
  topRight?: ReactNode;
  children: ReactNode;
};

type MissionOverlayProps = {
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
  media?: ReactNode;
};

export function MissionHeader({
  eyebrow,
  title,
  rightSlot,
  stats,
}: MissionHeaderProps) {
  return (
    <section className="hard-border rounded-[28px] bg-white p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-[11px] tracking-[0.18em] text-gameroom-orange">
            {eyebrow}
          </p>
          <h1 className="text-4xl leading-[0.9] text-gameroom-navy sm:text-5xl">
            {title}
          </h1>
        </div>

        {rightSlot ? <div className="flex items-center gap-3">{rightSlot}</div> : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[20px] border-[3px] border-gameroom-navy bg-gameroom-cream px-3 py-3 text-xs text-gameroom-navy"
          >
            {stat.label} {stat.value}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CharacterPanel({
  speech,
  mood,
  name,
  footer,
  accent = "#7dd3fc",
  children,
}: CharacterPanelProps) {
  return (
    <aside className="hard-border relative rounded-[28px] bg-gameroom-cream p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
      <div className="mb-3 rounded-[20px] border-[3px] border-gameroom-navy bg-white px-3 py-2 text-center text-[10px] leading-[1.2] text-gameroom-navy">
        {speech}
      </div>

      <div className="flex min-h-[208px] flex-col items-center justify-center">
        <div
          className={[
            "relative flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-gameroom-navy shadow-[5px_5px_0_var(--color-gameroom-navy)]",
            mood === "idle" ? "animate-[cosmo-bounce_1.8s_ease-in-out_infinite]" : "",
            mood === "celebrate" ? "animate-[cosmo-celebrate_0.55s_ease-in-out]" : "",
            mood === "surprised" ? "animate-[cosmo-surprised_0.35s_linear]" : "",
          ].join(" ")}
          style={{ backgroundColor: accent }}
        >
          <div className="absolute top-8 flex w-full justify-center gap-4">
            <span className="h-3 w-3 rounded-full bg-gameroom-navy" />
            <span className="h-3 w-3 rounded-full bg-gameroom-navy" />
          </div>
          <div className="absolute top-[56px] h-3 w-10 rounded-full border-[3px] border-gameroom-navy bg-white" />
        </div>

        <div className="mt-4 rounded-[24px] border-[3px] border-gameroom-navy bg-white px-3 py-2 text-center text-[11px] text-gameroom-navy">
          {name}
        </div>

        {children}

        <div className="mt-2 text-[10px] text-gameroom-navy">{footer}</div>
      </div>
    </aside>
  );
}

export function MissionArena({
  title,
  progressLabel,
  progressValue,
  progressPercent,
  badge,
  topRight,
  children,
}: MissionArenaProps) {
  return (
    <section className="hard-border relative overflow-hidden rounded-[32px] bg-gameroom-number p-4 shadow-[5px_5px_0_var(--color-gameroom-number-shadow)] transition-transform sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-2 text-[11px] tracking-[0.16em] text-gameroom-navy">
            CURRENT STOP
          </p>
          <div className="inline-flex rounded-[24px] border-[3px] border-gameroom-navy bg-white px-6 py-3 text-3xl leading-none text-gameroom-navy shadow-[4px_4px_0_var(--color-gameroom-navy)] sm:text-5xl">
            {title}
          </div>
        </div>

        <div className="w-full max-w-xs">
          <div className="mb-2 flex items-center justify-between text-[11px] text-gameroom-navy">
            <span>{progressLabel}</span>
            <span>{progressValue}</span>
          </div>
          <div className="h-6 overflow-hidden rounded-full border-[3px] border-gameroom-navy bg-white">
            <div
              className="h-full bg-gameroom-orange transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-[470px] overflow-hidden rounded-[28px] border-[3px] border-gameroom-navy bg-[#173d84] p-3 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.45),transparent_12%),radial-gradient(circle_at_70%_28%,rgba(255,255,255,0.2),transparent_14%),radial-gradient(circle_at_82%_76%,rgba(255,255,255,0.16),transparent_12%),linear-gradient(180deg,#2255a4_0%,#173d84_45%,#132d63_100%)]" />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-4 py-2 text-[10px] text-gameroom-navy shadow-[3px_3px_0_var(--color-gameroom-navy)]">
          {badge}
        </div>
        {topRight ? (
          <div className="pointer-events-none absolute right-4 top-4 z-10">{topRight}</div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function MissionOverlay({
  eyebrow,
  title,
  body,
  action,
  media,
}: MissionOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(26,10,46,0.22)] p-5">
      <div className="hard-border max-w-md rounded-[30px] bg-white p-6 text-center shadow-[7px_7px_0_var(--color-gameroom-navy)]">
        <p className="mb-2 text-[11px] tracking-[0.18em] text-gameroom-orange">
          {eyebrow}
        </p>
        {media}
        <h2 className="text-4xl leading-[0.92] text-gameroom-navy">{title}</h2>
        <p className="mt-3 text-sm leading-[1.2] text-gameroom-navy">{body}</p>
        {action}
      </div>
    </div>
  );
}

export function BurstBadge({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 animate-[streak-pop_1.25s_ease-out] rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-6 py-4 text-base leading-none text-gameroom-navy shadow-[6px_6px_0_var(--color-gameroom-navy)]">
      {text}
    </div>
  );
}
