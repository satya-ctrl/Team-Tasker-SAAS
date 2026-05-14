"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const publicRoutes = ["/", "/login", "/signup"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser, setLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        router.push("/login");
      }
      if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
