"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createStayApi,
    updateStayApi,
    deleteStayApi,
    getStayByIdApi,
    getAllStaysApi,
    updateStayCurrentPriceApi
} from "@/services/stay.service";
import { getCitiesApi } from "@/services/city.service";
import { getDestinationsApi } from "@/services/destination.service";
import { StayInputType } from "@/lib/validation/stay.validation";
import { toast } from "react-toastify";

const initialFormData: StayInputType = {
    name: "",
    shortDescription: "",
    longDescription: "",
    type: "hotel",
    starRating: 3,
    location: {
        address: "",
        coordinates: { lat: 0, lng: 0 },
        altitude: 0
    },
    priceRange: { min: 0, max: 0 },
    rooms: [
        {
            typeOfRoom: "Standard",
            pricePerNight: { min: 0, max: 0 },
            capacity: 2,
            amenities: [],
            availability: { totalRooms: 10, availableRooms: 10 },
            roomImages: []
        }
    ],
    images: [],
    connectivity: {
        nearestAirport: "",
        nearestRailway: "",
        nearestBusStop: ""
    },
    safetyMeasuresRatings: {
        emergencyContact: 5,
        firstAid: 5,
        security: 5,
        fireSafety: 5,
        hygiene: 5,
        staffTraining: 5,
        sanitizationProtocols: 5
    }
};

export default function useStay() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState<StayInputType>(initialFormData);
    const [editId, setEditId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    console.log(formData, "formData")
    // Queries
    const { data: staysData, isLoading: isStaysLoading } = useQuery({
        queryKey: ["stays", page, limit, search],
        queryFn: () => getAllStaysApi(page, limit, search)
    });

    const { data: citiesData } = useQuery({
        queryKey: ["cities"],
        queryFn: () => getCitiesApi(1, 1000)
    });

    const { data: destinationsData } = useQuery({
        queryKey: ["destinations"],
        queryFn: () => getDestinationsApi(1, 1000)
    });

    const { data: singleStayData, isLoading: isSingleLoading } = useQuery({
        queryKey: ["stay", editId],
        queryFn: () => getStayByIdApi(editId as string),
        enabled: !!editId
    });

    // Populate form for editing
    useEffect(() => {
        if (singleStayData?.data) {
            const data = { ...singleStayData.data };
            // Flatten populated objects back to IDs for the form
            if (data.destinationId && typeof data.destinationId === 'object') {
                data.destinationId = (data.destinationId as any)._id;
            }
            if (data.mainCity && typeof data.mainCity === 'object') {
                data.mainCity = (data.mainCity as any)._id;
            }
            setFormData(data);
        }
    }, [singleStayData]);

    // Mutations
    const { mutate: createStay, isPending: isCreateLoading, isSuccess: isCreateSuccess } = useMutation({
        mutationFn: createStayApi,
        onSuccess: () => {
            toast.success("Stay created successfully");
            queryClient.invalidateQueries({ queryKey: ["stays"] });
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create stay");
        }
    });

    const { mutate: updateStay, isPending: isUpdateLoading, isSuccess: isUpdateSuccess } = useMutation({
        mutationFn: (data: StayInputType) => updateStayApi(editId as string, data),
        onSuccess: () => {
            toast.success("Stay updated successfully");
            queryClient.invalidateQueries({ queryKey: ["stays"] });
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update stay");
        }
    });

    const { mutate: deleteStay, isPending: isDeleteLoading } = useMutation({
        mutationFn: deleteStayApi,
        onSuccess: () => {
            toast.success("Stay deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["stays"] });
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete stay");
        }
    });

    const { mutate: updateStayCurrentPrice, isPending: isUpdatePriceLoading } = useMutation({
        mutationFn: ({ id, price }: { id: string; price: number }) => updateStayCurrentPriceApi(id, price),
        onSuccess: () => {
            toast.success("Stay price updated successfully");
            queryClient.invalidateQueries({ queryKey: ["stays"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update stay price");
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
                    current[keys[i]] = Array.isArray(current[keys[i]]) ? [...current[keys[i]]] : { ...current[keys[i]] };
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
            updateStay(formData);
        } else {
            createStay(formData);
        }
    };

    return {
        staysData,
        isStaysLoading,
        citiesData,
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
        createStay,
        updateStay,
        updateStayCurrentPrice,
        isUpdatePriceLoading,
        confirmDelete: () => deleteId && deleteStay(deleteId),
        resetForm
    };
}
