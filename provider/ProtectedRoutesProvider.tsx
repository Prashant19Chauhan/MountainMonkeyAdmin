"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoutesProvider({
  children,
}: Props) {
  const router = useRouter();
  const { token, user, hydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (hydrated) {
      if (!token || !user) {
        toast.info("Please login to continue");
        router.replace("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [token, user, hydrated, router]);

  if (!hydrated || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}