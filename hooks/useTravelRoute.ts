'use client'

import { useState, useEffect } from "react"
import { TravelRouteInput, travelRouteSchema } from "@/lib/validation/travelRoute.validation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
    createTravelRouteApi, 
    deleteTravelRouteApi, 
    getTravelRoutesApi, 
    getTravelRouteByIdApi, 
    updateTravelRouteApi,
    getRoutesByDestinationApi
} from "@/services/travelRoute.service"
import { toast } from "react-toastify"
import { getCitiesApi } from "@/services/city.service"

export default function useTravelRoute() {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<TravelRouteInput>({
    name: "",
    from: { id: "", name: "" },
    to: { id: "", name: "" },
    StepRoutes: []
  })

  const [editRouteId, setEditRouteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // --- Fetching Data ---

  const { data: citiesData } = useQuery({
        queryKey: ["cities"],
        queryFn: () => getCitiesApi(1, 1000)
    });
  
  const { data: travelRoutesData, isPending: isTravelRoutesLoading } = useQuery({
    queryKey: ["travel-routes"],
    queryFn: getTravelRoutesApi,
  })

  const { data: singleRouteData, isPending: isSingleRouteLoading } = useQuery({
    queryKey: ["travel-route", editRouteId],
    queryFn: () => getTravelRouteByIdApi(editRouteId as string),
    enabled: !!editRouteId,
  })

  useEffect(() => {
    if (singleRouteData?.data) {
      const route = singleRouteData.data;
      setFormData({
        _id: route._id,
        name: route.name || "",
        from: route.from,
        to: route.to,
        StepRoutes: (route.routes || []).map((step: any) => ({
           ...step,
           _parentStepId: step.previousRoutesTrack?.length > 1 ? step.previousRoutesTrack[step.previousRoutesTrack.length - 2] : ""
        }))
      });
    }
  }, [singleRouteData]);

  // --- Mutations ---

  const { mutate: createRoute, isPending: isCreateLoading } = useMutation({
    mutationFn: createTravelRouteApi,
    onSuccess: () => {
        toast.success("Travel route created successfully");
        queryClient.invalidateQueries({ queryKey: ["travel-routes"] })
        resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create travel route");
    }
  })

  const { mutate: updateRoute, isPending: isUpdateLoading, isSuccess: isUpdateSuccess } = useMutation({
    mutationFn: updateTravelRouteApi,
    onSuccess: () => {
        toast.success("Travel route updated successfully");
        queryClient.invalidateQueries({ queryKey: ["travel-routes"] })
        resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update travel route");
    }
  })

  const { mutate: deleteRoute, isPending: isDeleteLoading } = useMutation({
    mutationFn: deleteTravelRouteApi,
    onSuccess: () => {
        toast.success("Travel route deleted successfully");
        setIsDeleteDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["travel-routes"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete travel route");
    }
  })

  // --- Form Helpers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev: any) => {
        let updated = { ...prev };
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
          current = current[key];
        }
        current[keys[keys.length - 1]] = val;
        return updated;
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      from: { id: "", name: "" },
      to: { id: "", name: "" },
      StepRoutes: []
    });
    setEditRouteId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Auto-calculate cumulative totals for each step based on previousRoutesTrack
    const finalFormData: any = { ...formData };
    finalFormData.StepRoutes = (finalFormData.StepRoutes || []).map((step: any) => {
       const getAncestors = (currentStepId: string): any[] => {
          const currentStep = (finalFormData.StepRoutes as any[]).find((s: any) => s.stepId === currentStepId);
          if (!currentStep || !currentStep._parentStepId) return [];
          const parent = (finalFormData.StepRoutes as any[]).find((s: any) => s.stepId === currentStep._parentStepId);
          if (!parent) return [];
          return [...getAncestors(parent.stepId), parent];
       };

       const ancestors = getAncestors(step.stepId).filter(Boolean);
       const previousRoutesTrack = [...ancestors.map(a => a.stepId), step.stepId];

       let totalMinCost = step.travelDetails.minCost || 0;
       let totalMaxCost = step.travelDetails.maxCost || 0;
       let totalDuration = step.travelDetails.duration || 0;
       let totalDistance = step.travelDetails.distance || 0;
       let totalStops = ancestors.length;

       ancestors.forEach((s: any) => {
           totalMinCost += (s.travelDetails.minCost || 0);
           totalMaxCost += (s.travelDetails.maxCost || 0);
           totalDuration += (s.travelDetails.duration || 0);
           totalDistance += (s.travelDetails.distance || 0);
       });

       const finalStep = {
           ...step,
           previousRoutesTrack,
           totalMinCost,
           totalMaxCost,
           totalDuration,
           totalDistance,
           totalStops
       };

       delete finalStep._parentStepId;
       return finalStep;
    });

    try {
      travelRouteSchema.parse(finalFormData)
      if (finalFormData._id) {
        updateRoute(finalFormData);
      } else {
        createRoute(finalFormData)
      }
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => toast.error(err.message));
      } else {
        console.error(error);
      }
    }
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    isTravelRoutesLoading,
    isSingleRouteLoading,
    isUpdateSuccess,
    travelRoutesData,
    deleteRoute,
    setIsDeleteDialogOpen,
    isDeleteDialogOpen,
    setEditRouteId,
    editRouteId,
    resetForm,
    citiesData,
    createRoute,
    updateRoute
  }
}
