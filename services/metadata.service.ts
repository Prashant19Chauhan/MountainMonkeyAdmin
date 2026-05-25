import { api } from "@/lib/api";
import { seoValidationSchema } from "@/lib/validation/metaData.validation";
import { AxiosError } from "axios";

export const createMetaData = async (pageId: string, typeOfPage: string, data: any) => {
    try{
        const validate = seoValidationSchema.safeParse(data);
        if(!validate.success){
            const errorMsg = validate.error.issues.map(err => {
                const pathStr = err.path.join('.');
                return pathStr ? `${pathStr}: ${err.message}` : err.message;
            }).join(', ');
            throw new Error(errorMsg);
        }

        const result = await api.post(`/meta-data/create/${typeOfPage}/${pageId}`, data);
        return result.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        if (error instanceof Error) {
            throw error.message;
        }
        throw "Something went wrong";
    }
};

export const getMetaData = async (pageId: string) => {
    try{
        const result = await api.get(`/meta-data/single/${pageId}`);
        return result.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        throw "Something went wrong";
    }
};

export const updateMetaData = async (pageId: string, data: any) => {
    try{
        const validate = seoValidationSchema.partial().safeParse(data);
        if(!validate.success){
            const errorMsg = validate.error.issues.map(err => {
                const pathStr = err.path.join('.');
                return pathStr ? `${pathStr}: ${err.message}` : err.message;
            }).join(', ');
            throw new Error(errorMsg);
        }
        const result = await api.put(`/meta-data/update/${pageId}`, data);
        return result.data;
    }catch(error){
        if(error instanceof AxiosError){
            throw error.response?.data.message;
        }
        if (error instanceof Error) {
            throw error.message;
        }
        throw "Something went wrong";
    }
};


