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
                // console.log("User data set in store:", response.data);
            } else {
                // console.log("No user data found in response");
            }
        } catch (error) {
            // console.error("Error fetching user profile:", error);
        }
    }

    fetchUserData();

    // Since this component does not render anything, we can
    // return null or a fragment.

  return null
}

export default Setdata