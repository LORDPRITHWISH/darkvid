import moment from "moment";
import { type PlaylistItem } from "../types/channel.types";

interface Props {
  pl: PlaylistItem;
}

export default function PlaylistCard({ pl }: Props) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5">
        <div className="w-full h-full bg-gradient-to-br from-violet-950/60 to-zinc-900 rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
            ▶ Play all
          </span>
        </div>
        <div className="absolute -bottom-1 left-2 right-2 h-1 bg-zinc-700 rounded-b" />
        <div className="absolute -bottom-2 left-4 right-4 h-1 bg-zinc-800 rounded-b" />
      </div>
      <p className="text-sm font-semibold text-zinc-100 line-clamp-2 mb-1">
        {pl.title}
      </p>
      {pl.description && (
        <p className="text-xs text-zinc-500 line-clamp-1 mb-1">
          {pl.description}
        </p>
      )}
      <p className="text-xs text-zinc-600">{moment(pl.createdAt).fromNow()}</p>
    </div>
  );
}
