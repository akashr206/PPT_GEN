"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function AuthListener() {
  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error("Session expired. Please log in again.");
      signOut({ callbackUrl: "/" });
    };

    window.addEventListener("session-expired", handleSessionExpired);
    
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  return null;
}
