"use client"

import { LoginInput, LoginSchema } from "@/lib/validation/auth.validation";
import { useState } from "react";
import {useMutation} from "@tanstack/react-query";
import { LoginApi } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";


export default function useAuth() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      useAuthStore.getState().setAuth(data?.accessToken, data?.user)
      router.push("/")
    },
  });

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try{
      const parsed = LoginSchema.parse(formData)
      login(parsed)

    }catch(error){
      throw error
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
