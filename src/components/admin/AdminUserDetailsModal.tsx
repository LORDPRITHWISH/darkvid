import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Ban, Shield } from "lucide-react";
import moment from "moment";
import { GenericSubResourceTable } from "@/components/admin/GenericSubResourceTable";
import { videoColumns, userColumns, commentColumns } from "@/components/admin/SharedColumns";

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  name: string;
  profilepic: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  role: string;
  videoCount: number;
  totalViews: number;
  subscriberCount: number;
  bio?: string;
  updatedAt?: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUser | null;
}

export function AdminUserDetailsModal({ isOpen, onOpenChange, selectedUser }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");

  if (!selectedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[70vh]">
          <div className="flex gap-4 border-b border-white/10 px-6 pt-2 shrink-0 overflow-x-auto">
            {["Overview", "Videos", "Liked Videos", "Disliked", "Comments", "Subscribers", "Subscriptions"].map(tab => (
              <button 
                key={tab} 
                className={`pb-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`} 
                onClick={() => setActiveTab(tab)}
              >
                 {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-6 pt-4 min-h-0">
            {activeTab === "Overview" && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-2 border-white/10">
                    <AvatarImage src={selectedUser.profilepic} />
                    <AvatarFallback className="bg-indigo-600 text-2xl text-white">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                      {selectedUser.isVerified && <CheckCircle2 size={18} className="text-blue-400" />}
                    </div>
                    <p className="text-zinc-400">@{selectedUser.username}</p>
                    <p className="text-zinc-500 text-sm mt-1">{selectedUser.email}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                        selectedUser.role === 'admin' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-zinc-800 text-zinc-300 border border-white/5'
                      }`}>
                        {selectedUser.role === 'admin' && <Shield size={12} />}
                        <span className="capitalize">{selectedUser.role}</span>
                      </span>
                      
                      {selectedUser.isBanned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          <Ban size={12} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{selectedUser.videoCount || 0}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">Videos</p>
                  </div>
                  <div className="text-center border-l border-r border-white/10">
                    <p className="text-2xl font-bold text-white">{selectedUser.subscriberCount || 0}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">Subscribers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{selectedUser.totalViews || 0}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">Total Views</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-300">Account Information</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <p className="text-zinc-500 mb-1">User ID</p>
                      <p className="font-mono text-zinc-300">{selectedUser._id}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 mb-1">Joined Date</p>
                      <p className="text-zinc-300">{moment(selectedUser.createdAt).format("MMMM Do, YYYY")}</p>
                    </div>
                    {selectedUser.bio && (
                      <div className="col-span-2">
                        <p className="text-zinc-500 mb-1">Bio</p>
                        <p className="text-zinc-300">{selectedUser.bio}</p>
                      </div>
                    )}
                    {selectedUser.updatedAt && (
                      <div>
                        <p className="text-zinc-500 mb-1">Last Updated</p>
                        <p className="text-zinc-300">{moment(selectedUser.updatedAt).fromNow()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Videos" && (
              <GenericSubResourceTable 
                url={`/admin/user/${selectedUser._id}/videos`} 
                columns={videoColumns} 
              />
            )}
            {activeTab === "Liked Videos" && (
              <GenericSubResourceTable 
                url={`/admin/user/${selectedUser._id}/liked-videos`} 
                columns={videoColumns} 
              />
            )}
            {activeTab === "Disliked" && (
              <GenericSubResourceTable 
                url={`/admin/user/${selectedUser._id}/disliked-videos`} 
                columns={videoColumns} 
              />
            )}
            {activeTab === "Comments" && (
              <GenericSubResourceTable 
                url={`/admin/user/${selectedUser._id}/comments`} 
                columns={commentColumns} 
              />
            )}
            {activeTab === "Subscribers" && (
              <GenericSubResourceTable 
                url={`/admin/user/${selectedUser._id}/subscribers`} 
                columns={userColumns} 
              />
            )}
            {activeTab === "Subscriptions" && (
              <GenericSubResourceTable 
                url={`/admin/user/${selectedUser._id}/subscriptions`} 
                columns={userColumns} 
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
