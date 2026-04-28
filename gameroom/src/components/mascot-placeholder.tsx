type MascotPlaceholderProps = {
  label: string;
  className?: string;
};

export function MascotPlaceholder({
  label,
  className = "",
}: MascotPlaceholderProps) {
  return (
    <div
      className={[
        "hard-border flex aspect-square items-center justify-center rounded-full px-2 text-center leading-[1.05] text-gameroom-navy",
        className,
      ].join(" ")}
    >
      <span>{label}</span>
    </div>
  );
}
