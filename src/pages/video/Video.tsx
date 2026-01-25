import { useEffect, useRef, useState } from "react";
import { Share2, Pencil, Reply, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNavigate, useParams } from "react-router";
import { getVideo, startVideoWatch, endVideoWatch, toggleVideoLike, getRelatedVideos } from "@/services/video.service";
import type { VideoDetails } from "@/types/video.types";

import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { subscribeToChannel } from "@/services/user.service";
import { CommentCreation } from "@/components/video/CommentCreation";
import { getVideoComments } from "@/services/comment.service";
import type { Comments } from "@/types/comment.types";
import moment from "moment";
import { useHeartBeatStore } from "@/store/heartBeatStore";
import { getSessionKey } from "@/utils/session.util";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
// import { set } from "lodash";

export default function WatchPage() {
  const { videoid } = useParams();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [userComments, setUserComments] = useState<Comments[]>([]);

  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);

  const [wasStarted, setWasStarted] = useState(false);

  const sessionKey = getSessionKey();

  const videoUrl = `${import.meta.env.VITE_Frontend_URL}/video/${videoid}`;

  const shareVideo = async () => {
    // Implement share functionality here
    console.log("Share video:", videoUrl);
    setWasStarted(true);
    // window.navigator.clipboard.writeText(videoUrl);
    await navigator.clipboard.writeText(videoUrl);

    setTimeout(() => {
      setWasStarted(false);
    }, 2000);
  };

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
      window.document.title = response?.data?.title || "DarkVid Playback";
    };

    const fetchRelatedVideos = async () => {
      if (!videoid) return;
      const response = await getRelatedVideos(videoid || ""); // Fetch related videos

      setRelatedVideos(response?.data || []);
    };

    fetchVideoDetails();
    fetchRelatedVideos();
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
    <div className="w-screen min-h-screen text-white ml-2 grid grid-cols-384 ">
      {/* LEFT: Main content */}
      <div className="flex-1 px-4 col-span-293">
        {/* Video */}
        <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden">
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
            // onEnded={(e) => {
            //   // console.log("the end", e);
            //   stopHeartBeat(true);
            // }}
          />
        </div>

        {/* Title & Meta */}
        <div className="mt-1">
          <h1 className="text-xl font-semibold">{videoDetails?.title || "Corrupted dark title..."}</h1>
        </div>

        <div className="flex justify-between items-center mt-2 ">
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
              // size="lg"
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

            {/* <Button className="gap-2">
              <Share2 /> Share
            </Button> */}
            <Dialog>
              <DialogTrigger>
                <Button className="gap-2">
                  <Share2 /> Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Share</DialogTitle>
                  <DialogDescription>Share this video with your friends</DialogDescription>
                </DialogHeader>

                {/* Share buttons */}
                <div className="grid grid-cols-4 gap-4 py-4">
                  {[
                    { name: "WhatsApp", color: "bg-green-500" },
                    { name: "Telegram", color: "bg-sky-500" },
                    { name: "X", color: "bg-black" },
                    { name: "Email", color: "bg-gray-600" },
                  ].map((item) => (
                    <button key={item.name} className={`flex flex-col items-center justify-center gap-2 rounded-lg p-3 text-white ${item.color}`}>
                      <span className="text-xs font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>

                {/* Copy link */}
                <div className="flex items-center gap-2">
                  <input readOnly value={videoUrl} className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm" />
                  <Button size="icon" className={`${wasStarted ? "bg-green-500 hover:bg-green-600 text-white" : ""}`} onClick={wasStarted ? undefined : shareVideo}>
                    {wasStarted ? <IoCheckmarkDoneSharp /> : <MdOutlineContentCopy />}
                  </Button>
                </div>

                {/* Embed */}
                <div className="pt-3">
                  <button className="text-sm text-muted-foreground hover:underline">Embed</button>
                </div>
              </DialogContent>
            </Dialog>
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
      <aside className="w-full p-2 h-full col-span-91">
        <h2 className="text-lg font-semibold mb-4">Recommended</h2>
        <div className="space-y-4">
          {relatedVideos.map((video, i) => (
            <div key={i} className="flex gap-3">
              {/* <div className="w-32 h-20 bg-gray-700 rounded" /> */}
              <img src={video.thumbnailUrl} alt="video thumbnail" className="w-32 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold leading-snug">{video.title}</p>
                <p className="text-xs text-gray-400">
                  {video.ownerDetails.username} • {video.viewCount} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
