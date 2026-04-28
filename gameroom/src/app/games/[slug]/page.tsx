import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { MascotPlaceholder } from "@/components/mascot-placeholder";
import { ScreenShell } from "@/components/screen-shell";
import { Wordmark } from "@/components/wordmark";
import { games, gamesBySlug } from "@/lib/games";

type GamePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = gamesBySlug[slug];

  if (!game) {
    notFound();
  }

  return (
    <ScreenShell>
      <header className="header-stripes bg-gameroom-orange px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <Wordmark />
          <Link
            href="/"
            className="rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-4 py-3 text-xs leading-none text-gameroom-navy shadow-[3px_3px_0_var(--color-gameroom-navy)]"
          >
            HOME
          </Link>
        </div>
      </header>

      <main className="screen-grid flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <section
          className="hard-border rounded-[30px] p-5"
          style={{
            backgroundColor: game.cardColor,
            boxShadow: `5px 5px 0 ${game.shadowColor}`,
          }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[11px] tracking-[0.18em] text-gameroom-navy">
                {game.subject} GAME
              </p>
              <h1 className="text-4xl leading-[0.9] text-gameroom-navy sm:text-5xl">
                {game.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-[1.18] text-gameroom-navy">
                {game.tagline}
              </p>
            </div>

            <MascotPlaceholder
              label={game.mascot}
              className="h-28 w-28 bg-gameroom-cream text-sm sm:h-32 sm:w-32"
            />
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="hard-border rounded-[24px] bg-white p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
            <p className="mb-2 text-[11px] text-gameroom-orange">INSPIRED BY</p>
            <p className="text-lg leading-[1.05] text-gameroom-navy">
              {game.inspiredBy}
            </p>
          </div>

          <div className="hard-border rounded-[24px] bg-white p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
            <p className="mb-2 text-[11px] text-gameroom-orange">STYLE</p>
            <p className="text-sm leading-[1.15] text-gameroom-navy">
              {game.style}
            </p>
          </div>

          <div className="hard-border rounded-[24px] bg-white p-4 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
            <p className="mb-2 text-[11px] text-gameroom-orange">STATUS</p>
            <p className="text-sm leading-[1.15] text-gameroom-navy">
              FRONTEND SHELL READY. GAMEPLAY COMING NEXT.
            </p>
          </div>
        </section>

        <section className="hard-border mt-5 rounded-[30px] bg-white p-5 shadow-[5px_5px_0_var(--color-gameroom-navy)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="mb-2 text-[11px] tracking-[0.16em] text-gameroom-orange">
                LEARNING LADDER
              </p>
              <h2 className="text-2xl leading-none text-gameroom-navy">
                KINDERGARTEN TO 5TH GRADE
              </h2>
            </div>

            <span className="rounded-full bg-gameroom-navy px-3 py-2 text-[10px] leading-none text-gameroom-yellow sm:text-[11px]">
              STAGE {game.stage} OF 18
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {game.curriculum.map((step) => (
              <article
                key={step.grade}
                className="rounded-[22px] border-[3px] border-gameroom-navy bg-gameroom-cream p-4"
              >
                <p className="mb-2 text-[11px] text-gameroom-orange">
                  {step.grade}
                </p>
                <p className="text-sm leading-[1.15] text-gameroom-navy">
                  {step.focus}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="play" />
    </ScreenShell>
  );
}
