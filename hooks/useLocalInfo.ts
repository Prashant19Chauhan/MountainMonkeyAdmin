"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    createLocalInfoApi, 
    updateLocalInfoApi, 
    deleteLocalInfoApi, 
    getLocalInfoByIdApi, 
    getAllLocalInfosApi 
} from "@/services/localInfo.service";
import { getDestinationsApi } from "@/services/destination.service";
import { LocalInfoInputType } from "@/lib/validation/localInfo.validation";
import { toast } from "react-toastify";

const initialFormData: LocalInfoInputType = {

  // ==========================================
  // DESTINATION
  // ==========================================

  destinationId: "",

  // ==========================================
  // BASIC INFO
  // ==========================================

  language: [],

  currency: "INR",

  bestTimeToVisit: "",

  // ==========================================
  // FAMOUS FOOD
  // ==========================================

  famousFood: [
    {
      name: "",
      description: "",
      images: [],
      typeOfFood: "veg",
      bestPlaces: [
        {
          name: "",
          location: ""
        }
      ]
    }
  ],

  // ==========================================
  // FAMOUS PLACES
  // ==========================================

  famousPlaces: [
    {
      name: "",
      description: "",
      images: [],
      type: "tourist_spot",
      bestTimeToVisit: "",
      entryFee: 0,
      timings: ""
    }
  ],

  // ==========================================
  // CULTURE
  // ==========================================

  culture: {
    traditions: [],
    festivals: [],
    localEtiquette: []
  },

  // ==========================================
  // MYTHS & STORIES
  // ==========================================

  mythsAndStories: [
    {
      title: "",
      story: ""
    }
  ],

  // ==========================================
  // PRECAUTIONS
  // ==========================================

  precautions: [
    {
      title: "",
      description: "",
      severity: "low"
    }
  ],

  // ==========================================
  // SAFETY
  // ==========================================

  safety: {
    overallSafety: 5,

    tips: [],

    emergencyContacts: [
      {
        authority: "",
        number: ""
      }
    ]
  },

  // ==========================================
  // CLOTHING
  // ==========================================

  clothing: {
    summer: [],
    winter: [],
    religiousPlaces: [],
    generalTips: []
  },

  // ==========================================
  // DO'S & DON'TS
  // ==========================================

  dos: [],

  donts: [],

  // ==========================================
  // LOCAL TIPS
  // ==========================================

  localTips: [],

  // ==========================================
  // USEFUL PHRASES
  // ==========================================

  phrases: [
    {
      local: "",
      english: ""
    }
  ],

  // ==========================================
  // AI
  // ==========================================

  aiSummary: "",

  embedding: [],

  // ==========================================
  // METADATA
  // ==========================================

  popularityScore: 0
};

export default function useLocalInfo() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState<LocalInfoInputType>(initialFormData);
    const [editId, setEditId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Queries
    const { data: localInfosData, isLoading: isLocalInfosLoading } = useQuery({
        queryKey: ["localInfos", page, limit, search],
        queryFn: () => getAllLocalInfosApi(page, limit, search)
    });

    const { data: destinationsData } = useQuery({
        queryKey: ["destinations"],
        queryFn: () => getDestinationsApi(1, 1000)
    });

    const { data: singleLocalInfoData, isLoading: isSingleLoading } = useQuery({
        queryKey: ["localInfo", editId],
        queryFn: () => getLocalInfoByIdApi(editId as string),
        enabled: !!editId
    });

    // Populate form for editing
    useEffect(() => {
        if (singleLocalInfoData?.data) {
            const data = { ...singleLocalInfoData.data };
            if (data.destinationId && typeof data.destinationId === 'object') {
                data.destinationId = (data.destinationId as any)._id;
            }
            setFormData(data);
        }
    }, [singleLocalInfoData]);

    // Mutations
    const { mutate: createLocalInfo, isPending: isCreateLoading, isSuccess: isCreateSuccess } = useMutation({
        mutationFn: createLocalInfoApi,
        onSuccess: () => {
            toast.success("Local info created successfully");
            queryClient.invalidateQueries({ queryKey: ["localInfos"] });
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create local info");
        }
    });

    const { mutate: updateLocalInfo, isPending: isUpdateLoading, isSuccess: isUpdateSuccess } = useMutation({
        mutationFn: (data: LocalInfoInputType) => updateLocalInfoApi(editId as string, data),
        onSuccess: () => {
            toast.success("Local info updated successfully");
            queryClient.invalidateQueries({ queryKey: ["localInfos"] });
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update local info");
        }
    });

    const { mutate: deleteLocalInfo, isPending: isDeleteLoading } = useMutation({
        mutationFn: deleteLocalInfoApi,
        onSuccess: () => {
            toast.success("Local info deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["localInfos"] });
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete local info");
        }
    });

    const resetForm = () => {
        setFormData(initialFormData);
        setEditId(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === "number" ? Number(value) : value;

        if (name.includes(".")) {
            const keys = name.split(".");
            setFormData((prev: any) => {
                let updated = { ...prev };
                let current = updated;
                for (let i = 0; i < keys.length - 1; i++) {
                    current[keys[i]] = { ...current[keys[i]] };
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = val;
                return updated;
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            updateLocalInfo(formData);
        } else {
            createLocalInfo(formData);
        }
    };
    console.log(formData);

    return {
        localInfosData,
        isLocalInfosLoading,
        destinationsData,
        formData,
        setFormData,
        handleInputChange,
        handleSubmit,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        editId,
        setEditId,
        isCreateLoading,
        isUpdateLoading,
        isCreateSuccess,
        isUpdateSuccess,
        isSingleLoading,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        setDeleteId,
        confirmDelete: () => deleteId && deleteLocalInfo(deleteId),
        resetForm
    };
}

