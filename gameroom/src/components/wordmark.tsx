import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" aria-label="GAMEROOM HOME" className="inline-block -rotate-2">
      <span className="font-wordmark wordmark-shadow block text-[34px] leading-none tracking-tight text-white sm:text-[52px]">
        GAME<span className="text-gameroom-yellow">ROOM</span>
      </span>
    </Link>
  );
}
