import { useEffect, useState } from "react";
import { apiRequest } from "@/api/apiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Ban, Shield, Eye, MoreHorizontal } from "lucide-react";
import moment from "moment";
import { DataTable, ColumnDef, PaginationData } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminUserDetailsModal } from "@/components/admin/AdminUserDetailsModal";

export interface AdminUser {
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

export default function AdminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page, limit]);

  const fetchUsers = async (pageNumber: number, currentLimit: number) => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: { data: AdminUser[]; total: number; page: number; limit: number; totalPages: number }[] }>({
        method: "GET",
        url: `/admin/users?page=${pageNumber}&limit=${currentLimit}`,
      });

      if (response && response.data && response.data.length > 0) {
        const result = response.data[0];
        setUsers(result.data);
        setPagination({
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      header: "User",
      accessorKey: "name",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarImage src={user.profilepic} alt={user.name} />
            <AvatarFallback className="bg-indigo-600 text-white">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-white">{user.name}</span>
              {user.isVerified && (
                <CheckCircle2 size={14} className="text-blue-400" />
              )}
            </div>
            <div className="text-xs text-zinc-500">{user.email}</div>
            <div className="text-[10px] text-zinc-600 mt-0.5">@{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
          user.role === 'admin' 
            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
            : 'bg-zinc-800 text-zinc-300 border border-white/5'
        }`}>
          {user.role === 'admin' && <Shield size={12} />}
          <span className="capitalize">{user.role}</span>
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isBanned",
      cell: (user) => (
        <div className="flex flex-col gap-1.5">
          {user.isBanned ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
              <Ban size={10} /> Banned
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
              <CheckCircle2 size={10} /> Active
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Stats",
      cell: (user) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-400"><strong className="text-zinc-300 font-medium">{user.videoCount || 0}</strong> videos</span>
          <span className="text-xs text-zinc-400"><strong className="text-zinc-300 font-medium">{user.subscriberCount || 0}</strong> subs</span>
        </div>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (user) => (
        <span className="text-sm text-zinc-400">
          {moment(user.createdAt).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      cell: (user) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={() => handleViewUser(user)}
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
              <DropdownMenuItem className="text-zinc-300 hover:text-white focus:bg-white/5 cursor-pointer" onClick={() => handleViewUser(user)}>
                View Details
              </DropdownMenuItem>
              {user.isBanned ? (
                <DropdownMenuItem className="text-emerald-400 hover:text-emerald-300 focus:bg-emerald-500/10 cursor-pointer">
                  Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:bg-red-500/10 cursor-pointer">
                  Ban User
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
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your platform's users, roles, and statuses.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1); // Reset to page 1 when limit changes
          }}
          keyExtractor={(user) => user._id}
        />
      </div>

      <AdminUserDetailsModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        selectedUser={selectedUser} 
      />
    </div>
  );
}
