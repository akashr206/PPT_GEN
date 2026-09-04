"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function AuthListener() {
  useEffect(() => {
    const handleSessionExpired = async () => {
      toast.error("Session expired. Please log in again.");
      await signOut({ redirect: false });
      window.location.href = "/";
    };

    window.addEventListener("session-expired", handleSessionExpired);
    
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  return null;
}
