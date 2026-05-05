import { type VideoItem, formatDuration, formatViews } from "../types/channel.types";

interface Props {
  video: VideoItem;
  onClick: () => void;
}

export default function ShortCard({ video, onClick }: Props) {
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden"
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      <div className="relative aspect-[9/16] bg-white/5 rounded-lg overflow-hidden">
        <img
          src={video.thumbnailUrl || "/thumb.jpg"}
          alt={video.title || "Short"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/thumb.jpg";
          }}
        />
        {video.duration !== undefined && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-zinc-200 mt-2 px-1 line-clamp-2 leading-snug">
        {video.title || "Short"}
      </p>
      <p className="text-xs text-zinc-500 px-1">
        {formatViews(video.totalViews || 0)}
      </p>
    </div>
  );
}
