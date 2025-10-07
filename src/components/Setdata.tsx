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
          setUser(response.data.username, response.data.profilepic);
          return;
        }

        const refreshedResponse = await refreshToken();
        if (refreshedResponse?.data && isMounted) {
          const retryResponse = await getProfile();
          if (retryResponse?.data) {
            setUser(retryResponse.data.username, retryResponse.data.profilepic);
            return;
          }
        }

        if (isMounted) {
          // setUser("", "");
          logout();
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