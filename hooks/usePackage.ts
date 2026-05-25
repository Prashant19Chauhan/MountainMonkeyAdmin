'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
    createPackageApi, 
    deletePackageApi, 
    getPackageApi, 
    getPackagesApi, 
    updatePackageApi,
    GetPackagesParams
} from "@/services/package.service"
import { useState, useEffect } from "react"
import { CreatePackageFormValues, createPackageSchema } from "@/lib/validation/package.validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function usePackage() {

    const queryClient = useQueryClient();
    const router = useRouter();
    
    // Query Params
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [destinationId, setFilterDestinationId] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<string | undefined>(undefined);

    const initialFormState: CreatePackageFormValues = {
        title: '',
        description: '',
        shortDescription: '',
        destination: {
            id: '',
            coordinates: { lat: 0, lng: 0 }
        },
        duration: { days: 1, nights: 0 },
        pricing: {
            basePrice: 0,
            currency: 'USD',
            perPerson: true,
            taxesIncluded: false
        },
        categories: [],
        activities: [],
        accommodations: [],
        transport: { included: false, modes: [] },
        meals: { included: false, plan: [] },
        itinerary: [],
        images: [],
        videos: [],
        inclusions: [],
        exclusions: [],
        aiMetadata: {
            tags: [],
            mood: [],
            suitableFor: [],
            difficultyLevel: 'easy',
            bestSeason: [],
            highlights: [],
            languagesSupported: [],
            popularityScore: 0
        },
        vendor: {
            vendorId: '',
            name: '',
            contactEmail: '',
            contactPhone: ''
        },
        status: 'draft',
        isFeatured: false
    };

    const [formData, setFormData] = useState<CreatePackageFormValues>(initialFormState);

    const [packageId, setPackageId] = useState<string | null>(null);

    const updateFields = (fields: Partial<CreatePackageFormValues>) => {
        setFormData(prev => ({ ...prev, ...fields }))
    }

    const queryParams: GetPackagesParams = {
        page,
        limit,
        destinationId,
        category,
        status
    };

    const { data: packagesData, isPending: isPackagesLoading, error: packagesError } = useQuery({
        queryKey: ["packages", queryParams],
        queryFn: () => getPackagesApi(queryParams)
    })
    
    const { mutate: createPackage, isPending: isCreatePackageLoading, error: createPackageError } = useMutation({
        mutationFn: createPackageApi,
        onSuccess: () => {
            resetForm();
            toast.success("Package created successfully");
            queryClient.invalidateQueries({ queryKey: ["packages"] });
        },
        onError: (error: string) => {
            toast.error(error);
        }
    })

    const extractId = (val: any) => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (val._id) return val._id.toString();
        if (val.toString) return val.toString();
        return val;
    };

    const prepareSubmitData = (data: any) => {
        const submitData = JSON.parse(JSON.stringify(data));
        if (submitData.destination) {
            submitData.destination.id = extractId(submitData.destination.id);
        }
        if (Array.isArray(submitData.activities)) {
            submitData.activities = submitData.activities.map((act: any) => ({
                ...act,
                id: extractId(act.id)
            }));
        }
        if (Array.isArray(submitData.accommodations)) {
            submitData.accommodations = submitData.accommodations.map((acc: any) => ({
                ...acc,
                stayId: extractId(acc.stayId)
            }));
        }
        return submitData;
    };

    const handlePackageCreate = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const submitData = prepareSubmitData(formData);
            const parse = createPackageSchema.parse(submitData);
            createPackage(parse);
        } catch (error) {
            console.log(error);
            toast.error("Please fill all required fields correctly.");
        }
    }

    const { data: singlePackageData } = useQuery({
        queryKey: ["package", packageId],
        queryFn: () => getPackageApi(packageId as string),
        enabled: !!packageId
    })

    useEffect(() => {
        if (singlePackageData?.data) {
            setFormData(singlePackageData.data);
        }
    }, [singlePackageData])


    const { mutate: updatePackage, isPending: isUpdatePackageLoading, error: updatePackageError } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<CreatePackageFormValues> }) => updatePackageApi(id, data),
        onSuccess: () => {
            toast.success("Package updated successfully");
            queryClient.invalidateQueries({ queryKey: ["packages"] });
            setTimeout(() => {
                router.push("/packages");
            }, 500)
        },
        onError: (error: string) => {
            toast.error(error);
        }
    })

    const handlePackageUpdate = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!packageId) return;
        try {
            console.log("============================", formData);
            const submitData = prepareSubmitData(formData);
            console.log("submit data-------------", submitData)
            const parse = createPackageSchema.partial().parse(submitData);
            updatePackage({ id: packageId, data: parse });
        } catch (error) {
            console.log(error);
            toast.error("Please fill all required fields correctly.");
        }
    }

    const { mutate: deletePackage, isPending: isDeletePackageLoading, error: deletePackageError } = useMutation({
        mutationFn: deletePackageApi,
        onSuccess: () => {
            toast.success("Package deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["packages"] });
        },
        onError: (error: string) => {
            toast.error(error);
        }
    })

    const resetForm = () => {
        setFormData(initialFormState);
        setPackageId(null);
    }

    return {
        formData,
        updateFields,
        packagesData,
        isPackagesLoading,
        packagesError,
        createPackage,
        updatePackage,
        isCreatePackageLoading,
        createPackageError,
        handlePackageCreate,
        setPackageId,
        packageId,
        isUpdatePackageLoading,
        updatePackageError,
        handlePackageUpdate,
        deletePackage,
        isDeletePackageLoading,
        deletePackageError,
        packageData: singlePackageData,
        page,
        setPage,
        limit,
        setLimit,
        destinationId,
        setFilterDestinationId,
        category,
        setCategory,
        status,
        setStatus,
        resetForm
    }
}
