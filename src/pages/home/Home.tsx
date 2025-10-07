import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVideo } from "@/services/home.service";
import type { Video } from "@/types/video.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";

export default function HomePage() {
  // console.log(getVideo());
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    getVideo()
      .then((res) => {
        // console.log("Videos fetched:", res?.data);
        setVideos(res?.data);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, []);

  const navigate = useNavigate();

  function formatDuration(sec: number): string {
    const totalSeconds = Math.floor(sec);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    // If there are hours, show HH:MM:SS
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
  
    // Otherwise, show MM:SS
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="w-screen min-h-screen bg-black text-white flex">
      {/* Main Content */}
      <div className="flex-1 ml-14">
        {/* Video Grid */}
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            🔥 Recommended for Darkness
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className="flex flex-col"
                onClick={() => navigate(`video/${video.videoId}`)}>
                <div className="w-full aspect-video bg-gray-800 rounded-sm overflow-hidden relative">
                  <img
                    src={video.thumbnailUrl || "/thumb.jpg"}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className=" absolute right-1.5 bottom-1.5 bg-slate-950/60  text-white text-sm  px-1.5 py-0.5 rounded">
                    {(video.duration) ? formatDuration(video.duration) : "time"}
                  </div>
                </div>
                <div className="mt-2 flex  gap-2  ">
                  <Avatar className="size-11 mt-1">
                    <AvatarImage
                      src={video.ownerDetails.profilepic || "/profile.jpg"}
                      alt="channel"
                    />
                    <AvatarFallback>
                      {video.ownerDetails.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2 ">
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {video.title ?? "Untitled Video"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {video.ownerDetails.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {video.views} views • {moment(video.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
