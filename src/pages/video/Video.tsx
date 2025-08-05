import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const playlists = ["Dark Hack Series", "Tech Shorts", "Unlisted Secrets", "Learning AI"];

export default function DetailsZone({ videoFile, thumbnail }) {
  const [privacy, setPrivacy] = useState("public");
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");

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

      {/* Thumbnail Upload + Preview */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Thumbnail</Label>
        <Input
          type="file"
          accept="image/*"
          className="bg-[#111] border border-[#333] file:text-cyan-400"
        />
        <img
          src={thumbnail}
          alt="thumbnail preview"
          className="rounded-xl w-full h-48 object-cover border border-[#333] shadow-[0_0_12px_#0ff3]"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Video Title</Label>
        <Input
          placeholder="Enter a dark and catchy title..."
          className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Playlist Dropdown */}
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
          placeholder="Describe the secrets behind the hack..."
          rows={4}
          className="bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Privacy Options */}
      <div className="md:col-span-2 flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Privacy</Label>
        <div className="flex gap-4">
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

      {/* Schedule Upload Toggle */}
      <div className="md:col-span-2 flex flex-col gap-2">
        <Label className="text-sm text-cyan-300">Schedule Upload</Label>
        <button
          className={cn(
            "px-5 py-2 w-fit rounded-full text-sm transition flex items-center gap-2 border",
            scheduleEnabled
              ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_#0ff3]"
              : "bg-transparent border-cyan-500 hover:bg-cyan-900 text-cyan-300"
          )}
          onClick={() => setScheduleEnabled(!scheduleEnabled)}
        >
          <CalendarIcon size={16} />
          {scheduleEnabled ? "Scheduled" : "Off"}
        </button>

        {scheduleEnabled && (
          <Input
            type="datetime-local"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="mt-2 bg-[#111] border border-[#333] focus:ring-2 focus:ring-cyan-500 max-w-sm"
          />
        )}
      </div>
    </section>
  );
}
