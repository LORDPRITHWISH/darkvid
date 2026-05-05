interface Props {
  title: React.ReactNode;
  onSeeAll?: () => void;
}

export default function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium flex items-center gap-1"
        >
          See all <span className="text-lg leading-none">›</span>
        </button>
      )}
    </div>
  );
}
