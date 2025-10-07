import React, { useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Pencil,
  // Bold,
  // Italic,
  // Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNavigate, useParams } from "react-router";
import { getVideo } from "@/services/video.service";
// import { GrEdit } from "react-icons/gr";

// import channelPic from "@/assets/channel.jpg";
// import userPic from "@/assets/user.jpg";

export default function WatchPage() {
  const { videoid } = useParams();
  const [videoDetails, setVideoDetails] = React.useState(null);

  useEffect(() => {
    // Fetch video details using videoid
    const fetchVideoDetails = async () => {
      if (!videoid) return;
      const response = await getVideo(videoid || ""); // Fetch video details

      setVideoDetails(response?.data);
    };

    fetchVideoDetails();
  }, [videoid]);

  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen text-white flex ml-10 ">
      {/* LEFT: Main content */}
      <div className="flex-1 p-4 max-w-[calc(100%-550px)]">
        {/* Video */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video
            className="w-full h-full"
            controls
            autoPlay
            // src="/videos/sample.mp4"
            src={videoDetails?.playbackUrl}
          />
        </div>

        {/* Title & Meta */}
        <div className="mt-2">
          <h1 className="text-2xl font-semibold">
            {videoDetails?.title || "Corrupting title..."}
          </h1>
        </div>

        <div className="flex justify-between items-center mt-6 mx-4">
          {/* Channel */}
          <div className="flex items-center gap-4">
            <img
              src={videoDetails?.ownerDetails.profilepic || "/profile.jpg"}
              alt="channel"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">
                {videoDetails?.ownerDetails.username}
              </p>
              <p className="text-sm text-gray-400">153K subscribers</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Subscribe
            </Button>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate(`/edit/${videoid}`)}
              className="gap-2">
              <Pencil /> Edit
            </Button>
            <ToggleGroup
              type="single"
              variant={"outline"}
              className=" border-0 ">
              <ToggleGroupItem
                value="bold"
                className=" border "
                aria-label="Toggle bold">
                <ThumbsUp /> 24K
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                className=" border "
                aria-label="Toggle italic">
                <ThumbsDown /> 320
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              className="gap-2">
              <Share2 /> Share
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-1 bg-gray-400/10 py-4 px-8 rounded-3xl">
          <p className=" text-gray-400">1.7M views • 1 month ago</p>

          <p className=" text-gray-300">
            {videoDetails?.description || "No description available."}
          </p>
          {/* <p className=" text-gray-300">
            #darkvid #darkhacks #coding #programming #react #nodejs #webdevelopment
          </p> */}
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Comments (89)</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-3">
                <img
                  src={"/thumb.jpg"}
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">CyberUser_{i}</p>
                  <p className="text-sm text-gray-300">
                    🔥 This episode is next level. Respect to DarkLord!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Recommendations */}
      <aside className="w-[350px] p-2 h-full">
        <h2 className="text-lg font-semibold mb-4">Recommended</h2>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-3">
              <div className="w-32 h-20 bg-gray-700 rounded" />
              <div className="flex-1">
                <p className="text-sm font-semibold leading-snug">
                  Hack the Web #{i + 1}
                </p>
                <p className="text-xs text-gray-400">DarkHacks • 120K views</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
