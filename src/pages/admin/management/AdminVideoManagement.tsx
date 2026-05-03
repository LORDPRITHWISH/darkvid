import { useEffect, useState } from "react";
import { apiRequest } from "@/api/apiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MoreHorizontal, Video, Globe2, Lock, Clock, ThumbsUp, MessageSquare, Play, Calendar } from "lucide-react";
import moment from "moment";
import { DataTable, ColumnDef, PaginationData } from "@/components/admin/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminVideo {
  _id: string;
  videoId: string;
  title?: string;
  description?: string;
  tags: string[];
  views: number;
  privacy: "public" | "private" | "unlisted";
  isPublished: boolean;
  status: "uploading" | "processing" | "completed" | "failed";
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  duration: number;
  thumbnailID?: string;
  thumbnailUrl?: string;
  ownerDetails: {
    _id: string;
    username: string;
    name: string;
    profilepic: string;
  };
  comments: number;
  likes: number;
  dislikes: number;
}

export default function AdminVideoManagement() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const fetchVideos = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: { data: AdminVideo[]; total: number; page: number; limit: number; totalPages: number }[] }>({
        method: "GET",
        url: `/admin/videos?page=${pageNumber}&limit=${limit}`,
      });

      if (response && response.data && response.data.length > 0) {
        const result = response.data[0];
        setVideos(result.data);
        setPagination({
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVideo = (video: AdminVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getThumbnailUrl = (video: AdminVideo) => {
    return video.thumbnailUrl || "";
  };

  const columns: ColumnDef<AdminVideo>[] = [
    {
      header: "Video",
      accessorKey: "title",
      cell: (video) => (
        <div className="flex items-center gap-3 w-72 lg:w-96">
          <div className="w-24 h-14 bg-zinc-800 rounded-md overflow-hidden shrink-0 relative flex items-center justify-center border border-white/5">
            {video.thumbnailUrl || video.thumbnailID ? (
               <img 
                 src={getThumbnailUrl(video)} 
                 alt={video.title || video.videoId} 
                 className="w-full h-full object-cover" 
                 onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).className = 'hidden'; }}
               />
            ) : (
              <Video className="text-zinc-600" size={24} />
            )}
            <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-medium text-white">
              {formatDuration(video.duration)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate text-sm" title={video.title || video.videoId}>
              {video.title || "Untitled Video"}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 font-mono">{video.videoId}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Owner",
      accessorKey: "owner",
      cell: (video) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={video.ownerDetails?.profilepic} />
            <AvatarFallback className="bg-indigo-600 text-[10px] text-white">
              {video.ownerDetails?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-zinc-300 whitespace-nowrap">{video.ownerDetails?.name || "Unknown"}</span>
        </div>
      ),
    },
    {
      header: "Status & Privacy",
      cell: (video) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            {video.status === 'completed' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                Completed
              </span>
            ) : video.status === 'uploading' || video.status === 'processing' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                {video.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                {video.status}
              </span>
            )}
            
            {video.deleted && (
               <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                 Deleted
               </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            {video.privacy === 'public' ? <Globe2 size={12} /> : <Lock size={12} />}
            <span className="capitalize">{video.privacy}</span>
            {video.isPublished ? (
              <span className="ml-1 text-[10px] bg-zinc-800 px-1.5 rounded text-zinc-300">Published</span>
            ) : (
              <span className="ml-1 text-[10px] bg-zinc-800 px-1.5 rounded text-zinc-500">Draft</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Metrics",
      cell: (video) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1 text-zinc-300"><Play size={12} className="text-zinc-500"/> {video.views || 0} views</div>
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1 text-zinc-400"><ThumbsUp size={12}/> {video.likes || 0}</span>
             <span className="flex items-center gap-1 text-zinc-400"><MessageSquare size={12}/> {video.comments || 0}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (video) => (
        <div className="flex flex-col gap-1 text-sm text-zinc-400">
          <span>{moment(video.createdAt).format("MMM D, YYYY")}</span>
          <span className="text-[10px] text-zinc-500">{moment(video.createdAt).format("h:mm A")}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right w-16",
      headerClassName: "text-right w-16",
      cell: (video) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={() => handleViewVideo(video)}
          >
            <Eye size={16} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-[#09090b] border-white/10">
              <DropdownMenuItem className="text-zinc-300 hover:text-white focus:bg-white/5 cursor-pointer" onClick={() => handleViewVideo(video)}>
                View Details
              </DropdownMenuItem>
              {video.deleted ? (
                <DropdownMenuItem className="text-emerald-400 hover:text-emerald-300 focus:bg-emerald-500/10 cursor-pointer">
                  Restore Video
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:bg-red-500/10 cursor-pointer">
                  Delete Video
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Management</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor and manage videos uploaded by users.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={videos}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          keyExtractor={(video) => video._id}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[700px] p-0 overflow-hidden">
          {selectedVideo && (
            <div className="flex flex-col max-h-[85vh]">
              <div className="relative w-full aspect-video bg-black flex items-center justify-center shrink-0">
                {selectedVideo.thumbnailUrl || selectedVideo.thumbnailID ? (
                   <img 
                     src={getThumbnailUrl(selectedVideo)} 
                     alt={selectedVideo.title || selectedVideo.videoId} 
                     className="w-full h-full object-cover opacity-50" 
                   />
                ) : (
                  <Video className="text-zinc-600" size={48} />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors border border-white/10">
                    <Play className="text-white ml-1" size={24} />
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                   {selectedVideo.status === 'completed' ? (
                    <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg">Completed</span>
                  ) : (
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg capitalize">{selectedVideo.status}</span>
                  )}
                  {selectedVideo.privacy === 'public' && <span className="bg-zinc-800/80 backdrop-blur text-white text-xs font-semibold px-2 py-1 rounded shadow-lg flex items-center gap-1"><Globe2 size={12}/> Public</span>}
                  {selectedVideo.privacy === 'private' && <span className="bg-zinc-800/80 backdrop-blur text-white text-xs font-semibold px-2 py-1 rounded shadow-lg flex items-center gap-1"><Lock size={12}/> Private</span>}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded">
                  {formatDuration(selectedVideo.duration)}
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold text-white pr-8">
                    {selectedVideo.title || "Untitled Video"}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-zinc-300">ID: {selectedVideo.videoId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {moment(selectedVideo.createdAt).format("MMMM Do YYYY, h:mm a")}</span>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center">
                    <Play size={20} className="text-indigo-400 mb-2"/>
                    <span className="text-xl font-bold">{selectedVideo.views}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Views</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center">
                    <ThumbsUp size={20} className="text-emerald-400 mb-2"/>
                    <span className="text-xl font-bold">{selectedVideo.likes}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Likes</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center">
                    <MessageSquare size={20} className="text-blue-400 mb-2"/>
                    <span className="text-xl font-bold">{selectedVideo.comments}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Comments</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center">
                    <Clock size={20} className="text-purple-400 mb-2"/>
                    <span className="text-xl font-bold">{formatDuration(selectedVideo.duration)}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Duration</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/20">
                  <Avatar className="w-12 h-12 border-2 border-white/10">
                    <AvatarImage src={selectedVideo.ownerDetails?.profilepic} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {selectedVideo.ownerDetails?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500 mb-0.5">Uploaded by</p>
                    <p className="font-semibold text-white">{selectedVideo.ownerDetails?.name}</p>
                    <p className="text-sm text-zinc-400">@{selectedVideo.ownerDetails?.username}</p>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0">
                    View Profile
                  </Button>
                </div>

                {selectedVideo.description && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
                    <p className="text-sm text-zinc-400 whitespace-pre-wrap bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      {selectedVideo.description}
                    </p>
                  </div>
                )}
                
                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                   <div className="mt-6">
                    <h4 className="text-sm font-semibold text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, i) => (
                        <span key={i} className="bg-white/5 border border-white/10 text-zinc-300 text-xs px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
