import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Lock, Globe } from "lucide-react";
import { getStudioVideo } from "@/services/studio.service";
import { useNavigate } from "react-router";
import type { StudioVideo } from "@/types/studio.types";



export default function StudioPage() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<StudioVideo[]>([]);

  const fetchVideos = async () => {
    const response = await getStudioVideo();
    if (response && response.data) {
      setVideos(response.data);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  console.log(videos);

  const filteredVideos = videos.filter((video) => video.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">Channel Content</h1>

      <div className="flex items-center gap-2">
        <Input placeholder="Filter videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm bg-slate-900 border-slate-700 text-white" />
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
                <TableHead className="text-slate-300">Total Views</TableHead>
                <TableHead className="text-slate-300">Unique Views</TableHead>
                <TableHead className="text-slate-300">Comments</TableHead>
                <TableHead className="text-slate-300">Likes</TableHead>
                <TableHead className="text-slate-300">Dislikes</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video._id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* <div className="bg-slate-800 w-16 h-10 flex items-center justify-center text-xs rounded">{video.duration}</div> */}
                      <img src={video.thumbnailUrl || "/thumb.jpg"} alt="thumbnail" className="w-20 h-16 object-cover rounded" />
                      <div>
                        <p className="font-medium text-white text-xl">{video.title}</p>
                        {/* <p className="text-xs text-slate-400">Add description</p> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {video.privacy === "private" ? (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Lock className="w-4 h-4" /> Private
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Globe className="w-4 h-4" /> Public
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400">{video.createdAt}</TableCell>
                  <TableCell className="text-slate-400">{video.totalViews}</TableCell>
                  <TableCell className="text-slate-400">{video.uniqueViews}</TableCell>
                  <TableCell className="text-slate-400">{video.commentCount}</TableCell>
                  <TableCell className="text-slate-400">{video.likes}</TableCell>
                  <TableCell className="text-slate-400">{video.dislikes}</TableCell>
                  <TableCell className="text-slate-400">
                    <div className="flex h-full items-center gap-2">
                    <Button variant="link" className="text-slate-400 bg-slate-800" onClick={() => navigate(`/edit/${video.videoId}`)}>
                      Edit
                    </Button>
                    <Button variant="link" className="text-slate-400 bg-slate-800" onClick={() => navigate(`/video/${video.videoId}`)}>
                      play
                    </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
