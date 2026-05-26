import { LocalInfoInputType } from "@/lib/validation/localInfo.validation"
import { api } from "@/lib/api"
import { AxiosError } from "axios"

export const createLocalInfoApi = async(data: LocalInfoInputType) => {
    try{
        const response = await api.post("/local-info", data)
        return response.data
    }catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("Something went wrong")
    }
}

export const updateLocalInfoApi = async(slug: string, data: LocalInfoInputType) => {
    try{
        const response = await api.put(`/local-info/${slug}`, data)
        return response.data
    }catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("Something went wrong")
    }
}

export const deleteLocalInfoApi = async(slug: string) => {
    try{
        const response = await api.delete(`/local-info/${slug}`)
        return response.data
    }catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("Something went wrong")
    }
}

export const getLocalInfoByIdApi = async(slug: string) => {
    try{
        const response = await api.get(`/local-info/${slug}`)
        return response.data
    }catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("Something went wrong")
    }
}

export const getAllLocalInfosApi = async(page: number, limit: number, search?: string) => {
    try{
        const response = await api.get(`/local-info?page=${page}&limit=${limit}&search=${search}`)
        return response.data
    }catch(error){
        if(error instanceof AxiosError){
            throw error
        }
        throw new Error("Something went wrong")
    }
}