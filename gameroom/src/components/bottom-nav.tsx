import Link from "next/link";

type BottomNavProps = {
  active: "play" | "trophies" | "progress";
};

const navItems = [
  { href: "/", label: "PLAY", key: "play" },
  { href: "/trophies", label: "TROPHIES", key: "trophies" },
  { href: "/progress", label: "PROGRESS", key: "progress" },
] as const;

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="border-t-[3px] border-gameroom-navy bg-gameroom-navy px-3 py-3 sm:px-5">
      <div className="grid grid-cols-3 gap-2">
        {navItems.map((item) => {
          const isActive = item.key === active;

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "rounded-full border-[3px] px-3 py-3 text-center text-xs leading-none transition-transform sm:text-sm",
                isActive
                  ? "border-gameroom-orange bg-gameroom-orange text-gameroom-navy"
                  : "border-gameroom-cream text-gameroom-cream hover:-translate-x-0.5 hover:-translate-y-0.5",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
