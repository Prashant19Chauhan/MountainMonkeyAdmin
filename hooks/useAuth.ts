"use client"

import { LoginInput, LoginSchema } from "@/lib/validation/auth.validation";
import { useState } from "react";
import {useMutation} from "@tanstack/react-query";
import { LoginApi } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import z from "zod";
import { toast } from "react-toastify";


export default function useAuth() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    isPending,
    isError,
    error,
    mutate: login,
  } = useMutation({
    mutationFn: LoginApi,

    onSuccess: (data) => {
      const accessToken = data?.data?.accessToken || data?.accessToken;
      const user = data?.data?.user || data?.user;
      useAuthStore.getState().setAuth(accessToken, user);
      router.push("/");
    },
  });

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try{
      formData.email = formData.email.trim().toLowerCase()
      const parsed = LoginSchema.parse(formData)
      login(parsed)

    }catch(error: any){
      if(error instanceof z.ZodError){
        toast.error(error?.issues[0]?.message)
        return
      }
      toast.error(error?.message || "Something went wrong")
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isLoginLoading: isPending,
    isLoginError: isError,
    loginError: error,
  }
}
