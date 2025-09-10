import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Lock, Globe } from "lucide-react";

// Mock Data similar to YouTube Studio
const videoData = [
  { id: 1, title: "2025 07 21 05 14 25", duration: "0:58", visibility: "Private", date: "10 Aug 2025", views: 0, comments: 0, likes: "-" },
  { id: 2, title: "2025 07 21 05 20 33", duration: "3:45", visibility: "Private", date: "7 Aug 2025", views: 0, comments: 0, likes: "-" },
  { id: 3, title: "Next.js Crash Course", duration: "10:41:21", visibility: "Private", date: "3 Aug 2025", views: 0, comments: 0, likes: "-" },
  { id: 4, title: "Welcome to Tryhard", duration: "2:59", visibility: "Public", date: "20 Apr 2025", views: 9, comments: 0, likes: "-" },
  { id: 5, title: "videolar 2*2", duration: "1:14", visibility: "Public", date: "8 Nov 2024", views: 3, comments: 0, likes: "100% (1 like)" },
];

export default function StudioPage() {
  const [search, setSearch] = useState("");

  const filteredVideos = videoData.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">Channel Content</h1>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-slate-900 border-slate-700 text-white"
        />
        <Button variant="outline" className="border-slate-700 text-white">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300">Video</TableHead>
                <TableHead className="text-slate-300">Visibility</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Views</TableHead>
                <TableHead className="text-slate-300">Comments</TableHead>
                <TableHead className="text-slate-300">Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800 w-16 h-10 flex items-center justify-center text-xs rounded">
                        {video.duration}
                      </div>
                      <div>
                        <p className="font-medium text-white">{video.title}</p>
                        <p className="text-xs text-slate-400">Add description</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {video.visibility === "Private" ? (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Lock className="w-4 h-4" /> Private
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Globe className="w-4 h-4" /> Public
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400">{video.date}</TableCell>
                  <TableCell className="text-slate-400">{video.views}</TableCell>
                  <TableCell className="text-slate-400">{video.comments}</TableCell>
                  <TableCell className="text-slate-400">{video.likes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
