import { useEffect, useRef, useState } from "react";
import { Share2, Pencil, Reply, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNavigate, useParams } from "react-router";
import { getVideo, startVideoWatch, endVideoWatch, toggleVideoLike } from "@/services/video.service";
import type { VideoDetails } from "@/types/video.types";

import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { subscribeToChannel } from "@/services/user.service";
import { CommentCreation } from "@/components/video/CommentCreation";
import { getVideoComments } from "@/services/comment.service";
import type { Comments } from "@/types/comment.types";
import moment from "moment";
import { useHeartBeatStore } from "@/store/heartBeatStore";
import { getSessionKey } from "@/utils/session.util";

export default function WatchPage() {
  const { videoid } = useParams();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [userComments, setUserComments] = useState<Comments[]>([]);

  const sessionKey = getSessionKey();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const [lastPosition, setLastPosition] = useState(0);
  const { initializeHeartBeat, updateLastPosition, startHeartBeat, stopHeartBeat } = useHeartBeatStore();

  const startWatching = async () => {
    if (!videoid) return;
    const response = await startVideoWatch(videoid, sessionKey); // Notify backend about starting to watch
    console.log("The Start Responce", response);
    const startPosition = response?.data?.startPosition || 0;
    // const startPosition = 100;
    console.log("The Start position", startPosition);
    if (videoRef.current) {
      videoRef.current.currentTime = startPosition;
      // videoRef.current.play().catch((err) => {
      //   console.error("Auto-play was prevented:", err);
      // });
    }
    initializeHeartBeat(videoid, sessionKey, startPosition);
  };

  useEffect(() => {
    const handlePageHide = () => {
      if (videoid) {
        endVideoWatch(videoid, sessionKey, videoRef.current?.currentTime || 0);
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);


  // const id

  useEffect(() => {
    // Fetch video details using videoid
    const fetchVideoDetails = async () => {
      if (!videoid) return;
      const response = await getVideo(videoid || ""); // Fetch video details

      setVideoDetails(response?.data);
    };

    fetchVideoDetails();
    startWatching();
  }, [videoid]);

  const fetchVideoComments = async () => {
    if (!videoDetails) return;
    console.log("Loaded video details:", videoDetails);
    if (!videoDetails._id) return;
    const response = await getVideoComments(videoDetails._id); // Fetch video comments
    setUserComments(response?.data || []);
  };

  useEffect(() => {
    fetchVideoComments();
  }, [videoDetails, videoid]);

  const toggle = async (mode: "like" | "dislike" | "") => {
    if (!videoDetails) return;

    const response = await toggleVideoLike(videoDetails?._id, mode);
    // Optionally, refresh video details to reflect the new like/dislike status
    // setVideoDetails(response?.);
    if (response && response.success && videoDetails) {
      console.log("the video was", videoDetails.LikeMode, " now ", mode);
      const newDetails = { ...videoDetails };
      newDetails.LikeMode = mode;
      console.log("the video now was", videoDetails.LikeMode, " now ", mode);
      if (mode === "like") {
        newDetails.likes += 1;
        if (videoDetails.LikeMode === "dislike") {
          newDetails.dislikes -= 1;
        }
      } else if (mode === "dislike") {
        newDetails.dislikes += 1;
        if (videoDetails.LikeMode === "like") {
          newDetails.likes -= 1;
        }
      } else {
        // mode is ""
        console.log("nutral from", videoDetails.LikeMode);
        if (videoDetails.LikeMode === "like") {
          newDetails.likes -= 1;
        } else if (videoDetails.LikeMode === "dislike") {
          newDetails.dislikes -= 1;
        }
      }

      // console.log(newDetails)

      setVideoDetails({ ...newDetails });
      // setVideoDetails(response.);
    }
  };

  const handleSubscribe = async () => {
    if (!videoDetails) return;

    const response = await subscribeToChannel(videoDetails?.ownerDetails._id);
    if (response && response.success) {
      setVideoDetails((prev) => {
        if (!prev) return prev;
        const wasSubscribed = prev.isSubscribed;
        const updatedOwnerDetails = {
          ...prev.ownerDetails,
          subscriberCount: (prev.ownerDetails?.subscriberCount || 0) + (wasSubscribed ? -1 : 1),
        };
        return {
          ...prev,
          isSubscribed: !wasSubscribed,
          ownerDetails: updatedOwnerDetails,
        };
      });
    }
  };

  const navigate = useNavigate();

  if (!videoid) {
    return <div>Video ID not found.</div>;
  }

  // console.log("The Comments : ", userComments);

  return (
    <div className="w-screen min-h-screen text-white flex ml-10 ">
      {/* LEFT: Main content */}
      <div className="flex-1 p-4 max-w-[calc(100%-550px)]">
        {/* Video */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            poster={videoDetails?.thumbnailUrl}
            controls
            // autoPlay
            src={videoDetails?.playbackUrl}
            onTimeUpdate={(e) => {
              updateLastPosition(e.currentTarget.currentTime);
            }}
            onPause={() => {
              // const currentTime = e.currentTarget.currentTime;
              // console.log("Paused at:", currentTime);
              stopHeartBeat();
              // fire API / save to DB / localStorage here
            }}
            onPlay={() => {
              startHeartBeat();
            }}
            onEnded={(e)=>{
              console.log("the end",e)
            }}
          />
        </div>

        {/* Title & Meta */}
        <div className="mt-2">
          <h1 className="text-2xl font-semibold">
            {videoDetails?.title || "Corrupted dark title..."} {sessionKey}
          </h1>
        </div>

        <div className="flex justify-between items-center mt-6 mx-4">
          {/* Channel */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                void navigate(`/channel/${videoDetails?.ownerDetails.username}`);
              }}>
              <img src={videoDetails?.ownerDetails.profilepic || "/profile.jpg"} alt="channel" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium">{videoDetails?.ownerDetails.username}</p>
                <p className="text-sm text-gray-400">{videoDetails?.ownerDetails.subscriberCount || 0} subscribers</p>
              </div>
            </div>
            {!videoDetails?.isOwner && (
              <Button className={videoDetails?.isSubscribed ? "bg-gray-600/20 hover:bg-gray-800 text-white" : "bg-red-600 hover:bg-red-700 text-white"} onClick={handleSubscribe}>
                {videoDetails?.isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            {videoDetails?.isOwner && (
              <Button variant="secondary" onClick={() => navigate(`/edit/${videoid}`)} className="gap-2">
                <Pencil /> Edit
              </Button>
            )}
            <ToggleGroup
              type="single"
              onValueChange={(value: "like" | "dislike" | "") => toggle(value)}
              value={videoDetails?.LikeMode || ""}
              variant="outline"
              size="lg"
              className="border-0">
              <ToggleGroupItem
                value="like"
                aria-label="Toggle Like"
                className="
                  border transition-colors w-20
                  hover:bg-green-100 hover:text-green-700
                  data-[state=on]:bg-green-600 data-[state=on]:text-white                
                  ">
                {videoDetails?.LikeMode === "like" ? <BiSolidLike className=" !text-lg !w-5 !h-5 " /> : <BiLike className=" !text-lg !w-5 !h-5 " />} {videoDetails?.likes || 0}
              </ToggleGroupItem>

              <ToggleGroupItem
                value="dislike"
                aria-label="Toggle Dislike"
                className="
                  border transition-colors w-20
                  hover:bg-red-100 hover:text-red-700
                  data-[state=on]:bg-red-600 data-[state=on]:text-white
                ">
                {videoDetails?.LikeMode === "dislike" ? <BiSolidDislike className=" !text-lg !w-5 !h-5 " /> : <BiDislike className=" !text-lg !w-6 !h-6 " />}{" "}
                {videoDetails?.dislikes || 0}
              </ToggleGroupItem>
            </ToggleGroup>

            <Button className="gap-2">
              <Share2 /> Share
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-1 bg-gray-400/10 py-4 px-8 rounded-3xl">
          <p className=" text-gray-400">
            {videoDetails?.views || 0} views • {moment(videoDetails?.createdAt).fromNow()}
          </p>

          <p className=" text-gray-300">{videoDetails?.description || "No description available."}</p>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Comments ( {userComments.length} )</h2>
          <div className="space-y-4">
            {videoDetails?._id && <CommentCreation videoId={videoDetails?._id} fetchComments={fetchVideoComments} />}
            {userComments.map((comment, i) => (
              <div key={i} className="flex gap-3">
                <img src={comment.user.profilepic ?? "/profile.jpg"} alt="user" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{comment.user.username}</p>•<p className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</p>
                  </div>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-gray-500">
                    <button className="hover:text-white transition-colors flex items-center gap-1">
                      <BiLike /> {comment.likes}
                    </button>
                    <button className="hover:text-white transition-colors flex items-center gap-1">
                      <Reply /> reply
                    </button>
                  </div>
                  <Button variant="link" className="px-0 mt-2 text-sm text-blue-400">
                    <ChevronDown />
                    View {comment.replyCount} replies
                  </Button>
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
            <div key={i} className="flex gap-3">
              {/* <div className="w-32 h-20 bg-gray-700 rounded" /> */}
              <img src={"/thumb.jpg"} alt="video thumbnail" className="w-32 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold leading-snug">Hack the Web #{i + 1}</p>
                <p className="text-xs text-gray-400">DarkHacks • 120K views</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
