interface Props {
  active: boolean;
  label: string;
  onClick: () => void;
}

export default function FilterChip({ active, label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
        active
          ? "bg-violet-500/15 border-violet-400/40 text-violet-300 font-medium"
          : "bg-white/[0.05] border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}
