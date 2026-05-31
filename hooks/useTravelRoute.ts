'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCitiesApi, createCityApi } from "@/services/city.service";
import {
  createHubApi, getHubsApi, deleteHubApi,
  createOperatorApi, getOperatorsApi, deleteOperatorApi,
  createVehicleApi, getVehiclesApi, deleteVehicleApi,
  createRouteApi, getRoutesApi, deleteRouteApi,
  createTransferApi, getTransfersApi, deleteTransferApi,
  createScheduleApi, getSchedulesApi, deleteScheduleApi
} from "@/services/travelRoute.service";
import { toast } from "react-toastify";
import { Location, Hub, Operator, Vehicle, Route, Transfer, Schedule } from "@/components/_travelRoute/RouteGraphCanvas";

export default function useTravelRoute() {
  const queryClient = useQueryClient();

  // ── 1. QUERIES (FETCH DATA FROM BACKEND) ──

  // Fetch Locations (using a high limit to get all city clusters for reference)
  const { data: locationsResponse, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations-all"],
    queryFn: () => getCitiesApi(1, 1000)
  });
  const locations = (locationsResponse?.data as Location[]) || [];

  // Fetch Hubs
  const { data: hubsResponse, isLoading: isLoadingHubs } = useQuery({
    queryKey: ["hubs"],
    queryFn: () => getHubsApi()
  });
  const hubs = ((hubsResponse?.data as Hub[]) || []).map((hub: any) => ({
    ...hub,
    coordinates: hub.coordinates || hub.location?.coordinates || [77.0, 31.0]
  })) as Hub[];

  // Fetch Operators
  const { data: operatorsResponse, isLoading: isLoadingOperators } = useQuery({
    queryKey: ["operators"],
    queryFn: () => getOperatorsApi()
  });
  const operators = (operatorsResponse?.data as Operator[]) || [];

  // Fetch Vehicles
  const { data: vehiclesResponse, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehiclesApi()
  });
  const vehicles = (vehiclesResponse?.data as Vehicle[]) || [];

  // Fetch Routes
  const { data: routesResponse, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutesApi()
  });
  const routes = (routesResponse?.data as Route[]) || [];

  // Fetch Transfers
  const { data: transfersResponse, isLoading: isLoadingTransfers } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => getTransfersApi()
  });
  const transfers = (transfersResponse?.data as Transfer[]) || [];

  // Fetch Schedules
  const { data: schedulesResponse, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => getSchedulesApi()
  });
  const schedules = (schedulesResponse?.data as Schedule[]) || [];

  const isLoading =
    isLoadingLocations ||
    isLoadingHubs ||
    isLoadingOperators ||
    isLoadingVehicles ||
    isLoadingRoutes ||
    isLoadingTransfers ||
    isLoadingSchedules;

  // ── 2. MUTATIONS (CREATE/DELETE CALLS TO BACKEND) ──

  // Cities
  const createCityMutation = useMutation({
    mutationFn: createCityApi,
    onSuccess: () => {
      toast.success("City created successfully!");
      queryClient.invalidateQueries({ queryKey: ["locations-all"] });
    },
    onError: (err: string) => toast.error(err)
  });

  // Hubs
  const createHubMutation = useMutation({
    mutationFn: createHubApi,
    onSuccess: () => {
      toast.success("Hub created successfully!");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
    },
    onError: (err: string) => toast.error(err)
  });

  const deleteHubMutation = useMutation({
    mutationFn: deleteHubApi,
    onSuccess: () => {
      toast.success("Hub deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
    },
    onError: (err: string) => toast.error(err)
  });

  // Operators
  const createOperatorMutation = useMutation({
    mutationFn: createOperatorApi,
    onSuccess: () => {
      toast.success("Operator registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    },
    onError: (err: string) => toast.error(err)
  });

  const deleteOperatorMutation = useMutation({
    mutationFn: deleteOperatorApi,
    onSuccess: () => {
      toast.success("Operator deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    },
    onError: (err: string) => toast.error(err)
  });

  // Vehicles
  const createVehicleMutation = useMutation({
    mutationFn: createVehicleApi,
    onSuccess: () => {
      toast.success("Vehicle mapped successfully!");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (err: string) => toast.error(err)
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: deleteVehicleApi,
    onSuccess: () => {
      toast.success("Vehicle deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (err: string) => toast.error(err)
  });

  // Routes
  const createRouteMutation = useMutation({
    mutationFn: createRouteApi,
    onSuccess: () => {
      toast.success("Intercity route created successfully!");
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
    onError: (err: string) => toast.error(err)
  });

  const deleteRouteMutation = useMutation({
    mutationFn: deleteRouteApi,
    onSuccess: () => {
      toast.success("Intercity route deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
    onError: (err: string) => toast.error(err)
  });

  // Transfers
  const createTransferMutation = useMutation({
    mutationFn: createTransferApi,
    onSuccess: () => {
      toast.success("Local transfer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (err: string) => toast.error(err)
  });

  const deleteTransferMutation = useMutation({
    mutationFn: deleteTransferApi,
    onSuccess: () => {
      toast.success("Local transfer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (err: string) => toast.error(err)
  });

  // Schedules
  const createScheduleMutation = useMutation({
    mutationFn: createScheduleApi,
    onSuccess: () => {
      toast.success("Vehicle schedule created successfully!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (err: string) => toast.error(err)
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: deleteScheduleApi,
    onSuccess: () => {
      toast.success("Vehicle schedule deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (err: string) => toast.error(err)
  });

  return {
    locations,
    hubs,
    operators,
    vehicles,
    routes,
    transfers,
    isLoading,

    createCity: createCityMutation.mutate,
    createCityAsync: createCityMutation.mutateAsync,
    createHub: createHubMutation.mutate,
    createHubAsync: createHubMutation.mutateAsync,
    deleteHub: deleteHubMutation.mutate,
    
    createOperator: createOperatorMutation.mutate,
    createOperatorAsync: createOperatorMutation.mutateAsync,
    deleteOperator: deleteOperatorMutation.mutate,
    
    createVehicle: createVehicleMutation.mutate,
    createVehicleAsync: createVehicleMutation.mutateAsync,
    deleteVehicle: deleteVehicleMutation.mutate,
    
    createRoute: createRouteMutation.mutate,
    createRouteAsync: createRouteMutation.mutateAsync,
    deleteRoute: deleteRouteMutation.mutate,
    
    createTransfer: createTransferMutation.mutate,
    createTransferAsync: createTransferMutation.mutateAsync,
    deleteTransfer: deleteTransferMutation.mutate,
    
    schedules,
    createSchedule: createScheduleMutation.mutate,
    createScheduleAsync: createScheduleMutation.mutateAsync,
    deleteSchedule: deleteScheduleMutation.mutate
  };
}
