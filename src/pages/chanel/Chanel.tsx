import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUserChannel } from "@/services/user.service";

type ChannelData = {
  _id: string;
  username: string;
  name: string;
  profilepic: string;
  bio: string;
  coverimage: string;
  subscriberCount: number;
  subscriptionCount: number;
  isSubscribed: boolean;
};

function Chanel() {
  const { userid } = useParams<{ userid: string }>();
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Chanel component mounted with userid:", userid);

  useEffect(() => {
    if (!userid) return;

    // console.log("Fetching channel data for:", userid);

    // getUserChannel(userid).then((response) => {
    //   console.log("api responce :", response);
    // });

    // axios
    //   .get(`${import.meta.env.VITE_API_URL}/api/v1/users/c/${userid}`, { withCredentials: true })
    //   .then((res) => {
    //     setChannel(res.data.data);
    //   })
    //   .catch(() => {
    //     setError("Failed to fetch channel");
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });

    const fetchChannel = async () => {
      try {
        const response = await getUserChannel(userid);
        console.log("API response:", response);
        if (response && response.data) {
          setChannel(response.data);
        } else {
          setError("No data found");
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
        setError("Failed to fetch channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [userid]);

  if (loading) return <div>Loading...</div>;
  if (error || !channel) return <div>{error || "No data found"}</div>;

  return (
    <div className="max-w-xl mx-auto p-4 shadow-xl rounded-xl bg-white">
      <img
        src={channel.coverimage}
        alt="cover"
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <div className="flex items-center space-x-4 -mt-10 p-4">
        <img
          src={channel.profilepic}
          alt="profile"
          className="w-24 h-24 rounded-full border-4 border-white object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{channel.name}</h2>
          <p className="text-gray-500">@{channel.username}</p>
        </div>
      </div>
      <p className="p-4 text-gray-700">{channel.bio}</p>
      <div className="px-4 pb-4 flex justify-between text-sm text-gray-600">
        <span>Subscribers: {channel.subscriberCount}</span>
        <span>Subscriptions: {channel.subscriptionCount}</span>
        <span>{channel.isSubscribed ? "Subscribed" : "Not Subscribed"}</span>
      </div>
    </div>
  );
}

export default Chanel;
