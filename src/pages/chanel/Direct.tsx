import React from 'react'
import { useUserStore } from "../../store/userStore";
import { Navigate } from "react-router";

export default function Direct() {
    const userId = useUserStore((s) => s.userId);
    
      if (!userId) return null; // Or loader
      return <Navigate to={`/chanel/${userId}`} replace />;

  // return (
    // <div>Direct to {userId}</div>
  // )
}


// src/components/MyChannelRedirect.tsx


// };

