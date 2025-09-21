// import React from "react";
// import Sidelink from "@/components/Sidelink";
// import { Home, Upload, Users, Video } from "lucide-react";
// import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router";

const dummyVideos = [...Array(12)].map((_, i) => ({
  id: i,
  title: `Dark Hack Series - Ep ${i + 1}`,
  channel: "DarkVids Central",
  views: `${(i + 1) * 10}K`,
  date: `${i + 1} days ago`,
  thumbnail: "/thumb.jpg",
  link: `/video/dark-hack-ep${i + 1}`,
}));
 

export default function HomePage() {

  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-black text-white flex">


      {/* Main Content */}
      <div className="flex-1 ml-14">

        {/* Video Grid */}
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">🔥 Recommended for Darkness</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {dummyVideos.map((video) => (
              <div key={video.id} className="flex flex-col" onClick={() => navigate(video.link)} >
                <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-sm leading-tight line-clamp-2">{video.title}</p>
                  <p className="text-xs text-gray-400">{video.channel}</p>
                  <p className="text-xs text-gray-500">
                    {video.views} views • {video.date}
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
