// import React from "react";
// import Sidelink from "@/components/Sidelink";
// import { Home, Upload, Users, Video } from "lucide-react";
// import { Button } from "@/components/ui/button";

import { getVideo } from "@/services/home.service";
import type { Video } from "@/types/video.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

 

export default function HomePage() {

  // console.log(getVideo());
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    getVideo()
      .then((res) => {
        console.log("Videos fetched:", res?.data);
        setVideos(res?.data);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, []);


  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-black text-white flex">


      {/* Main Content */}
      <div className="flex-1 ml-14">

        {/* Video Grid */}
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">🔥 Recommended for Darkness</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.videoId} className="flex flex-col" onClick={() => navigate(`video/${video.videoId}`)} >
                <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnailUrl || "/thumb.jpg"}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-sm leading-tight line-clamp-2">{video.title ?? "Untitled Video"}</p>
                  <p className="text-xs text-gray-400">{video.ownerDetails.username}</p>
                  <p className="text-xs text-gray-500">
                    {video.views} views • {video.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
