'use client'

import TravelRouteForm from "@/components/_travelRoute/TravelRouteForm"
import useTravelRoute from "@/hooks/useTravelRoute";
import { useSearchParams } from "next/navigation"
import { useEffect } from "react";

export default function UpdateTravelRoutePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const travelRouteHook = useTravelRoute();
  const { setEditRouteId } = travelRouteHook;

  useEffect(() => {
    if (id) {
      setEditRouteId(id);
    }
  }, [id, setEditRouteId]);

  return (
    <TravelRouteForm isUpdate={true} travelRouteHook={travelRouteHook} />
  )
}
