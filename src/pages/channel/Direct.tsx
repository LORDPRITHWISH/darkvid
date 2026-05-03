import { useUserStore } from "../../store/userStore";
import { Navigate } from "react-router";

export default function Direct() {
    const username = useUserStore((s) => s.username);

    
      if (!username) return <Navigate to="/login" replace />; 
      return <Navigate to={`/Channel/${username}`} replace />;

  // return (
    // <div>Direct to {userId}</div>
  // )
}


// src/components/MyChannelRedirect.tsx


// };

