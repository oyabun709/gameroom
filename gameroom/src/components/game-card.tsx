import Link from "next/link";
import { MascotPlaceholder } from "@/components/mascot-placeholder";
import type { Game } from "@/lib/games";

type GameCardProps = {
  game: Game;
  fullWidth?: boolean;
};

export function GameCard({ game, fullWidth = false }: GameCardProps) {
  const progressWidth = `${(game.stage / 18) * 100}%`;

  return (
    <Link
      href={`/games/${game.slug}`}
      className="block transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
    >
      <article
        className={[
          "hard-border relative overflow-hidden rounded-[30px] p-4 sm:p-5",
          fullWidth ? "min-h-[240px]" : "min-h-[250px]",
        ].join(" ")}
        style={{
          backgroundColor: game.cardColor,
          boxShadow: `5px 5px 0 ${game.shadowColor}`,
        }}
      >
        <div
          className={[
            "flex gap-4",
            fullWidth
              ? "flex-col md:flex-row md:items-center md:justify-between"
              : "flex-col",
          ].join(" ")}
        >
          <div className={fullWidth ? "max-w-2xl" : undefined}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border-[3px] border-gameroom-navy bg-white text-sm text-gameroom-navy">
                {game.icon}
              </div>

              <div className="flex items-center gap-2">
                {game.isNew ? (
                  <span className="rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-2 py-1 text-[10px] leading-none text-gameroom-navy">
                    NEW
                  </span>
                ) : null}

                <span className="rounded-full bg-gameroom-navy px-3 py-2 text-[10px] leading-none text-gameroom-yellow sm:text-[11px]">
                  K &rarr; 5TH
                </span>
              </div>
            </div>

            <div
              className={[
                "mb-4 flex gap-4",
                fullWidth ? "flex-col sm:flex-row sm:items-center" : "items-center",
              ].join(" ")}
            >
              <MascotPlaceholder
                label={game.mascot}
                className={[
                  "shrink-0 bg-gameroom-cream text-[10px]",
                  fullWidth ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16",
                ].join(" ")}
              />

              <div>
                <h2 className="text-[28px] leading-[0.9] text-gameroom-navy sm:text-[32px]">
                  {game.title}
                </h2>
                <p className="soft-copy mt-2 max-w-lg text-[12px] leading-[1.15] sm:text-[13px]">
                  {game.tagline}
                </p>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between gap-3 text-[10px] leading-none text-gameroom-navy sm:text-[11px]">
                <span>STAGE {game.stage} OF 18</span>
                <span>{game.subject}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border-[3px] border-gameroom-navy bg-white">
                <div
                  className="h-full rounded-full bg-gameroom-navy"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>
          </div>

          {fullWidth ? (
            <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
              <span className="soft-copy max-w-[220px] text-[11px] leading-[1.15] text-left md:text-right">
                {game.style}
              </span>
              <span className="inline-flex min-w-[118px] items-center justify-center rounded-full border-[3px] border-gameroom-navy bg-gameroom-orange px-4 py-3 text-sm leading-none text-gameroom-navy">
                PLAY
              </span>
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
