import { BottomNav } from "@/components/bottom-nav";
import { MascotPlaceholder } from "@/components/mascot-placeholder";
import { ScreenShell } from "@/components/screen-shell";
import { Wordmark } from "@/components/wordmark";

export default function TrophiesPage() {
  return (
    <ScreenShell>
      <header className="header-stripes bg-gameroom-orange px-4 py-4 sm:px-6 sm:py-5">
        <Wordmark />
      </header>

      <main className="screen-grid flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <section className="hard-border w-full max-w-2xl rounded-[30px] bg-white p-6 text-center shadow-[5px_5px_0_var(--color-gameroom-navy)]">
          <MascotPlaceholder
            label="TROPHY SLOT"
            className="mx-auto mb-4 h-24 w-24 bg-gameroom-yellow text-xs"
          />
          <h1 className="text-3xl leading-none text-gameroom-navy">TROPHIES</h1>
          <p className="soft-copy mt-3 text-sm leading-[1.15]">
            TROPHIES AND CELEBRATIONS WILL LIVE HERE WHEN WE ADD PLAYER
            PROGRESSION.
          </p>
        </section>
      </main>

      <BottomNav active="trophies" />
    </ScreenShell>
  );
}
