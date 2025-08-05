import { useUserStore } from "../../store/userStore";
import { Navigate } from "react-router";

export default function Direct() {
    const userId = useUserStore((s) => s.userId);
    
      if (!userId) return <Navigate to="/login" replace />; 
      return <Navigate to={`/chanel/${userId}`} replace />;

  // return (
    // <div>Direct to {userId}</div>
  // )
}


// src/components/MyChannelRedirect.tsx


// };

