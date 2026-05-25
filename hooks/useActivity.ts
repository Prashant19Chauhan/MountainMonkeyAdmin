'use client'

import { useState, useEffect } from "react"
import { ActivityInput, activityValidationSchema } from "@/lib/validation/activity.validation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
    createActivityApi, 
    updateActivityApi, 
    deleteActivityApi, 
    getActivityByIdApi, 
    getAllActivitiesApi 
} from "@/services/activities.service"
import { getCitiesApi } from "@/services/city.service"
import { getDestinationsApi } from "@/services/destination.service"
import { toast } from "react-toastify"


const initialFormData: ActivityInput = {

  // ==========================================
  // BASIC INFO
  // ==========================================

  name: "",

  destinationId: "",

  type: "",

  category: [],

  shortDescription: "",

  longDescription: "",

  // ==========================================
  // LOCATION
  // ==========================================

  location: {
    address: "",

    coordinates: {
      lat: 0,
      lng: 0
    },

    mainCity: ""
  },

  // ==========================================
  // TIMING
  // ==========================================

  timing: {
    openingTime: "",
    closingTime: "",
    duration: 0
  },

  bestTimeToVisit: "",

  // ==========================================
  // PRICING
  // ==========================================

  pricing: {
    price: 0,
    currency: "INR",
    isFree: false
  },

  // ==========================================
  // ACTIVITY DETAILS
  // ==========================================

  difficultyLevel: "moderate",

  ageLimit: {
    min: 0,
    max: 100
  },

  requiredItems: [],

  // ==========================================
  // SAFETY
  // ==========================================

  safetyInfo: {
    precautions: [],
    riskLevel: "low"
  },

  // ==========================================
  // PROVIDERS
  // ==========================================

  providers: [
    {
      name: "",
      contact: "",
      website: ""
    }
  ],

  // ==========================================
  // RATINGS
  // ==========================================

  ratings: {
    average: 0,
    count: 0
  },

  // ==========================================
  // MEDIA
  // ==========================================

  images: [],

  // ==========================================
  // TAGS
  // ==========================================

  tags: [],

  recommendedFor: [],

  timeSlotPreference: [],

  // ==========================================
  // AI FIELDS
  // ==========================================

  aiScore: {
    popularity: 0,
    experienceQuality: 0,
    valueForMoney: 0,
    uniqueness: 0
  },

  aiSummary: "",

  popularityScore: 0,

  // ==========================================
  // STATUS
  // ==========================================

  isActive: true
};  

export default function useActivity() {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState<ActivityInput>(initialFormData)
    const [editActivityId, setEditActivityId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")

    console.log(formData)

    // Handle Input Changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const val = type === "number" ? Number(value) : value

        if (name.includes(".")) {
            const keys = name.split(".")
            setFormData((prev:any) => {
                let updated = { ...prev }
                let current = updated
                for (let i = 0; i < keys.length - 1; i++) {
                    current[keys[i]] = { ...current[keys[i]] }
                    current = current[keys[i]]
                }
                current[keys[keys.length - 1]] = val
                return updated
            })
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: val
            }))
        }
    }

    // React Query Hooks
    const { data: activitiesData, isLoading: isActivitiesLoading } = useQuery({
        queryKey: ["activities", page, limit, search],
        queryFn: () => getAllActivitiesApi(page, limit, search),
    })

    const { data: citiesData } = useQuery({
        queryKey: ["cities"],
        queryFn: () => getCitiesApi(1, 1000),
    })

    const { data: destinationsData } = useQuery({
        queryKey: ["destinations"],
        queryFn: () => getDestinationsApi(1, 1000),
    })

    const { data: singleActivityData, isLoading: isSingleActivityLoading } = useQuery({
        queryKey: ["activity", editActivityId],
        queryFn: () => getActivityByIdApi(editActivityId as string),
        enabled: !!editActivityId
    })


    useEffect(() => {
        if (singleActivityData?.data) {
            const data = { ...singleActivityData.data };
            // Flatten populated objects back to IDs for the form
            if (data.destinationId && typeof data.destinationId === 'object') {
                data.destinationId = (data.destinationId as any)._id;
            }
            if (data.location?.mainCity && typeof data.location.mainCity === 'object') {
                data.location.mainCity = (data.location.mainCity as any)._id;
            }
            setFormData(data as any)
        }
    }, [singleActivityData])


    const { mutate: createActivity, isPending: isCreateLoading, isSuccess: isCreateSuccess } = useMutation({
        mutationFn: createActivityApi,
        onSuccess: () => {
            toast.success("Activity created successfully")
            queryClient.invalidateQueries({ queryKey: ["activities"] })
            resetForm()
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create activity")
        }
    })

    const { mutate: updateActivity, isPending: isUpdateLoading, isSuccess: isUpdateSuccess } = useMutation({
        mutationFn: (data: ActivityInput) => updateActivityApi(editActivityId as string, data),
        onSuccess: () => {
            toast.success("Activity updated successfully")
            queryClient.invalidateQueries({ queryKey: ["activities"] })
            resetForm()
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update activity")
        }
    })


    const { mutate: deleteActivity, isPending: isDeleteLoading } = useMutation({
        mutationFn: deleteActivityApi,
        onSuccess: () => {
            toast.success("Activity deleted successfully")
            queryClient.invalidateQueries({ queryKey: ["activities"] })
            setIsDeleteDialogOpen(false)
            setDeleteId(null)
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete activity")
        }
    })

    const resetForm = () => {
        setFormData(initialFormData)
        setEditActivityId(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const validatedData = activityValidationSchema.parse(formData)
            if (editActivityId) {
                updateActivity(validatedData)
            } else {
                createActivity(validatedData)
            }
        } catch (error: any) {
            if (error.errors) {
                error.errors.forEach((err: any) => {
                    toast.error(`${err.path.join(".")}: ${err.message}`)
                })
            } else {
                toast.error("Validation failed")
            }
        }
    }

    const openDeleteDialog = (id: string) => {
        setDeleteId(id)
        setIsDeleteDialogOpen(true)
    }

    return {
        formData,
        setFormData,
        handleInputChange,
        handleSubmit,
        activitiesData,
        isActivitiesLoading,
        isCreateLoading,
        isUpdateLoading,
        isDeleteLoading,
        isCreateSuccess,
        isUpdateSuccess,
        isSingleActivityLoading,
        createActivity,
        updateActivity,

        editActivityId,
        setEditActivityId,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        openDeleteDialog,
        confirmDelete: () => deleteId && deleteActivity(deleteId),
        resetForm,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        citiesData,
        destinationsData
    }
}

