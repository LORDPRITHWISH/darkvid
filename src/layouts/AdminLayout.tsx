import { Outlet } from "react-router";
import AdminSidebar from "@/components/AdminSidebar";
import Setdata from "@/components/Setdata";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <Setdata />
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
