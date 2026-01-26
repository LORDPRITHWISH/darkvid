import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Lock, Globe } from "lucide-react";
import { getStudioVideo } from "@/services/studio.service";
import { useNavigate } from "react-router";
import type { StudioVideo } from "@/types/studio.types";
import { PopupCustom } from "@/components/PopupCustom";
import { deleteVideo } from "@/services/video.service";
// import { set } from "lodash";
import { toast } from "sonner";
// import { Skeleton } from "node_modules/@types/three";
import { Skeleton } from "@/components/ui/skeleton";
// import { TfiReload } from "react-icons/tfi";
import { ImSpinner11 } from "react-icons/im";
import { Spinner } from "@/components/ui/spinner";

export function SkeletonTable() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function StudioPage() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<StudioVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getStudioVideo();
      if (response && response.data) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Error fetching studio videos:", error);
      toast.error("Failed to fetch studio videos.");
    } finally {
      setLoading(false);
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Filter videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm bg-slate-900 border-slate-700 text-white" />
          <Button variant="outline" className="border-slate-700 text-white">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
        <Button variant="outline" className={`border-slate-700 text-white `} onClick={fetchVideos} disabled={loading}>
          <ImSpinner11 className={`w-4 h-4  text-white ${loading && "animate-spin"} `} />
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="relative">
          {/* <div> */}
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
              {loading && filteredVideos.length === 0
                ? Array.from({ length: 7 }).map((_, index) => (
                    <TableRow key={index} className="border-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-15 w-20" />
                          <Skeleton className="h-10 w-60" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : filteredVideos.map((video) => (
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
                          <PopupCustom
                            title="Delete Video"
                            description={`Are you sure you want to delete this video "${video.title}"? This action cannot be undone.`}
                            actionText="Delete"
                            cancelText="Cancel"
                            onAction={() => deleteVideo(video.videoId)}
                            triggerElement={
                              <Button variant="link" className="text-slate-400 bg-slate-800">
                                Delete
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {loading && filteredVideos.length > 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
              <Spinner />
            </div>
          )}
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
