import { useEffect } from "react";
import { getProfile, refreshToken } from "@/services/user.service";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

export default function Setdata() {
  const setUser = useUserStore((state) => state.setUser);
  const setIsUserFetched = useUserStore((state) => state.setIsUserFetched);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      // setIsUserFetched(false);
      try {
        const response = await getProfile();

        if (response?.data && isMounted) {
          setUser(response.data.id, response.data.username, response.data.name, response.data.profilepic, response.data.email, response.data.role);
          setIsUserFetched(true);
          return;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        try {
          const refreshedResponse = await refreshToken();
          if (refreshedResponse?.data && isMounted) {
            const retryResponse = await getProfile();
            if (retryResponse?.data && isMounted) {
              setUser(
                retryResponse.data.id,
                retryResponse.data.username,
                retryResponse.data.name,
                retryResponse.data.profilepic,
                retryResponse.data.email,
                retryResponse.data.role,
              );
              setIsUserFetched(true);
              return;
            }
          }

          // console.log("the responce", refreshedResponse);
        } catch (error) {
          // console.log("The code",error.status);
          console.error("Error refreshing token:", error);
          if (isMounted && (error as AxiosError)?.status === 401) {
            // setUser("", "");
            logout();
            // console.log("Token refresh failed or user data fetch failed. Redirecting to login.");
            // navigate("/login");
          }
        }
      }

      if (isMounted) {
        setIsUserFetched(true);
      }
    }

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [navigate, setUser, setIsUserFetched, logout]);

  return null;
}
