import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type TweetItem, type ChannelData } from "../types/channel.types";

interface Props {
  tweet: TweetItem;
  channel: ChannelData;
}

export default function PostCard({ tweet, channel }: Props) {
  return (
    <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 hover:border-violet-500/25 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="size-10 border-2 border-violet-500/30">
          <AvatarImage src={channel.profilepic || "/profile.jpg"} />
          <AvatarFallback>{channel.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-zinc-100">{channel.name}</p>
          <p className="text-xs text-zinc-500">
            {moment(tweet.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {tweet.title && (
        <h3 className="text-base font-bold text-zinc-50 mb-2">{tweet.title}</h3>
      )}

      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-3">
        {tweet.content}
      </p>

      {tweet.featuredImage && (
        <img
          src={tweet.featuredImage}
          alt="post"
          className="w-full max-h-96 object-cover rounded-xl mb-3"
        />
      )}

      <div className="flex gap-2 pt-3 border-t border-white/5">
        {(
          [
            ["👍", String(tweet.likes || 0)],
            ["👎", ""],
            ["💬", "Reply"],
          ] as [string, string][]
        ).map(([icon, label], i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-zinc-400 text-xs hover:bg-white/[0.09] hover:text-zinc-100 transition-colors"
          >
            <span>{icon}</span>
            {label && <span>{label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
