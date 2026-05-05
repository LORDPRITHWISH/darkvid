import moment from "moment";
import { type VideoItem, formatDuration, formatViews } from "../types/channel.types";

interface Props {
  video: VideoItem;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: Props) {
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden focus-visible:ring-2 focus-visible:ring-violet-500 outline-none"
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="relative w-full aspect-video bg-white/5 rounded-lg overflow-hidden">
        <img
          src={video.thumbnailUrl || "/thumb.jpg"}
          alt={video.title || "Video"}
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
      <div className="pt-2.5 px-1">
        <p className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug mb-1">
          {video.title || "Untitled Video"}
        </p>
        <p className="text-xs text-zinc-500">
          {formatViews(video.totalViews || 0)} •{" "}
          {moment(video.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}
