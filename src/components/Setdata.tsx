// import axios from "axios";
import { getProfile } from "@/services/user.service";
import { useUserStore } from "@/store/userStore";

function Setdata() {
  // console.log("Setdata component rendered");
  const setUser = useUserStore((state) => state.setUser);

  async function fetchUserData() {
    try {
      const response = await getProfile();
      if (response && response.data) {
        // setUser(response.data);
        setUser(response.data.username, response.data.profilepic);
      } else {
        setUser("", "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  fetchUserData();

  return null;
}

export default Setdata;
