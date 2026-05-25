import { useState, useEffect, useCallback } from 'react';
import { folderService, imageService, categoryService, handleApiError } from '@/services/media.service';

/**
 * Custom hook for managing media library state and operations
 * Handles folders, images, and categories with full CRUD functionality
 */
export const useMedia = () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  const [folders, setFolders] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState({
    folders: false,
    images: false,
    categories: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Store full category objects for ID mapping
  const [categoryObjects, setCategoryObjects] = useState<any[]>([]);

  // ==========================================
  // FOLDER OPERATIONS
  // ==========================================

  const fetchFolders = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, folders: true }));
      setError(null);

      console.log("calling fetch folders");

      const folderDataRaw = await folderService.getAll();
      const folderData = Array.isArray(folderDataRaw) ? folderDataRaw : (folderDataRaw?.data || []);
      setFolders(folderData);

      // Set initial selected folder if none selected
      if (!selectedFolderId && folderData.length > 0) {
        setSelectedFolderId(folderData[0]._id || folderData[0].id);
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to load folders: ${apiError.message}`);
      console.error('Fetch folders error:', err);
    } finally {
      setLoading(prev => ({ ...prev, folders: false }));
    }
  }, [selectedFolderId]);

  const createFolder = async (name: string) => {
    try {
      setError(null);
      const newFolder = await folderService.create(name);
      setFolders(prev => [...prev, newFolder]);
      setSelectedFolderId(newFolder._id || newFolder.id);
      return { success: true, data: newFolder };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to create folder: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  const updateFolder = async (id: string, name: string) => {
    try {
      setError(null);
      const updatedFolder = await folderService.update(id, name);
      setFolders(prev => prev.map(f => (f._id === id || f.id === id) ? updatedFolder : f));
      return { success: true, data: updatedFolder };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to update folder: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      setError(null);

      // Check if it's the last folder
      if (folders.length <= 1) {
        return {
          success: false,
          error: 'Cannot delete the last folder. At least one folder must remain.'
        };
      }

      await folderService.delete(id);

      // Remove folder and its images from state
      setFolders(prev => prev.filter(f => (f._id !== id && f.id !== id)));
      setImages(prev => prev.filter(img => img.folderId !== id));

      // Update selected folder if deleted
      if (selectedFolderId === id) {
        const remaining = folders.filter(f => (f._id !== id && f.id !== id));
        setSelectedFolderId(remaining[0]?._id || remaining[0]?.id);
      }

      return { success: true };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to delete folder: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  // ==========================================
  // IMAGE OPERATIONS
  // ==========================================

  const fetchImages = useCallback(async (folderId: string | null, category: string) => {
    try {
      setLoading(prev => ({ ...prev, images: true }));
      setError(null);

      const filters: { folderId?: string; category?: string } = {};
      if (folderId) filters.folderId = folderId;
      if (category && category !== 'All') filters.category = category;

      const imageDataRaw = await imageService.getAll(filters);
      const imageData = Array.isArray(imageDataRaw) ? imageDataRaw : (imageDataRaw?.data || []);
      setImages(imageData);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to load images: ${apiError.message}`);
      console.error('Fetch images error:', err);
    } finally {
      setLoading(prev => ({ ...prev, images: false }));
    }
  }, []);

  const uploadImage = async (file: File, metadata: { title: string; folderId: string; category: string }) => {
    try {
      setError(null);
      const newImage = await imageService.upload(file, metadata);

      // Add to state if it matches current view
      if (metadata.folderId === selectedFolderId) {
        setImages(prev => [newImage, ...prev]);
      }

      return { success: true, data: newImage };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to upload image: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  const deleteImage = async (id: string) => {
    try {
      setError(null);
      await imageService.delete(id);
      setImages(prev => prev.filter(img => (img._id !== id && img.id !== id)));
      return { success: true };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to delete image: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  const moveImageToFolder = async (imageId: string, targetFolderId: string) => {
    try {
      setError(null);

      // Update image folder in state
      setImages(prev => prev.map(img =>
        (img._id === imageId || img.id === imageId)
          ? { ...img, folderId: targetFolderId }
          : img
      ));

      // Note: If backend supports PATCH endpoint for moving images, call it here
      // For now, optimistic update in state

      return { success: true };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to move image: ${apiError.message}`);

      // Revert on error - refetch images
      await fetchImages(selectedFolderId, selectedCategory);

      return { success: false, error: apiError.message };
    }
  };

  const updateImageMetadata = async (id: string, title: string, category: string) => {
    try {
      setError(null);

      // Update in state optimistically
      setImages(prev => prev.map(img =>
        (img._id === id || img.id === id)
          ? { ...img, title, category }
          : img
      ));

      // Note: Add backend PATCH endpoint for image metadata updates
      // await imageService.updateMetadata(id, { title, category });

      return { success: true };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to update image: ${apiError.message}`);

      // Revert on error
      await fetchImages(selectedFolderId, selectedCategory);

      return { success: false, error: apiError.message };
    }
  };

  // ==========================================
  // CATEGORY OPERATIONS
  // ==========================================

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      setError(null);

      const categoryDataRaw = await categoryService.getAll();
      const categoryData = Array.isArray(categoryDataRaw) ? categoryDataRaw : (categoryDataRaw?.data || []);

      // Extract names from category objects
      const categoryNames = categoryData.map((cat: any) => cat.name);
      setCategories(categoryNames);

      // Store full category objects for ID reference
      setCategoryObjects(categoryData);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to load categories: ${apiError.message}`);
      console.error('Fetch categories error:', err);

      // Fallback to default categories
      setCategories(['Mountains', 'Camping', 'Beaches', 'Resorts', 'Misc']);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  const createCategory = async (name: string) => {
    try {
      setError(null);
      const newCategory = await categoryService.create(name);
      setCategories(prev => [...prev, newCategory.name]);
      setCategoryObjects(prev => [...prev, newCategory]);
      return { success: true, data: newCategory };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to create category: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    try {
      setError(null);

      // Find category ID by name
      const categoryObj = categoryObjects.find(cat => cat.name === oldName);
      if (!categoryObj) {
        throw new Error('Category not found');
      }

      const updatedCategory = await categoryService.update(categoryObj._id || categoryObj.id, newName);

      // Update categories list
      setCategories(prev => prev.map(cat => cat === oldName ? newName : cat));
      setCategoryObjects(prev => prev.map(cat =>
        (cat._id === categoryObj._id || cat.id === categoryObj.id) ? updatedCategory : cat
      ));

      // Refresh images to reflect category updates
      await fetchImages(selectedFolderId, selectedCategory);

      return { success: true, data: updatedCategory };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to update category: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  const deleteCategory = async (name: string) => {
    try {
      setError(null);

      // Find category ID by name
      const categoryObj = categoryObjects.find(cat => cat.name === name);
      if (!categoryObj) {
        throw new Error('Category not found');
      }

      await categoryService.delete(categoryObj._id || categoryObj.id);

      // Remove from state
      setCategories(prev => prev.filter(cat => cat !== name));
      setCategoryObjects(prev => prev.filter(cat =>
        (cat._id !== categoryObj._id && cat.id !== categoryObj.id)
      ));

      // Refresh images as they may have been reassigned
      await fetchImages(selectedFolderId, selectedCategory);

      return { success: true };
    } catch (err) {
      const apiError = handleApiError(err);
      setError(`Failed to delete category: ${apiError.message}`);
      return { success: false, error: apiError.message };
    }
  };

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  const currentFolder = (Array.isArray(folders) ? folders : []).find(f => (f._id === selectedFolderId || f.id === selectedFolderId));

  const filteredImages = (Array.isArray(images) ? images : []).filter(img => {
    const folderMatch = img.folderId === selectedFolderId;
    const categoryMatch = selectedCategory === 'All' || img.category === selectedCategory;
    return folderMatch && categoryMatch;
  });

  const isLoading = loading.folders || loading.images || loading.categories;

  // ==========================================
  // INITIAL DATA FETCH
  // ==========================================

  useEffect(() => {
    fetchCategories();
    fetchFolders();
  }, [fetchCategories, fetchFolders]);

  useEffect(() => {
    if (selectedFolderId) {
      fetchImages(selectedFolderId, selectedCategory);
    }
  }, [selectedFolderId, selectedCategory, fetchImages]);

  // ==========================================
  // RETURN API
  // ==========================================

  return {
    // State
    folders,
    images,
    categories,
    selectedFolderId,
    selectedCategory,
    currentFolder,
    filteredImages,
    loading,
    isLoading,
    error,

    // Setters
    setSelectedFolderId,
    setSelectedCategory,
    setError,

    // Folder operations
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,

    // Image operations
    fetchImages,
    uploadImage,
    deleteImage,
    moveImageToFolder,
    updateImageMetadata,

    // Category operations
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useMedia;