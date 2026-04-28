import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { NumberBlastGame } from "@/components/number-blast-game";
import { ScreenShell } from "@/components/screen-shell";
import { Wordmark } from "@/components/wordmark";

export default function NumberBlastPage() {
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
        <NumberBlastGame />
      </main>

      <BottomNav active="play" />
    </ScreenShell>
  );
}
