'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createCityApi, deleteCityApi, getCityApi, getCitiesApi, updateCityApi } from "@/services/city.service"
import { useState, useEffect } from "react"
import { CityInput, citySchema } from "@/lib/validation/city.validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function useCity() {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState<CityInput>({
        name: '',
        country: '',
        state: '',
        city: '',
        address: '',
        locationCoordinates: {
            type: 'Point',
            coordinates:  [null, null] as unknown as [number, number],
        },
        altitude: 0,
        timezone: '',
        description: '',
        status: 'Active'
    });

    const [editCityId, setEditCityId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const updateFields = (fields: Partial<CityInput>) => {
        setFormData(prev => ({ ...prev, ...fields }))
    }

    const { data: citiesData, isPending: isCitiesLoading, error: citiesError } = useQuery({
        queryKey: ["cities", page, limit, search],
        queryFn: () => getCitiesApi(page, limit, search)
    })
    
    const { mutate: createCity, isPending: isCreateCityLoading, error: createCityError, isSuccess: isCreateCitySuccess, reset: resetCreate } = useMutation({
        mutationFn: createCityApi,
        onSuccess: () => {
            resetForm();
            toast.success("City created successfully");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
        },
        onError: (error: string) => {
            toast.error(error);
        }
    })

    const handleCityCreate = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const parse = citySchema.parse(formData);
            createCity(parse);
        } catch (error) {
            console.log(error);
        }
    }

    const { data: singleCityData } = useQuery({
        queryKey: ["city", editCityId],
        queryFn: () => getCityApi(editCityId as string),
        enabled: !!editCityId
    })

    useEffect(() => {
        if (singleCityData?.data) {
            setFormData(singleCityData.data);
        }
    }, [singleCityData])

    const { mutate: updateCity, isPending: isUpdateCityLoading, error: updateCityError, isSuccess: isUpdateCitySuccess, reset: resetUpdate } = useMutation({
        mutationFn: updateCityApi,
        onSuccess: () => {
            toast.success("City updated successfully");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            setTimeout(() => {
                router.push("/cities");
            }, 500)
        },
        onError: (error: string) => {
            toast.error(error);
        }
    })

    const handleCityUpdate = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const parse = citySchema.parse(formData);
            updateCity(parse);
        } catch (error) {
            console.log(error);
        }
    }

    const { mutate: deleteCity, isPending: isDeleteCityLoading, error: deleteCityError } = useMutation({
        mutationFn: deleteCityApi,
        onSuccess: () => {
            toast.success("City deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            setIsDeleteDialogOpen(false)
        },
        onError: (error: string) => {
            toast.error(error);
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const keys = name.split('.');
            if (keys[0] === 'locationCoordinates' && keys[1] === 'coordinates') {
                const index = parseInt(keys[2]);
                setFormData(prev => {
                    const newCoordinates = [...prev.locationCoordinates.coordinates];
                    newCoordinates[index] = Number(value);
                    return {
                        ...prev,
                        locationCoordinates: {
                            ...prev.locationCoordinates,
                            coordinates: newCoordinates as [number, number]
                        }
                    };
                });
                return;
            }
        }
        setFormData(prev => ({ ...prev, [name]: name === 'altitude' ? Number(value) : value }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editCityId) {
            handleCityUpdate(e);
        } else {
            handleCityCreate(e);
        }
    }

    const loading = isCreateCityLoading || isUpdateCityLoading;
    const error = createCityError || updateCityError;
    const isUpdateSuccess = isCreateCitySuccess || isUpdateCitySuccess;

    const resetForm = () => {
        setFormData({
            name: '',
            country: '',
            state: '',
            city: '',
            address: '',
            locationCoordinates: {
                type: 'Point',
                coordinates: [0, 0],
            },
            altitude: 0,
            timezone: '',
            description: '',
            status: 'Active'
        });
        setEditCityId(null);
        resetCreate();
        resetUpdate();
    }

    return {
        formData,
        updateFields,
        citiesData,
        isCitiesLoading,
        citiesError,
        createCity,
        updateCity,
        isCreateCityLoading,
        createCityError,
        handleCityCreate,
        editCityId,
        setEditCityId,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isUpdateCityLoading,
        updateCityError,
        handleCityUpdate,
        deleteCity,
        isDeleteCityLoading,
        cityData: singleCityData,
        deleteCityError,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        resetForm,
        handleInputChange,
        handleSubmit,
        loading,
        error,
        isUpdateSuccess
    }
}
