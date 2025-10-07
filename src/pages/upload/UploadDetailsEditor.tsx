import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { useVideoStore } from "@/store/vidStore";
import { uploadThumbnail, uploadVideo } from "@/utils/upload.utils";
import { Progress } from "@/components/ui/progress";
import ImageUpload from "@/components/upload/ImageUpload";
import { setVideoData } from "@/services/upload.service";
import { debounce } from "lodash";

const playlists = [
  "Dark Hack Series",
  "Tech Shorts",
  "Unlisted Secrets",
  "Learning AI",
];

export default function DetailsZone() {
  const { videoid } = useParams<{ videoid: string }>();
  const { Video, uploadProgress, uploadStatus, videoId } = useVideoStore();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [privacy, setPrivacy] = useState("public");
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  // const [videoDetails, setVideoDetails] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Memoized video URL to prevent reload
  const videoFile = useMemo(() => {
    if (Video instanceof File) return URL.createObjectURL(Video);
    return "https://res.cloudinary.com/dvc3yzzhf/video/upload/video-1754765279128-756662035_aygrvf.mp4";
  }, [Video]);

  // Navigate only when absolutely needed
  useEffect(() => {
    if (Video === null) {
      navigate(`/edit/${videoid}`);
    }
  }, [Video, navigate, videoid]);

  // Initialize default title only once
  useEffect(() => {
    if (Video?.name) {
      setTitle(Video.name);
    }
  }, [Video]);

  const uploadTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        if (!videoid) return;
        setLoading(true);
        setVideoData(videoid, { title: newTitle }).finally(() =>
          setLoading(false)
        );
      }, 500),
    [videoid]
  );

  const uploadDescription = useMemo(
    () =>
      debounce((description: string) => {
        if (!videoid) return;
        setLoading(true);
        setVideoData(videoid, { description }).finally(() => setLoading(false));
      }, 500),
    [videoid]
  );

  const setDetail = useMemo(
    () =>
      debounce((field: string, value: string | string[]) => {
        if (!videoid) return;
        setLoading(true);
        setVideoData(videoid, { [field]: value }).finally(() =>
          setLoading(false)
        );
      }, 500),
    [videoid]
  );

  // const handleRemoveTag = (tag: string) => {
  //   setTags(tags.filter((t) => t !== tag));
  // };

  const publishVideo = () => {
    if (!videoid) return;
    setLoading(true);
    setVideoData(videoid, { isPublished: true, privacy }).finally(() =>
      setLoading(false)
    );
  };

  // Handle duration upload
  useEffect(() => {
    if (duration && videoid) {
      console.log("Setting duration:", duration);
      setVideoData(videoid, { duration });
    }
  }, [duration, videoid]);

  // Handle thumbnail upload
  useEffect(() => {
    if (thumbnailFile && videoId) {
      uploadThumbnail(thumbnailFile, videoId);
    }
  }, [thumbnailFile, videoId]);

  useEffect(() => {
    if (Video instanceof File && uploadStatus === "uploading") {
      uploadVideo();
    }
  }, []);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const Link = `${import.meta.env.VITE_Frontend_URL}/video/${videoid}`;

  return (
    <section className="w-full py-6 px-12 bg-[#0d0d0d] rounded-2xl shadow-[0_0_20px_#0ff3] border border-[#1f1f1f] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Video Title</Label>
            <Input
              placeholder="Catchy title here..."
              className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
              value={title || ""}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                uploadTitle(newTitle);
              }}
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Thumbnail</Label>
            <ImageUpload onFileChange={setThumbnailFile} />
          </div>

          {/* Playlist */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Playlist</Label>
            <Select
              value={selectedPlaylist}
              onValueChange={setSelectedPlaylist}>
              <SelectTrigger className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500">
                {selectedPlaylist}
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border border-[#333] text-white">
                {playlists.map((p) => (
                  <SelectItem
                    key={p}
                    value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Description</Label>
            <Textarea
              placeholder="Describe the video in detail..."
              rows={5}
              className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
              value={description || ""}
              onChange={(e) => {
                const desc = e.target.value;
                setDescription(desc);
                uploadDescription(desc);
              }}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="bg-[#111] border border-[#333] w-60"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-cyan-600 rounded-md text-black hover:bg-cyan-400">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-black hover:text-red-600">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Privacy + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Visibility */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-cyan-300">Visibility</Label>
              <div className="flex gap-2 flex-wrap">
                {["public", "private", "unlisted"].map((p) => (
                  <button
                    key={p}
                    className={cn(
                      "px-4 py-2 rounded-full border border-cyan-500 text-sm capitalize transition",
                      privacy === p
                        ? "bg-cyan-500 text-black shadow-[0_0_10px_#0ff3]"
                        : "bg-transparent hover:bg-cyan-900"
                    )}
                    onClick={() => setPrivacy(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-cyan-300">Schedule Upload</Label>
              <Input
                type="datetime-local"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Video Preview */}
          <div className="flex flex-col gap-3">
            <Label className="text-sm text-cyan-300">Video Preview</Label>
            <video
              src={videoFile}
              controls
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              className="rounded-xl w-full border border-[#333] shadow-[0_0_12px_#0ff3]"
            />
            <div className="w-full space-y-2">
              <Progress value={uploadProgress ?? 0} />
              <div
                className={cn("text-xs", {
                  "text-cyan-400": uploadStatus === "uploading",
                  "text-green-400": uploadStatus === "completed",
                  "text-red-400": uploadStatus === "error",
                })}>
                {uploadStatus === "uploading" &&
                  `Uploading... ${uploadProgress}%`}
                {uploadStatus === "completed" && "Upload completed!"}
                {uploadStatus === "error" && "Error during upload."}
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-slate-800 w-fit px-4 py-2 rounded">
              Open at:
              <div className="mt-1 text-sm">
                <a
                  href={Link}
                  target="_blank"
                  className="text-cyan-400 hover:underline break-all">
                  {Link}
                </a>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex mt-auto justify-between items-center">
            <div className="text-gray-400 text-sm">
              {loading ? "Saving changes..." : "Saved"}
            </div>
            <div className="flex gap-4 w-full">
              <button className=" py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white w-32 " onClick={() => navigate("/studio")} disabled={loading}>
                Finish Later
              </button>
              {/* <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">
                Schedule
              </button> */}
              <button className=" py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white w-32 " onClick={publishVideo} disabled={loading}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
