import { useEffect, useState } from "react";
import { apiRequest } from "@/api/apiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MoreHorizontal, Video, Globe2, Lock, ThumbsUp, MessageSquare, Play } from "lucide-react";
import moment from "moment";
import { DataTable } from "@/components/admin/DataTable";
import type { ColumnDef, PaginationData } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminVideoDetailsModal } from "@/components/admin/AdminVideoDetailsModal";

export interface AdminVideo {
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
  const [limit, setLimit] = useState(10);
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVideos(page, limit);
  }, [page, limit]);

  const fetchVideos = async (pageNumber: number, currentLimit: number) => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: { data: AdminVideo[]; total: number; page: number; limit: number; totalPages: number }[] }>({
        method: "GET",
        url: `/admin/videos?page=${pageNumber}&limit=${currentLimit}`,
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
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          keyExtractor={(video) => video._id}
        />
      </div>

      <AdminVideoDetailsModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        selectedVideo={selectedVideo} 
      />
    </div>
  );
}
