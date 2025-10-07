import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { getVideoDetails } from "@/services/video.service";
import ImageUpload from "@/components/upload/ImageUpload";
import { uploadThumbnail } from "@/utils/upload.utils";
import { debounce } from "lodash";
import { setVideoData } from "@/services/upload.service";

export default function DetailsZone() {
  const { videoid } = useParams<{ videoid: string }>();
  // const [videoDetails, setVideoDetails] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [uploadDate, setUploadDate] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");

  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!videoid) return;
      const response = await getVideoDetails(videoid || "");
      console.log("Video details fetched", response);
      setThumbnail(response?.data?.thumbnailUrl || "/thumb.jpg");
      setTitle(response?.data?.title || "");
      setPrivacy(response?.data?.privacy || "public");
      setDescription(response?.data?.description || "");
      setIsPublished(response?.data?.isPublished || false);
      setTags(response?.data?.tags || []);
      setVideoLink(response?.data?.playbackUrl || "");
    };
    fetchVideoDetails();
  }, [videoid]);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

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

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const Link = `${import.meta.env.VITE_Frontend_URL}/video/${videoid}`;

  useEffect(() => {
    if (thumbnailFile && videoDetails) {
      uploadThumbnail(thumbnailFile, videoDetails.videoId);
    }
  }, [thumbnailFile]);

  return (
    <section className="w-full py-6 px-12 bg-[#0d0d0d] rounded-2xl shadow-[0_0_20px_#0ff3] border border-[#1f1f1f] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* LEFT SIDE: Fields */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Video Title</Label>
            <Input
              placeholder="Catchy title here..."
              className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                uploadTitle(e.target.value);
              }}
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Thumbnail</Label>
            <ImageUpload
              initialImage={thumbnail}
              onFileChange={setThumbnailFile}
            />
          </div>

          {/* Playlist */}
          {/* <div className="flex flex-col gap-2">
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
              </SelectContent>uploadDescription
            </Select>
          </div> */}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Description</Label>
            <Textarea
              placeholder="Describe the video in detail..."
              rows={5}
              className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                uploadDescription(e.target.value);
              }}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-cyan-300">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setDetail("tags", [...tags, e.target.value]);
                }}
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
            {/* Privacy */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-cyan-300">Privacy</Label>
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
                    onClick={() => {
                      setPrivacy(p);
                      setDetail("privacy", p);
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Date */}
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

        {/* RIGHT SIDE: Video + Link */}
        <div className="flex flex-col gap-6">
          {/* Video Preview */}
          <div className="flex flex-col gap-3">
            <Label className="text-sm text-cyan-300">Video Preview</Label>
            <video
              src={videoLink}
              controls
              // className="rounded-xl w-full border border-[#333] shadow-[0_0_12px_#0ff3]"
              className="rounded-xl w-full shadow-[0_0_12px_#0ff3]"
            />
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

          {/* Action Buttons */}
          <div className="flex mt-auto justify-between items-center">
            <div className="text-gray-400 text-sm">
              {loading ? "Saving changes..." : "Saved"}
            </div>
            {isPublished ? (
              <div className="flex gap-4 flex-row w-fit">
                <button
                  className=" py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white w-32 "
                  onClick={() => {
                    navigate(-1);
                  }}>
                  close
                </button>
              </div>
            ) : (
              <div className="flex gap-4 flex-row w-fit">
                <button className=" py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white w-32 " onClick={() => navigate("/studio")} disabled={loading}>
                  Finish Later
                </button>
                {/* <button className=" py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white w-32 ">
                  Schedule
                </button> */}
                <button className=" py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white w-32 ">
                  Publish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
