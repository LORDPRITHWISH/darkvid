import { Outlet } from "react-router";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router";

const EivationGuard = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const isUserFetched = useUserStore((state) => state.isUserFetched);

  if (!isUserFetched) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default EivationGuard;