import type { ReactNode } from "react";

type ScreenShellProps = {
  children: ReactNode;
};

export function ScreenShell({ children }: ScreenShellProps) {
  return (
    <div className="bg-gameroom-cream">
      <div className="mx-auto flex min-h-screen w-full max-w-[1024px] flex-col bg-gameroom-cream md:border-x-[3px] md:border-gameroom-navy">
        {children}
      </div>
    </div>
  );
}
