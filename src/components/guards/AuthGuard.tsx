import { Navigate, Outlet } from "react-router";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

const AuthGuard = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const isUserFetched = useUserStore((state) => state.isUserFetched);

  useEffect(() => {
    console.log("AuthGuard render - isUserFetched:", isUserFetched, "isLoggedIn:", isLoggedIn);
  }, [isUserFetched, isLoggedIn]);

  if (!isUserFetched) {
    // Show a loading state while fetching user data
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log("Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
