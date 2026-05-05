interface Props {
  children: React.ReactNode;
}

export default function ScrollRow({ children }: Props) {
  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      <div className="flex gap-4 pb-2 min-w-max">{children}</div>
    </div>
  );
}
