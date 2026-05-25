'use client';

import React, { useState, FormEvent, DragEvent, MouseEvent } from 'react';
import { useMedia } from '@/hooks/useMedia';
import {
  FolderPlus,
  Folder,
  FolderEdit,
  Trash2,
  Plus,
  Check,
  X,
  Edit2,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface SelectedImageOutput {
  id: string;
  url: string;
}

interface ImageLibraryProps {
  onSelect?: (images: SelectedImageOutput[]) => void;
  onClose?: () => void;
}

interface ImageAsset {
  _id?: string;
  id?: string;
  url: string;
  title: string;
  category: string;
}

interface FolderAsset {
  _id?: string;
  id?: string;
  name: string;
}

function ImageLibrary({ onSelect, onClose }: ImageLibraryProps) {

  // ==========================================
  // CUSTOM HOOK
  // ==========================================

  const {
    folders,
    categories,
    currentFolder,
    filteredImages,
    selectedFolderId,
    selectedCategory,
    isLoading,
    error,
    setSelectedFolderId,
    setSelectedCategory,
    setError,
    createFolder,
    updateFolder,
    deleteFolder,
    uploadImage,
    deleteImage,
    moveImageToFolder,
    updateImageMetadata,
    createCategory,
  } = useMedia() as {
    folders: FolderAsset[];
    categories: string[];
    currentFolder: FolderAsset | null;
    filteredImages: ImageAsset[];
    selectedFolderId: string | null;
    selectedCategory: string;
    isLoading: boolean;
    error: string | null;
    setSelectedFolderId: (id: string | null) => void;
    setSelectedCategory: (cat: string) => void;
    setError: (err: string | null) => void;
    createFolder: (name: string) => Promise<{ success: boolean; error?: string }>;
    updateFolder: (id: string, name: string) => Promise<{ success: boolean; error?: string }>;
    deleteFolder: (id: string) => Promise<{ success: boolean; error?: string }>;
    uploadImage: (file: File, metadata: { title: string; folderId: string | null; category: string }) => Promise<{ success: boolean; error?: string }>;
    deleteImage: (id: string) => Promise<{ success: boolean; error?: string }>;
    moveImageToFolder: (imageId: string, folderId: string) => Promise<{ success: boolean; error?: string }>;
    updateImageMetadata: (id: string, title: string, category: string) => Promise<{ success: boolean; error?: string }>;
    createCategory: (name: string) => Promise<{ success: boolean; error?: string }>;
  };

  // ==========================================
  // LOCAL UI STATE
  // ==========================================

  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState<string>('');

  const [isSystemDragging, setIsSystemDragging] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingImageSrc, setPendingImageSrc] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalCategory, setModalCategory] = useState<string>('Misc');

  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageTitle, setEditingImageTitle] = useState<string>('');
  const [editingImageCategory, setEditingImageCategory] = useState<string>('');

  // ==========================================
  // MULTI IMAGE SELECTION
  // ==========================================

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      }
      return [...prev, imageId];
    });
  };

  const handleSelectImages = () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    const selectedImageData: SelectedImageOutput[] = filteredImages
      .filter((img) => {
        const imageId = img._id || img.id;
        return imageId && selectedImages.includes(imageId);
      })
      .map((img) => ({
        id: (img._id || img.id) as string,
        url: `http://localhost:3000${img.url}`,
      }));

    if (onSelect) {
      onSelect(selectedImageData);
    }

    if (onClose) {
      onClose();
    }
  };

  // ==========================================
  // CATEGORY CRUD ACTIONS
  // ==========================================

  const handleCreateCategory = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const formattedCategory = newCategoryName.trim();

    if (!formattedCategory) return;

    if (categories.some((cat) => cat.toLowerCase() === formattedCategory.toLowerCase())) {
      alert('This category already exists.');
      return;
    }

    const result = await createCategory(formattedCategory);
    if (result.success) {
      setNewCategoryName('');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // ==========================================
  // FOLDER CRUD ACTIONS
  // ==========================================

  const handleCreateFolder = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim()) return;

    const result = await createFolder(newFolderName.trim());
    if (result.success) {
      setNewFolderName('');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleUpdateFolder = async (id: string) => {
    if (!editingFolderName.trim()) return;

    const result = await updateFolder(id, editingFolderName.trim());
    if (result.success) {
      setEditingFolderId(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDeleteFolder = async (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (folders.length <= 1) {
      alert('At least one folder is required.');
      return;
    }

    if (!confirm('Are you sure? This will delete the folder and all its images.')) {
      return;
    }

    const result = await deleteFolder(id);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  };

  // ==========================================
  // SYSTEM FILE DRAG & DROP
  // ==========================================

  const handleSystemDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSystemDragging(true);
  };

  const handleSystemDragLeave = () => {
    setIsSystemDragging(false);
  };

  const handleSystemDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSystemDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPendingFile(file);
          setPendingImageSrc(event.target.result as string);
          setModalTitle(file.name.split('.')[0]);
          setModalCategory(categories[0] || 'Misc');
          setIsModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please drop a valid image file.');
    }
  };

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleSaveModalMetadata = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!modalTitle.trim() || !pendingFile) return;

    const metadata = {
      title: modalTitle.trim(),
      folderId: selectedFolderId,
      category: modalCategory,
    };

    const result = await uploadImage(pendingFile, metadata);
    if (result.success) {
      setIsModalOpen(false);
      setPendingFile(null);
      setPendingImageSrc('');
      setModalTitle('');
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  };

  // ==========================================
  // DRAG & DROP BETWEEN FOLDERS
  // ==========================================

  const handleCardDragStart = (e: DragEvent<HTMLDivElement>, imageId: string) => {
    e.dataTransfer.setData('text/plain', imageId);
  };

  const handleFolderDrop = async (e: DragEvent<HTMLLIElement>, targetFolderId: string) => {
    e.preventDefault();
    const draggedImageId = e.dataTransfer.getData('text/plain');
    if (!draggedImageId) return;

    const result = await moveImageToFolder(draggedImageId, targetFolderId);
    if (!result.success) {
      alert(`Error moving image: ${result.error}`);
    }
  };

  // ==========================================
  // IMAGE METADATA EDITING
  // ==========================================

  const handleUpdateImage = async (id: string) => {
    if (!editingImageTitle.trim()) return;

    const result = await updateImageMetadata(id, editingImageTitle.trim(), editingImageCategory);
    if (result.success) {
      setEditingImageId(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const result = await deleteImage(id);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  };

  const dismissError = () => setError(null);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 p-6 relative">

      {/* GLOBAL CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-full shadow-sm transition-all z-30"
          aria-label="Close Library"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="fixed top-6 right-20 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-xl max-w-md animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">System Error</p>
              <p className="text-xs mt-0.5 text-red-600">{error}</p>
            </div>
            <button onClick={dismissError} className="text-red-400 hover:text-red-600 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LOADING BACKDROP */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-100">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-700 font-medium text-sm">Processing request...</p>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-full md:w-72 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 mb-6 md:mb-0 md:mr-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-5 tracking-tight text-emerald-600 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Ghumakkad Go Assets
          </h2>

          {/* CREATE FOLDER */}
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Folder Management
          </h4>

          <div className="mb-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="New folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateFolder(); } }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
              <button
                type="button"
                onClick={handleCreateFolder}
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/10 disabled:opacity-50"
              >
                <FolderPlus className="w-3.5 h-3.5" /> Create Folder
              </button>
            </div>
          </div>

          {/* FOLDER LIST */}
          <ul className="space-y-1 max-h-[240px] overflow-y-auto pr-1">
            {folders.map((folder) => {
              const folderId = folder._id || folder.id;
              if (!folderId) return null;
              const isActive = selectedFolderId === folderId;

              return (
                <li
                  key={folderId}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFolderDrop(e, folderId)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all border-2 ${isActive
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  {editingFolderId === folderId ? (
                    <div className="flex items-center space-x-1 w-full" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        className="border border-slate-200 px-2 py-1 rounded-lg text-xs w-full outline-none focus:border-emerald-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateFolder(folderId)}
                        className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFolderId(null)}
                        className="p-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFolderId(folderId);
                          setSelectedCategory('All');
                        }}
                        className="flex-1 text-left truncate flex items-center gap-2"
                      >
                        <Folder className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                        <span className="truncate">{folder.name}</span>
                      </button>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-0.5 transition ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(folderId);
                            setEditingFolderName(folder.name);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/50"
                          title="Rename folder"
                        >
                          <FolderEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFolder(folderId, e)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Categories
          </h4>

          <div className="mb-3">
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Tag name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCategory(); } }}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isLoading}
                className="bg-blue-600 text-white p-1.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] bg-slate-50 text-slate-600 font-medium px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs"
              >
                #{cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div
        onDragOver={handleSystemDragOver}
        onDragLeave={handleSystemDragLeave}
        onDrop={handleSystemDrop}
        className={`flex-1 bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-200 relative flex flex-col ${isSystemDragging
            ? 'border-dashed border-emerald-500 bg-emerald-50/40 target-ring scale-[0.99]'
            : 'border-slate-200/80'
          }`}
      >
        {/* VIEW HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentFolder?.name || 'Workspace Setup'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <UploadCloud className="w-3.5 h-3.5 text-slate-300" /> Drop high-res image files into this view window
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 transition outline-none cursor-pointer text-slate-700"
              >
                <option value="All">All Items</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    #{cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleSelectImages}
              disabled={selectedImages.length === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 shadow-sm shadow-emerald-600/10 transition flex items-center gap-2"
            >
              Use Selected ({selectedImages.length})
            </button>
          </div>
        </div>

        {/* WORKSPACE STATES */}
        {!selectedFolderId ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 text-sm">
            <Folder className="w-8 h-8 text-slate-300 mb-2" />
            Please select a directory folder to view contents
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 text-sm">
            <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
            Empty Space. Drop system images here to populate
          </div>
        ) : (
          /* IMAGES GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredImages.map((img) => {
              const imageId = img._id || img.id;
              if (!imageId) return null;
              const isSelected = selectedImages.includes(imageId);

              return (
                <div
                  key={imageId}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, imageId)}
                  onClick={() => toggleImageSelection(imageId)}
                  className={`group relative bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ${isSelected
                      ? 'ring-4 ring-emerald-500/20 border-emerald-500'
                      : 'border-slate-200'
                    }`}
                >
                  {/* SELECTION CHECKMARK */}
                  {isSelected && (
                    <div className="absolute top-3 left-3 z-20 bg-emerald-600 text-white p-1 rounded-full shadow-md animate-in zoom-in-75">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-600" />
                    </div>
                  )}

                  {/* FLOATING OPTIONS BAR */}
                  <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-150 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-100 flex space-x-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering global select click
                        setEditingImageId(imageId);
                        setEditingImageTitle(img.title);
                        setEditingImageCategory(img.category);
                      }}
                      className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                      title="Edit metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(imageId);
                      }}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* THUMBNAIL DISPLAY */}
                  <div className="aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                    <img
                      src={`http://localhost:3000${img.url}`}
                      alt={img.title}
                      className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>

                  {/* BOTTOM INFO PANEL */}
                  <div className="p-3.5">
                    {editingImageId === imageId ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingImageTitle}
                          onChange={(e) => setEditingImageTitle(e.target.value)}
                          className="w-full text-xs border border-slate-200 p-2 rounded-xl outline-none focus:border-emerald-500"
                        />
                        <div className="flex items-center space-x-1.5">
                          <div className="relative flex-1">
                            <select
                              value={editingImageCategory}
                              onChange={(e) => setEditingImageCategory(e.target.value)}
                              className="text-xs border border-slate-200 p-2 rounded-xl w-full bg-slate-50 appearance-none outline-none"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUpdateImage(imageId)}
                            className="bg-emerald-600 text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-emerald-700 transition"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingImageId(null)}
                            className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-xs text-slate-800 truncate tracking-tight">
                          {img.title}
                        </h4>
                        <span className="inline-block bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md mt-1.5 font-semibold tracking-wider uppercase">
                          #{img.category}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* METADATA SETUP DIALOG ON SYSTEM FILE DROP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in-50 duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-emerald-600" /> Upload Configuration
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="p-5 space-y-4">
                <div className="w-full aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                  <img src={pendingImageSrc} alt="Preview" className="w-full h-full object-cover" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Asset Title</label>
                  <input
                    type="text"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveModalMetadata(); } }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category Identification</label>
                  <div className="relative">
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 appearance-none outline-none focus:bg-white focus:border-emerald-500 transition"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalMetadata}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/10 transition disabled:opacity-50"
                >
                  Save Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageLibrary;