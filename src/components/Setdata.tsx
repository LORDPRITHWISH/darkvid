// import axios from "axios";
import { getProfile, refreshToken } from "@/services/user.service";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router";

function Setdata() {
  // console.log("Setdata component rendered");
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  async function fetchUserData() {
    try {
      const response = await getProfile();

      // console.log("User profile response:", response);
      
      if (response && response.data) {
        // setUser(response.data);
        setUser(response.data.username, response.data.profilepic);
        return
      } 
      
      const refreshedResponse = await refreshToken();
      
      console.log("Refresh token response:", refreshedResponse);
      console.log("hello fucker");

      if (refreshedResponse && refreshedResponse.data) {
        const retryResponse = await getProfile();
        if (retryResponse && retryResponse.data) {
          setUser(retryResponse.data.username, retryResponse.data.profilepic);
          return
        }
      }

        setUser("", "");
        navigate("/login");
        
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  fetchUserData();

  return null;
}

export default Setdata;
