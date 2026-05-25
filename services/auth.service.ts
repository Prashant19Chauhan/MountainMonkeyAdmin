import { api } from "@/lib/api";
import { LoginInput } from "@/lib/validation/auth.validation";
import { AxiosError } from "axios";

export const LoginApi = async(formData: LoginInput) => {
    try{
        const response = await api.post("/auth/login", formData);
        return response.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
}
