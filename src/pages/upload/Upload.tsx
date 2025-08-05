import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const playlists = ["Dark Hack Series", "Tech Shorts", "Unlisted Secrets", "Learning AI"];

export default function DetailsZone({ videoFile, thumbnail }) {
  const [privacy, setPrivacy] = useState("public");
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [uploadDate, setUploadDate] = useState("");

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <section className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0d0d0d] rounded-2xl shadow-[0_0_20px_#0ff3] border border-[#1f1f1f] text-white">

      {/* Video Preview */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Video Preview</Label>
        <video
          src={videoFile}
          controls
          className="rounded-xl w-full border border-[#333] shadow-[0_0_12px_#0ff3]"
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Thumbnail</Label>
        <img
          src={thumbnail}
          alt="thumbnail preview"
          className="rounded-xl w-full h-48 object-cover border border-[#333] shadow-[0_0_12px_#0ff3]"
        />
        <Input type="file" accept="image/*" className="mt-2 bg-[#111] border border-[#333]" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Video Title</Label>
        <Input
          placeholder="Catchy title here..."
          className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Playlist */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Playlist</Label>
        <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
          <SelectTrigger className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500">
            {selectedPlaylist}
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1a] border border-[#333] text-white">
            {playlists.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="md:col-span-2 flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Description</Label>
        <Textarea
          placeholder="Describe the video in detail..."
          rows={4}
          className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
        />
      </div>

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
              onClick={() => setPrivacy(p)}
            >
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

      {/* Tags */}
      <div className="md:col-span-2 flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag and press Enter"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            className="bg-[#111] border border-[#333] w-60"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-cyan-600 rounded-md text-black hover:bg-cyan-400"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="text-black hover:text-red-600">
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
