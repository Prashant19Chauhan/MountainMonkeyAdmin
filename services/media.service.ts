import { api } from "@/lib/api";

// ==========================================
// FOLDER SERVICES
// ==========================================

export const folderService = {
  getAll: async () => {
    const response = await api.get('/media/folders');
    console.log("folders ", response.data);
    return response.data;
  },

  create: async (name: string) => {
    console.log('Creating folder:', name);
    const response = await api.post('/media/folder', { name });
    return response.data;
  },

  update: async (id: string, name: string) => {
    const response = await api.put('/media/folder/'+id, { name });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete('/media/folder/'+id);
    return response.data;
  },
};

// ==========================================
// IMAGE SERVICES
// ==========================================

export const imageService = {
  getAll: async (filters: { folderId?: string; category?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.folderId) params.append('folderId', filters.folderId);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    
    const response = await api.get(`/media/?${params.toString()}`);
    console.log("media images ",response.data);
    return response.data;
  },

  upload: async (file: File, metadata: { title: string; folderId: string; category: string }) => {
    const formData = new FormData();
    formData.append('imageFile', file);
    formData.append('title', metadata.title);
    formData.append('folderId', metadata.folderId);
    formData.append('category', metadata.category);

    const response = await api.post(`/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete('/media/'+id);
    return response.data;
  },
};

// ==========================================
// CATEGORY SERVICES
// ==========================================

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/media/categories');
    return response.data;
  },

  create: async (name: string) => {
    const response = await api.post('/media/category', { name });
    return response.data;
  },

  update: async (id: string, name: string) => {
    const response = await api.put('/media/category/'+id, { name });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete('/media/category/'+id);
    return response.data;
  },
};

// ==========================================
// ERROR HANDLER UTILITY
// ==========================================

export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
};

export default {
  folderService,
  imageService,
  categoryService,
  handleApiError,
};