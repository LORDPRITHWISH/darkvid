import { useEffect } from "react";
import { getProfile, refreshToken } from "@/services/user.service";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router";
// import { log } from "console";

export default function Setdata() {
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      try {
        const response = await getProfile();

        if (response?.data && isMounted) {
          setUser(response.data.username, response.data.name, response.data.profilepic, response.data.email);
          return;
        }
        
        const refreshedResponse = await refreshToken();
        if (refreshedResponse?.data && isMounted) {
          const retryResponse = await getProfile();
          if (retryResponse?.data && isMounted) {
            setUser(retryResponse.data.id, retryResponse.data.name, retryResponse.data.profilepic, retryResponse.data.email);
            return;
          }
        }

        if (isMounted && refreshedResponse?.code === 401 ) {
          // setUser("", "");
          logout();
          console.log("Token refresh failed or user data fetch failed. Redirecting to login.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  return null;
}