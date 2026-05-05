interface Props {
  icon: string;
  title: string;
  sub: string;
}

export default function EmptyState({ icon, title, sub }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500">{sub}</p>
    </div>
  );
}
