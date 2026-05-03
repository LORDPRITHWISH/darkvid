import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@/components/admin/DataTable";
import moment from "moment";

export const videoColumns: ColumnDef<any>[] = [
  {
    header: "Video",
    cell: (video) => (
      <div className="flex items-center gap-3">
        <div className="w-16 h-10 bg-zinc-800 rounded overflow-hidden relative">
          {video.thumbnailUrl && <img src={video.thumbnailUrl} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{video.title || "Untitled"}</p>
          <p className="text-[10px] text-zinc-500">{video.videoId}</p>
        </div>
      </div>
    )
  },
  {
    header: "Metrics",
    cell: (video) => (
      <div className="text-xs text-zinc-400">
        <div>{video.views || 0} views</div>
        <div>{video.likes || 0} likes</div>
      </div>
    )
  },
  {
    header: "Status",
    cell: (video) => (
      <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 capitalize">
        {video.status}
      </span>
    )
  }
];

export const userColumns: ColumnDef<any>[] = [
  {
    header: "User",
    cell: (sub) => {
      const user = sub.subscriberDetails || sub.subscribedToDetails || sub.viewerDetails || sub.originatorDetails;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilepic} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">{user?.name || "Unknown"}</p>
            <p className="text-[10px] text-zinc-500">@{user?.username}</p>
          </div>
        </div>
      );
    }
  },
  {
    header: "Date",
    cell: (sub) => (
      <div className="text-xs text-zinc-400">
        {moment(sub.createdAt || sub.viewedAt).format("MMM D, YYYY")}
      </div>
    )
  }
];

export const commentColumns: ColumnDef<any>[] = [
  {
    header: "Comment",
    cell: (comment) => (
      <div className="max-w-[200px] sm:max-w-[300px]">
        <p className="text-sm text-zinc-300 truncate" title={comment.content}>{comment.content}</p>
      </div>
    )
  },
  {
    header: "User/Video",
    cell: (item) => {
      // In user management context, we want to show the video title.
      // In video management context, we want to show the user who commented.
      // We can handle both if we just conditionally render what's available.
      if (item.videoDetails || (!item.originatorDetails && item.videoId)) {
         return (
           <div className="text-xs text-zinc-400 truncate max-w-[150px]">
             {item.videoDetails?.title || item.videoId}
           </div>
         );
      }
      
      const user = item.originatorDetails;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user?.profilepic} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-zinc-400">@{user?.username}</p>
        </div>
      );
    }
  },
  {
    header: "Date",
    cell: (comment) => (
      <div className="text-xs text-zinc-400">
        {moment(comment.createdAt).format("MMM D, YYYY")}
      </div>
    )
  }
];
