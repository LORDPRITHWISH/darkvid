import { useEffect } from "react";
import { getProfile, refreshToken } from "@/services/user.service";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
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

        console.log("hi there");

        if (response?.data && isMounted) {
          setUser(response.data.username, response.data.name, response.data.profilepic, response.data.email);
          return;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      
      try {
        const refreshedResponse = await refreshToken();
        if (refreshedResponse?.data && isMounted) {
          const retryResponse = await getProfile();
          if (retryResponse?.data && isMounted) {
            setUser(retryResponse.data.id, retryResponse.data.name, retryResponse.data.profilepic, retryResponse.data.email);
            return;
          }
        }
        
        console.log("the responce", refreshedResponse);
      } catch (error) {
        // console.log("The code",error.status);
        console.error("Error refreshing token:", error);
        if (isMounted && (error as AxiosError)?.status === 401) {
          // setUser("", "");
          logout();
          // console.log("Token refresh failed or user data fetch failed. Redirecting to login.");
          navigate("/login");
        }
      }
    }

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  return null;
}
