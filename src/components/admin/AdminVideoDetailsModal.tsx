import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Globe2, Lock, Clock, ThumbsUp, MessageSquare, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { GenericSubResourceTable } from "@/components/admin/GenericSubResourceTable";
import { userColumns, commentColumns } from "@/components/admin/SharedColumns";
import type { AdminVideo } from "@/pages/admin/management/AdminVideoManagement";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVideo: AdminVideo | null;
}

export function AdminVideoDetailsModal({ isOpen, onOpenChange, selectedVideo }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");

  if (!selectedVideo) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[700px] p-0 overflow-hidden">
        <div className="flex flex-col h-[85vh]">
          <div className="flex gap-4 border-b border-white/10 px-6 shrink-0 overflow-x-auto bg-black pt-4">
            {["Overview", "Viewers", "Likes", "Dislikes", "Comments"].map(tab => (
              <button 
                key={tab} 
                className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`} 
                onClick={() => setActiveTab(tab)}
              >
                 {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 bg-[#09090b]">
            {activeTab === "Overview" && (
              <div>
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
            {activeTab === "Viewers" && (
              <div className="p-6">
                <GenericSubResourceTable 
                  url={`/admin/video/${selectedVideo.videoId}/viewers`} 
                  columns={userColumns} 
                />
              </div>
            )}
            {activeTab === "Likes" && (
              <div className="p-6">
                <GenericSubResourceTable 
                  url={`/admin/video/${selectedVideo.videoId}/like`} 
                  columns={userColumns} 
                />
              </div>
            )}
            {activeTab === "Dislikes" && (
              <div className="p-6">
                <GenericSubResourceTable 
                  url={`/admin/video/${selectedVideo.videoId}/dislike`} 
                  columns={userColumns} 
                />
              </div>
            )}
            {activeTab === "Comments" && (
              <div className="p-6">
                <GenericSubResourceTable 
                  url={`/admin/video/${selectedVideo.videoId}/comments`} 
                  columns={commentColumns} 
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
