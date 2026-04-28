import { BottomNav } from "@/components/bottom-nav";
import { GameCard } from "@/components/game-card";
import { MascotPlaceholder } from "@/components/mascot-placeholder";
import { ScreenShell } from "@/components/screen-shell";
import { Wordmark } from "@/components/wordmark";
import { featuredGames, games } from "@/lib/games";

export default function HomePage() {
  const codeMonkey = games.find((game) => game.slug === "code-monkey");

  return (
    <ScreenShell>
      <header className="header-stripes bg-gameroom-orange px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <Wordmark />
          <MascotPlaceholder
            label="REMI"
            className="h-16 w-16 bg-gameroom-yellow text-[11px] sm:h-20 sm:w-20"
          />
        </div>
      </header>

      <main className="screen-grid flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <section className="hard-border mb-4 rounded-[28px] bg-white px-5 py-5 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[11px] tracking-[0.25em] text-gameroom-orange">
                AALIYAH&apos;S ARCADE
              </p>
              <h1 className="text-3xl leading-[0.92] text-gameroom-navy sm:text-4xl">
                YOUR GAMES. YOUR RULES.
              </h1>
              <p className="soft-copy mt-3 max-w-xl text-sm leading-[1.2]">
                PICK A GAME, TAP PLAY, AND JUMP INTO STEAM MISSIONS BUILT FOR
                KINDERGARTEN THROUGH 5TH GRADE.
              </p>
            </div>
            <MascotPlaceholder
              label="REMI"
              className="h-24 w-24 self-start bg-gameroom-cream text-xs sm:h-28 sm:w-28 md:self-center"
            />
          </div>
        </section>

        <div className="mb-5 rounded-full bg-gameroom-navy px-4 py-3 text-center text-[11px] leading-none tracking-[0.14em] text-gameroom-yellow sm:text-xs">
          ADVANCED STEAM CURRICULUM &middot; KINDERGARTEN &rarr; 5TH GRADE
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>

        {codeMonkey ? (
          <section className="mt-4">
            <GameCard game={codeMonkey} fullWidth />
          </section>
        ) : null}
      </main>

      <BottomNav active="play" />
    </ScreenShell>
  );
}
