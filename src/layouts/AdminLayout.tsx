import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black">
      <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar collapsed={collapsed} />
        <main className="flex-1 overflow-y-auto p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
