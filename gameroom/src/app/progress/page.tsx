import { BottomNav } from "@/components/bottom-nav";
import { ScreenShell } from "@/components/screen-shell";
import { Wordmark } from "@/components/wordmark";

export default function ProgressPage() {
  return (
    <ScreenShell>
      <header className="header-stripes bg-gameroom-orange px-4 py-4 sm:px-6 sm:py-5">
        <Wordmark />
      </header>

      <main className="screen-grid flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <section className="hard-border w-full max-w-2xl rounded-[30px] bg-white p-8 text-center shadow-[5px_5px_0_var(--color-gameroom-navy)]">
          <div className="mx-auto mb-5 h-24 w-24 rounded-full border-[3px] border-gameroom-navy bg-gameroom-cream shadow-[4px_4px_0_var(--color-gameroom-navy)]">
            <div className="flex h-full flex-col items-center justify-center gap-2 px-2">
              <div className="flex gap-1">
                <div className="w-3 rounded-sm border-[2px] border-gameroom-navy bg-gameroom-orange" style={{ height: "24px" }} />
                <div className="w-3 rounded-sm border-[2px] border-gameroom-navy bg-gameroom-orange" style={{ height: "36px" }} />
                <div className="w-3 rounded-sm border-[2px] border-gameroom-navy bg-gameroom-orange" style={{ height: "20px" }} />
              </div>
            </div>
          </div>
          <h1 className="text-3xl leading-none text-gameroom-navy">PROGRESS</h1>
          <p className="soft-copy mx-auto mt-3 max-w-sm text-sm leading-[1.3]">
            YOUR STREAKS, STAGES, AND GAME HISTORY WILL APPEAR HERE.
          </p>
          <p className="mt-5 inline-block rounded-full border-[3px] border-gameroom-navy bg-gameroom-yellow px-5 py-2 text-xs leading-none text-gameroom-navy shadow-[3px_3px_0_var(--color-gameroom-navy)]">
            COMING SOON
          </p>
        </section>
      </main>

      <BottomNav active="progress" />
    </ScreenShell>
  );
}
