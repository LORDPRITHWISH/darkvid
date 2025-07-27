import React from 'react'
import { useUserStore } from "../../store/userStore";
import { Navigate } from "react-router";

export default function Direct() {
    const userId = useUserStore((s) => s.userId);

  return (
    <div>Direct to {userId}</div>
  )
}


// src/components/MyChannelRedirect.tsx


//   if (!userId) return null; // Or loader
//   return <Navigate to={`/chanel/${userId}`} replace />;
// };

