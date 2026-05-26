'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createDestinationApi, deleteDestinationApi, getDestinationApi, getDestinationsApi, updateDestinationApi } from "@/services/destination.service"
import { useState, useEffect } from "react"
import { destinationInput, destinationSchema } from "@/lib/validation/destination.validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function useDestination() {

    const queryClient = useQueryClient();
    const router = useRouter();
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState<destinationInput>(
        {
            name: '',
            description: '',
            shortDescription: '',
            images: [],
            location: {
               address: '',
               pinCode: '',
               coordinates: {
                 lat: 0,
                 lng: 0
               },
               altitude: 0,
             },
             mainCity: '',
             placeType: '',
             categories: [],
             nearbyDestinations: [],
             budgetEstimate: {
               dailyAvg: 0,
               budget: 0,
               luxury: 0
             },
             aiMetadata: {
               tags: [],
               mood: [],
               suitableFor: [],
               travelStyle: [],
               highlights: []
             }
        }
    );

    console.log(formData);
    const [destinationId, setDestinationId] = useState<string | null>(null);

    const updateFields = (fields: Partial<destinationInput>) => {
        setFormData(prev => ({ ...prev, ...fields }))
    }

    const {data: destinationsData, isPending: isDestinationsLoading, error: destinationsError} = useQuery({
        queryKey: ["destinations", page, limit, search],
        queryFn: () => getDestinationsApi(page, limit, search)
    })
    
    const {mutate: createDestination, isPending: isCreateDestinationLoading, error: createDestinationError} = useMutation({
        mutationFn: createDestinationApi,
        onSuccess: () => {
            resetForm();
            toast.success("Destination created successfully");
            queryClient.invalidateQueries({queryKey: ["destinations"]});
        },

        onError: (error: string) => {
          toast.error(error);
        }
    })

    const handleDestinationCreate = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        try{
            const parse = destinationSchema.parse(formData);
            createDestination(parse);
        }catch(error){
            console.log(error);
        }
    }

    const {data: singleDestinationData} = useQuery({
        queryKey: ["destination", destinationId],
        queryFn: () => getDestinationApi(destinationId as string),
        enabled: !!destinationId
    })

    useEffect(()=>{
        if(singleDestinationData?.data){
            setFormData(singleDestinationData.data);
        }
    }, [singleDestinationData])

    const {mutate: updateDestination, isPending: isUpdateDestinationLoading, error: updateDestinationError} = useMutation({
        mutationFn: (data: destinationInput) => updateDestinationApi(destinationId as string, data),
        onSuccess: () => {
            toast.success("Destination updated successfully");
            queryClient.invalidateQueries({queryKey: ["destinations"]});
            setTimeout(()=>{
                router.push("/destinations");
            }, 500)
        },

        onError: (error: string) => {
          toast.error(error);
        }
    })

    const handleDestinationUpdate = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        try{
            const parse = destinationSchema.parse(formData);
            updateDestination(parse);
        }catch(error){
            console.log(error);
        }
    }

    const {mutate: deleteDestination, isPending: isDeleteDestinationLoading, error: deleteDestinationError} = useMutation({
        mutationFn: deleteDestinationApi,
        onSuccess: () => {
            toast.success("Destination deleted successfully");
            queryClient.invalidateQueries({queryKey: ["destinations"]});
        },

        onError: (error: string) => {
          toast.error(error);
        }
    })

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            shortDescription: '',
            images: [],
            location: {
               address: '',
               pinCode: '',
               coordinates: {
                 lat: 0,
                 lng: 0
               },
               altitude: 0,
             },
             mainCity: '',
             placeType: '',
             categories: [],
             nearbyDestinations: [],
             budgetEstimate: {
               dailyAvg: 0,
               budget: 0,
               luxury: 0
             },
             aiMetadata: {
               tags: [],
               mood: [],
               suitableFor: [],
               travelStyle: [],
               highlights: []
             }
        });
        setDestinationId(null);
    }

    return {
        formData,
        updateFields,
        destinationsData,
        isDestinationsLoading,
        destinationsError,
        createDestination,
        isCreateDestinationLoading,
        createDestinationError,
        handleDestinationCreate,
        setDestinationId,
        updateDestination,
        isUpdateDestinationLoading,
        updateDestinationError,
        handleDestinationUpdate,
        deleteDestination,
        isDeleteDestinationLoading,
        destinationData: singleDestinationData,
        deleteDestinationError,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        resetForm
    }

  
}