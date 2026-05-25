"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthRoutesProvider({
  children,
}: Props) {
  const router = useRouter();
  const { token, user, hydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (hydrated) {
      if (token && user) {
        router.replace("/");
      } else {
        setIsChecking(false);
      }
    }
  }, [token, user, hydrated, router]);

  if (!hydrated || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}