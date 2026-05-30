'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlogApi, deleteBlogApi, getBlogApi, getBlogsApi, updateBlogApi } from "@/services/blog.service";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export interface BlogInput {
    _id?: string;
    title: string;
    slug?: string;
    author: string;
    shortDescription: string;
    coverImage: string;
    content: string;
    category: string;
    tags: string[];
    status: string;
}

export default function useBlog() {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState<BlogInput>({
        title: '',
        slug: '',
        author: 'MountainMonkey Guide',
        shortDescription: '',
        coverImage: '',
        content: '',
        category: 'Travel Guide',
        tags: [],
        status: 'Active'
    });

    const [editBlogId, setEditBlogId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const updateFields = (fields: Partial<BlogInput>) => {
        setFormData(prev => ({ ...prev, ...fields }))
    }

    const { data: blogsData, isPending: isBlogsLoading, error: blogsError } = useQuery({
        queryKey: ["blogs", page, limit, search],
        queryFn: () => getBlogsApi(page, limit, search)
    });
    
    const { mutate: createBlog, isPending: isCreateBlogLoading, error: createBlogError, isSuccess: isCreateBlogSuccess, reset: resetCreate } = useMutation({
        mutationFn: createBlogApi,
        onSuccess: () => {
            resetForm();
            toast.success("Blog post created successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: (error: string) => {
            toast.error(error);
        }
    });

    const handleBlogCreate = () => {
        if (!formData.title || !formData.shortDescription || !formData.content || !formData.coverImage) {
            toast.error("Please fill in all required fields.");
            return;
        }
        createBlog(formData);
    }

    const { data: singleBlogData } = useQuery({
        queryKey: ["blog", editBlogId],
        queryFn: () => getBlogApi(editBlogId as string),
        enabled: !!editBlogId
    });

    useEffect(() => {
        if (singleBlogData?.data) {
            setFormData(singleBlogData.data);
        }
    }, [singleBlogData]);

    const { mutate: updateBlog, isPending: isUpdateBlogLoading, error: updateBlogError, isSuccess: isUpdateBlogSuccess, reset: resetUpdate } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateBlogApi(id, data),
        onSuccess: () => {
            toast.success("Blog post updated successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            setTimeout(() => {
                router.push("/blogs");
            }, 500);
        },
        onError: (error: string) => {
            toast.error(error);
        }
    });

    const handleBlogUpdate = () => {
        if (!editBlogId) return;
        if (!formData.title || !formData.shortDescription || !formData.content || !formData.coverImage) {
            toast.error("Please fill in all required fields.");
            return;
        }
        updateBlog({ id: editBlogId, data: formData });
    }

    const { mutate: deleteBlog, isPending: isDeleteBlogLoading, error: deleteBlogError } = useMutation({
        mutationFn: deleteBlogApi,
        onSuccess: () => {
            toast.success("Blog post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            setIsDeleteDialogOpen(false);
        },
        onError: (error: string) => {
            toast.error(error);
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const loading = isCreateBlogLoading || isUpdateBlogLoading;
    const error = createBlogError || updateBlogError;
    const isUpdateSuccess = isCreateBlogSuccess || isUpdateBlogSuccess;

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            author: 'MountainMonkey Guide',
            shortDescription: '',
            coverImage: '',
            content: '',
            category: 'Travel Guide',
            tags: [],
            status: 'Active'
        });
        setEditBlogId(null);
        resetCreate();
        resetUpdate();
    }

    return {
        formData,
        updateFields,
        blogsData,
        isBlogsLoading,
        blogsError,
        createBlog,
        updateBlog,
        isCreateBlogLoading,
        createBlogError,
        handleBlogCreate,
        editBlogId,
        setEditBlogId,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isUpdateBlogLoading,
        updateBlogError,
        handleBlogUpdate,
        deleteBlog,
        isDeleteBlogLoading,
        blogData: singleBlogData,
        deleteBlogError,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        resetForm,
        handleInputChange,
        loading,
        error,
        isUpdateSuccess
    }
}
