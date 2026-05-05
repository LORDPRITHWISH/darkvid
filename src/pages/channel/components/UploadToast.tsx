interface Props {
  message: string;
}

export default function UploadToast({ message }: Props) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-300 pointer-events-none z-20">
      ✓ {message}
    </div>
  );
}
